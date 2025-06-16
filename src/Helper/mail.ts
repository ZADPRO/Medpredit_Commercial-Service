import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true, // Enable internal logging
  // debug: true, // Show debug output
});

// const transporter = nodemailer.createTransport({
//   service: "hotmail",
//   auth: {
//     type: "OAuth2",
//     user: "thirukumara.d@zadroit.com",
//     clientId: "80177c7c-49df-4a2e-8725-231c18ea2268",
//     clientSecret: "bcc81305-60b0-4494-8871-d7a9fa6700f5",
//     refreshToken:
//       "1.ASsAMxCjkfOAtk2IBT5Vah5JlXx8F4DfSS5KhyUjHBjqImg9AEgrAA.AgABBAIAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P-2u4CGqCy_nte5WxAstBoIXU0bma_353m0GhHwcs2CDVU5AZ0AW5jcKm4u8ShzQUkdQ4PR3StQddJ3oHCBXdtw0OrKXncMJhRoSGbPQhg9SQNliX63YVG8qqK6eLnQpbQ69uo5ysYfXcs90FjFrWMZXTP1nNYsXBDDrmUtPa3BSkgejj8KvH7ZwBMrMZt47-G4w1Sh2E7r4HPsYIXv37D92v19iRZZb50b-7ku0E6Pv-QblBGBlHpt8sXRh69rWTT41nc_zNbxDlu4K0hwavxUyRzk_s8kfTv1qjKtBLzOPujqF1GpSaqRQqzYCwt0nSgTJiexorlnApt9Ivad3TIjngNBVgZ-QPCs3VgtbgIlWd4BuJs3z_gCsxNw49iSoR4-2-yRTO-aLtbucgHrCwQ0EnXn8m94lUc0cjIlHvledmW8x9vG-HYdg9mr3zbmS82d_h5olyQ77WqGD-F_cP32FkXKN49eA8A8x8HchOMNu8JTXWLDNwb2WzA1smlQL5XAnVQWMfc-hW2UWgmjy-jih7SJX5lrWrNHQjBxBYQZUofvRWg7vsEB70tbXxxAirFTexK4ATLjLq1Q14LkdMz7U3Qd3x8W90Sy-wmzE_X5K5aOAAB0OmoSKhgfefAlv0iFAsb6uAqa-GfusnplkF853yhLVQp-kGOnpc8qlWpY4hLjd7iJ0i-Y3KNZW6UjHlD1jQEkvuIfN8gEWYahSTz1Hvot26c87-2wgxOzPZFES2l3X_Vu45sWPLsEiwU6seGpRaQtNW8HmFG5D1gfMx3Hz3IYguRE7vtQxLTqxwa-EURYuVBhHTNcH4G3Ny1N2LQ-y50PoFAThyCLkOOxlyPxYfJbecs3lnEc-fqK36hdG8GwoGXdrZBsTmKc31Y7L009i43sLqDw3dOpN6W-qGiJfHpAFD2tAQm9sg0KwpAtIJNYQfbgm52eD9bTpE_0yB7DvgOfOA&session_state=44a0f2b2-aa51-460a-bc5f-d2d0e2ff5971",
//     accessToken: "OPTIONAL",
//   },
//   logger: true,
//   debug: true,
// });

/**
 * Sends an email using Nodemailer.
 * @param {MailOptions} mailOptions - Options for the email.
 */
export const sendEmail = async (mailOptions: MailOptions): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      ...mailOptions,
    });
    return true; // success
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // failure
  }
};
