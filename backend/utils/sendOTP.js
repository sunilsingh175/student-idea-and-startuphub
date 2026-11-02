const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your regular password)
  },
});

const sendOTPEmail = async (toEmail, otp, userName) => {
  const mailOptions = {
    from: `"Student Startup Hub" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🚀 Your OTP for Student Startup Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚀 Student Startup Hub</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333;">Hi ${userName || 'there'}! 👋</h2>
          <p style="color: #555; font-size: 16px;">Your One-Time Password (OTP) for account verification is:</p>
          <div style="background: #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #888; font-size: 14px;">⏱️ This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #888; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background: #f0f0f0; padding: 15px; text-align: center;">
          <p style="color: #aaa; font-size: 12px; margin: 0;">© 2024 Student Startup Hub. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
