import express from "express";
import { discoverUsers, FollowUsers, getUserData, updateUserData,UnfollowUsers, sendConnectionRequest, acceptConnectionRequest, getUserConnection, getUserProfiles } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";
import { getUserRecentMessages } from "../controllers/messageController.js";

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

// @/api/user/connect
userRouter.post('/connect', protect , sendConnectionRequest);

// @/api/user/accept
userRouter.post('/accept', protect , acceptConnectionRequest);

// @/api/user/connections
userRouter.get('/connections', protect , getUserConnection);

// @/api/user/profiles
userRouter.post('/profiles', protect , getUserProfiles);

// @/api/user/recent-messages
userRouter.get('/recent-message', protect , getUserRecentMessages);



export default userRouter;