// export const getUserQuery = `
// SELECT
//   u.*,
//   rc.*
// FROM
//   public."Users" u
//   JOIN public."refCommunication" rc ON CAST(rc."refUserId" AS INTEGER) = u."refUserId"
// WHERE
//   u."refUserId" = $1;

// `;

// export const userUpdateQuery = `
// UPDATE public."Users"
// SET
//   "refUserFname" = $1,
//   "refUserLname" = $2,
//   "refDOB" = $3,
//   "refGender" = $4,
//   "refMaritalStatus" = $5,
//   "refEducation" = $6,
//   "refOccupationLvl" = $7,
//   "refSector" = $8,
//   "activeStatus" = $9,
//   "updatedBy" = $10

// WHERE "refUserId" = $11
// RETURNING *;
// `;

// export const communicationUpdateQuery = `UPDATE public."refCommunication"
// SET
//   "refUserEmail" = $1,
//   "refAddress" = $2,
//   "refDistrict" = $3,
//   "refPincode" = $4

// WHERE "refUserId" = $5
// RETURNING *;
// `;

// export const changeUserpostActiveQuery = `
// UPDATE
//   public."Users"
// SET
//   "activeStatus" = $1,
//   "updatedAt" = $2,
//   "updatedBy" = $3,
//   "headStatus" = $4
// WHERE
//   "refUserId" = $5
// `;

// export const changeHeadUserQuery = `
// UPDATE
//   public."Users"
// SET
//   "headStatus" = $1,
//   "updatedAt" = $2,
//   "updatedBy" = $3
//   WHERE
//   "refUserId" = $4
// `;

// export const getAllValidPackageQuery = `
// SELECT
//   *
// FROM
//   public."refPackages" rp
// WHERE
//   rp."refPkgStatus" IS TRUE
//   AND CAST(rp."refPkgEndDate" AS DATE) >= CAST($1 AS DATE)
//   ORDER BY rp."refPkgValidMembers" ASC
// `;

// export const InsertTransactionHistoryQuery = `
// INSERT INTO public."refPaymentTransaction" (
//   "refSubscriptionId",
//   "refUserId",
//   "refPkgId",
//   "refTransactionAmount",
//   "refTransactionSGST",
//   "refTransactionCGST",
//   "refTransactionMethod",
//   "refTransactionDate",
//   "refTransactionKey",
//   "refTransactionStatus",
//   "createdAt",
//   "createdBy"
// ) VALUES (
//   $1,
//   $2,
//   $3,
//   $4,
//   $5,
//   $6,
//   $7,
//   $8,
//   $9,
//   $10,
//   $11,
//   $12
// );
// `;

// export const InsertSubscriptionQuery = `
// INSERT INTO public."refSubscription" (
//   "refPkgId",
//   "refUserId",
//   "refSubStartDate",
//   "refSubEndDate",
//   "createdAt",
//   "createdBy"
// ) VALUES (
//   $1,
//   $2,
//   $3,
//   $4,
//   $5,
//   $6
// ) RETURNING *;
// `;

// export const SelectPackageQuery = `
// SELECT
//   *
// FROM
//   public."refPackages"
// WHERE
//   "refPkgId" = $1
//   AND "refPkgStatus" IS TRUE
//   AND CAST("refPkgEndDate" AS DATE) >= CAST($2 AS DATE)
// `;

// export const getPaymentTransactionHistoryQuery = `
// SELECT
//   *
// FROM
//   public."refPaymentTransaction" rpayt
//   JOIN public."refPackages" rp ON rp."refPkgId" = rpayt."refPkgId"
//   JOIN public."Users" u ON u."refUserId" = rpayt."refUserId"
//   JOIN public."refCommunication" rc ON rc."refUserId" = rpayt."refUserId"
// WHERE
//   rpayt."refUserId" = $1;
// `;

