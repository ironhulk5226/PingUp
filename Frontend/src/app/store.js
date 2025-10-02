import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice.js"
import connectionReducer from "../features/connections/connectionsSlice.js"
import messageReducer from "../features/messages/messagesSlice.js"

export const store = configureStore({
    reducer:{
        user:userReducer,
        connections:connectionReducer,
        messages:messageReducer
    }
})