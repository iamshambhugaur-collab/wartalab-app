const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'image', 'sticker'],
      default: 'text'
    },
    content: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    sticker: { type: String, default: '' },
    clientTempId: { type: String, default: '' }
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