// export const checkSubscriptionsQuery = `
// SELECT
//   u."refUserId" AS "refUserId",
//   u1."refUserId" AS "refHeadUserId",
//   CAST(rs1."refSubEndDate" AS DATE) >= CAST($1 AS DATE) AS "isSubscriptionValid",
//   rs1.*,
//   rp1.*,
//   rpt1.*
// FROM
//   public."refRelation" rr
//   JOIN public."Users" u ON u."refUserId" = CAST(rr."refUserId" AS INTEGER)
//   JOIN public."refCommunication" rc ON rc."refUserId" = CAST(rr."refUserId" AS INTEGER)
//   -- Join to head user
//   JOIN public."refCommunication" rc1 ON CAST(rc1."refUserMobileno" AS TEXT) = CAST(rr."refRHeadMobileNo" AS TEXT)
//   JOIN public."Users" u1 ON u1."refUserId" = CAST(rc1."refUserId" AS INTEGER)
//   AND u1."headStatus" = 'true'
//   JOIN public."refRelation" rr1 ON rr1."refUserId" = CAST(u1."refUserId" AS INTEGER)
//   JOIN public."refSubscription" rs1 ON rs1."refUserId" = CAST(rc1."refUserId" AS INTEGER)
//   JOIN public."refPackages" rp1 ON rp1."refPkgId" = CAST(rs1."refPkgId" AS INTEGER)
//   JOIN public."refPaymentTransaction" rpt1 ON rpt1."refSubscriptionId" = rs1."refSubscriptionId"
// WHERE
//   CAST(rs1."refSubEndDate" AS DATE) >= CAST($1 AS DATE)
//   AND rr."refUserId" = $2
//   AND rr."refRStatus" = true
//   ORDER BY rpt1."refTransactionId" DESC
//   LIMIT 1;
// `;

// export const isFirstcheckSubscriptionsQuery = `
// SELECT
//   *
// FROM
//   public."refSubscription" rs
//   FULL JOIN public."refPackages" rp ON rp."refPkgId" = CAST(rs."refPkgId" AS INTEGER)
// WHERE
//   rs."refUserId" = $1
// ORDER BY
//   rs."refSubscriptionId" ASC
// `;

// export const updatedSubscriptionQuery = `
// UPDATE
//   public."refSubscription"
// SET
//   "refSubEndDate" = $1,
//   "updatedAt" = $2,
//   "updatedBy" = $3
// WHERE
//   "refSubscriptionId" = $4;
// `;

// export const getGSTQuery = `
// SELECT * FROM public."refGST"
// `;

// export const getFamilyMembersQuery = `
// SELECT
//   *
// FROM
//   public."refRelation" rr
//   JOIN public."Users" u ON u."refUserId" = rr."refUserId"
//   JOIN public."refCommunication" rc ON rc."refUserId" = rr."refUserId"
// WHERE
//   rr."refRHeadMobileNo" = $1
//   AND rr."refRStatus" = true
//   AND u."activeStatus" = 'active'
// ORDER BY
//   u."refUserId" ASC
// `;

// export const addRelationQuery = `
// INSERT INTO
//   public."refRelation" (
//     "refUserId",
//     "refRHeadMobileNo",
//     "refRName",
//     "refRStatus",
//     "createdAt",
//     "createdBy"
//   )
// VALUES
//   ($1, $2, $3, $4, $5, $6);
//   `;

// export const checkParticularUserMobileQuery = `
// SELECT
//   *
// FROM
//   public."refCommunication" rc
//   JOIN public."Users" u ON u."refUserId" = CAST(rc."refUserId" AS INTEGER)
// WHERE
//   rc."refUserMobileno" = $1
//   AND u."refUserId" != $2
//   AND u."activeStatus" = 'active'
//   AND u."headStatus" = 'false'
//   AND u."refRoleId" = '3'
// ORDER BY
//   u."refUserId" ASC
//   `;

// export const updateRelationQuery = `
//   UPDATE
//   public."refRelation"
// SET
//   "refRStatus" = $1,
//   "refRName" = $2,
//   "updatedAt" = $3,
//   "updatedBy" = $4
// WHERE
//   "refRId" = $5
//   `;

// export const checkUserRelationQuery = `
//   SELECT
//   *
// FROM
//   public."refRelation" rr
// WHERE
//   rr."refUserId" = $1
//   AND rr."refRHeadMobileNo" = $2
//   `;

// export const getLanguageQuery = `
//   SELECT * FROM public."refLanguage"
//   `;

// export const getVersionQuery = `
//   SELECT
//   *
// FROM
//   public."refVersion"
// ORDER BY
//   "refVersionId" DESC
// LIMIT
//   1
//   `;

