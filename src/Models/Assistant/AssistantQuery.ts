export const getPatientDataQuery = `
SELECT
  *
FROM
  public."refCommunication" rc
  JOIN public."Users" u ON u."refUserId" = rc."refUserId"
WHERE
  rc."refUserMobileno" = $1
  AND u."refRoleId" = 3
  AND u."activeStatus" = 'active'
  ORDER BY u."refUserId" ASC
`;

export const nextUserId = `
SELECT 
  COUNT(*) + 1 AS NextrefUserCustId
FROM 
  public."Users" us
WHERE 
  us."refRoleId" = 3;`;

export const overAllId = `
SELECT
  MAX(u."refUserId") + 1 as "overAllId"
FROM
  public."Users" u
  `;

export const postNewUser = `
  INSERT INTO
  public."Users" (
    "refUserId",
    "refUserCustId",
    "refRoleId",
    "refUserFname",
    "refUserLname",
    "refDOB",
    "refGender",
    "refMaritalStatus",
    "refEducation",
    "refOccupationLvl",
    "refSector",
    "activeStatus",
    "createdAt",
    "createdBy",
    "headStatus"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
`;

export const getUserId = `
SELECT * FROM public."Users" u WHERE u."refUserCustId" = $1`;

export const postnewCommunication = `
INSERT INTO public."refCommunication" (
  "refUserId",
  "refUserMobileno",
  "refUserEmail",
  "refAddress",
  "refDistrict",
  "refPincode",
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
  $8
);
`;

export const postnewUserDomain = `
INSERT INTO public."refUserDomain" (
  "refUserId",
  "refUserPassword",
  "refUserHashedpass",
  "createdAt",
  "createdBy"
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
);
`;

export const getMainCategoryQuery = `
SELECT
 rct."refQCategoryId",
 rct."refCategoryLabel"
FROM
  public."refCategory" rct
WHERE
  rct."refQSubCategory" = '0'
  AND rct."refLanCode" = $1
  `;

export const getSubMainCategoryQuery = `
SELECT
  rct."refQCategoryId",
  rct."refCategoryLabel"
FROM
  public."refCategory" rct
WHERE
  rct."refQSubCategory" = $1
  AND rct."refLanCode" = $2
  `;

export const getFirstQuestionQuery = `
SELECT
  *
FROM
  public."refQuestions" ro
WHERE
  ro."refQCategoryId" = $1
  AND ro."refLanCode" = $2
ORDER BY
  ro."refQId"
`;

export const getOptions = `
SELECT
  ro."refOptionId",
  ro."refOptionLabel",
  ro."forwardQId",
  ro."backwardQId",
  ro."refOptionMark"
FROM
  public."refOptions" ro
WHERE
  ro."refOptionId" = ANY ($1)
  AND ro."refLanCode" = $2;
`;

export const getAnswers = `
SELECT * FROM public."refUserAnswers" rua WHERE rua."refUserId" = $1 AND rua."refQId" = $2
`;

export const addOptions = `
INSERT INTO
  public."refUserAnswers" (
    "refUserId",
    "refQCategoryId",
    "refQId",
    "refAnswer",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6)
;`;

export const updateOptions = `
UPDATE
  public."refUserAnswers"
SET
  "refAnswer" = $1,
  "updatedAt" = $2,
  "updatedBy" = $3
WHERE
  "refUserId" = $4
  AND "refQId" = $5
`;

export const getLatestPTIdQuery = `
SELECT
  rpt."refPTId"
FROM
  public."refPatientTransaction" rpt
ORDER BY
  rpt."refPTId" DESC;
`;

export const addPatientTransactionQuery = `
insert into
  public."refPatientTransaction" (
    "refPTId",
    "refPMId",
    "refPTScore",
    "refPTStatus",
    "refPTcreatedDate",
    "createdAt",
    "createdBy"
  )
values
  ($1, $2, $3, $4, $5, $6, $7)
`;

export const addPatientIdTransactionQuery = `
insert into
  public."refPatientTransaction" (
    "refPTId",
    "refUserId",
    "refPTScore",
    "refPTStatus",
    "refPTcreatedDate",
    "createdAt",
    "createdBy"
  )
values
  ($1, $2, $3, $4, $5, $6, $7)
`;

export const addUserScoreDetailsQuery = `
insert into
  public."refUserScoreDetail" (
    "refPTId",
    "refQCategoryId",
    "createdAt",
    "createdBy"
  )
values
  ($1, $2, $3, $4)
`;

