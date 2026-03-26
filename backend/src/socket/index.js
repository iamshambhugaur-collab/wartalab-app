const User = require('../models/User');
const Message = require('../models/Message');
const { getOrCreateConversation } = require('../utils/conversation');

const setupSocket = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('presence:online', async ({ userId }) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { online: true, lastSeen: null });
      socket.broadcast.emit('presence:update', { userId, online: true });
    });

    socket.on('chat:send', async (payload) => {
      try {
        const { senderId, receiverId, content, type, imageUrl, sticker, clientTempId } = payload;
        const conversation = await getOrCreateConversation(senderId, receiverId);

        const message = await Message.create({
          conversationId: conversation._id,
          senderId,
          receiverId,
          content: content || '',
          type: type || 'text',
          imageUrl: imageUrl || '',
          sticker: sticker || '',
          clientTempId: clientTempId || ''
        });

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('chat:message', message);
        }

        socket.emit('chat:delivered', message);
      } catch (error) {
        socket.emit('chat:error', { message: error.message });
      }
    });

    socket.on('disconnect', async () => {
      const disconnectedUser = [...onlineUsers.entries()].find(([, socketId]) => socketId === socket.id);
      if (disconnectedUser) {
        const [userId] = disconnectedUser;
        onlineUsers.delete(userId);
        await User.findByIdAndUpdate(userId, { online: false, lastSeen: new Date() });
        socket.broadcast.emit('presence:update', { userId, online: false, lastSeen: new Date() });
      }
    });
  });
};

module.exports = setupSocket;
