import mongoose from "mongoose";

const connectDB = async() =>{
    try {
       mongoose.connect(
    process.env.MONGODB_URL,
    {
      dbName:"PingUp_Data"
    }
).then(()=>console.log("mongoDB connected...")).catch((err)=>console.log(err));
    } catch (error) {
        console.log(error.message)
    }
}
export default connectDB;