export const getUserScore = `
SELECT
  *
FROM
  public."refUserScoreDetail" rusd
  FULL JOIN public."refPatientTransaction" rpt ON rpt."refPTId" = CAST(rusd."refPTId" AS INTEGER)
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
  FULL JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(rpm."refDoctorId" AS INTEGER)
WHERE
  (
    rpm."refPatientId" = $1
    OR rpt."refUserId" = $1
  )
  AND rusd."refQCategoryId" = $2
ORDER BY
  rusd."refUSDId" DESC
`;
// AND rdm."refHospitalId" = $3
//   AND rdm."refDoctorId" = $4
// AND DATE (rpt."refPTcreatedDate") = $5

export const getPasswordQuery = `
SELECT
  *
FROM
  public."refUserDomain"
WHERE
  "refUserId" = $1
`;

export const getAssistantDoctorQuery = `
SELECT
  ram."refAMId",
  rdm."refDoctorId",
  ram."refAssId",
  u."refUserFname" AS "DoctorFirstName",
  u."refUserLname" AS "DoctorLastName"
FROM
  public."refAssMap" ram
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(ram."refDoctorId" AS INTEGER)
  JOIN public."Users" u ON u."refUserId" = CAST(rdm."refDoctorId" AS INTEGER)
WHERE
  ram."refAssId" = $1
  AND rdm."refHospitalId" = $2
  AND u."activeStatus" = 'active'
`;

export const getResetScoreRefQuery = `
SELECT
  *
FROM
  public."refUserScoreDetail" rusd
  JOIN public."refPatientTransaction" rpt ON rpt."refPTId" = CAST(rusd."refPTId" AS INTEGER)
  JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(rpm."refDoctorId" AS INTEGER)
WHERE
  rpm."refPatientId" = $1
  AND rdm."refDoctorId" = $2
  AND rdm."refHospitalId" = $3
  AND rusd."refQCategoryId" = $4
  AND DATE (rpt."refPTcreatedDate") = DATE ($5)
`;

export const resetScoreQuery = `
DELETE FROM
  public."refUserScoreDetail" rusd
WHERE
  rusd."refUSDId" = $1;
`;

export const resetPatientTransactionQuery = `
DELETE FROM
  public."refPatientTransaction" rpt
WHERE
  rpt."refPTId" = $1;
`;

export const postPastReport = `
SELECT DISTINCT
  TO_CHAR(
    CAST(rpt."refPTcreatedDate" AS TIMESTAMP),
    'YYYY-MM'
  ) AS refPTcreatedDate
FROM
  public."refPatientTransaction" rpt
  LEFT JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
WHERE
  rpm."refPatientId" = $1
  OR rpt."refUserId" = $1
ORDER BY
  refPTcreatedDate DESC;
`;

export const postReportParticularDate = `
SELECT DISTINCT
  TO_CHAR(
    CAST(rpt."refPTcreatedDate" AS TIMESTAMP),
    'YYYY-MM-DD'
  ) AS refPTcreatedDate
FROM
  "refPatientTransaction" rpt
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
WHERE
  EXTRACT(
    YEAR
    FROM
      rpt."refPTcreatedDate"::TIMESTAMP
  ) = $1
  AND EXTRACT(
    MONTH
    FROM
      rpt."refPTcreatedDate"::TIMESTAMP
  ) = $2
  AND (rpm."refPatientId" = $3 OR rpt."refUserId" = $3)
`;

export const postCurrentReport = `
SELECT
  rusd."refUSDId",
  rusd."refPTId",
  rusd."refQCategoryId"
FROM
  public."refUserScoreDetail" rusd
  JOIN public."refPatientTransaction" rpt ON rpt."refPTId" = CAST(rusd."refPTId" AS INTEGER)
  JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(rpm."refDoctorId" AS INTEGER)
WHERE
  rdm."refHospitalId" = $1
  AND rdm."refDoctorId" = $2
  AND rpm."refPatientId" = $3
  AND DATE(rusd."createdAt") = DATE ($4);
`;

export const getCatgeoryQuery = `
SELECT
  *
FROM
  public."refCategory" rc
WHERE
  rc."refQCategoryId" = $1
`;

