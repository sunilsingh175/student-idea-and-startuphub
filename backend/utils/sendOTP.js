const nodemailer = require('nodemailer');

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error('sendOTP: EMAIL_USER or EMAIL_PASS environment variable is missing.');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 10000,
  });
}

const sendOTPEmail = async (toEmail, otp, userName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"StudentIdea Hub" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🚀 Your OTP for StudentIdea and Startup Hub',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #fbf9f4; border-radius: 12px; overflow: hidden; border: 1px solid #e8e3d8;">
        <div style="background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%); padding: 28px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 700;">🚀 StudentIdea & Startup Hub</h1>
        </div>
        <div style="padding: 28px 24px;">
          <h2 style="color: #111827; margin: 0 0 10px; font-size: 18px;">Hi ${userName || 'there'}! 👋</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Your One-Time Password (OTP) for account verification is:
          </p>
          <div style="background: #ffffff; border: 1.5px solid #93c5fd; border-radius: 10px; padding: 18px; text-align: center; margin: 0 0 20px;">
            <span style="color: #2563eb; font-size: 34px; font-weight: 800; letter-spacing: 10px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 6px;">⏱️ This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #9ca3af; font-size: 13px; margin: 0;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background: #f4efe6; padding: 14px; text-align: center; border-top: 1px solid #e8e3d8;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">@2026 StudentIdea and Startup</p>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
