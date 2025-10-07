import { Inngest } from "inngest";
import Connection from "../models/connection.js";
import User from "../models/user.js";
import sendMail from "../configs/nodemailer.js";
import Story from "../models/story.js";
import Message from "../models/message.js";



// Create a client to send and receive events
export const inngest = new Inngest({ id: "pingup-app" });

// inngest function to create user data in the database
const syncUserCreation = inngest.createFunction(
    {id:'sync-user-from-clerk'}, // unique id for each function
    {event:'clerk/user.created'}, // The name of the event that will trigger this event to run
    async({event})=>{
        const {id,first_name , last_name , email_addresses , image_url} = event.data;

        let username = email_addresses[0].email_address.split('@')[0];

        const user = await User.findOne({username})

        if(user) {
            username = username + Math.floor(Math.random()*100000)
        }

        const userData = {
            _id : id,
            email : email_addresses[0].email_address,
            full_name : first_name + " " + last_name,
            profile_picture : image_url,
            username : username
        }
        await User.create(userData);



    }

)
// inngest function to update user data in the database
const syncUserUpdation = inngest.createFunction(
    {id:'update-user-from-clerk'}, // unique id for each function
    {event:'clerk/user.updated'}, // The name of the event that will trigger this event to run
    async({event})=>{
        const {id,first_name , last_name , email_addresses , image_url} = event.data;


        const updatedUserData = {
            email : email_addresses[0].email_address,
            full_name : first_name + " " + last_name,
            profile_picture : image_url,
        }
        await User.findByIdAndUpdate(id,updatedUserData);
    }

)
// inngest function to delete user data in the database
const syncUserDeletion = inngest.createFunction(
    {id:'delete-user-from-clerk'}, // unique id for each function
    {event:'clerk/user.deleted'}, // The name of the event that will trigger this event to run
    async({event})=>{
        const {id} = event.data;
        await User.findByIdAndDelete(id);
    }

)

//inngest function to send reminder when a new connection request is added
// 4. await step.run('send-connection-request-mail', async () => { ... })
// Defines a step inside your function, with a name "send-connection-request-mail".
// Steps make your function idempotent (if it fails, only this step retries).
// Inside this step, you actually send the email.

const sendNewConnectionRequestReminder = inngest.createFunction(
    {id:'send-new-connection-request-reminder'},
    {event:'app/connection-request'},
    async({event,step})=>{
        const {connectionId} = event.data;

        await step.run('send-connection-request-mail',async()=>{
            const connection = await Connection.findById(connectionId).populate('from_user_id','to_user_id')
            const subject = `👋 New Connection Request`
            const body = `
            <div style="font-family:Arial,sans-serif;padding:20px;"> 
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <p> You have a new conection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
            <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981">here</a> to accept or reject the request</p>
            <br/>
            <p>Thanks,<br/>PingUp - Stay Connected.</p>
            </div>
            `;

            await sendMail({
                to:connection.to_user_id.email,
                subject,
                body
            })

            const in24Hours = new Date(Date.now()+ 24*60*60*1000)
            await step.sleepUntil('wait-for-24-hours',in24Hours)
            await step.run('send-connection-request-reminder',async()=>{
                const connection = await Connection.findById(connectionId).populate('from_user_id','to_user_id')

                if(connection.status === 'accepted'){
                    return {message:"Already Accepted"}
                }

                const subject = `👋 New Connection Request`
            const body = `
            <div style="font-family:Arial,sans-serif;padding:20px;"> 
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <p> You have a new conection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
            <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981">here</a> to accept or reject the request</p>
            <br/>
            <p>Thanks,<br/>PingUp - Stay Connected.</p>
            </div>
            `;

            await sendMail({
                to:connection.to_user_id.email,
                subject,
                body
            })

            return {message:"Reminder sent"}

            })
        })
    }
)

// Inngest Function to delete the story after 24 hours

const deleteStory = inngest.createFunction(
    {id:'story-delete'},
    {event: 'app/story.delete'},
    async({event,step})=>{
        const {storyId} = event.data
        const in24hours = new Date(Date.now()+24*60*60*1000)
        await step.sleepUntil('wait-for-24-hours',in24hours)
        await step.run('delete-story',async()=>{
            await Story.findByIdAndDelete(storyId)
            return {message:"Story Deleted Successfully"}
        })

    }
)

// Cron is a tool or system for scheduling tasks to run automatically at specific times or intervals.
// TZ = TimeZone
// 0 9 * * *
// Minute = 0
// Hour = 9
// Day-of-month = * → every day
// Month = * → every month
// Day-of-week = * → every day of the week

// const sendNotificationOfUnseenMessages = inngest.createFunction(
//     {id:'send-unseen-messages-notification'},
//     {cron:'TZ=America/New_York 0 9 * * *'}, // every day 9 am
//     async({step})=>{
//         const messages = await Message.find({seen:false}).populate('to_user_id');
//         const unseenCount = {}

//         messages.map((message)=>{
//             unseenCount[message.to_user_id._id] = (unseenCount[message.to_user_id._id] || 0)  + 1
//         })

//         for (const userId in unseenCount) {
//             const user = await User.findById(userId)
//             const subject = `✉️ You have ${unseenCount[userId]}unseen messages`

//             const body = `
//             <div style="font-family: Arial,sans-serif; padding:20px;">
//             <h2> Hi ${user.full_name},</h2>
//             <p>You have ${unseenCount[userId]} unseen messages</p>
//             <p>Click <a href="${process.env.FRONTEND_URL}/messages" style="color:#10b981">here</a> to view them </p>
//             <br/>
//             <p> Thanks, <br/> PingUp - Stay Connected.</p>
//             </div>
//             `;

//             await sendMail({
//                 to:user.email,
//                 subject,
//                 body
//             })


//         }
//         return {message : "Notification Sent"}
//     }

// )

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation , syncUserDeletion , syncUserUpdation , sendNewConnectionRequestReminder, deleteStory , sendNotificationOfUnseenMessages

];