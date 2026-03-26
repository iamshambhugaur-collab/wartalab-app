const Conversation = require('../models/Conversation');

const getOrCreateConversation = async (userA, userB) => {
  const participants = [userA, userB];

  let conversation = await Conversation.findOne({
    participants: { $all: participants, $size: 2 }
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants });
  }

  return conversation;
};

module.exports = { getOrCreateConversation };
