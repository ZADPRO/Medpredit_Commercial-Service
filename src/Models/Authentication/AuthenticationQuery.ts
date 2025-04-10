export const usersigninQuery = `
SELECT
  *
FROM
  public."refCommunication" rc
  JOIN public."Users" u ON rc."refUserId" = u."refUserId"
  JOIN public."refUserDomain" rud ON rc."refUserId" = rud."refUserId"
WHERE
  rc."refUserMobileno" = $1
  AND u."activeStatus" = 'active'
`;

export const userParticularSiginQuery = `
SELECT
  *
FROM
  public."refCommunication" rc
  JOIN public."Users" u ON rc."refUserId" = u."refUserId"
  JOIN public."refUserDomain" rud ON rc."refUserId" = rud."refUserId"
WHERE
  rc."refUserMobileno" = $1
  AND u."refUserId" = $2
`;

export const patientDataCheckQuery = `SELECT
  COUNT(*) > 0 AS result
FROM
  public."Users" u
  JOIN public."refCommunication" rc ON rc."refUserId" = u."refUserId"
WHERE
  (
    u."refUserId" IS NULL
    OR CAST(u."refUserId" AS TEXT) = ''
    OR u."refUserCustId" IS NULL
    OR u."refUserCustId" = ''
    OR u."refRoletype" IS NULL
    OR CAST(u."refRoletype" AS TEXT) = ''
    OR u."refHospitalId" IS NULL
    OR CAST(u."refHospitalId" AS TEXT) = ''
    OR u."refUserFname" IS NULL
    OR u."refUserFname" = ''
    OR u."refUserLname" IS NULL
    OR u."refUserLname" = ''
    OR u."refDOB" IS NULL
    OR u."refDOB" = ''
    OR u."refGender" IS NULL
    OR u."refGender" = ''
    OR u."refMaritalStatus" IS NULL
    OR u."refMaritalStatus" = ''
    OR u."refEducation" IS NULL
    OR u."refEducation" = ''
    OR u."refProfession" IS NULL
    OR u."refProfession" = ''
    OR rc."refUserMobileno" IS NULL
    OR rc."refUserMobileno" = ''
    OR rc."refUserEmail" IS NULL
    OR rc."refUserEmail" = ''
    OR rc."refAddress" IS NULL
    OR rc."refAddress" = ''
    OR rc."refPincode" IS NULL
    OR rc."refPincode" = ''
  )
  AND u."refUserId" = $1;`;

export const doctorDataCheckQuery = `SELECT
  COUNT(*) > 0 AS result
FROM
  public."Users" u
  JOIN public."refCommunication" rc ON rc."refUserId" = u."refUserId"
  JOIN public."refStaffDomain" rsd ON rsd."refUserId"= u."refUserId"
WHERE
  (
    u."refUserId" IS NULL
    OR CAST(u."refUserId" AS TEXT) = ''
    OR u."refUserCustId" IS NULL
    OR u."refUserCustId" = ''
    OR u."refRoletype" IS NULL
    OR CAST(u."refRoletype" AS TEXT) = ''
    OR u."refHospitalId" IS NULL
    OR CAST(u."refHospitalId" AS TEXT) = ''
    OR u."refUserFname" IS NULL
    OR u."refUserFname" = ''
    OR u."refUserLname" IS NULL
    OR u."refUserLname" = ''
    OR u."refDOB" IS NULL
    OR u."refDOB" = ''
    OR u."refGender" IS NULL
    OR u."refGender" = ''
    OR u."refMaritalStatus" IS NULL
    OR u."refMaritalStatus" = ''
    OR u."refEducation" IS NULL
    OR u."refEducation" = ''
    OR u."refProfession" IS NULL
    OR u."refProfession" = ''
    OR rc."refUserMobileno" IS NULL
    OR rc."refUserMobileno" = ''
    OR rc."refUserEmail" IS NULL
    OR rc."refUserEmail" = ''
    OR rc."refAddress" IS NULL
    OR rc."refAddress" = ''
    OR rc."refPincode" IS NULL
    OR rc."refPincode" = ''
    OR rsd."refAllopathic" IS NULL
    OR rsd."refAllopathic" = ''
    OR rsd."refMedicalCouncil" IS NULL
    OR rsd."refMedicalCouncil" = ''
    OR rsd."refMCIno" IS NULL
    OR rsd."refMCIno" = ''
    OR rsd."refCRSector" IS NULL
    OR rsd."refCRSector" = ''
    OR rsd."refCRInstitute" IS NULL
    OR rsd."refCRInstitute" = ''
    OR rsd."refCRDesignation" IS NULL
    OR rsd."refCRDesignation" = ''
    OR rsd."refCRDepartment" IS NULL
    OR rsd."refCRDepartment" = ''
    OR rsd."refCRAddress" IS NULL
    or rsd."refCRAddress" = ''
  )
  AND u."refUserId" = $1;`;

