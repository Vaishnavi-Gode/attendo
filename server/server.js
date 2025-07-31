import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.post("/api/send-report", async (req, res) => {
  try {
    const { emails, chartData, tableData } = req.body;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background-color: #f8f9fa;
              line-height: 1.6;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 12px; 
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: #00ACC1;
              color: white; 
              text-align: center; 
              padding: 30px 20px;
            }
            .header h1 { margin: 0 0 10px 0; font-size: 28px; }
            .header p { margin: 0; opacity: 0.9; }
            .content { padding: 30px; }
            .section { margin-bottom: 40px; }
            .section h2 { 
              color: #00ACC1; 
              border-bottom: 2px solid #e0f2f1; 
              padding-bottom: 10px; 
              margin-bottom: 20px;
            }
            .chart-container { 
              background: #f8f9fa; 
              border-radius: 8px; 
              padding: 20px; 
              margin: 20px 0;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              font-size: 14px;
            }
            @media screen and (max-width: 600px) {
              .container { margin: 10px; border-radius: 8px; }
              .content { padding: 15px; }
              table { font-size: 11px; }
              th, td { padding: 6px 3px; }
            }
            th { 
              background: #00ACC1; 
              color: white; 
              padding: 12px; 
              text-align: left;
              font-weight: 600;
            }
            td { 
              padding: 10px 12px; 
              border-bottom: 1px solid #e0e0e0;
            }
            tr:nth-child(even) { background-color: #f8f9fa; }
            tr:hover { background-color: #e0f2f1; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Attendo - Attendance Report</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="content">

              <div class="section">
                <h2>📈 Attendance Analytics</h2>
                
                <!-- Today's Overall Attendance -->
                <div class="chart-container" style="text-align: center;">
                  
                  <!-- Circular Progress Ring -->
                  <div style="text-align: center; margin: 30px 0;">
                    <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 20px;">
                      Today's Attendance
                    </div>
                    
                    <!-- Outlook-compatible Progress Bars -->
                    <div style="text-align: center; margin: 20px 0;">
                      <div style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px;">
                        ${Math.round(
                          (chartData.presentToday / chartData.totalToday) * 100
                        )}% Present Today
                      </div>
                      <div style="font-size: 14px; color: #666; margin-bottom: 20px;">
                        ${chartData.presentToday} Present • ${
      chartData.absentToday
    } Absent • ${chartData.totalToday} Total
                      </div>
                      
                      <!-- Present Bar -->
                      <table style="margin: 15px auto; width: 300px; border-collapse: collapse;">
                        <tr>
                          <td style="width: 60px; font-size: 12px; font-weight: bold; color: #00acc1; text-align: right; padding-right: 10px;">Present:</td>
                          <td style="background: #e0e0e0; height: 20px; position: relative; padding: 0;">
                            <div style="background: #00acc1; height: 100%; width: ${Math.round(
                              (chartData.presentToday / chartData.totalToday) *
                                100
                            )}%;"></div>
                          </td>
                          <td style="width: 40px; font-size: 12px; text-align: left; padding-left: 10px;">${
                            chartData.presentToday
                          }</td>
                        </tr>
                      </table>
                      
                      <!-- Absent Bar -->
                      <table style="margin: 15px auto; width: 300px; border-collapse: collapse;">
                        <tr>
                          <td style="width: 60px; font-size: 12px; font-weight: bold; color: #f44336; text-align: right; padding-right: 10px;">Absent:</td>
                          <td style="background: #e0e0e0; height: 20px; position: relative; padding: 0;">
                            <div style="background: #f44336; height: 100%; width: ${Math.round(
                              (chartData.absentToday / chartData.totalToday) *
                                100
                            )}%;"></div>
                          </td>
                          <td style="width: 40px; font-size: 12px; text-align: left; padding-left: 10px;">${
                            chartData.absentToday
                          }</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  

                </div>
                
                <!-- Class-wise Attendance Bar Chart -->
                <div class="chart-container">
                  <h3 style="margin-top: 0; color: #333; text-align: center;">Class-wise Attendance Today</h3>
                  <div style="max-width: 600px; margin: 0 auto;">
                    ${
                      chartData.classWiseAttendance
                        ? chartData.classWiseAttendance
                            .map(
                              (classData) => `
                      <div style="margin: 20px 0; display: table; width: 100%;">
                        <div style="display: table-cell; width: 100px; font-size: 14px; font-weight: 600; color: #333; vertical-align: middle; padding-right: 15px;">
                          ${classData.className}
                        </div>
                        <div style="display: table-cell; vertical-align: middle;">
                          <div style="background: #e0e0e0; height: 30px; border-radius: 15px; position: relative; overflow: hidden;">
                            <div style="background: #00acc1; height: 100%; width: ${classData.percentage}%; border-radius: 15px; transition: width 0.3s ease;"></div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: bold; color: #333;">
                              ${classData.percentage}% (${classData.present}/${classData.total})
                            </div>
                          </div>
                        </div>
                      </div>
                    `
                            )
                            .join("")
                        : ""
                    }
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>📋 Detailed Attendance Data</h2>
                <table>
                  <thead>
                    <tr>
                      ${
                        tableData.headers
                          ? tableData.headers
                              .map((header) => `<th>${header}</th>`)
                              .join("")
                          : ""
                      }
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      tableData.rows
                        ? tableData.rows
                            .map(
                              (row) => `
                      <tr>
                        ${row.map((cell) => `<td>${cell}</td>`).join("")}
                      </tr>
                    `
                            )
                            .join("")
                        : ""
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: emails.join(", "),
      subject: `Attendo Attendance Report - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Report sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
