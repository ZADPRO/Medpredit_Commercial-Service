import express from "express";

import multer from "multer";
import path from "path";
import fs from "fs";

const {
  verifyToken,
} = require("../../Controller/Authentication/AuthenticationControllers");

const {
  sendUserCountMailController,
} = require("../../Controller/Batch/BatchController");

const BatchRoutes = express.Router();

BatchRoutes.get("/sendUserCountMail",
  //  verifyToken,
    sendUserCountMailController);

export default BatchRoutes;
