import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../api/axios";

const initialState = {
    value:null
}

// 🔹 So why createAsyncThunk?
// Reduces boilerplate (no need to manually manage pending/fulfilled/rejected).
// Keeps Redux state updates consistent across all API calls.
// Integrates with slices (extraReducers) easily.
// Debugging is easier since Redux DevTools shows pending/fulfilled/rejected automatically.

export const fetchUser = createAsyncThunk('user/fetchUser', async(token)=>{
    const {data} = await api.get('/api/user/data',{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return data.success ? data.user : null;
})

export const updateUser = createAsyncThunk('user/update', async({userData,token})=>{
    const {data} = await api.post('/api/user/update',userData,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })

    if(data.success){
        toast.success(data.message)
        return data.user // updated user data
    }
    else{
        toast.error(data.message)
        return null;
    }
})




const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(fetchUser.fulfilled, (state,action)=>{
            state.value = action.payload;
        }).addCase(updateUser.fulfilled , (state,action)=>{
            state.value = action.payload;
        })
    }
})

export default userSlice.reducer;