import { subscribe } from "diagnostics_channel";
import {
  addDaysToDate,
  calculateDaysDifference,
  CurrentTime,
  getDateOnly,
} from "../../Helper/CurrentTime";

import { sendEmail } from "../../Helper/mail";
import axios from "axios";
import { userlistQuery } from "../Admin/AdminQuery";
// import { userlistQuery } from "./AdminQuery";

const DB = require("../../Helper/DBConncetion");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const logger = require("../../Helper/Logger");

export const UserCountModel = async () => {
  const connection = await DB();
  try {
    const query = `
      SELECT
  *
  FROM
  public."Users" u
WHERE
  u."refUserCustId" LIKE 'USER%'
  AND u."activeStatus" = 'active'
    `;
    const result = await connection.query(query, []);
    return result.rows;
  } catch (error) {
    console.error("GetMedicalRecordsByUserModel error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const userListModel = async (fromDate: string, todate: string) => {
  const connection = await DB();

  try {
    const values = [fromDate, todate];

    const result = await connection.query(userlistQuery, values);

    return {
      status: true,
      data: result.rows,
    };
  } catch (error) {
    console.error("Something went Wrong", error);
    throw error;
  } finally {
    await connection.end();
  }
};
