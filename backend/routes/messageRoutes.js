const express = require('express');
const PrivateMessage = require('../models/PrivateMessage');
const Idea = require('../models/Idea');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// ─── GET ALL CONVERSATIONS FOR CURRENT USER ──────────────────────────────────
router.get('/conversations', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch all messages where current user is sender or recipient
    const messages = await PrivateMessage.find({
      $or: [{ sender: currentUserId }, { recipient: currentUserId }],
    })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .populate('ideaId', 'title domain')
      .sort({ createdAt: -1 });

    // Group into unique conversations by (partnerId + ideaId)
    const convMap = new Map();

    messages.forEach((msg) => {
      if (!msg.sender || !msg.recipient || !msg.ideaId) return;

      const isSender = msg.sender._id.toString() === currentUserId;
      const partner = isSender ? msg.recipient : msg.sender;
      const partnerId = partner._id.toString();
      const ideaId = msg.ideaId._id.toString();
      const convKey = `${partnerId}_${ideaId}`;

      if (!convMap.has(convKey)) {
        convMap.set(convKey, {
          key: convKey,
          partner,
          idea: msg.ideaId,
          lastMessage: {
            text: msg.message,
            createdAt: msg.createdAt,
            senderId: msg.sender._id.toString(),
            read: msg.read,
          },
          unreadCount: 0,
        });
      }

      // Count unread messages sent by partner to current user
      if (!isSender && !msg.read) {
        const item = convMap.get(convKey);
        item.unreadCount += 1;
      }
    });

    const conversations = Array.from(convMap.values());
    res.json({ success: true, conversations });
  } catch (err) {
    console.error('Fetch conversations error:', err);
    res.status(500).json({ success: false, msg: 'Server error loading conversations' });
  }
});

// ─── GET CHAT THREAD WITH A SPECIFIC PARTNER ABOUT AN IDEA ───────────────────
router.get('/thread', auth, async (req, res) => {
  const { partnerId, ideaId } = req.query;
  if (!partnerId || !ideaId) {
    return res.status(400).json({ success: false, msg: 'partnerId and ideaId are required' });
  }

  try {
    const currentUserId = req.user.id;

    // Mark all incoming messages from partner as read
    await PrivateMessage.updateMany(
      {
        ideaId,
        sender: partnerId,
        recipient: currentUserId,
        read: false,
      },
      { $set: { read: true } }
    );

    // Fetch messages
    const messages = await PrivateMessage.find({
      ideaId,
      $or: [
        { sender: currentUserId, recipient: partnerId },
        { sender: partnerId, recipient: currentUserId },
      ],
    })
      .populate('sender', 'name role')
      .populate('recipient', 'name role')
      .sort({ createdAt: 1 });

    const partner = await User.findById(partnerId).select('name email role');
    const idea = await Idea.findById(ideaId).select('title domain createdBy');

    res.json({
      success: true,
      partner,
      idea,
      messages,
    });
  } catch (err) {
    console.error('Fetch thread error:', err);
    res.status(500).json({ success: false, msg: 'Server error loading thread' });
  }
});

// ─── SEND A MESSAGE ──────────────────────────────────────────────────────────
router.post('/send', auth, async (req, res) => {
  const { recipientId, ideaId, message } = req.body;
  if (!recipientId || !ideaId || !message || !message.trim()) {
    return res.status(400).json({ success: false, msg: 'recipientId, ideaId, and message are required' });
  }

  try {
    const newMsg = new PrivateMessage({
      ideaId,
      sender: req.user.id,
      recipient: recipientId,
      message: message.trim(),
    });

    await newMsg.save();
    const populated = await newMsg.populate('sender', 'name role');

    res.json({ success: true, message: populated });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ success: false, msg: 'Server error sending message' });
  }
});

module.exports = router;
