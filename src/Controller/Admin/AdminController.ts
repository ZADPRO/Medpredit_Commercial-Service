import { encrypt } from "../../Helper/Encryption";
import { CurrentTime } from "../../Helper/CurrentTime";

import { AbstractKeyword } from "typescript";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../../Helper/Logger");

import path from "path";
import fs from "fs";
import { UserCountModel, userListModel } from "../../Models/Admin/AdminModels";
// import { UserCountModel, userListModel } from "../../Controller/Admin/";

export const UserCountController = async (req, res) => {
  console.log("req", req);
  //   const { userId } = req.params;
  //   console.log("userId", userId);

  try {
    const result = await UserCountModel();
    return res.status(200).json({
      status: true,
      records: result,
    });
  } catch (error) {
    console.error("User Count Model error:", error);
    return res.status(500).json({
      status: false,
      message: "Error User Count Model",
    });
  }
};

const UserlistController = async (req, res) => {
  try {
    const { fromDate, todate } = req.body;

    const result = await userListModel(fromDate, todate);

    logger.info(`User list (${UserlistController})`);

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    console.error("Something went Wrong", error);

    logger.error(`User list In Error: (${error})`);
    return res.status(500).json({ error: "Something went Wrong" + error });
  }
};

const CheckAPIController = async (req, res) => {
  try {
    const result = {
      status: "success",
      message: "API is working fine",
      timestamp: new Date().toISOString(),
    };

    // Logging the check
    logger.info(`API check successful`);

    // Encrypt and respond
    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    console.error("Something went wrong:", error);

    logger.error(`API check error: ${error.message}`);
    return res
      .status(500)
      .json({ error: "Something went wrong: " + error.message });
  }
};

module.exports = {
  UserCountController,
  UserlistController,
  CheckAPIController,
};