export const assistantMapping = `
  SELECT
  rh."refHospitalId"
FROM
  public."refAssMap" ram
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(ram."refDoctorId" AS INTEGER)
  JOIN public."refHospital" rh ON rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
WHERE
  ram."refAssId" = $1
  `;

export const checkDoctorHospitalQuery = `
 SELECT
  rdm."refHospitalId",
  rh."refHospitalName",
  rh."refHospitalAddress" || ', ' || rh."refHospitalPincode" AS "FullAddress"
FROM
  public."refDoctorMap" rdm
  JOIN public."refHospital" rh ON rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
WHERE
  rdm."refDoctorId" = $1;
  `;

export const changePasswordQuery = `
SELECT
  u."refUserId",
  rud."refUserPassword",
  rc."refUserMobileno"
FROM
  public."Users" u
  JOIN public."refUserDomain" rud ON rud."refUserId" = u."refUserId"
  JOIN public."refCommunication" rc ON rc."refUserId" = u."refUserId"
WHERE
  u."refUserId" = $1 AND rud."refUserPassword" = $2;
`;

export const getUsersListMobileNo = `
SELECT
  *
FROM
  public."refCommunication" rc
  JOIN public."Users" u ON u."refUserId" = CAST(rc."refUserId" AS INTEGER)
WHERE
  rc."refUserMobileno" = $1
  AND u."headStatus" = 'true'
  AND u."activeStatus" = 'active';
`;

export const updatePasswordQuery = `
UPDATE
  public."refUserDomain"
SET
  "refUserPassword" = $1,
  "refUserHashedpass" = $2
WHERE
  "refUserId" = $3;
`;

export const updateMobilenumberQuery = `
UPDATE
  public."refCommunication"
SET
  "refUserMobileno" = $1,
  "updatedAt" = $2,
  "updatedBy" = $3
WHERE
  "refUserId" = $4
`;

export const getDoctorList = `
SELECT DISTINCT
  ON (u."refUserId") rdm."refDMId" AS "code",
  u."refUserCustId",
  (
    'Dr. ' || u."refUserFname" || ' ' || u."refUserLname"
  ) AS "name",
  u."activeStatus",
  u."refUserId" AS "Id"
FROM
  public."Users" u
  JOIN public."refDoctorMap" rdm ON rdm."refDoctorId" = CAST(u."refUserId" AS TEXT)
WHERE
  u."refRoleId" IN ('1', '4')
  AND rdm."refHospitalId" = $1
`;

export const getDoctorListActive = `
SELECT DISTINCT
  ON (u."refUserId") rdm."refDMId" AS "code",
  u."refUserCustId",
  (
    'Dr. ' || u."refUserFname" || ' ' || u."refUserLname"
  ) AS "name",
  u."activeStatus",
  u."refUserId" AS "Id"
FROM
  public."Users" u
  JOIN public."refDoctorMap" rdm ON rdm."refDoctorId" = CAST(u."refUserId" AS TEXT)
WHERE
  u."refRoleId" IN ('1', '4')
  AND rdm."refHospitalId" = $1
  AND u."activeStatus" = 'active'
`;

export const getAssistantList = `
SELECT DISTINCT
  ON (ram."refAssId") u."refUserId" AS "code",
  (u."refUserFname" || ' ' || u."refUserLname") AS "name",
  u."refUserCustId"
FROM
  public."Users" u
  JOIN public."refAssMap" ram ON ram."refAssId" = CAST(u."refUserId" AS TEXT)
  JOIN public."refDoctorMap" rdm ON rdm."refDMId" = CAST(ram."refDoctorId" AS INTEGER)
WHERE
  u."refRoleId" = $1
  AND rdm."refHospitalId" = $2
  AND u."activeStatus" = 'active'
ORDER BY
  ram."refAssId";
`;

