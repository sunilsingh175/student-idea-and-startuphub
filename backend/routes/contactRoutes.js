const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST /api/contact — Send feedback email
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"StudentIdea Hub Contact" <${process.env.EMAIL_USER}>`,
      to: 'startuphub695@gmail.com',
      replyTo: email,
      subject: subject ? `[Feedback] ${subject}` : `[Feedback] New message from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fbf9f4; border-radius: 12px; overflow: hidden; border: 1px solid #e8e3d8;">
          <div style="background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%); padding: 28px 32px;">
            <h1 style="margin: 0; color: white; font-size: 22px; font-weight: 700;">📬 New Feedback Received</h1>
            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">StudentIdea & Startup Hub</p>
          </div>
          <div style="padding: 28px 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600; width: 100px; text-transform: uppercase; letter-spacing: 0.5px;">Name</td>
                <td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${name}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f0ea;">
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                <td style="padding: 10px 0; color: #111827; font-size: 15px;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td>
              </tr>
              ${subject ? `
              <tr style="border-top: 1px solid #f3f0ea;">
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</td>
                <td style="padding: 10px 0; color: #111827; font-size: 15px;">${subject}</td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 20px; background: #ffffff; border: 1px solid #e8e3d8; border-radius: 10px; padding: 20px;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
              <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="padding: 16px 32px; background: #f8f6f1; border-top: 1px solid #e8e3d8; text-align: center;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2026 StudentIdea and Startup Hub</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Your feedback has been sent successfully! We\'ll get back to you soon.' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
  }
});

module.exports = router;