// export const UserEmailForPayment = `
// SELECT u."refUserFname", u."refUserLname", rcn."refUserEmail", rpt."refTransactionId", rpt."refInvoiceId", rpt."refTransactionAmount", rpt."refTransactionSGST", rpt."refTransactionCGST", rpt."refTransactionMethod", rpt."refTransactionDate", rpt."refTransactionKey", rsn."refSubStartDate", rsn."refSubEndDate", rp."refPkgName"  FROM public."refPaymentTransaction" rpt
// JOIN public."refSubscription" rsn ON rpt."refUserId" = rsn."refUserId"
// JOIN public."refPackages" rp ON rp."refPkgId" = rpt."refPkgId"
// JOIN public."Users" u ON rpt."refUserId" = u."refUserId"
// JOIN public."refCommunication" rcn ON rcn."refUserId" = u."refUserId"
// WHERE rpt."refUserId"=$1 LIMIT 1;
// `;

// export const EmailIDForPayment = `
// SELECT
//   u."refUserFname",
//   u."refUserLname",
//   rcn."refUserEmail",
//   rpt."refTransactionId",
//   rpt."refInvoiceId",
//   rpt."refTransactionAmount",
//   rpt."refTransactionSGST",
//   rpt."refTransactionCGST",
//   rpt."refTransactionMethod",
//   rpt."refTransactionDate",
//   rpt."refTransactionKey",
//   rp."refPkgName"
// FROM
//   public."refPaymentTransaction" rpt
//   JOIN public."refPackages" rp ON rp."refPkgId" = rpt."refPkgId"
//   JOIN public."Users" u ON rpt."refUserId" = u."refUserId"
//   JOIN public."refCommunication" rcn ON rcn."refUserId" = u."refUserId"
// WHERE
//   rpt."refUserId" = $1
// LIMIT
//   1;
// `;

export const getUserQuery = `
SELECT
  u.*,
  rc.*
FROM
  public."Users" u
  JOIN public."refCommunication" rc ON CAST(rc."refUserId" AS INTEGER) = u."refUserId"
WHERE
  u."refUserId" = $1;

`;

export const userUpdateQuery = `
UPDATE public."Users"
SET
  "refUserFname" = $1,
  "refUserLname" = $2,
  "refDOB" = $3,
  "refGender" = $4,
  "refMaritalStatus" = $5,
  "refEducation" = $6,
  "refOccupationLvl" = $7,
  "refSector" = $8,
  "activeStatus" = $9,
  "updatedBy" = $10
  
WHERE "refUserId" = $11
RETURNING *;
`;

export const communicationUpdateQuery = `UPDATE public."refCommunication"
SET
  "refUserEmail" = $1,
  "refAddress" = $2,
  "refDistrict" = $3,
  "refPincode" = $4
  
WHERE "refUserId" = $5
RETURNING *;
`;

export const changeUserpostActiveQuery = `
UPDATE
  public."Users" 
SET
  "activeStatus" = $1,
  "updatedAt" = $2,
  "updatedBy" = $3,
  "headStatus" = $4
WHERE
  "refUserId" = $5
`;

export const changeHeadUserQuery = `
UPDATE
  public."Users"
SET
  "headStatus" = $1,
  "updatedAt" = $2,
  "updatedBy" = $3
  WHERE 
  "refUserId" = $4
`;

export const getAllValidPackageQuery = `
SELECT
  *
FROM
  public."refPackages" rp
WHERE
  rp."refPkgStatus" IS TRUE
  AND CAST(rp."refPkgEndDate" AS DATE) >= CAST($1 AS DATE)
  AND rp."refLanCode" = $2
ORDER BY
  rp."refPkgValidMembers" ASC
`;

export const InsertTransactionHistoryQuery = `
INSERT INTO public."refPaymentTransaction" (
  "refSubscriptionId",
  "refUserId",
  "refPkgId",
  "refTransactionAmount",
  "refTransactionSGST",
  "refTransactionCGST",
  "refTransactionMethod",
  "refTransactionDate",
  "refTransactionKey",
  "refTransactionStatus",
  "createdAt",
  "createdBy"
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11,
  $12
);
`;

export const InsertSubscriptionQuery = `
INSERT INTO public."refSubscription" (
  "refPkgId",
  "refUserId",
  "refSubStartDate",
  "refSubEndDate",
  "createdAt",
  "createdBy"
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
) RETURNING *;
`;

