export const emailContForPaymentUpgrade = (
  username: string,
  planName: string,
  amount: string,
  transactionId: string,
  date: string,
  paymentMethod: string,
  startDate: string,
  endDate: string,
  companyName: string
) => {
  const currentYear = new Date().getFullYear();

  const formatDate = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  };

  const paymentDateFormatted = formatDate(date);

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background-color: #fff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 15px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                margin-top: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
            }
            .footer {
                font-size: 12px;
                color: #999;
                text-align: center;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Subscription Payment Confirmation</h2>
            </div>
            <div class="content">
                <p>Hello <strong>${username}</strong>,</p>
                <p>Thank you for subscribing to the <strong>${planName}</strong> plan. Your payment was successful and your subscription is now active.</p>

                <h3>💳 Payment Summary</h3>
                <table>
                    <tr><th>Amount Paid</th><td>₹${amount}</td></tr>
                    <tr><th>Transaction ID</th><td>${transactionId}</td></tr>
                    <tr><th>Payment Date</th><td>${paymentDateFormatted}</td></tr>
                    <tr><th>Payment Method</th><td>${paymentMethod}</td></tr>
                </table>

                <h3>📅 Subscription Details</h3>
                <table>
                    <tr><th>Plan Name</th><td>${planName}</td></tr>
                    <tr><th>Start Date</th><td>${startDate}</td></tr>
                    <tr><th>End Date</th><td>${endDate}</td></tr>
                </table>

                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Thank you for choosing <strong>${companyName}</strong>.</p>
            </div>
            <div class="footer">
                &copy; ${currentYear} ${companyName}. All rights reserved.
            </div>
        </div>
    </body>
    </html>
  `;
};

export const emailContForPackageUpgrade = (
  username: string,
  newPlanName: string,
  oldPlanName: string,
  amount: number,
  transactionId: string,
  transactionDate: string,
  paymentMethod: string,
  startDate: string,
  endDate: string,
  companyName: string
) => {
  const currentYear = new Date().getFullYear();

  const formatDate = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background-color: #fff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #0073e6;
                color: white;
                padding: 15px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                margin-top: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
            }
            .footer {
                font-size: 12px;
                color: #999;
                text-align: center;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Subscription Package Upgraded</h2>
            </div>
            <div class="content">
                <p>Hello <strong>${username}</strong>,</p>
                <p>We’re excited to let you know that your subscription has been successfully upgraded.</p>

                <h3>🔁 Upgrade Summary</h3>
                <table>
                    <tr><th>Previous Plan</th><td>${oldPlanName}</td></tr>
                    <tr><th>New Plan</th><td>${newPlanName}</td></tr>
                    <tr><th>Subscription Start</th><td>${formatDate(
                      startDate
                    )}</td></tr>
                    <tr><th>Subscription End</th><td>${formatDate(
                      endDate
                    )}</td></tr>
                </table>

                <h3>💳 Payment Details</h3>
                <table>
                    <tr><th>Amount Paid</th><td>₹${amount.toFixed(2)}</td></tr>
                    <tr><th>Transaction ID</th><td>${transactionId}</td></tr>
                    <tr><th>Payment Date</th><td>${formatDate(
                      transactionDate
                    )}</td></tr>
                    <tr><th>Payment Method</th><td>${paymentMethod}</td></tr>
                </table>

                <p>If you have any questions, feel free to contact our support team.</p>
                <p>Thank you for continuing with <strong>${companyName}</strong>.</p>
            </div>
            <div class="footer">
                &copy; ${currentYear} ${companyName}. All rights reserved.
            </div>
        </div>
    </body>
    </html>
  `;
};


// export const sendWeeklyReport = (
//   userData: { registration_date: string; user_count: number }[],
//   subscriptionData: { refPkgName: string; packageTakenByUserCount: number }[]
// ): string => {
//   const today = new Date().toLocaleDateString("en-IN");

//   // User registration table rows
//   const userRows = userData
//     .map(
//       (row, index) => `
//       <tr>
//         <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${index + 1}</td>
//         <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${row.registration_date}</td>
//         <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${row.user_count}</td>
//       </tr>`
//     )
//     .join("");

