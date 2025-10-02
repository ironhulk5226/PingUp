import { format } from "path";
import User from "../models/user.js";
import fs from "fs";
import cloudinary from "../configs/cloudinary.js";
import Connection from "../models/connection.js";
import Post from "../models/post.js";
import { inngest } from "../inngest/index.js";


// with multer uploaded file object looks like
// {
//   fieldname: 'profile',
//   originalname: 'mypic.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'uploads/',
//   filename: 'abc123.jpg',
//   path: 'uploads/abc123.jpg',  // <-- this is profile.path
//   size: 12345
// }

// e.g res for imagekit.upload
// {
//   "fileId": "63e3c2c7e4b0c2ab7c0a4a91",
//   "name": "mypic.jpg",
//   "size": 13456,
//   "versionInfo": {
//     "id": "63e3c2c7e4b0c2ab7c0a4a92",
//     "name": "Version 1"
//   },
//   "filePath": "/mypic.jpg",
//   "url": "https://ik.imagekit.io/your_imagekit_id/mypic.jpg",
//   "thumbnailUrl": "https://ik.imagekit.io/your_imagekit_id/tr:n-media_library_thumbnail/mypic.jpg",
//   "height": 300,
//   "width": 400,
//   "fileType": "image",
//   "mime": "image/jpeg",
//   "tags": null,
//   "isPrivateFile": false,
//   "customCoordinates": null,
//   "embeddedMetadata": {},
//   "customMetadata": {}
// }