export const SelectPackageQuery = `
SELECT
  *
FROM
  public."refPackages"
WHERE
  "refPkgId" = $1
  AND "refPkgStatus" IS TRUE
  AND CAST("refPkgEndDate" AS DATE) >= CAST($2 AS DATE)
`;

export const getPaymentTransactionHistoryQuery = `
SELECT
  *
FROM
  public."refPaymentTransaction" rpayt
  JOIN public."refPackages" rp ON rp."refPkgId" = rpayt."refPkgId"
  JOIN public."Users" u ON u."refUserId" = rpayt."refUserId"
  JOIN public."refCommunication" rc ON rc."refUserId" = rpayt."refUserId"
WHERE
  rpayt."refUserId" = $1;
`;

export const checkSubscriptionsQuery = `
SELECT
  u."refUserId" AS "refUserId",
  u1."refUserId" AS "refHeadUserId",
  CAST(rs1."refSubEndDate" AS DATE) >= CAST($1 AS DATE) AS "isSubscriptionValid",
  rs1.*,
  rp1.*,
  rpt1.*
FROM
  public."refRelation" rr
  JOIN public."Users" u ON u."refUserId" = CAST(rr."refUserId" AS INTEGER)
  JOIN public."refCommunication" rc ON rc."refUserId" = CAST(rr."refUserId" AS INTEGER)
  JOIN public."refCommunication" rc1 ON CAST(rc1."refUserMobileno" AS TEXT) = CAST(rr."refRHeadMobileNo" AS TEXT)
  JOIN public."Users" u1 ON u1."refUserId" = CAST(rc1."refUserId" AS INTEGER)
  AND u1."headStatus" = 'true'
  JOIN public."refRelation" rr1 ON rr1."refUserId" = CAST(u1."refUserId" AS INTEGER)
  JOIN public."refSubscription" rs1 ON rs1."refUserId" = CAST(rc1."refUserId" AS INTEGER)
  JOIN public."refPackages" rp1 ON rp1."refPkgId" = CAST(rs1."refPkgId" AS INTEGER)
  JOIN public."refPaymentTransaction" rpt1 ON rpt1."refSubscriptionId" = rs1."refSubscriptionId"
WHERE
  CAST(rs1."refSubEndDate" AS DATE) >= CAST($1 AS DATE)
  AND rr."refUserId" = $2
  AND rr."refRStatus" = true
  ORDER BY rpt1."refTransactionId" DESC
  LIMIT 1;
`;

export const checktheSubscriptionsQuery = `
SELECT
  u."refUserId" AS "refUserId",
  u1."refUserId" AS "refHeadUserId",
  CAST(rs1."refSubEndDate" AS DATE) >= CAST($1 AS DATE) AS "isSubscriptionValid",
  rs1.*,
  rp1.*,
  rpt1.*
FROM
  public."refRelation" rr
  JOIN public."Users" u ON u."refUserId" = CAST(rr."refUserId" AS INTEGER)
  JOIN public."refCommunication" rc ON rc."refUserId" = CAST(rr."refUserId" AS INTEGER)
  JOIN public."refCommunication" rc1 ON CAST(rc1."refUserMobileno" AS TEXT) = CAST(rr."refRHeadMobileNo" AS TEXT)
  JOIN public."Users" u1 ON u1."refUserId" = CAST(rc1."refUserId" AS INTEGER)
  AND u1."headStatus" = 'true'
  JOIN public."refRelation" rr1 ON rr1."refUserId" = CAST(u1."refUserId" AS INTEGER)
  JOIN public."refSubscription" rs1 ON rs1."refUserId" = CAST(rc1."refUserId" AS INTEGER)
  JOIN public."refPackages" rp1 ON rp1."refPkgId" = CAST(rs1."refPkgId" AS INTEGER)
  JOIN public."refPaymentTransaction" rpt1 ON rpt1."refSubscriptionId" = rs1."refSubscriptionId"
WHERE
  CAST(rs1."refSubEndDate" AS DATE) >= CAST($1 AS DATE)
  AND rr."refUserId" = $2
  AND rp1."refLanCode" = $3
  AND rr."refRStatus" = true
  ORDER BY rpt1."refTransactionId" DESC
  LIMIT 1;
`;

export const isFirstcheckSubscriptionsQuery = `
SELECT
  *
FROM
  public."refSubscription" rs
  FULL JOIN public."refPackages" rp ON rp."refPkgId" = CAST(rs."refPkgId" AS INTEGER)
WHERE
  rs."refUserId" = $1
ORDER BY
  rs."refSubscriptionId" ASC
`;