export const nextDoctorId = `
SELECT 
  COUNT(*) + 1 AS NextrefUserCustId
FROM 
  public."Users" us
WHERE 
  us."refRoleId" IN ('1', '4');
`;

export const nextStaffId = `
SELECT 
  COUNT(*) + 1 AS NextrefUserCustId
FROM 
  public."Users" us
WHERE 
  us."refRoleId" = $1;`;

export const addStaffUserQuery = `
INSERT INTO 
  public."Users" (
    "createdAt",
    "createdBy",
    "refDOB",
    "refGender",
    "refMaritalStatus",
    "refRoleId",
    "refUserCustId",
    "refUserFname",
    "refUserLname",
    "activeStatus",
    "refUserId",
    "headStatus"
  ) 
VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'true');

`;

export const addStaffCommunicationQuery = `
INSERT INTO 
  public."refCommunication" (
    "createdAt",
    "createdBy",
    "refAddress",
    "refDistrict",
    "refPincode",
    "refUserEmail",
    "refUserId",
    "refUserMobileno"
  ) 
VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8);
`;

export const addStaffDomainQuery = `
INSERT INTO 
  public."refStaffDomain" (
    "refUserId",
    "refAllopathic",
    "refEducation",
    "refEducationSpec",
    "refSuperSpec",
    "refBranchSuperSpec",
    "refAddDeg",
    "refTypeAddDeg",
    "refSpecBranch",
    "refNameRegCouncil",
    "refMCINo",
    "refCROcpSector",
    "refCRInstituteType",
    "refCRInstituteName",
    "refCRDesignation",
    "refCRDepartment",
    "refCRAddress",
    "createdAt",
    "createdBy"
  ) 
VALUES 
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
  );
`;

export const addStaffExprienceQuery = `
INSERT INTO 
  public."refStaffExperience" (
    "refUserId",
    "refPEInstitute",
    "refPEDesignation",
    "refPEDepartment",
    "refPEAddress",
    "refPEFrom",
    "refPETo",
    "createdAt",
    "createdBy"
  ) 
VALUES 
  (
    $1, 
    $2, 
    $3, 
    $4, 
    $5, 
    $6, 
    $7, 
    $8, 
    $9
  );
`;

export const addStaffDoctorMap = `
INSERT INTO
  public."refDoctorMap" (
    "refHospitalId",
    "refDoctorId",
    "CreatedAt",
    "CreatedBy"
  )
VALUES
  ($1, $2, $3, $4)
`;

export const addStaffAssistantMap = `
INSERT INTO
  public."refAssMap" (
    "refDoctorId",
    "refAssId",
    "CreatedAt",
    "CreatedBy"
  )
VALUES
  ($1, $2, $3, $4)
`;

export const getDoctorMapList = `
SELECT
  rdm."refDMId" AS "refUserId",
  u."refUserCustId",
  (
    'Dr. ' || u."refUserFname" || ' ' || u."refUserLname"
  ) AS doctorName,
  (
    EXISTS (
      SELECT
        1
      FROM
        public."refAssMap" ram
      WHERE
        ram."refDoctorId" = CAST(rdm."refDMId" AS TEXT)
        AND ram."refAssId" = $1
    )
  ) AS hasAssistant
FROM
  public."Users" u
  JOIN public."refDoctorMap" rdm ON rdm."refDoctorId" = CAST(u."refUserId" AS TEXT)
  JOIN public."refHospital" rh ON rh."refHospitalId" = CAST(rdm."refHospitalId" AS INTEGER)
WHERE
  u."refRoleId" IN ('1', '4')
  AND rh."refHospitalId" = $2
`;

export const postActiveQuery = `
UPDATE public."Users"
  SET 
    "activeStatus" = $1,
    "updatedAt" = $2,
    "updatedBy" = $3
  WHERE 
    "refUserId" = $4
`;

export const getUserActiveStatus = `
SELECT
  u."activeStatus"
FROM
  public."Users" u
WHERE
  u."refUserId" = $1
`;

export const getDetailsQuery = `
SELECT
  *
FROM
  public."Users" u
  JOIN public."refCommunication" rc ON rc."refUserId" = u."refUserId"
  JOIN public."refUserDomain" rud ON rud."refUserId" = u."refUserId"
WHERE
  u."refUserId" = $1
`;
