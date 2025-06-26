export const userlistQuery = `
SELECT
  u.*,
  rc."refUserMobileno",
  rc."refUserEmail"
FROM
  public."Users" u
  LEFT JOIN public."refCommunication" rc ON CAST (rc."refUserId" AS INTEGER) = u."refUserId"
  
WHERE
  u."refUserCustId" LIKE 'USER%'
  AND u."createdAt"::date BETWEEN $1::date AND $2::date
  AND u."activeStatus" = 'active'
ORDER BY
  u."refUserId" DESC
`;

export const packageTakenByUserCountQuery = `
SELECT
  rp."refPkgName",
  COUNT(*) AS "packageTakenByUserCount"
FROM
  public."refSubscription" s
  LEFT JOIN public."refPackages" rp
    ON CAST(s."refPkgId" AS INTEGER) = rp."refPkgId"
GROUP BY
  rp."refPkgName"
ORDER BY
  "packageTakenByUserCount" DESC;
`;