export const updatedSubscriptionQuery = `
UPDATE
  public."refSubscription"
SET
  "refSubEndDate" = $1,
  "updatedAt" = $2,
  "updatedBy" = $3
WHERE
  "refSubscriptionId" = $4;
`;

export const getGSTQuery = `
SELECT * FROM public."refGST"
`;

export const getFamilyMembersQuery = `
SELECT
  *
FROM
  public."refRelation" rr
  JOIN public."Users" u ON u."refUserId" = rr."refUserId"
  JOIN public."refCommunication" rc ON rc."refUserId" = rr."refUserId"
WHERE
  rr."refRHeadMobileNo" = $1
  AND rr."refRStatus" = true
  AND u."activeStatus" = 'active'
ORDER BY
  u."refUserId" ASC
`;

export const addRelationQuery = `
INSERT INTO
  public."refRelation" (
    "refUserId",
    "refRHeadMobileNo",
    "refRName",
    "refRStatus",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6);
  `;

export const checkParticularUserMobileQuery = `
SELECT
  *
FROM
  public."refCommunication" rc
  JOIN public."Users" u ON u."refUserId" = CAST(rc."refUserId" AS INTEGER)
WHERE
  rc."refUserMobileno" = $1
  AND u."refUserId" != $2
  AND u."activeStatus" = 'active'
  AND u."headStatus" = 'false'
  AND u."refRoleId" = '3'
ORDER BY
  u."refUserId" ASC
  `;

export const updateRelationQuery = `
  UPDATE
  public."refRelation"
SET
  "refRStatus" = $1,
  "refRName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refRId" = $5
  `;

export const checkUserRelationQuery = `
  SELECT
  *
FROM
  public."refRelation" rr
WHERE
  rr."refUserId" = $1
  AND rr."refRHeadMobileNo" = $2
  `;

export const getLanguageQuery = `
  SELECT * FROM public."refLanguage"
  `;

export const getVersionQuery = `
  SELECT
  *
FROM
  public."refVersion"
ORDER BY
  "refVersionId" DESC
LIMIT
  1
  `;

export const UserEmailForPayment = `
SELECT u."refUserFname", u."refUserLname", rcn."refUserEmail", rpt."refTransactionId", rpt."refInvoiceId", rpt."refTransactionAmount", rpt."refTransactionSGST", rpt."refTransactionCGST", rpt."refTransactionMethod", rpt."refTransactionDate", rpt."refTransactionKey", rsn."refSubStartDate", rsn."refSubEndDate", rp."refPkgName"  FROM public."refPaymentTransaction" rpt
JOIN public."refSubscription" rsn ON rpt."refUserId" = rsn."refUserId"
JOIN public."refPackages" rp ON rp."refPkgId" = rpt."refPkgId"
JOIN public."Users" u ON rpt."refUserId" = u."refUserId"
JOIN public."refCommunication" rcn ON rcn."refUserId" = u."refUserId"
WHERE rpt."refUserId"=$1 LIMIT 1;
`;

export const EmailIDForPayment = `
SELECT
  u."refUserFname",
  u."refUserLname",
  rcn."refUserEmail",
  rpt."refTransactionId",
  rpt."refInvoiceId",
  rpt."refTransactionAmount",
  rpt."refTransactionSGST",
  rpt."refTransactionCGST",
  rpt."refTransactionMethod",
  rpt."refTransactionDate",
  rpt."refTransactionKey",
  rp."refPkgName"
FROM
  public."refPaymentTransaction" rpt
  JOIN public."refPackages" rp ON rp."refPkgId" = rpt."refPkgId"
  JOIN public."Users" u ON rpt."refUserId" = u."refUserId"
  JOIN public."refCommunication" rcn ON rcn."refUserId" = u."refUserId"
WHERE
  rpt."refUserId" = $1
LIMIT
  1;
`;

