import express from "express";
import { discoverUsers, FollowUsers, getUserData, updateUserData,UnfollowUsers, sendConnectionRequest, acceptConnectionRequest, getUserConnection } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";

const userRouter = express.Router();

// @/api/user/data
userRouter.get('/data' , protect, getUserData)

// @/api/user/update
userRouter.post('/update',upload.fields([{name:'profile',maxCount:1},{name:'cover',maxCount:1}]),protect,updateUserData);

// @/api/user/discover
userRouter.post('/discover',protect , discoverUsers);

// @/api/user/follow
userRouter.post('/follow' , protect , FollowUsers);

// @/api/user/unfollow
userRouter.post('/unfollow', protect , UnfollowUsers);

// @/api/user/unfollow
userRouter.post('/connect', protect , sendConnectionRequest);

// @/api/user/unfollow
userRouter.post('/accept', protect , acceptConnectionRequest);

// @/api/user/unfollow
userRouter.post('/connections', protect , getUserConnection);



export default userRouter;