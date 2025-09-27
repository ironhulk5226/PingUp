import express from "express";
import { addUserStory , getUserStories } from "../controllers/storyController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";

const storyRouter = express.Router();

//@api/story/create
storyRouter.post('/create', upload.single('media') , protect , addUserStory)

//@api/story/getstories
storyRouter.get('/getstories',protect,getUserStories)

export default storyRouter;