// Get User data using userId
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const updateUserData = async (req, res) => {
  try {
    // Add null check for req.auth()
    if (!req.auth) {
      return res.status(401).json({ success: false, message: "Authentication failed" });
    }
    
    const { userId } = req.auth() || {};
    
    // Check if userId exists
    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID not found in authentication" });
    }
    
    // Check if req.body exists and handle FormData properly
    let username = req.body?.username;
    const bio = req.body?.bio;
    const location = req.body?.location;
    const full_name = req.body?.full_name;

    const tempUser = await User.findById(userId);
    if (!tempUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // if username not provided, keep old one
    if (!username) username = tempUser.username;

    // check if username is taken
    if (tempUser.username !== username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        username = tempUser.username; // fallback to old username
      }
    }

    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };

    // Add null check for req.files
    const profile = req.files && req.files.profile && req.files.profile[0];
    const cover = req.files && req.files.cover && req.files.cover[0];

    if (profile) {
      try {
        const buffer = fs.readFileSync(profile.path);
        const fileStr = `data:${profile.mimetype};base64,${buffer.toString(
          "base64"
        )}`;

        console.log("Attempting to upload profile image to Cloudinary...");
        const response = await cloudinary.uploader.upload(fileStr, {
          folder: "pingup",
          resource_type: "image",
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" },
            { width: 512, crop: "scale" },
          ],
        });

        console.log("Cloudinary upload successful:", response.secure_url);
        updatedData.profile_picture = response.secure_url; // save URL to DB
      } catch (error) {
        console.error("Error uploading profile image to Cloudinary:", error);
        return res.json({
          success: false,
          message: `Error uploading profile image: ${error.message}`,
        });
      }
    }

    if (cover) {
      try {
        const buffer = fs.readFileSync(cover.path);
        const fileStr = `data:${cover.mimetype};base64,${buffer.toString(
          "base64"
        )}`;

        console.log("Attempting to upload cover image to Cloudinary...");
        const response = await cloudinary.uploader.upload(fileStr, {
          folder: "pingup",
          resource_type: "image",
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" },
            { width: 1280, crop: "scale" },
          ],
        });

        console.log("Cloudinary cover upload successful:", response.secure_url);
        updatedData.cover_photo = response.secure_url; // save URL to DB
      } catch (error) {
        console.error("Error uploading cover image to Cloudinary:", error);
        return res.json({
          success: false,
          message: `Error uploading cover image: ${error.message}`,
        });
      }
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.json({
      success: true,
      user,
      message: "User Profile Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// find users by username , email , location , name
// $or: [...]
// $or is a MongoDB operator.
// It means: “Match documents if any of the listed conditions is true.

export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        //'i' means case-insensitive search.
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    const filteredUsers = allUsers.filter((user) => user._id.toString() !== userId); // excluding the logged in user i.e your own profile while searching

    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Follow User
export const FollowUsers = async (req, res) => {
  try {
    const { userId } = req.auth(); // logged in user's id
    const { id } = req.body; // the id of the user whom logged in user wants to follow

    const user = await User.findById(userId);

    if (user.following.includes(id)) {
      // if already following
      return res.json({
        success: false,
        message: "You are already following this user",
      });
    }

    // updating logged in users following (not followers)
    user.following.push(id);
    await user.save();

    // updating followers of the user to be followed
    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    res.json({ success: true, message: "User Followed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Unfollow User
export const UnfollowUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);
    if (!user.following.map((u) => u.toString()).includes(id.toString())) {
      return res.json({
        success: false,
        message: "You are not following this user",
      });
    }

    user.following = user.following.filter(
      (uid) => uid.toString() !== id.toString()
    );
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers = toUser.followers.filter(
      (uid) => uid.toString() !== userId.toString()
    );
    await toUser.save();

    res.json({
      success: true,
      message: "You are no longer following this user",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// send connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    // check if user has sent more than 20 connction reqs in last 24 hours

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1000 -> ms
    const connectionRequests = await Connection.find({
      from_user_id: userId,
      createdAt: { $gt: last24Hours },
    });
    if (connectionRequests.length >= 20) {
      return res.json({
        success: false,
        message:
          "You have sent more than 20 connection requests in the last 24 hours",
      });
    }

    // Check if users are already connected
    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (!connection) {
      const newConnection = await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });

      //inngest function invoking
      try {
        await inngest.send({
          name:'app/connection-request',
          data : {connectionId: newConnection._id}
        });
      } catch (inngestError) {
        console.log("Inngest error (connection request will still be processed):", inngestError.message);
        // Continue without Inngest - connection request is still created
      }
      
      return res.json({
        success: true,
        message: "Connection request sent successfully",
      });
    } else if (connection.status === "accepted") {
      return res.json({
        success: false,
        message: "You are already connected with this user",
      });
    } else if (connection.status === "pending") {
      // Check if the current user sent the pending request
      if (connection.from_user_id.toString() === userId) {
        return res.json({
          success: false,
          message: "You already sent a connection request to this user",
        });
      } else {
        // The other user sent a request to the current user
        return res.json({
          success: false,
          message: "This user has already sent you a connection request. Check your pending connections.",
        });
      }
    }

    return res.json({
      success: false,
      message: "Unable to process connection request",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//get user connection
export const getUserConnection = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).populate(
      "connections followers following"
    );

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const connections = user.connections || [];
    const followers = user.followers || [];
    const following = user.following || [];

    const pendingConnections = await Connection.find({
      to_user_id: userId,
      status: "pending",
    }).populate("from_user_id");

    const pendingUsers = pendingConnections.map((conn) => conn.from_user_id);
    return res.json({success: true, connections, followers, following, pendingUsers});
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// Accept user connection
export const acceptConnectionRequest = async(req,res)=>{
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId
    });

    if(!connection){
      return res.json({success: false, message: "Connection not found"});
    }

    const user = await User.findById(userId);
    user.connections.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.connections.push(userId);
    await toUser.save();

    connection.status = 'accepted';
    await connection.save();

    res.json({success: true, message: "Connection accepted successfully"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
}

// get user profiles 
export const getUserProfiles = async(req,res)=>{
  try {
     const{profileId} = req.body;
     const profile = await User.findById(profileId)

     if(!profile){
      return res.json({success:false,message:"Profile not found"})
     }

     const posts = await Post.find({user:profileId}).populate('user')

     res.json({success:true,profile,posts})

  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
    
  }
}