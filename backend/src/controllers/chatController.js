const Message = require('../models/Message');
const { getOrCreateConversation } = require('../utils/conversation');

const createMessagePayload = ({ senderId, receiverId, type, content, imageUrl, sticker, clientTempId }) => ({
  senderId,
  receiverId,
  type: type || 'text',
  content: content || '',
  imageUrl: imageUrl || '',
  sticker: sticker || '',
  clientTempId: clientTempId || ''
});

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, type, content, sticker, clientTempId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'receiverId is required' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!content && !imageUrl && !sticker) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const conversation = await getOrCreateConversation(senderId, receiverId);

    const message = await Message.create({
      conversationId: conversation._id,
      ...createMessagePayload({ senderId, receiverId, type, content, imageUrl, sticker, clientTempId })
    });

    return res.status(201).json({ conversationId: conversation._id, message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const me = req.user.id;
    const { peerId } = req.params;

    const conversation = await getOrCreateConversation(me, peerId);

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({ conversationId: conversation._id, messages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getConversationMessages };
