const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/sendOTP');
const auth = require('../middleware/auth');

const router = express.Router();


// ─── STEP 1: REGISTER — Send OTP ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, msg: 'Please provide name, email, and password.' });
  }

  try {

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    // Hash password before storing temporarily
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any existing OTP for this email (re-send scenario)
    await OTP.deleteMany({ email });

    // Save OTP + temp user data in DB (auto-expires in 10 min)
    await OTP.create({
      email,
      otp,
      userData: { name, password: hashedPassword, role: role || 'student' },
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.json({
      success: true,
      msg: `OTP sent to ${email}. Please check your inbox.`,
    });

  } catch (err) {
    console.error('Register/OTP error:', err.message || err);
    res.status(500).json({ success: false, msg: `Server error: ${err.message || 'Could not send OTP.'}` });
  }

});


// ─── STEP 2: VERIFY OTP — Create Account + Issue JWT ─────────────────────────
router.post('/verify-otp', async (req, res) => {

  const { email, otp } = req.body;

  try {

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ success: false, msg: 'OTP expired or not found. Please register again.' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, msg: 'Invalid OTP. Please try again.' });
    }

    // OTP is valid — create the user
    const { name, password, role } = otpRecord.userData;

    const user = new User({ name, email, password, role });
    await user.save();

    // Delete OTP record
    await OTP.deleteMany({ email });

    // Issue JWT
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error.' });
  }

});


// ─── RESEND OTP ───────────────────────────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {

  const { email } = req.body;

  try {

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ success: false, msg: 'No pending registration found. Please register again.' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpRecord.otp = otp;
    otpRecord.createdAt = new Date(); // Reset TTL
    await otpRecord.save();

    await sendOTPEmail(email, otp, otpRecord.userData.name);

    res.json({ success: true, msg: 'New OTP sent successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Could not resend OTP.' });
  }

});


// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, msg: 'Please provide email and password.' });
  }

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// ─── LOGIN WITH OTP: Step 1 — Send Login OTP ──────────────────────────────────
router.post('/login-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, msg: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'No account found with this email. Please register.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      userData: { name: user.name, role: user.role, isLogin: true },
    });

    await sendOTPEmail(email, otp, user.name);
    res.json({ success: true, msg: `Login OTP sent to ${email}. Check your inbox!` });
  } catch (err) {
    console.error('Login OTP error:', err.message || err);
    res.status(500).json({ success: false, msg: `Server error: ${err.message || 'Could not send OTP.'}` });
  }
});


// ─── LOGIN WITH OTP: Step 2 — Verify OTP & Login ──────────────────────────────
router.post('/verify-login-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ success: false, msg: 'OTP expired or not found. Please request a new one.' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, msg: 'Invalid OTP. Please try again.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found.' });
    }

    await OTP.deleteMany({ email });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Verify login OTP error:', err);
    res.status(500).json({ success: false, msg: 'Server error during OTP verification.' });
  }
});


// ─── GET CURRENT USER PROFILE ────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});


// ─── UPDATE USER PROFILE ─────────────────────────────────────────────────────
router.put('/profile', auth, async (req, res) => {
  const { name, skills } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

    if (name) user.name = name;
    if (skills) user.skills = skills;

    await user.save();
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error updating profile' });
  }
});


module.exports = router;