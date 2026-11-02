const express = require('express');
const Idea = require('../models/Idea');
const Comment = require('../models/Comment');
const PrivateMessage = require('../models/PrivateMessage');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    
    // Check if user is authenticated to add hasLiked
    const token = req.header('x-auth-token');
    let userId = null;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.user.id;
      } catch (err) {
        // Invalid token, treat as unauthenticated
      }
    }
    
    const ideasWithLikeStatus = ideas.map(idea => ({
      ...idea.toObject(),
      hasLiked: userId ? idea.upvotes.some(u => u.toString() === userId) : false
    }));
    
    res.json(ideasWithLikeStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Database not connected. Please install and start MongoDB.');
  }
});

// Get current user's submitted ideas
router.get('/user/my-ideas', auth, async (req, res) => {
  try {
    const ideas = await Idea.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error fetching user ideas' });
  }
});

// Get single idea
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('createdBy', 'name').populate('teamMembers', 'name');
    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    
    // Check if user is authenticated to add hasLiked
    const token = req.header('x-auth-token');
    let userId = null;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.user.id;
      } catch (err) {
        // Invalid token, treat as unauthenticated
      }
    }
    
    const ideaWithLikeStatus = {
      ...idea.toObject(),
      hasLiked: userId ? idea.upvotes.some(u => u.toString() === userId) : false
    };
    
    res.json(ideaWithLikeStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Database not connected. Please install and start MongoDB.');
  }
});

// Create idea
router.post('/', auth, async (req, res) => {
  const { title, description, domain } = req.body;

  try {
    const newIdea = new Idea({
      title,
      description,
      domain,
      createdBy: req.user.id,
    });

    const idea = await newIdea.save();
    res.json(idea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Database not connected. Please install and start MongoDB.');
  }
});

// Upvote idea (toggle like/dislike)
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }

    const userId = req.user.id;
    const upvoteIndex = idea.upvotes.findIndex(u => u.toString() === userId);
    
    if (upvoteIndex > -1) {
      // Already upvoted, remove the upvote (dislike)
      idea.upvotes.splice(upvoteIndex, 1);
    } else {
      // Not upvoted, add the upvote (like)
      idea.upvotes.push(userId);
    }
    
    await idea.save();
    
    // Return the updated idea with hasLiked status
    const updatedIdea = {
      ...idea.toObject(),
      hasLiked: idea.upvotes.some(u => u.toString() === userId)
    };
    
    res.json(updatedIdea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Database not connected. Please install and start MongoDB.');
  }
});

// Get comments for an idea
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ ideaId: req.params.id }).populate('userId', 'name').sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Database not connected. Please install and start MongoDB.');
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  const { comment } = req.body;

  try {
    const newComment = new Comment({
      ideaId: req.params.id,
      userId: req.user.id,
      comment,
    });

    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Database not connected. Please install and start MongoDB.');
  }
});

// Delete idea (only the author or admin can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ success: false, msg: 'Idea not found' });
    }

    // Check ownership
    if (idea.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Not authorized to delete this idea' });
    }

    // Delete associated comments and private messages
    await Comment.deleteMany({ ideaId: req.params.id });
    await PrivateMessage.deleteMany({ ideaId: req.params.id });

    // Delete the idea
    await Idea.findByIdAndDelete(req.params.id);

    res.json({ success: true, msg: 'Idea deleted successfully' });
  } catch (err) {
    console.error('Delete idea error:', err.message);
    res.status(500).json({ success: false, msg: 'Server error deleting idea' });
  }
});

// ─── PRIVATE CHAT (CONFIDENTIAL 1-ON-1 SESSION) ──────────────────────────────

// Get private messages for an idea
router.get('/:id/private-messages', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('createdBy', 'name role');
    if (!idea) {
      return res.status(404).json({ success: false, msg: 'Idea not found' });
    }

    const currentUserId = req.user.id;
    const authorId = idea.createdBy._id.toString();
    const isAuthor = currentUserId === authorId;

    if (!isAuthor) {
      // Normal user: messages between current user and the idea author
      const messages = await PrivateMessage.find({
        ideaId: req.params.id,
        $or: [
          { sender: currentUserId, recipient: authorId },
          { sender: authorId, recipient: currentUserId },
        ],
      })
        .populate('sender', 'name role')
        .populate('recipient', 'name role')
        .sort({ createdAt: 1 });

      return res.json({
        success: true,
        isAuthor: false,
        partner: idea.createdBy,
        messages,
      });
    }

    // Author: fetch all conversations for this idea
    const allMessages = await PrivateMessage.find({ ideaId: req.params.id })
      .populate('sender', 'name role')
      .populate('recipient', 'name role')
      .sort({ createdAt: 1 });

    const partnerMap = new Map();
    allMessages.forEach((msg) => {
      const partner = msg.sender._id.toString() === authorId ? msg.recipient : msg.sender;
      if (partner && partner._id.toString() !== authorId) {
        partnerMap.set(partner._id.toString(), partner);
      }
    });

    const partners = Array.from(partnerMap.values());
    const selectedPartnerId = req.query.partnerId || (partners.length > 0 ? partners[0]._id.toString() : null);

    const filteredMessages = selectedPartnerId
      ? allMessages.filter(
          (msg) =>
            (msg.sender._id.toString() === authorId && msg.recipient._id.toString() === selectedPartnerId) ||
            (msg.sender._id.toString() === selectedPartnerId && msg.recipient._id.toString() === authorId)
        )
      : [];

    res.json({
      success: true,
      isAuthor: true,
      partners,
      selectedPartnerId,
      messages: filteredMessages,
    });
  } catch (err) {
    console.error('Fetch private messages error:', err);
    res.status(500).json({ success: false, msg: 'Server error loading private messages' });
  }
});

// Send a private message
router.post('/:id/private-messages', auth, async (req, res) => {
  const { message, recipientId } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, msg: 'Message cannot be empty' });
  }

  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ success: false, msg: 'Idea not found' });
    }

    const currentUserId = req.user.id;
    const authorId = idea.createdBy.toString();
    const isAuthor = currentUserId === authorId;

    let targetRecipientId;
    if (isAuthor) {
      if (!recipientId) {
        return res.status(400).json({ success: false, msg: 'Recipient is required when replying as author' });
      }
      targetRecipientId = recipientId;
    } else {
      // Visitor chatting with author
      targetRecipientId = authorId;
    }

    const newMsg = new PrivateMessage({
      ideaId: req.params.id,
      sender: currentUserId,
      recipient: targetRecipientId,
      message: message.trim(),
    });

    await newMsg.save();
    const populated = await newMsg.populate('sender', 'name role');

    res.json({ success: true, message: populated });
  } catch (err) {
    console.error('Send private message error:', err);
    res.status(500).json({ success: false, msg: 'Server error sending private message' });
  }
});

module.exports = router;