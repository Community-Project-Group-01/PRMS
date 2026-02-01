const sgMail = require("@sendgrid/mail");
const logger = require("./logger");

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  logger.warn("SENDGRID_API_KEY not found in environment variables");
}

/**
 * Send email using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content (optional)
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    const msg = {
      to,
      from: process.env.SENDER_EMAIL || "noreply@prms.com",
      subject,
      text,
      html: html || text, // Use HTML if provided, otherwise use text
    };

    await sgMail.send(msg);
    logger.info(`Email sent successfully to ${to}`, { subject });
  } catch (error) {
    logger.error("Error sending email", {
      to,
      subject,
      error: error.message,
      stack: error.stack,
    });
    throw new Error("Email sending failed");
  }
};

/**
 * Send account credentials email
 * @param {string} to - Recipient email
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (doctor/patient)
 */
const sendCredentialsEmail = async (to, name, email, password, role) => {
  const subject = "Your Account Credentials - PRMS";
  const text = `
Hi ${name},

Your ${role} account has been created successfully in the Patient Record Management System (PRMS).

Account Details:
Email: ${email}
Password: ${password}

Please keep your password safe and change it after your first login.

Best regards,
PRMS Team
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .credential-item { margin: 10px 0; }
    .label { font-weight: bold; color: #667eea; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to PRMS</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Your ${role} account has been created successfully in the Patient Record Management System (PRMS).</p>
      
      <div class="credentials">
        <h3>Account Details:</h3>
        <div class="credential-item">
          <span class="label">Email:</span> ${email}
        </div>
        <div class="credential-item">
          <span class="label">Password:</span> ${password}
        </div>
      </div>
      
      <p><strong>Please keep your password safe and change it after your first login.</strong></p>
      
      <div class="footer">
        <p>Best regards,<br>PRMS Team</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({ to, subject, text, html });
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} name - User name
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - Password reset URL
 */
const sendPasswordResetEmail = async (to, name, resetToken, resetUrl) => {
  const subject = "Password Reset Request - PRMS";
  const resetLink = resetUrl || `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

  const text = `
Hi ${name},

You requested to reset your password for your PRMS account.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour.

If you did not request this password reset, please ignore this email.

Best regards,
PRMS Team
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .button:hover { background: #5568d3; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    .warning { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>You requested to reset your password for your PRMS account.</p>
      
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
      
      <div class="warning">
        <strong>⚠️ Important:</strong> This link will expire in 1 hour. If you did not request this password reset, please ignore this email.
      </div>
      
      <div class="footer">
        <p>Best regards,<br>PRMS Team</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({ to, subject, text, html });
};

module.exports = {
  sendEmail,
  sendCredentialsEmail,
  sendPasswordResetEmail,
};
