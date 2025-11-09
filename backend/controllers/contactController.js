const { sendContactEmail, sendConfirmationEmail } = require('../utils/emailService');
const ContactMessage = require('../models/ContactMessage');

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
exports.sendContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Save message to database
    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message
    });
    
    await contactMessage.save();

    // Send email to admin
    await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Send confirmation email to customer
    await sendConfirmationEmail(email, name);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact/messages
// @access  Private/Admin
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({})
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages.',
    });
  }
};

// @desc    Get single contact message (Admin only)
// @route   GET /api/contact/messages/:id
// @access  Private/Admin
exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.'
      });
    }
    
    res.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message.',
    });
  }
};

// @desc    Reply to contact message (Admin only)
// @route   POST /api/contact/messages/:id/reply
// @access  Private/Admin
exports.replyToMessage = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const messageId = req.params.id;
    
    // Validation
    if (!replyMessage) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a reply message' 
      });
    }

    // Find the message
    const message = await ContactMessage.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.'
      });
    }

    // Update message with reply details
    message.replied = true;
    message.repliedAt = Date.now();
    message.repliedBy = req.user._id;
    message.replyMessage = replyMessage;
    
    await message.save();

    // Send reply email to customer
    const { sendReplyEmail } = require('../utils/emailService');
    await sendReplyEmail(message.email, message.name, replyMessage, message.subject);

    res.json({
      success: true,
      message: 'Reply sent successfully!',
      data: message
    });
  } catch (error) {
    console.error('Reply message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply. Please try again later.',
    });
  }
};