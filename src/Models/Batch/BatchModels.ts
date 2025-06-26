import nodemailer from "nodemailer";
import { CurrentTime } from "../../Helper/CurrentTime";
import { getUserCountQuery, packageTakenByUserCountQuery } from "./BatchQuery";
import { sendEmail } from "../../Helper/mail"; // if you still want this
import { sendWeeklyReport } from "../Commercial/mailContents";
const DB = require("../../Helper/DBConncetion");

export const sendUserCountMailModels = async (): Promise<{
  status: boolean;
  message?: string;
}> => {
  const connection = await DB();

  try {
    const getUserData = await connection.query(getUserCountQuery);
    console.log("getUserData", getUserData);
    const getUserSubscriptionData = await connection.query(
      packageTakenByUserCountQuery
    );
    console.log("getUserSubscriptionData", getUserSubscriptionData);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // if (getUserData.length > 0) {
    //   for (let i = 0; i < getUserData.length; i++) {
    //      const htmlContent = sendWeeklyReport(getUserData.rows, getUserSubscriptionData.rows); // Or get for individual user
    //      console.log('htmlContent', htmlContent)

    //     const mailOptions = {
    //       from: process.env.EMAIL_USER,
    //       to: "indumathi123indumathi@gmail.com",
    //       subject: `📅 Weekly Reminder - ${CurrentTime()}`,
    //       html: htmlContent,
    //     };

    //     try {
    //       await transporter.sendMail(mailOptions); // or use sendEmail(mailOptions)
    //       console.log(`📩 Email sent to: ${mailOptions.to}`);
    //     } catch (error) {
    //       console.error(`❌ Failed to send email to ${mailOptions.to}:`, error);
    //     }
    //   }
    // } else {
    //   console.log("ℹ️ No user data found.");
    // }

    //     const getUserData = await connection.query(getUserCountQuery);
    // const getUserSubscriptionData = await connection.query(packageTakenByUserCountQuery);

    if (getUserData.rowCount > 0) {
      const htmlContent = sendWeeklyReport(
        getUserData.rows,
        getUserSubscriptionData.rows
      );

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "indumathi123indumathi@gmail.com",
        subject: `📅 Weekly Reminder - ${CurrentTime()}`,
        html: htmlContent,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`📩 Weekly summary email sent to: ${mailOptions.to}`);
      } catch (error) {
        console.error(`❌ Failed to send email:`, error);
      }
    } else {
      console.log("ℹ️ No user registration data found.");
    }

    return { status: true };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { status: false, message: "Failed to send email" };
  }
};