export const reportDetailsQuery = `
 SELECT
  rus."refScoreId",
  rus."refUserId",
  rus."refQCategoryId",
  rus."refTotalScore",
  TO_CHAR(CAST(rus."createdAt" AS TIMESTAMP), 'DD-MM-YYYY') AS "createdAt",
  rpm."refDoctorId",
  (
    SELECT
      u."refUserFname" || ' ' || u."refUserLname"
    FROM
      public."Users" u
    WHERE
      u."refUserId" = CAST(rpm."refDoctorId" AS INTEGER)
  ) AS doctorName,
  rdm."refHospitalId",
  (
    SELECT
      rh."refHospitalName"
    FROM
      public."refHospital" rh
    WHERE
      rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
  ) AS hospitalName,
  (
    SELECT
      rh."refHospitalAddress"
    FROM
      public."refHospital" rh
    WHERE
      rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
  ) AS hospitalAddress,
  (
    SELECT
      rh."refHospitalPincode"
    FROM
      public."refHospital" rh
    WHERE
      rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
  ) AS hospitalPincode
FROM
  public."refUserScoreDetail" rus
  JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rus."refPMId" AS INTEGER)
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(rpm."refDoctorId" AS INTEGER)
WHERE
  rus."refScoreId" = $1
`;

export const questionDetailsQuery = `
SELECT
  rc."refQCategoryId",
  rc."refCategoryLabel",
  rc."refQSubCategory",
  rus."refTotalScore"
FROM
  public."refCategory" rc
LEFT JOIN
  public."refUserScoreDetail" rus
ON
  CAST(rus."refQCategoryId" AS INTEGER) = rc."refQCategoryId"
  AND DATE(rus."createdAt") = $1
  AND rus."refUserId" = $2;
`;

export const getUserScoreVerifyQuery = `
SELECT
  *
FROM
  public."refUserScoreVerify" rusv
WHERE
  rusv."refQCategoryId" = $1
  AND rusv."refLanCode" = $2
`;

export const getProfileQuery = `
SELECT
  u."refUserCustId",
  (CASE 
     WHEN u."refRoleId" = 1 THEN 'Dr. ' 
     ELSE '' 
   END) || u."refUserFname" || ' ' || u."refUserLname" AS "refUserName",
  u."refRoleId",
  rh."refHospitalName"
FROM
  public."Users" u
  JOIN public."refDoctorMap" rdm ON rdm."refDoctorId" = CAST(u."refUserId" AS TEXT)
  JOIN public."refHospital" rh ON rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
WHERE
  u."refUserId" = $1
  AND rh."refHospitalId" = $2;
  `;

export const getProfileQueryAssistant = `
SELECT
  u."refUserCustId",
  u."refUserFname" || ' ' || u."refUserLname" AS "refUserName",
  u."refRoleId",
  rh."refHospitalName"
FROM
  public."Users" u
  JOIN public."refAssMap" ram ON ram."refAssId" = u."refUserId"::TEXT
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = ram."refDoctorId"::INTEGER
  JOIN public."refHospital" rh ON rh."refHospitalId" = rdm."refHospitalId"::INTEGER
WHERE
  u."refUserId" = $1
  AND rh."refHospitalId" = $2
LIMIT
  1
  `;

export const getProfileQueryUsers = `
SELECT
  u."refUserFname" || ' ' || u."refUserLname" AS "refUserName",
  u."refUserCustId",
  rc."refDistrict" AS "refHospitalName",
  rc."refUserMobileno",
  u."refUserId"
FROM
  public."Users" u
  JOIN public."refCommunication" rc ON rc."refUserId" = u."refUserId"
WHERE
  u."refUserId" = $1
  `;

// export const getReportSessionQuery = `
// SELECT
//   *
// FROM
//   public."refUserScoreDetail" rusd
//   JOIN public."refPatientTransaction" rpt ON rpt."refPTId" = CAST(rusd."refPTId" AS INTEGER)
//   JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
// WHERE
//   rpm."refPatientId" = $1
//   AND rusd."refQCategoryId" = '0'
//   ORDER BY rusd."refUSDId" DESC
//   `;

export const getQuestionScoreQuery = `
  SELECT
  *
FROM
  public."refUserScoreDetail" rusd
  JOIN public."refPatientTransaction" rpt ON rpt."refPTId" = CAST(rusd."refPTId" AS INTEGER)
  JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
WHERE
  rpm."refPatientId" = $1
  AND rusd."refQCategoryId" = $2
  AND DATE(rpt."refPTcreatedDate") = DATE ($3);
  `;

