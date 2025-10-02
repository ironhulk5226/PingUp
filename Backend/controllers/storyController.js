import fs from "fs";
import User from "../models/user.js";
import cloudinary from "../configs/cloudinary.js";
import Story from "../models/story.js";
import { inngest } from "../inngest/index.js";

//Add user Story

export const addUserStory = async(req,res)=>{
    try {
        const {userId} = req.auth();
        const {content , media_type, background_color} = req.body;
        const media = req.file
        let media_url = '';

        // upload media to cloudinary
        if(media_type==='image' || media_type==='video'){
            const fileBuffer = fs.readFileSync(media.path);
            const fileStr = `data:${media.mimetype};base64,${fileBuffer.toString(
                "base64"
            )}`

            console.log("Uploading media to Cloudinary...");
            const response = await cloudinary.uploader.upload(fileStr,{
                folder:"pingupStories",
                resource_type:media_type==="video"?"video":"image",
                transformation:[
                    {quality:"auto"},
                    {fetch_format:"auto"},
                    {width:1280 , crop:"scale"}
                ]
            })
            media_url = response.secure_url;
        }
        // create Story 
        const story = await Story.create({
            user:userId,
            content,
            media_url,
            media_type,
            background_color
        })

        // schedule / invoke story deletion after 24 hours
        try {
            await inngest.send({
                name:'app/story.delete',
                data:{storyId:story._id}
            });
        } catch (inngestError) {
            console.log("Inngest error (story will be handled by TTL index):", inngestError.message);
            // Continue without Inngest - stories will expire naturally through MongoDB TTL index
        }

        return res.json({success:true , message:"Story Created Successfully"})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    
        
    }
}

//Get User Stories
export const getUserStories = async(req,res)=>{
    try { 
        const {userId} = req.auth();
        const user = await User.findById(userId);

        // for showing stories of user connection and following
        const userIds = [userId, ...user.connections , ...user.following]

        const stories = await Story.find({
            user: {$in:userIds}
        }).populate('user').sort({createdAt:-1})


        return res.json({success:true , stories})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    
        
    }
}