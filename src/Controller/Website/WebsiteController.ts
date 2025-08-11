import { encrypt } from "../../Helper/Encryption";
import { CurrentTime } from "../../Helper/CurrentTime";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../../Helper/Logger");

import path from "path";
import fs from "fs";
import {
  adminSigninModel,
  UploadBlogModel,
  listBlogsModel,
  userReviewsModel,
  listReviewsModel,
  addAchievementModel,
  deleteBlogModel,
  listAchievementModel,
  deleteAchivementsModel,
  addReleaseModel,
  deleteReleaseModel,
  listReleaseModel,
  deleteReviewsModel,
  UpdateBlogModel,
  UpdateReviewModel,
  updateAchievementModel,
  blogImageModel,
  updateViewStatusModel,
  getBlogsModel,
  updateReleaseModel,
  getReleaseModel,
  testImageModel,
} from "../../Models/Website/WebsiteModels";

// const adminSigninController = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const result = await adminSigninModel(username, password);

//     logger.info(`User Signed In (${username})`);

//     return res.status(200).json(encrypt(result, false));
//   } catch (error) {
//     console.error("Something went Wrong", error);

//     logger.error(`User Signed In Error: (${error})`);
//     return res.status(500).json({ error: "Something went Wrong" + error });
//   }
// };

const adminSigninController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await adminSigninModel(username, password);

    logger.info(`User Signed In (${username})`);
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    console.error("Something went Wrong", error);
    logger.error(`User Signed In Error: (${error})`);
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const uploadBlogImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "No file uploaded" });
    }

    const filePath = path.join("assets", "blogs", req.file.filename);
    const absolutePath = path.resolve(filePath);

    // ✅ Check file existence before reading
    if (!fs.existsSync(absolutePath)) {
      return res
        .status(404)
        .json({ status: false, message: "Uploaded file not found" });
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const base64Content = fileBuffer.toString("base64");

    return res.status(200).json(
      encrypt(
        {
          status: true,
          fileName: req.file.filename,
          filePath,
          base64: base64Content,
        },
        true
      )
    );
  } catch (error) {
    console.error("uploadBlogImageController error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Server error during file processing" });
  }
};

const UploadBlogController = async (req, res) => {
  try {
    const { blogTitle, blogContent, filePath } = req.body;

    const record = {
      blogTitle,
      blogContent,
      filePath,
    };
    const result = await UploadBlogModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("UploadBlogController error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Blog upload failed" });
  }
};
const deleteBlogController = async (req, res) => {
  try {
    const { blogId } = req.body;

    // const createdBy = req.userData.userid;

    const record = {
      blogId,
      // createdBy
    };
    const result = await deleteBlogModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("deleteBlogController error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Blog delete failed" });
  }
};

const listBlogsController = async (req, res) => {
  try {
    const result = await listBlogsModel();

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("listBlogl error:", error);
    return res.status(500).json({ status: false, message: "listBlogs failed" });
  }
};

const userReviewsController = async (req, res) => {
  try {
    const { userName, useremail, reviewContent, ratings } = req.body;

    const record = {
      userName,
      useremail,
      reviewContent,
      ratings,
    };
    const result = await userReviewsModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("userReviewsController error:", error);
    return res
      .status(500)
      .json({ status: false, message: "userReviewsController upload failed" });
  }
};

const updateViewStatusController = async (req, res) => {
  try {
    const { reviewId, newstatus } = req.body;

    const record = {
      reviewId,
      newstatus,
    };
    const result = await updateViewStatusModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("updateViewStatusController error:", error);
    return res
      .status(500)
      .json({
        status: false,
        message: "updateViewStatusController upload failed",
      });
  }
};

const listReviewsController = async (req, res) => {
  try {
    const result = await listReviewsModel();

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("userReviewsController error:", error);
    return res
      .status(500)
      .json({ status: false, message: "userReviewsController upload failed" });
  }
};

const addAchievementController = async (req, res) => {
  try {
    const { achievementTitle, achievementDescription, achievedOn } = req.body;

    const record = {
      achievementTitle,
      achievementDescription,
      achievedOn,
    };
    const result = await addAchievementModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("addAchievementController error:", error);
    return res.status(500).json({
      status: false,
      message: "addAchievementController upload failed",
    });
  }
};

const listAchievementController = async (req, res) => {
  try {
    const result = await listAchievementModel();

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("userReviewsController error:", error);
    return res
      .status(500)
      .json({ status: false, message: "userReviewsController upload failed" });
  }
};