export const insertTreatmentDetails = `
insert into
  "public"."refTreatmentDetails" (
    "refPMId",
    "refTDMedName",
    "refTDCat",
    "refTDStrength",
    "refTDROA",
    "refTDRTF",
    "refTDMorningDosage",
    "refTDMorningDosageTime",
    "refTDAfternoonDosage",
    "refTDAfternoonDosageTime",
    "refTDEveningDosage",
    "refTDEveningDosageTime",
    "refTDNightDosage",
    "refTDNightDosageTime",
    "refTDDurationMonth",
    "refTDDurationYear",
    "refTDCreatedDate",
    "createdAt",
    "createdBy"
  )
values
  (
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
    $12,
    $13,
    $14,
    $15,
    $16,
    $17,
    $18,
    $19
  )
  `;

export const insertTreatmentDetailsPatientId = `
insert into
  "public"."refTreatmentDetails" (
    "refUserId",
    "refTDMedName",
    "refTDCat",
    "refTDStrength",
    "refTDROA",
    "refTDRTF",
    "refTDMorningDosage",
    "refTDMorningDosageTime",
    "refTDAfternoonDosage",
    "refTDAfternoonDosageTime",
    "refTDEveningDosage",
    "refTDEveningDosageTime",
    "refTDNightDosage",
    "refTDNightDosageTime",
    "refTDDurationMonth",
    "refTDDurationYear",
    "refTDCreatedDate",
    "createdAt",
    "createdBy"
  )
values
  (
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
    $12,
    $13,
    $14,
    $15,
    $16,
    $17,
    $18,
    $19
  )
  `;

export const updateTreatmentDetails = `
  UPDATE "public"."refTreatmentDetails"
SET
  "refTDMedName" = $1,
  "refTDCat" = $2,
  "refTDStrength" = $3,
  "refTDROA" = $4,
  "refTDRTF" = $5,
  "refTDMorningDosage" = $6,
  "refTDMorningDosageTime" = $7,
  "refTDAfternoonDosage" = $8,
  "refTDAfternoonDosageTime" = $9,
  "refTDEveningDosage" = $10,
  "refTDEveningDosageTime" = $11,
  "refTDNightDosage" = $12,
  "refTDNightDosageTime" = $13,
  "refTDDurationMonth" = $14,
  "refTDDurationYear" = $15,
  "updatedAt" = $16,
  "updatedBy" = $17 	
WHERE
  "refTDId" = $18;  
  `;

export const deleteTreatmentDetails = `
  DELETE FROM public."refTreatmentDetails" rtd
  USING public."refPatientMap" rpm, public."refDoctorMap" rdm
  WHERE rpm."refPMId" = CAST(rtd."refPMId" AS INTEGER)
    AND rdm."refDMId" = CAST(rpm."refDoctorId" AS INTEGER)
    AND rpm."refPatientId" = $1
    AND rdm."refDoctorId" = $2
    AND DATE(rtd."refTDCreatedDate") = DATE ($3);
  `;

export const getTreatmentDetails = `
  SELECT
  *
FROM
  public."refTreatmentDetails" rtd
  JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rtd."refPMId" AS INTEGER)
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(rpm."refDoctorId" AS INTEGER)
WHERE
  rpm."refPatientId" = $1
  `;

export const getReportTreatmentDetails = `
SELECT
  *
FROM
  public."refTreatmentDetails" rtd
  LEFT JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(NULLIF(rtd."refPMId", '') AS INTEGER)
  LEFT JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(NULLIF(rpm."refDoctorId", '') AS INTEGER)
WHERE
  (rpm."refPatientId" = $1 OR rtd."refUserId" = $1)
  AND (rtd."refPMId" IS NOT NULL AND rtd."refPMId" <> '' OR rtd."refUserId" = $1)
  `;

export const insertInvestigationDetails = `
  insert into
  "public"."refInvestigationDetails" (
    "createdAt",
    "createdBy",
    "refIVDAccessData",
    "refIVDCreatedDate",
    "refIVDDate",
    "refIVDScore",
    "ref1hrs",
    "ref2hrs",
    "refUserId",
    "refQCategoryId"
  )
values
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10
  )
    `;

export const getInvestigationDetailsQuery = `
SELECT
    rivd."refIVDId" as id,
  rivd."refIVDDate" as date,
  rivd."refIVDScore" as number,
  rivd."refIVDAccessData" as flag,
  rivd."ref1hrs" as "oneHour",
  rivd.ref2hrs as "twoHours"
FROM
  public."refInvestigationDetails" rivd
WHERE
  rivd."refUserId" = $1
  AND rivd."refQCategoryId" = $2
  `;

