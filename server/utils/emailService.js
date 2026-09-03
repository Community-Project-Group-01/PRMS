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
    body { margin: 0; padding: 0; background: #f4fbfa; font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
    .email-card { background: #ffffff; border: 1px solid #d9eeec; border-radius: 12px; overflow: hidden; }
    .header { background: #096b68; color: #ffffff; padding: 28px 32px; text-align: center; }
    .brand { margin: 0 0 8px; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #90d1ca; }
    .header h1 { margin: 0; font-size: 24px; line-height: 1.3; }
    .content { padding: 32px; }
    .content p { margin: 0 0 16px; }
    .credentials { background: #f4fbfa; padding: 20px; border: 1px solid #d9eeec; border-left: 4px solid #129990; border-radius: 8px; margin: 24px 0; }
    .credentials h3 { margin: 0 0 14px; color: #096b68; font-size: 16px; }
    .credential-item { margin: 10px 0; }
    .label { font-weight: bold; color: #096b68; }
    .value { color: #1f2937; word-break: break-word; }
    .notice { background: #e8f6f4; padding: 14px 16px; border-radius: 8px; border-left: 4px solid #129990; }
    .footer { padding: 0 32px 28px; text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-card">
      <div class="header">
        <p class="brand">PRMS</p>
        <h1>Welcome to your account</h1>
      </div>
      <div class="content">
      <p>Hi ${name},</p>
      <p>Your ${role} account has been created successfully in the Patient Record Management System (PRMS).</p>
      
      <div class="credentials">
        <h3>Account Details:</h3>
        <div class="credential-item">
          <span class="label">Email:</span> <span class="value">${email}</span>
        </div>
        <div class="credential-item">
          <span class="label">Password:</span> <span class="value">${password}</span>
        </div>
      </div>
      
      <div class="notice"><strong>Next step:</strong> Please sign in and change your temporary password as soon as possible.</div>
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
    body { margin: 0; padding: 0; background: #f4fbfa; font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
    .email-card { background: #ffffff; border: 1px solid #d9eeec; border-radius: 12px; overflow: hidden; }
    .header { background: #096b68; color: #ffffff; padding: 28px 32px; text-align: center; }
    .brand { margin: 0 0 8px; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #90d1ca; }
    .header h1 { margin: 0; font-size: 24px; line-height: 1.3; }
    .content { padding: 32px; }
    .content p { margin: 0 0 16px; }
    .button { display: inline-block; padding: 13px 28px; background: #129990; color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 7px; margin: 8px 0 24px; }
    .link-label { color: #64748b; font-size: 13px; margin-bottom: 6px !important; }
    .reset-link { color: #096b68; word-break: break-all; font-size: 13px; }
    .notice { background: #fff8e6; padding: 14px 16px; border-radius: 8px; border-left: 4px solid #d99a00; margin-top: 24px; }
    .footer { padding: 0 32px 28px; text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-card">
      <div class="header">
        <p class="brand">PRMS</p>
        <h1>Password reset request</h1>
      </div>
      <div class="content">
      <p>Hi ${name},</p>
      <p>You requested to reset your password for your PRMS account.</p>
      
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      
      <p class="link-label">Or copy and paste this link into your browser:</p>
      <p class="reset-link">${resetLink}</p>
      
      <div class="notice">
        <strong>Important:</strong> This link will expire in 1 hour. If you did not request this password reset, please ignore this email.
      </div>
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