const deleteAchivementsController = async (req, res) => {
  try {
    const { achievementId } = req.body;

    const record = {
      achievementId,
    };
    const result = await deleteAchivementsModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("addAchievementController error:", error);
    return res.status(500).json({
      status: false,
      message: "addAchievementController upload failed",
    });
  }
};

const addReleaseController = async (req, res) => {
  try {
    const { version, notes, releaseDate, refStatus } = req.body;

    const record = {
      version,
      notes,
      releaseDate,
      refStatus,
    };
    const result = await addReleaseModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("addReleaseController error:", error);
    return res.status(500).json({
      status: false,
      message: "addReleaseController upload failed",
    });
  }
};
const deleteReleaseController = async (req, res) => {
  try {
    const { releaseId } = req.body;

    const record = {
      releaseId,
    };
    const result = await deleteReleaseModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("deleteReleaseController error:", error);
    return res.status(500).json({
      status: false,
      message: "deleteReleaseController upload failed",
    });
  }
};
const deleteReviewsController = async (req, res) => {
  try {
    const { reviewId } = req.body;

    const record = {
      reviewId,
    };
    const result = await deleteReviewsModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("deleteReviewsController error:", error);
    return res.status(500).json({
      status: false,
      message: "deleteReviewsController upload failed",
    });
  }
};

const listReleaseController = async (req, res) => {
  try {
    const result = await listReleaseModel();

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("userReviewsController error:", error);
    return res
      .status(500)
      .json({ status: false, message: "userReviewsController upload failed" });
  }
};

const updateBlogController = async (req, res) => {
  try {
    const { blogId, blogTitle, blogContent, imagePath } = req.body;

    const record = {
      blogTitle,
      blogContent,
      filePath: imagePath,
      blogId,
    };
    const result = await UpdateBlogModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("UploadBlogController error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Blog upload failed" });
  }
};

const updateReviewsController = async (req, res) => {
  try {
    const { userName, useremail, reviewContent, ratings, reviewId } = req.body;

    const record = {
      userName,
      useremail,
      reviewContent,
      ratings,
      reviewId,
    };
    const result = await UpdateReviewModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("UploadBlogController error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Blog upload failed" });
  }
};

const updateAchievementController = async (req, res) => {
  try {
    const {
      achievementId,
      achievementTitle,
      achievementDescription,
      achievedOn,
    } = req.body;

    const record = {
      achievementTitle,
      achievementDescription,
      achievedOn,
      achievementId,
    };
    const result = await updateAchievementModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("updateAchievementController error:", error);
    return res.status(500).json({
      status: false,
      message: "updateAchievementController upload failed",
    });
  }
};

const updateReleaseController = async (req, res) => {
  try {
    const { releaseId, version, notes, releaseDate, refStatus } = req.body;

    const record = {
      releaseId,
      version,
      notes,
      releaseDate,
      refStatus,
    };
    const result = await updateReleaseModel(record);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("updateReleaseController error:", error);
    return res.status(500).json({
      status: false,
      message: "updateReleaseController upload failed",
    });
  }
};
const blogImageController = async (req, res) => {
  try {
    const { fileName } = req.body;
    console.log("req.body", req.body);
    console.log("fileType", fileName);

    const result = await blogImageModel(fileName);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("blogImageController error:", error);
    return res.status(500).json({
      status: false,
      message: "blogImageController upload failed",
    });
  }
};

const getBlogsController = async (req, res) => {
  try {
    const { blogId } = req.body;
    console.log("blogId", blogId);
    const result = await getBlogsModel(blogId);
    console.log("result", result);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("getBlogsController error:", error);
    return res.status(500).json({
      status: false,
      message: "getBlogsController upload failed",
    });
  }
};

const getReleaseController = async (req, res) => {
  try {
    const { releaseId } = req.body;
    const result = await getReleaseModel(releaseId);

    return res.status(200).json(encrypt(result, true)); // Encrypt if needed
  } catch (error) {
    console.error("getReleaseController error:", error);
    return res.status(500).json({
      status: false,
      message: "getReleaseController upload failed",
    });
  }
};
const testImageController = async (req, res) => {
  try {
    const result = await testImageModel();

    return res.status(200).json(encrypt(result, false)); // Encrypt if needed
  } catch (error) {
    console.error("testImageController error:", error);
    return res.status(500).json({
      status: false,
      message: "testImageController upload failed",
    });
  }
};

module.exports = {
  adminSigninController,
  uploadBlogImageController,
  UploadBlogController,
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
  updateReleaseController,
  testImageController,
};
