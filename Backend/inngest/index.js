import { Inngest } from "inngest";
import User from "../models/user.js";



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

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation , syncUserDeletion , syncUserUpdation
];