export const checkPatientMapQuery = `
SELECT
*
FROM
public."refPatientMap" rpm
JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(rpm."refDoctorId" AS INTEGER)
WHERE
rdm."refDoctorId" = $1
AND rpm."refPatientId" = $2
AND rdm."refHospitalId" = $3
  `;

export const checkDoctor = `
  SELECT
  *
FROM
  public."refDoctorMap" rdm
WHERE
  rdm."refDoctorId" = $1;
  `;

export const addPatientMapQuery = `
  INSERT INTO
  public."refPatientMap" (
    "refDoctorId",
    "refPatientId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4);  
  `;

export const getDoctorMap = `
SELECT
  *
FROM
  public."refDoctorMap" rdm
  JOIN public."refHospital" rh ON rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
  JOIN public."Users" u ON u."refUserId" = CAST(rdm."refDoctorId" AS INTEGER)
WHERE
  rdm."refHospitalId" = $1
  AND rdm."refDoctorId" = $2
  `;

export const getDoctorData = `
SELECT
  u."refUserFname" || ' ' || u."refUserLname" AS doctorName,
  u."refUserCustId" AS doctorId,
  rh."refHospitalName" AS hospital,
  rh."refHospitalAddress" AS hospitalAddress,
  rh."refHospitalPincode" AS hospitalPincode
FROM
  public."refPatientMap" rpm
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(rpm."refDoctorId" AS INTEGER)
  JOIN public."refHospital" rh ON rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
  JOIN public."Users" u ON u."refUserId" = CAST(rdm."refDoctorId" AS INTEGER)
WHERE
u."refUserId" = $1
  `;

export const getPatientDetail = `
SELECT
  *
FROM
  public."Users" u
  JOIN public."refCommunication" rc ON rc."refUserId" = CAST(u."refUserId" AS INTEGER)
WHERE
  u."refUserId" = $1;
  `;

export const getAllCategoryQuery = `
SELECT
  *
FROM
  public."refCategory" rc
  `;

export const getAllScoreQuery = `
SELECT DISTINCT
  ON (rusd."refQCategoryId") rusd.*,
  rpt.*,
  rpm.*,
  u."refRoleId" AS doctorRoleId,
  u."refUserFname" || ' ' || u."refUserLname" AS doctorName,
  u."refUserId" AS doctorId,
  rc."refCategoryLabel"
FROM
  public."refUserScoreDetail" rusd
  FULL JOIN public."refPatientTransaction" rpt ON rpt."refPTId" = CAST(rusd."refPTId" AS INTEGER)
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
  FULL JOIN public."Users" u ON u."refUserId" = CAST(rusd."createdBy" AS INTEGER)
  FULL JOIN public."refCategory" rc ON rc."refQCategoryId" = rusd."refQCategoryId"::INTEGER
WHERE
  (
    rpm."refPatientId" = $1
    OR rpt."refUserId" = $1
  )
  AND rpt."refPTcreatedDate"::DATE <= $2::DATE
ORDER BY
  rusd."refQCategoryId",
  rusd."refUSDId" DESC;
  `;

export const getParticualarScoreQuery = `
SELECT DISTINCT
  ON (rusd."refQCategoryId") rusd.*,
  rpt.*,
  rpm.*,
  rusd."refQCategoryId",
  u."refRoleId"
FROM
  public."refUserScoreDetail" rusd
  FULL JOIN public."refPatientTransaction" rpt ON rpt."refPTId" = CAST(rusd."refPTId" AS INTEGER)
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
  FULL JOIN public."Users" u ON u."refUserId" = rusd."createdBy"::INTEGER
WHERE
  (
    rpm."refPatientId" = $1
    OR rpt."refUserId" = $1
  )
  AND DATE (rpt."refPTcreatedDate") <= DATE ($2)
ORDER BY
  rusd."refQCategoryId",
  rusd."refUSDId" DESC;
  `;

export const getAllScoreVerifyQuery = `
  SELECT
  *
FROM
  public."refUserScoreVerify";
  `;

export const getStressAnswerQuery = `
  SELECT
  *
FROM
  public."refOptions" ro
WHERE
  ro."refQCategoryId" = '9'
  AND (
    ro."forwardQId" = '0'
    OR ro."forwardQId" = '28'
    OR ro."forwardQId" = '29'
    OR ro."forwardQId" = '30'
  )
  `;

export const getDoctorPatientMapQuery = `
  SELECT
  *
FROM
  public."refPatientMap" rpm
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(rpm."refDoctorId" AS INTEGER)
WHERE
  rpm."refPatientId" = $1
  AND rdm."refDoctorId" = $2
  AND rdm."refHospitalId" = $3
  `;

export const getPatientDetailsReport = `
  SELECT
  u.*,
  rpt."refPTcreatedDate"
FROM
  public."refPatientTransaction" rpt
  JOIN public."refUserScoreDetail" rusd ON rusd."refPTId" = CAST(rpt."refPTId" AS TEXT)
  JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
  JOIN public."Users" u ON u."refUserId" = CAST(rpm."refPatientId" AS INTEGER)
WHERE
  DATE (rpt."refPTcreatedDate") = $1
  AND u."refUserId" = $2
  AND rusd."refQCategoryId" = '0'
  `;

