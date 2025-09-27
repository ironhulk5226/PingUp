import fs from "fs";
import User from "../models/user.js";
import cloudinary from "../configs/cloudinary.js";
import Post from "../models/post.js";

export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_type } = req.body;
    const images = req.files; // now buffers are available here

    let image_urls = [];

    if (images && images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
            const buffer = fs.readFileSync(image.path);
          // Convert buffer to base64 string
          const fileStr = `data:${image.mimetype};base64,${buffer.toString(
            "base64"
          )}`;

          console.log("Uploading image to Cloudinary...");
          const response = await cloudinary.uploader.upload(fileStr, {
            folder: "pingupPosts",
            resource_type: "image",
            transformation: [
              { quality: "auto" },
              { fetch_format: "auto" },
              { width: 1280, crop: "scale" },
            ],
          });

          return response.secure_url;
        })
      );
    }

    await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });

    res.json({ success: true, message: "Post Created Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getFeedPosts = async(req,res)=>{
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId)

        // User connections and Following
        const userIds = [userId,...user.connections,...user.following]
        const posts = await Post.find({user:{$in:userIds}}).populate('user').sort({createdAt:-1})

        res.json({success:true,posts});

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Like Post
export const likePosts = async(req,res)=>{
    try {
        const {userId} = req.auth();
        const {postId} = req.body;

        const post = await Post.findById(postId);

        if(post.likes_count.includes(userId)){
            // unlike post
            post.likes_count = post.likes_count.filter((user)=>user !== userId)
            await post.save();
            res.json({success:true , message:"Post Unliked Successfully"})
        }
        else{
            // like post 
            post.likes_count.push(userId);
            await post.save();
            res.json({success:true , message:"Post Liked Successfully"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
