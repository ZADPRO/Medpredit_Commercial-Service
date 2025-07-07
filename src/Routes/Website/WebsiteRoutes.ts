import express from "express";

import multer from "multer";
import path from "path";
import fs from "fs";
// import { UserCountController } from "../../Controller/Commercial/CommercialController";

const {
  verifyToken,
} = require("../../Controller/Authentication/AuthenticationControllers");

const {
  adminSigninController,
  UploadBlogController,
  uploadBlogImageController,
  listBlogsController,
  userReviewsController,
  listReviewsController,
  addAchievementController,
  deleteBlogController,
  listAchievementController,
  deleteAchivementsController,
  addReleaseController,
  deleteReleaseController,
  listReleaseController,
  deleteReviewsController,
  updateBlogController,
  updateReviewsController,
  updateAchievementController,
  blogImageController,
  updateViewStatusController,
  getBlogsController,
  getReleaseController,
  updateReleaseController
} = require("../../Controller/website/WebsiteController");

const WebsiteRoutes = express.Router();

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "assets/blogs";
    fs.mkdirSync(dir, { recursive: true }); // ✅ Create if not exists
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const uploadBlog = multer({ storage });

// Route 1: Upload image only
WebsiteRoutes.post(
  "/uploadBlogImage",
  uploadBlog.single("blogImage"),
  uploadBlogImageController
);

// Route 2: Upload blog metadata
WebsiteRoutes.post("/uploadBlog", UploadBlogController);

WebsiteRoutes.post("/deleteBlog", deleteBlogController);

WebsiteRoutes.post("/adminSignin", adminSigninController);

WebsiteRoutes.get("/listBlogs", listBlogsController);

WebsiteRoutes.post("/userReviews", userReviewsController);

WebsiteRoutes.post("/updateViewStatus",updateViewStatusController);

WebsiteRoutes.get("/listReviews", listReviewsController);

WebsiteRoutes.post("/addAchievement", addAchievementController);

WebsiteRoutes.get("/listAchievement", listAchievementController);

WebsiteRoutes.post("/deleteAchivements", deleteAchivementsController);

WebsiteRoutes.post("/addRelease", addReleaseController);

WebsiteRoutes.post("/deleteRelease", deleteReleaseController);

WebsiteRoutes.post("/deleteReviews", deleteReviewsController);

WebsiteRoutes.get("/listRelease", listReleaseController);

WebsiteRoutes.post("/updateBlog", updateBlogController);

WebsiteRoutes.post("/updateReviews", updateReviewsController);

WebsiteRoutes.post("/updateAchievement",  updateAchievementController);

WebsiteRoutes.post("/updateRelease",   updateReleaseController);

WebsiteRoutes.post("/blogImage", blogImageController);

WebsiteRoutes.post("/getBlogs",  getBlogsController);

WebsiteRoutes.post("/getRelease",   getReleaseController);



export default WebsiteRoutes;
