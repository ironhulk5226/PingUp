import fs from 'fs'
import cloudinary from '../configs/cloudinary.js';
import Message from '../models/messsage.js';

// create and empty object to store server side event connections
const connections = {};

// controller function for the SSE endpoint

export const sseController = (req, res) => {
  const { userId } = req.auth();
  console.log("New client Connected :", userId);

//   1. res.setHeader('Content-Type', 'text/event-stream')
// What it does: Tells the browser/client that the response is not a normal HTML/JSON, but a continuous event stream.
// Used in SSE (Server-Sent Events) so the browser keeps the connection open and listens for incoming events.
// Example:
// Content-Type: text/event-stream
// When the client sees this, it knows: “I should expect event messages instead of a one-time response.”

// 2. res.setHeader('Cache-Control', 'no-cache')
// What it does: Prevents the browser, proxies, or intermediate servers from caching the response.
// SSE is real-time; you don’t want old events to be stored and replayed.
// Example: If you send a live notification feed, you always want fresh events, not something from cache.

// 3. res.setHeader('Connection', 'keep-alive')
// What it does: Keeps the connection open instead of closing after sending the first response.
// Required for SSE because the server keeps pushing messages continuously.
// Example:
// Normal HTTP request: client requests → server responds → connection closes.
// With keep-alive: connection stays open → server keeps sending multiple chunks of data (events).
// ❌ In your code you wrote "kepp-alive" — should be "keep-alive" (typo).
// 4. res.setHeader('Access-Control-Allow-Origin', '*')
// What it does: This is part of CORS (Cross-Origin Resource Sharing).
// Allows clients from any domain (*) to connect to this SSE endpoint.
// Without this, if your frontend is on http://localhost:3000 and your backend is http://localhost:5000, the browser might block the connection due to CORS.

  // set SSE(Server-Sent Events) header
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Add the client's response object to the connections objes
  connections[userId] = res;
  // Send an initial even to the client
  res.write('log: connected to SSE stream\n\n')

  req.on('close',()=>{
    // remove the client's response object from connections array
    delete connections[userId]
    console.log('Client Disconnected')
  })


};

// send message to user
export const sendMessage = async(req,res)=>{
    try {
        const {userId} = req.auth();
        const {to_user_id , text} = req.body;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';

        if(message_type === 'image'){
            const fileBuffer = fs.readFileSync(image.path);
            const fileStr = `data:${image.mimetype};base64,${fileBuffer.toString(
                "base64"
            )}`

            console.log("Uploading image to Cloudinary...")
            const response = await cloudinary.uploader.upload(fileStr,{
                folder:"pingupMessages",
                resource_type:"image",
                transformation:[
                    {quality:"auto"},
                    {fetch_format:"auto"},
                    {width:1280 , crop:"scale"}
                ]
            })
            media_url = response.secure_url;
        }
        const message = await Message.create({
            from_user_id : userId,
            to_user_id,
            text,
            message_type,
            media_url
        })

        res.json({success:true, message})

        const messageWithUserData = await Message.findById(message._id).populate('from_user_id')

        if(connections[to_user_id]){
            connections[to_user_id].write(`data:${JSON.stringify(messageWithUserData)}\n\n`)
        }


        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message});
    }

}

// get user messages
export const getUserRecentMessages = async(req,res)=>{
    try {
        const {userId} = req.auth();
        const messages = await Message.find({to_user_id:userId}.populate('from_user_id to_user_id')).sort({createdAt:-1})

        res.json({success:true, messages})


    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message});
        
    }
}