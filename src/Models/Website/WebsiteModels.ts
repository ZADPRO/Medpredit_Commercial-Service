import { subscribe } from "diagnostics_channel";
import {
  addDaysToDate,
  calculateDaysDifference,
  CurrentTime,
  generateFileName,
  getDateOnly,
} from "../../Helper/CurrentTime";
import {
  checkMobileNumberQuery,
  getAssessmentNoQuery,
  getPasswordQuery,
  getUserId,
  nextUserId,
  overAllId,
  postnewCommunication,
  postNewUser,
  postnewUserDomain,
} from "../Assistant/AssistantQuery";
import {
  changePasswordQuery,
  getUsersListMobileNo,
  postActiveQuery,
  userParticularSiginQuery,
  usersigninQuery,
} from "../Authentication/AuthenticationQuery";

import { sendEmail } from "../../Helper/mail";
import axios from "axios";
import { Client } from "minio";

import moment from "moment";

import { UserLoginModel } from "../Commercial/CommercialModels";
import {
  createUploadUrl,
  getFileUrl,
  listAllFiles,
  minioClient,
} from "../../Helper/MinioClient/MinioClient";

const DB = require("../../Helper/DBConncetion");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const logger = require("../../Helper/Logger");

// export const adminSigninModel = async (username: string, password: string) => {
//   const connection = await DB();

//   try {
//     const values = [username];

//     const result = await connection.query(adminsigninQuery, values);

//     if (result.rows.length > 0) {
//       const hashpass = result.rows[0].refUserHashedpassPassword;

//       const passStatus = await bcrypt.compare(password, hashpass);

//       if (!passStatus) {
//       return { success: false, message: "Incorrect password" };
//     }
//       const accessToken = jwt.sign(
//         {
//           userid: result.rows[0].refUserId,
//           branch: "commercial",
//         },
//         process.env.ACCESS_TOKEN
//       );
//     }
//     if (result.rows.length === 0) {
//       return await UserLoginModel(username, password);
//     }
//         return { success: true, token: accessToken };

//   } catch (error) {
//     console.error("Something went Wrong", error);
//     throw error;
//   } finally {
//     await connection.end();
//   }
// };

