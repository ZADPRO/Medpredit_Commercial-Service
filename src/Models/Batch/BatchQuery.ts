export const getUserCountQuery = `
SELECT
  DATE("createdAt") AS "registration_date",
  COUNT(*) AS "user_count"
FROM
  public."Users"
WHERE
  DATE("createdAt") >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY
  DATE("createdAt")
ORDER BY
  "registration_date" DESC;

`;


export const packageTakenByUserCountQuery = `
SELECT
  rp."refPkgName",
  s."createdAt"::date AS "date",
  COUNT(*) AS "packageTakenByUserCount"
FROM
  public."refSubscription" s
  LEFT JOIN public."refPackages" rp ON CAST(s."refPkgId" AS INTEGER) = rp."refPkgId"
WHERE
  s."createdAt"::date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY
  rp."refPkgName",
  s."createdAt"::date
ORDER BY
  "date" ASC,
  "packageTakenByUserCount" DESC;
`;