export const getDoctorDetailsReport = `
SELECT
  *
FROM
  public."Users" u
  FULL JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(u."refUserId" AS INTEGER)
  FULL JOIN public."refHospital" rh ON rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
  FULL JOIN public."refCommunication" rc ON rc."refUserId" = CAST(u."refUserId" AS INTEGER)
  FULL JOIN public."refStaffDomain" rsd ON rsd."refUserId" = CAST(u."refUserId" AS INTEGER)
WHERE
  u."refRoleId" IN ('1', '4')
  AND u."refUserId" = $1
  `;

export const getScoreReport = `
  SELECT
  *
FROM
  public."refPatientTransaction" rpt
  JOIN public."refUserScoreDetail" rusd ON rusd."refPTId" = CAST(rpt."refPTId" AS TEXT)
  JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
WHERE
  DATE (rpt."refPTcreatedDate") = $1
  AND rpm."refPatientId" = $2
  `;

export const getScoreVerifyReport = `
  SELECT
  *
FROM
  public."refUserScoreVerify"
  `;

export const getAllCategoryFamilyHistory = `
  SELECT * FROM public."refCategory" rc WHERE rc."refQSubCategory" = '51'
  `;

export const getDiagnosisQuery = `
  SELECT
  *
FROM
  public."refPatientTransaction" rpt
  FULL JOIN public."refUserScoreDetail" rusd ON rusd."refPTId" = CAST(rpt."refPTId" AS TEXT)
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = CAST(rpt."refPMId" AS INTEGER)
WHERE
  DATE(rpt."refPTcreatedDate") = $1
  AND rpm."refPatientId" = $2
  `;

export const getDiagnosisTreatmentQuery = `
  SELECT
  EXISTS (
    SELECT
      1
    FROM
      public."refTreatmentDetails" rtd
    JOIN public."refPatientMap" rpm 
      ON rpm."refPMId" = CAST(rtd."refPMId" AS INTEGER)
    WHERE
      DATE(rtd."refTDCreatedDate") = DATE($1)
      AND rpm."refPatientId" = $2
      AND rtd."refTDCat" = $3
  ) AS treatementDetails;
  `;

export const patientDetails = `
  SELECT
  *
FROM
  public."Users" u
  JOIN public."refPatientMap" rpm ON rpm."refPatientId" = CAST(u."refUserId" AS TEXT)
  WHERE rpm."refPMId" = $1
  `;

export const getTreatementDetails = `
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

export const checkCreateReport = `
  SELECT
  *
FROM
  public."refUserScoreDetail" rusd
  FULL JOIN public."refPatientTransaction" rpt ON rpt."refPTId" = rusd."refPTId"::INTEGER
  WHERE DATE(rpt."refPTcreatedDate") = DATE($1)
  AND (rpt."refPMId" = $2 OR rpt."refUserId" = $3)
  AND rusd."refQCategoryId" = '237'
  `;

export const getHomePatient = `
SELECT DISTINCT
  ON (rpt."refPMId", DATE (rpt."createdAt")) *
FROM
  public."refPatientTransaction" rpt
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = rpt."refPMId"::INTEGER
  FULL JOIN public."refDoctorMap" rdm ON rdm."refDMId" = rpm."refDoctorId"::INTEGER
WHERE
  rdm."refDoctorId" = $1
  AND DATE (rpt."refPTcreatedDate") >= ($2)
  AND DATE (rpt."refPTcreatedDate") <= DATE ($3)
  `;

export const getHomeCategory = `
  SELECT DISTINCT
  ON (rpt."refPMId", DATE (rpt."createdAt")) *
FROM
  public."refPatientTransaction" rpt
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = rpt."refPMId"::INTEGER
  FULL JOIN public."refDoctorMap" rdm ON rdm."refDMId" = rpm."refDoctorId"::INTEGER
  FULL JOIN public."refUserScoreDetail" rusd ON rusd."refPTId" = rpt."refPTId"::TEXT
WHERE
  rdm."refDoctorId" = $1
  AND DATE (rpt."refPTcreatedDate") >= ($2)
  AND DATE (rpt."refPTcreatedDate") <= DATE ($3)
  AND rusd."refQCategoryId" = $4
  `;

export const getHomePatientAssistant = `
  SELECT DISTINCT
  ON (rpt."refPMId", DATE (rpt."createdAt")) *
FROM
  public."refPatientTransaction" rpt
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = rpt."refPMId"::INTEGER
  FULL JOIN public."refDoctorMap" rdm ON rdm."refDMId" = rpm."refDoctorId"::INTEGER
WHERE
  rpt."createdBy" = $1
  AND DATE (rpt."refPTcreatedDate") >= ($2)
  AND DATE (rpt."refPTcreatedDate") <= DATE ($3)
  `;

export const getHomeCategoryAssistant = `
  SELECT DISTINCT
  ON (rpt."refPMId", DATE (rpt."createdAt")) *
FROM
  public."refPatientTransaction" rpt
  FULL JOIN public."refPatientMap" rpm ON rpm."refPMId" = rpt."refPMId"::INTEGER
  FULL JOIN public."refDoctorMap" rdm ON rdm."refDMId" = rpm."refDoctorId"::INTEGER
  FULL JOIN public."refUserScoreDetail" rusd ON rusd."refPTId" = rpt."refPTId"::TEXT
WHERE
  rpt."createdBy" = $1
  AND DATE (rpt."refPTcreatedDate") >= ($2)
  AND DATE (rpt."refPTcreatedDate") <= DATE ($3)
  AND rusd."refQCategoryId" = $4
  `;

  export const deleteTreatmentDetail = `
  DELETE FROM public."refTreatmentDetails" WHERE "refTDId" = $1
  `;