export const adminSigninModel = async (username: string, password: string) => {
  const connection = await DB();

  try {
    const values = [username];
    const adminsigninQuery = `
    SELECT
  *
FROM
  "superAdmin"."adminTable"
WHERE
  "refUsername" = $1
    `;
    const result = await connection.query(adminsigninQuery, values);
    console.log("result", result);
    console.log("result.rows.length", result.rows.length);

    if (result.rows.length === 0) {
      //   return await UserLoginModel(username, password);
      const userLoginResult = await UserLoginModel(username, password);
      return {
        ...userLoginResult,
        fallback: true,
        message: "Admin not found, tried user login instead.",
      };
    }

    const user = result.rows[0];
    const hashpass = user.refUserHashedpassPassword;

    const passStatus = await bcrypt.compare(password, hashpass);
    if (!passStatus) {
      return { success: false, message: "Incorrect password" };
    }

    const accessToken = jwt.sign(
      {
        userid: user.adminTableId,
        branch: "commercial", // you can make this dynamic if needed
      },
      process.env.ACCESS_TOKEN!
    );

    return {
      success: true,
      token: accessToken,
      roleId: 6,
      result: result.rows[0],
      isDetails: result.rows[0],
      userdetails: {
        userId: 1,
        userCustId: "ADMIN01",
        firstName: "Admin",
        lastName: "Dashboard ",
        phNumber: "1234567890",
      },
    };
  } catch (error) {
    console.error("Something went wrong during admin signin:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const UploadBlogModel = async (data) => {
  const { blogTitle, blogContent, filePath } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
      INSERT INTO "superAdmin"."blogTable" (
        "blogTitle", "blogContent", "filePath", "createdAt", "createdBy"
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [blogTitle, blogContent, filePath, now, "Admin"];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "Blog added successfully.",
      result: result.rows[0],
    };
  } catch (error) {
    console.error("added Blog Model error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};
export const deleteBlogModel = async (data) => {
  const { blogId } = data;
  const connection = await DB();
  // const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
     UPDATE "superAdmin"."blogTable"
SET
  "isDelete" = true
WHERE
  "blogId" = $1
RETURNING *;
    `;

    const values = [blogId];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "Blog deleted successfully.",
      result: result.rows[0],
    };
  } catch (error) {
    console.error("delete Blog Model error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

// export const listBlogsModel = async () => {
//   const connection = await DB();

//   try {
//     const query = `
//       SELECT *
//       FROM "superAdmin"."blogTable"
//       WHERE "isDelete" IS NOT true
//     `;

//     const result = await connection.query(query);
//     const blogs = result.rows;

//     // Enrich blogs with signed image URLs
//     const expireMins = 15;

//     const enrichedBlogs = await Promise.all(
//       blogs.map(async (blog) => {
//         let signedImageUrl: string | null = null;
//         if (blog.filePath) {
//           try {
//             const fileName = blog.filePath;
//             console.log("fileName line ----- 264", fileName);
//             if (fileName) {
//               signedImageUrl = await getFileUrl(fileName, expireMins);
//             }
//           } catch (err) {
//             console.warn(
//               `Failed to generate signed URL for blog ID ${blog.id}`,
//               err
//             );
//           }
//         }

//         return {
//           ...blog,
//           signedImageUrl, // add the signed URL to the response
//         };
//       })
//     );

//     const userlistQuery = `
// SELECT
//   *
// FROM
//   "superAdmin"."blogTable"
// WHERE
//   "isDelete" IS NOT true
//   ORDER BY
//   "blogId" DESC
//  LIMIT 5;
// `;
//     const userListresult = await connection.query(userlistQuery);

//     return {
//       status: true,
//       message: "Blog listed successfully.",
//       image: enrichedBlogs,
//       result: result,
//       forUser: userListresult
//     };
//   } catch (error) {
//     console.error("Upload Blog listed error:", error);
//     throw error;
//   } finally {
//     await connection.end();
//   }
// };

export const listBlogsModel = async () => {
  const connection = await DB();

  try {
    const expireMins = 15;

    // Utility function to enrich a blog with a signed image URL
    const enrichBlogWithImage = async (blog: any) => {
      let signedImageUrl: string | null = null;

      if (
        blog.filePath &&
        typeof blog.filePath === "string" &&
        blog.filePath.trim() !== ""
      ) {
        try {
          signedImageUrl = await getFileUrl(blog.filePath, expireMins);
        } catch (err) {
          console.warn(
            `Failed to generate signed URL for blog ID ${blog.blogId}`,
            err
          );
        }
      }

      return {
        ...blog,
        signedImageUrl,
      };
    };

    // Fetch all blogs (not deleted)
    const allBlogsQuery = `
      SELECT *
      FROM "superAdmin"."blogTable"
      WHERE "isDelete" IS NOT true
      ORDER BY "blogId" DESC;
    `;
    const allBlogsResult = await connection.query(allBlogsQuery);
    const allBlogs = await Promise.all(
      allBlogsResult.rows.map(enrichBlogWithImage)
    );

    // Fetch latest 3 blogs for user view
    const userBlogsQuery = `
      SELECT *
      FROM "superAdmin"."blogTable"
      WHERE "isDelete" IS NOT true
      ORDER BY "blogId" DESC
      LIMIT 3;
    `;
    const userBlogsResult = await connection.query(userBlogsQuery);
    const userBlogs = await Promise.all(
      userBlogsResult.rows.map(enrichBlogWithImage)
    );

    return {
      status: true,
      message: "Blog listed successfully.",
      forUserAllBlogs: allBlogs, // Full list of blogs
      image: allBlogs,
      blogsForUser: userBlogs, // Latest 3 blogs for user
    };
  } catch (error) {
    console.error("Upload Blog listed error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

// export const listBlogsModel = async () => {
//   const connection = await DB();

//   try {
//     // Fetch all blogs (not deleted)
//     const query = `
//       SELECT
//   *
// FROM
//   "superAdmin"."blogTable"
// WHERE
//   "isDelete" IS NOT true
// ORDER BY
//   "blogId" DESC;
//     `;

//     const result = await connection.query(query);
//     const blogs = result.rows;

//     const expireMins = 15;

//     // Enrich blogs with signed image URLs
//     const enrichedBlogs = await Promise.all(
//       blogs.map(async (blog) => {
//         let signedImageUrl: string | null = null;

//         // Only try generating a URL if filePath exists
//         if (
//           blog.filePath &&
//           typeof blog.filePath === "string" &&
//           blog.filePath.trim() !== ""
//         ) {
//           try {
//             signedImageUrl = await getFileUrl(blog.filePath, expireMins);
//           } catch (err) {
//             console.warn(
//               `Failed to generate signed URL for blog ID ${blog.blogId}`,
//               err
//             );
//             signedImageUrl = null;
//           }
//         }

//         return {
//           ...blog,
//           signedImageUrl, // Always present (null if error)
//         };
//       })
//     );

//     const enrichedBlogsforUserAllBlogs = await Promise.all(
//       result.map(async (result) => {
//         let signedImageUrl: string | null = null;

//         // Only try generating a URL if filePath exists
//         if (
//           result.filePath &&
//           typeof result.filePath === "string" &&
//           result.filePath.trim() !== ""
//         ) {
//           try {
//             signedImageUrl = await getFileUrl(result.filePath, expireMins);
//           } catch (err) {
//             console.warn(
//               `Failed to generate signed URL for blog ID ${result.blogId}`,
//               err
//             );
//             signedImageUrl = null;
//           }
//         }

//         return {
//           ...result,
//           signedImageUrl, // Always present (null if error)
//         };
//       })
//     );
//     // Get latest 5 blogs for users
//     const userlistQuery = `
//   SELECT
//   *
// FROM
//   "superAdmin"."blogTable"
// WHERE
//   "isDelete" IS NOT true
// ORDER BY
//   "blogId" DESC
// LIMIT
//   3;
//     `;
//     const userListresult = await connection.query(userlistQuery);

//     const enrichedBlogsforUserBlogs = await Promise.all(
//       userListresult.map(async (userListresult) => {
//         let signedImageUrl: string | null = null;

//         // Only try generating a URL if filePath exists
//         if (
//           userListresult.filePath &&
//           typeof userListresult.filePath === "string" &&
//           userListresult.filePath.trim() !== ""
//         ) {
//           try {
//             signedImageUrl = await getFileUrl(
//               userListresult.filePath,
//               expireMins
//             );
//           } catch (err) {
//             console.warn(
//               `Failed to generate signed URL for blog ID ${userListresult.blogId}`,
//               err
//             );
//             signedImageUrl = null;
//           }
//         }

//         return {
//           ...userListresult,
//           signedImageUrl, // Always present (null if error)
//         };
//       })
//     );

//     return {
//       status: true,
//       message: "Blog listed successfully.",
//       forUserAllBlogs: enrichedBlogsforUserAllBlogs, // Full list with image handling
//       image: enrichedBlogs,
//       blogsForUser: enrichedBlogsforUserBlogs, // Only top 5 for user
//     };
//   } catch (error) {
//     console.error("Upload Blog listed error:", error);
//     throw error;
//   } finally {
//     await connection.end();
//   }
// };

export const userReviewsModel = async (data) => {
  const { userName, useremail, reviewContent, ratings } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
  INSERT INTO
  "superAdmin"."userReviews"(
    "userName",
    "useremail",
    "reviewContent",
    "ratings",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6)
RETURNING
  *
    `;

    const values = [userName, useremail, reviewContent, ratings, now, "Admin"];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "userReviews added successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error(" userReviewsModel Model error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const updateViewStatusModel = async (data) => {
  const { reviewId, newstatus } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
   UPDATE
  "superAdmin"."userReviews"
   SET
  "refViewStatus" = $2
   WHERE
  "reviewId" = $1
    `;

    const values = [reviewId, newstatus];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "userReviews added successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error(" userReviewsModel Model error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const listReviewsModel = async () => {
  const connection = await DB();

  try {
    const query = `
SELECT
  *
FROM
  "superAdmin"."userReviews" 
    WHERE "isDelete" IS NOT true

    `;

    const userquery = `
SELECT
  "userName",
  "useremail",
  "reviewContent",
  "ratings",
  "refViewStatus"
FROM
  "superAdmin"."userReviews"
WHERE
  "isDelete" IS NOT true
  AND ("refViewStatus" = 'Show')
ORDER BY
  "reviewId" DESC
LIMIT
  5;

    `;
    const userAllquery = `
SELECT
  "userName",
  "useremail",
  "reviewContent",
  "ratings",
  "refViewStatus"
FROM
  "superAdmin"."userReviews"
WHERE
  "isDelete" IS NOT true
  AND ("refViewStatus" = 'Show')
ORDER BY
  "reviewId" DESC;

    `;

    const result = await connection.query(query);
    const result2 = await connection.query(userquery);
    const result3 = await connection.query(userAllquery);

    return {
      status: true,
      message: "Reviews listed successfully.",
      result: result.rows,
      listUsers: result2.rows,
      listAllForUsers: result3.rows,
    };
  } catch (error) {
    console.error(" listReviewsModel  error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const addAchievementModel = async (data) => {
  const { achievementTitle, achievementDescription, achievedOn } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
  INSERT INTO
  "superAdmin"."achievements"(
    "achievementTitle",
    "achievementDescription",
    "achievedOn",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5)
RETURNING
  *
    `;

    const values = [
      achievementTitle,
      achievementDescription,
      achievedOn,
      now,
      "Admin",
    ];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "Achievement added successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error(" Achievement add error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const listAchievementModel = async () => {
  const connection = await DB();

  try {
    const query = `
SELECT
  *
FROM
  "superAdmin"."achievements"
  WHERE "isDelete" IS NOT true
    `;

    const result = await connection.query(query);

    const userquery = `
SELECT
  *
FROM
  "superAdmin"."achievements"
WHERE
  "isDelete" IS NOT true
ORDER BY
  "achievementId" DESC
LIMIT
  5;
    `;

    const result1 = await connection.query(userquery);

    return {
      status: true,
      message: "Achievements listed successfully.",
      result: result.rows,
      forUser: result1,
    };
  } catch (error) {
    console.error(" error in list Achievements:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const deleteAchivementsModel = async (data) => {
  const { achievementId } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
       UPDATE
  "superAdmin"."achievements"
SET
  "isDelete" = true
WHERE
  "achievementId" = $1
RETURNING
  *;
    `;

    const values = [achievementId];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "Achievements deleted successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error(" Achievements delete error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const addReleaseModel = async (data) => {
  const { version, notes, releaseDate, refStatus } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
  INSERT INTO
  "superAdmin"."newrelease" (
    "version",
    "notes",
    "releaseDate",
    "refStatus",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6)
RETURNING
  *
    `;

    const values = [version, notes, releaseDate, refStatus, "admin", now];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "New release added successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error(" New release addition error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const deleteReleaseModel = async (data) => {
  const { releaseId } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
UPDATE
  "superAdmin"."newrelease"
SET
  "isDelete" = true
WHERE
  "releaseId" = $1
RETURNING
  *;
    `;

    const values = [releaseId];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "release deleted successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error(" release  deleted error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};
export const deleteReviewsModel = async (data) => {
  const { reviewId } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
UPDATE
  "superAdmin"."userReviews"
SET
  "isDelete" = true
WHERE
  "reviewId" = $1
RETURNING
  *;
    `;

    const values = [reviewId];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "Reviews delete successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error(" userReview delete error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const listReleaseModel = async () => {
  const connection = await DB();

  try {
    const query = `
SELECT
  *
FROM
  "superAdmin"."newrelease"
  WHERE "isDelete" IS NOT true
  ORDER BY
  "releaseId" DESC
    `;

    const result = await connection.query(query);

    const Userquery = `
SELECT
  *
FROM
  "superAdmin"."newrelease"
WHERE
  "isDelete" IS NOT true
ORDER BY
  "releaseId" DESC
LIMIT
  4;
    `;

    const result1 = await connection.query(Userquery);

    return {
      status: true,
      message: "release listed successfully.",
      result: result.rows,
      forUser: result1.rows,
    };
  } catch (error) {
    console.error(" error in list release:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const UpdateBlogModel = async (data) => {
  const { blogId, blogTitle, blogContent, filePath } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
     UPDATE
  "superAdmin"."blogTable"
SET
  "blogTitle" = $2,
  "blogContent" = $3,
  "filePath" = $4,
  "updatedAt" = $5,
  "updatedBy" = $6
WHERE
  "blogId" = $1
RETURNING
  *;
    `;

    const values = [blogId, blogTitle, blogContent, filePath, now, "Admin"];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "Blog updated successfully.",
      result: result.rows[0],
    };
  } catch (error) {
    console.error("update Blog Model error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const UpdateReviewModel = async (data) => {
  const { userName, useremail, reviewContent, ratings, reviewId } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
UPDATE
  "superAdmin"."userReviews"
SET
  "userName" = $2,
  "useremail" = $3,
  "reviewContent" = $4,
  "ratings" = $5,
  "updatedAt" = $6,
  "updatedBy" = $7
WHERE
  "reviewId" = $1
RETURNING
  *;
    `;

    const values = [
      userName,
      useremail,
      reviewContent,
      ratings,
      reviewId,
      now,
      "Admin",
    ];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "review updated successfully.",
      result: result.rows[0],
    };
  } catch (error) {
    console.error("update review Model error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const updateAchievementModel = async (data) => {
  const {
    achievementTitle,
    achievementDescription,
    achievedOn,
    achievementId,
  } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
  INSERT INTO
  "superAdmin"."achievements"(
    "achievementTitle",
    "achievementDescription",
    "achievedOn",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5)
RETURNING
  *
    `;

    const values = [
      achievementTitle,
      achievementDescription,
      achievedOn,
      now,
      "Admin",
    ];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "Achievement added successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error(" Achievement add error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};
export const updateReleaseModel = async (data) => {
  const { releaseId, version, notes, releaseDate, refStatus } = data;
  const connection = await DB();
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const query = `
UPDATE
  "superAdmin"."newrelease"
SET
  "version" = $2,
  "notes" = $3,
  "releaseDate" = $4,
  "refStatus" = $5,
  "updatedAt" = $6,
  "updatedBy" = $7
WHERE
  "releaseId" = $1
    `;

    const values = [
      releaseId,
      version,
      notes,
      releaseDate,
      refStatus,
      now,
      "Admin",
    ];

    const result = await connection.query(query, values);

    return {
      status: true,
      message: "Achievement added successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error(" Achievement add error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const blogImageModel = async (fileName: string) => {
  const connection = await DB();

  try {
    // const filename = generateFileName();
    // console.log("filename", filename);
    // Generate signed URL for uploading and file view
    // const fileName = `${filename}.${fileTypes[1]}`
    console.log("fileName", fileName);
    const filename = generateFileName();
    console.log("filename", filename);

    const { upLoadUrl, fileUrl } = await createUploadUrl(filename, 15); // expires in 15 mins

    return {
      status: true,
      message: "Blog image upload URL generated successfully.",
      uploadUrl: upLoadUrl,
      fileUrl: fileUrl,
      fileName: filename,
    };
  } catch (error) {
    console.error("Blog image upload URL generation error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getBlogsModel = async (blogId: string) => {
  const connection = await DB();

  try {
    const query = `
SELECT
  *
FROM
  "superAdmin"."blogTable"
WHERE
  "blogId" = $1
    `;
    const value = [blogId];
    const result = await connection.query(query, value);
    console.log("result", result);
    const blogs = result.rows;
    const expireMins = 15;

    // Enrich blogs with signed image URLs
    const enrichedBlogs = await Promise.all(
      blogs.map(async (blogs) => {
        let signedImageUrl: string | null = null;

        // Only try generating a URL if filePath exists
        if (
          blogs.filePath &&
          typeof blogs.filePath === "string" &&
          blogs.filePath.trim() !== ""
        ) {
          try {
            signedImageUrl = await getFileUrl(blogs.filePath, expireMins);
          } catch (err) {
            console.warn(`Failed to generate signed URL`, err);
            signedImageUrl = null;
          }
        }

        return {
          ...blogs,
          signedImageUrl, // Always present (null if error)
        };
      })
    );

    return {
      status: true,
      message: "Blog get successfully.",
      result: enrichedBlogs,
    };
  } catch (error) {
    console.error("Blog get error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};
export const getReleaseModel = async (releaseId: string) => {
  const connection = await DB();

  try {
    const query = `
SELECT
  *
FROM
  "superAdmin"."newrelease"
WHERE
  "releaseId" = $1
    `;
    const value = [releaseId];
    const result = await connection.query(query, value);

    // Enrich blogs with signed image URLs

    return {
      status: true,
      message: "release get successfully.",
      result: result.rows,
    };
  } catch (error) {
    console.error("release get error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};
export const testImageModel = async () => {
  const connection = await DB();

  try {
    const bucketName = process.env.MINIO_BUCKET;


    const files = await listAllFiles(bucketName);
  const expirySeconds = 60 * 10; // e.g., 10 mins expiry

  const urls = await Promise.all(
      files.map((fileName) =>
        minioClient.presignedUrl("GET", bucketName, fileName, expirySeconds)
      )
    );
    return {
      status: true,
      message: "release get successfully.",
      urls:urls
   };
  } catch (error) {
    console.error("release get error:", error);
    throw error;
  } finally {
    await connection.end();
  }
};
