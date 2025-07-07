import { encrypt } from "../../Helper/Encryption";
import { CurrentTime } from "../../Helper/CurrentTime";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../../Helper/Logger");
import { sendUserCountMailModels } from "../../Models/Batch/BatchModels";

const sendUserCountMailController = async (req, res) => {
  try {
    const result = await sendUserCountMailModels();

    return res.status(200).json(encrypt(result, true));
  } catch (error) {
    logger.error(`getUserListController Error: (${error})`);
    console.error("Something went Wrong");
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

module.exports = {
  sendUserCountMailController,
};