export const deleteTreatmentDetailQuery = `
  DELETE FROM
  public."refInvestigationDetails"
WHERE
  "refIVDId" = $1
  `;

export const resetScoreInvestigationDetails = `
  DELETE FROM
  public."refInvestigationDetails"
WHERE
  "refIVDId" = (
    SELECT
      "refIVDId"
    FROM
      public."refInvestigationDetails"
    WHERE
      "refIVDAccessData" = 'perm'
      AND "refQCategoryId" = $1
    ORDER BY
      "refIVDId" DESC
    LIMIT
      1
  );`;

export const getCurrentInvestigation = `
 SELECT
  *
FROM (
  SELECT
    rivd."refIVDDate",
    rivd."refIVDScore"
  FROM
    public."refInvestigationDetails" rivd
  WHERE
    rivd."refUserId" = $1 
    AND rivd."refQCategoryId" = $2
    AND rivd."refIVDDate"::date <= DATE($3)
  ORDER BY
    rivd."refIVDDate" DESC
  LIMIT
    5
) AS subquery
ORDER BY
  subquery."refIVDDate" ASC;
  `;

export const getPastInvestigation = `
SELECT
  *
FROM
  (
    SELECT
      rivd."refIVDDate",
      rivd."refIVDScore",
      rivd.ref1hrs,
      rivd.ref2hrs
    FROM
      public."refInvestigationDetails" rivd
    WHERE
      rivd."refUserId" = $1
      AND rivd."refQCategoryId" = $2
      AND rivd."refIVDDate"::date <= DATE ($3)
    ORDER BY
      rivd."refIVDDate" DESC
    LIMIT
      5
  ) AS subquery
ORDER BY
  subquery."refIVDDate" ASC;
  `;

export const checkMobileNumberQuery = `
  SELECT
  *
FROM
  public."refCommunication"
WHERE
  "refUserMobileno" = $1
  `;

export const checkAgeQuery = `
  SELECT * FROM public."Users" WHERE "refUserId" = $1
  `;

export const diagosisCategory = `
  SELECT
  *
FROM
  public."refPatientTransaction" rpt
  FULL JOIN public."refUserScoreDetail" rusd ON rusd."refPTId" = CAST(rpt."refPTId" AS TEXT)
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
WHERE
  DATE(rpt."refPTcreatedDate") = DATE($1)
  AND rpm."refPatientId" = $2
  AND rusd."refQCategoryId" = $3
  `;

export const checkUserAnswered = `
  SELECT
  *
FROM
  public."refPatientTransaction" rpt
  JOIN public."refUserScoreDetail" rusd ON rusd."refPTId" = CAST(rpt."refPTId" AS TEXT)
WHERE
  rpt."refUserId" = $1
  AND rusd."refQCategoryId" IN (
    '5',
    '6',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '43',
    '51',
    '94',
    '202',
    '203',
    '204',
    '205',
    '206',
    '207',
    '213',
    '214',
    '215',
    '216',
    '218',
    '219',
    '220',
    '221',
    '222',
    '223',
    '224'
  )
  `;


export const getAssessmentNoQuery = `
  SELECT
  COUNT(*) AS AssessmentTakenNo
FROM
  public."refPatientTransaction" rpt
  JOIN public."refUserScoreDetail" rusd ON rusd."refPTId" = CAST(rpt."refPTId" AS TEXT)
WHERE
  rpt."refUserId" = $1
  AND rusd."refQCategoryId" = ANY ($2::TEXT[])
  `;

// export const getAssessmentNoQuery = `
//   SELECT
//   COUNT(*) AS AssessmentTakenNo
// FROM
//   public."refPatientTransaction" rpt
//   JOIN public."refUserScoreDetail" rusd ON rusd."refPTId" = CAST(rpt."refPTId" AS TEXT)
// WHERE
//   rpt."refUserId" = $1
//   AND rusd."refQCategoryId" IN (
//     '5',
//     '6',
//     '8',
//     '9',
//     '10',
//     '11',
//     '12',
//     '13',
//     '43',
//     '51',
//     '94',
//     '202',
//     '203',
//     '204',
//     '205',
//     '206',
//     '207',
//     '213',
//     '214',
//     '215',
//     '216',
//     '218',
//     '219',
//     '220',
//     '221',
//     '222',
//     '223',
//     '224'
//   )
//   `;