import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    messages:[]
}

export const fetchMessages = createAsyncThunk('messages/fetchMessages',async({token,userId})=>{
    const {data} = await api.post('/api/user/messages',{to_user_id:userId},{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })

    return data.success ? data : null;
})

const messageSlice = createSlice({
    name:"messages",
    initialState,
    reducers:{
        sendMessages : (state,action)=>{
            state.messages = action.payload
        },
        addMessage : (state,action)=>{
            state.messages = [...state.messages,action.payload]
        },
        resetMessages : (state)=>{
            state.messages = [];
        },

    },
    extraReducers:(builder)=>{
        builder.addCase(fetchMessages.fulfilled,(state,action)=>{
            if(action.payload){
                state.messages = action.payload.messages;
            }
        })
    }

})

export const {sendMessages,addMessage,resetMessages} = messageSlice.actions;

export default messageSlice.reducer;