export const getStressReportdataQuery = `
SELECT
  pt.*,
  usd.*,
  usv.*,
  CASE
    WHEN usv."refAction" = 'lessThanEqual'
    AND pt."refPTScore"::integer <= CAST(usv."refValue" AS INTEGER) THEN usv."refAnswerLabel"
    WHEN usv."refAction" = 'greaterThanEqual'
    AND pt."refPTScore"::integer >= CAST(usv."refValue" AS INTEGER) THEN usv."refAnswerLabel"
    WHEN usv."refAction" = 'rangeEqual'
    AND pt."refPTScore"::integer BETWEEN CAST(SPLIT_PART(usv."refValue", ',', 1) AS INTEGER) AND CAST(SPLIT_PART(usv."refValue", ',', 2) AS INTEGER)  THEN usv."refAnswerLabel"
    ELSE NULL
  END AS "calculatedAnswerLabel"
FROM
  public."refPatientTransaction" pt
  LEFT JOIN public."refUserScoreDetail" usd ON CAST(usd."refPTId" AS INTEGER) = pt."refPTId"::integer
  LEFT JOIN public."refUserScoreVerify" usv ON CAST(usv."refQCategoryId" AS INTEGER) = usd."refQCategoryId"::integer
WHERE
  pt."createdBy"::integer = $1
  AND usd."refQCategoryId"::integer = $2
  AND usv."refLanCode" = $3
  AND (
    (
      usv."refAction" = 'lessThanEqual'
      AND pt."refPTScore"::integer <= CAST(usv."refValue" AS INTEGER)
    )
    OR (
      usv."refAction" = 'greaterThanEqual'
      AND pt."refPTScore"::integer >= CAST(usv."refValue" AS INTEGER)
    )
    OR (
      usv."refAction" = 'rangeEqual'
      AND pt."refPTScore"::integer BETWEEN CAST(SPLIT_PART(usv."refValue", ',', 1) AS INTEGER) AND CAST(SPLIT_PART(usv."refValue", ',', 2) AS INTEGER)
    )
  );
`;

export const getDietaryReportdataQuery = `
SELECT
  pt.*,
  usd.*,
  usv.*,
  CASE
    WHEN usv."refAction" = 'equal'
    AND pt."refPTScore"::integer = CAST(usv."refValue" AS INTEGER) THEN usv."refAnswerLabel"
    ELSE NULL
  END AS "calculatedAnswerLabel"
FROM
  public."refPatientTransaction" pt
  LEFT JOIN public."refUserScoreDetail" usd ON CAST(usd."refPTId" AS INTEGER) = pt."refPTId"::integer
  LEFT JOIN public."refUserScoreVerify" usv ON CAST(usv."refQCategoryId" AS INTEGER) = usd."refQCategoryId"::integer
WHERE
  pt."createdBy"::integer = $1
  AND usd."refQCategoryId"::integer = $2
  AND usv."refLanCode" = $3
  AND usv."refAction" = 'equal'
  AND pt."refPTScore"::integer = CAST(usv."refValue" AS INTEGER);
`;

export const getSleepReportdataQuery = `
SELECT
  pt.*,
  usd.*,
  usv.*,
  CASE
    WHEN usv."refAction" = 'equal'
    AND pt."refPTScore"::integer = CAST(usv."refValue" AS INTEGER) THEN usv."refAnswerLabel"
    WHEN usv."refAction" = 'rangeEqual'
    AND pt."refPTScore"::integer BETWEEN CAST(SPLIT_PART(usv."refValue", ',', 1) AS INTEGER) AND CAST(SPLIT_PART(usv."refValue", ',', 2) AS INTEGER)  THEN usv."refAnswerLabel"
    ELSE NULL
  END AS "calculatedAnswerLabel"
FROM
  public."refPatientTransaction" pt
  LEFT JOIN public."refUserScoreDetail" usd ON CAST(usd."refPTId" AS INTEGER) = pt."refPTId"::integer
  LEFT JOIN public."refUserScoreVerify" usv ON CAST(usv."refQCategoryId" AS INTEGER) = usd."refQCategoryId"::integer
WHERE
  pt."createdBy"::integer = $1
  AND usd."refQCategoryId"::integer = $2
  AND usv."refLanCode" = $3
  AND (
    (
      usv."refAction" = 'equal'
      AND pt."refPTScore"::integer = CAST(usv."refValue" AS INTEGER)
    )
    OR (
      usv."refAction" = 'rangeEqual'
      AND pt."refPTScore"::integer BETWEEN CAST(SPLIT_PART(usv."refValue", ',', 1) AS INTEGER) AND CAST(SPLIT_PART(usv."refValue", ',', 2) AS INTEGER)
    )
  );
`;

