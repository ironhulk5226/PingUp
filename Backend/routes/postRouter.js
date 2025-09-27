import express from "express";
import { addPost, getFeedPosts, likePosts } from "../controllers/postController.js";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";

const postRouter = express.Router();

//@/api/post/add
postRouter.post('/add',upload.array('images',4),protect , addPost) // max 4 images can be uploaded

//@/api/post/feed
postRouter.get('/feed',protect,getFeedPosts);

//@/api/post/like
postRouter.post('/like',protect,likePosts);

export default postRouter;