//   // Subscription packages table rows
//   const packageRows = subscriptionData
//     .map(
//       (row, index) => `
//       <tr>
//         <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${index + 1}</td>
//         <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${row.refPkgName}</td>
//         <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${row.packageTakenByUserCount}</td>
//       </tr>`
//     )
//     .join("");

//   return `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta charset="UTF-8" />
//     <title>Weekly Registration & Subscription Report</title>
//     <style>
//       body {
//         font-family: Arial, sans-serif;
//         background-color: #f7f7f7;
//         margin: 0; padding: 20px;
//       }
//       .container {
//         max-width: 700px;
//         margin: auto;
//         background: #fff;
//         padding: 20px;
//         border-radius: 8px;
//         box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//       }
//       h2 {
//         color: #0478df;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-top: 20px;
//       }
//       th {
//         background-color: #0478df;
//         color: white;
//         padding: 10px;
//         text-align: center;
//         border: 1px solid #ccc;
//       }
//       td {
//         border: 1px solid #ccc;
//         padding: 8px;
//         text-align: center;
//       }
//       .footer {
//         margin-top: 30px;
//         text-align: center;
//         color: #888;
//         font-size: 12px;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="container">
//       <h2>📊 Weekly User Registration Report</h2>
//       <p><strong>Date:</strong> ${today}</p>
//       <p><strong>Total Days Reported:</strong> ${userData.length}</p>
//       <table>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Registration Date</th>
//             <th>User Count</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${userRows}
//         </tbody>
//       </table>

//       <h2 style="margin-top: 40px;">📦 Package Subscription Summary</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Package Name</th>
//             <th>User Count</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${packageRows}
//         </tbody>
//       </table>

//       <p style="margin-top: 30px;">Regards,<br/><strong>ZAdroit Team</strong></p>
//     </div>

//     <div class="footer">
//       &copy; 2025 ZAdroit. All rights reserved.
//     </div>
//   </body>
//   </html>
//   `;
// };

type UserCount = {
  registration_date: Date;
  user_count: number | string;
};

type SubscriptionCount = {
  refPkgName: string;
  date: Date;
  packageTakenByUserCount: number | string;
};

export const sendWeeklyReport = (
  userCounts: UserCount[],
  subscriptionCounts: SubscriptionCount[]
): string => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Group subscriptions by date
  const subsByDate: Record<string, SubscriptionCount[]> = {};
  subscriptionCounts.forEach((sub) => {
    const key = sub.date.toISOString().split("T")[0];
    if (!subsByDate[key]) subsByDate[key] = [];
    subsByDate[key].push(sub);
  });

  const rows = userCounts
    .map((userCount, idx) => {
      const dateKey = userCount.registration_date.toISOString().split("T")[0];
      const subscriptions = subsByDate[dateKey] || [];

      const subHtml = subscriptions
        .map(
          (sub) =>
            `<li>${sub.refPkgName}: <strong>${sub.packageTakenByUserCount}</strong></li>`
        )
        .join("") || "<li>No subscriptions</li>";

      return `
      <tr>
        <td style="border:1px solid #ccc; padding:8px; text-align:center;">${idx + 1}</td>
        <td style="border:1px solid #ccc; padding:8px;">${formatDate(userCount.registration_date)}</td>
        <td style="border:1px solid #ccc; padding:8px; text-align:center;">${userCount.user_count}</td>
        <td style="border:1px solid #ccc; padding:8px;">
          <ul style="margin:0; padding-left: 20px;">
            ${subHtml}
          </ul>
        </td>
      </tr>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Weekly User Registration & Subscription Report</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 800px;
        margin: auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      h2 {
        color: #0478df;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th {
        background-color: #0478df;
        color: white;
        padding: 10px;
        text-align: center;
        border: 1px solid #ccc;
      }
      td {
        border: 1px solid #ccc;
        padding: 8px;
        vertical-align: top;
      }
      ul {
        margin: 0;
        padding-left: 20px;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        color: #888;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>📊 Weekly User Registration & Subscription Report</h2>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>User Registrations</th>
            <th>Subscriptions Breakdown</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <p style="margin-top: 30px;">Regards,<br/><strong>ZAdroit Team</strong></p>
    </div>

    <div class="footer">
      &copy; 2025 ZAdroit. All rights reserved.
    </div>
  </body>
  </html>
  `;
};
