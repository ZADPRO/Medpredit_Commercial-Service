import express from "express";

import multer from "multer";
import path from "path";
import fs from "fs";

const {
  verifyToken,
} = require("../../Controller/Authentication/AuthenticationControllers");

const {
  UserCountController,
  UserlistController,
  CheckAPIController,
} = require("../../Controller/admin/adminController");

const AdminRoutes = express.Router();

AdminRoutes.get("/userCount", verifyToken, UserCountController);

AdminRoutes.post("/userList", verifyToken, UserlistController);
console.log("Checking api routes");

AdminRoutes.get(
  "/CheckAPI",
  // verifyToken,
  CheckAPIController
);

export default AdminRoutes;
