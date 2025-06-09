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