export const getBMIReportdataQuery = `
SELECT
  pt.*,
  usd.*,
  usv.*,
  CASE
    WHEN usv."refAction" = 'lessThan'
    AND pt."refPTScore"::numeric < CAST(usv."refValue" AS numeric) THEN usv."refAnswerLabel"
    WHEN usv."refAction" = 'greaterThan'
    AND pt."refPTScore"::numeric > CAST(usv."refValue" AS numeric) THEN usv."refAnswerLabel"
    WHEN usv."refAction" = 'rangeEqual'
    AND pt."refPTScore"::numeric BETWEEN CAST(SPLIT_PART(usv."refValue", ',', 1) AS numeric) AND CAST(SPLIT_PART(usv."refValue", ',', 2) AS numeric)  THEN usv."refAnswerLabel"
    ELSE NULL
  END AS "calculatedAnswerLabel"
FROM
  public."refPatientTransaction" pt
  LEFT JOIN public."refUserScoreDetail" usd ON CAST(usd."refPTId" AS INTEGER) = pt."refPTId"::integer
  LEFT JOIN public."refUserScoreVerify" usv ON CAST(usv."refQCategoryId" AS INTEGER) = usd."refQCategoryId"::integer
WHERE
  pt."createdBy"::integer = $1
  AND usd."refQCategoryId"::integer = $2
  AND usv."refLanCode" = $3
  AND (
    (
      usv."refAction" = 'lessThan'
      AND pt."refPTScore"::numeric < CAST(usv."refValue" AS numeric)
    )
    OR (
      usv."refAction" = 'greaterThan'
      AND pt."refPTScore"::numeric > CAST(usv."refValue" AS numeric)
    )
    OR (
      usv."refAction" = 'rangeEqual'
      AND pt."refPTScore"::numeric BETWEEN CAST(SPLIT_PART(usv."refValue", ',', 1) AS numeric) AND CAST(SPLIT_PART(usv."refValue", ',', 2) AS numeric)
    )
  );
`;

export const getPhysicalActivityReportdataQuery = `
SELECT
  pt.*,
  usd.*,
  usv.*,
  CASE
    WHEN usv."refAction" = 'equal'
      AND pt."refPTScore" = usv."refValue"
    THEN usv."refAnswerLabel"

    WHEN usv."refAction" = 'greaterThanEqual'
      AND pt."refPTScore" ~ '^[0-9]+(\.[0-9]+)?$'
      AND usv."refValue" ~ '^[0-9]+(\.[0-9]+)?$'
      AND pt."refPTScore"::numeric >= usv."refValue"::numeric
    THEN usv."refAnswerLabel"

    WHEN usv."refAction" = 'lessThan'
      AND pt."refPTScore" ~ '^[0-9]+(\.[0-9]+)?$'
      AND usv."refValue" ~ '^[0-9]+(\.[0-9]+)?$'
      AND pt."refPTScore"::numeric < usv."refValue"::numeric
    THEN usv."refAnswerLabel"

    ELSE NULL
  END AS "calculatedAnswerLabel"
FROM
  public."refPatientTransaction" pt
  LEFT JOIN public."refUserScoreDetail" usd 
    ON CAST(usd."refPTId" AS INTEGER) = pt."refPTId"::integer
  LEFT JOIN public."refUserScoreVerify" usv 
    ON CAST(usv."refQCategoryId" AS INTEGER) = usd."refQCategoryId"::integer
WHERE
  pt."createdBy"::integer = $1
  AND usd."refQCategoryId"::integer = $2
  AND usv."refLanCode" = $3
  AND (
    (
      usv."refAction" = 'equal'
      AND pt."refPTScore" = usv."refValue"
    )
    OR (
      usv."refAction" = 'greaterThanEqual'
      AND pt."refPTScore" ~ '^[0-9]+(\.[0-9]+)?$'
      AND usv."refValue" ~ '^[0-9]+(\.[0-9]+)?$'
      AND pt."refPTScore"::numeric >= usv."refValue"::numeric
    )
    OR (
      usv."refAction" = 'lessThan'
      AND pt."refPTScore" ~ '^[0-9]+(\.[0-9]+)?$'
      AND usv."refValue" ~ '^[0-9]+(\.[0-9]+)?$'
      AND pt."refPTScore"::numeric < usv."refValue"::numeric
    )
  );
`;
