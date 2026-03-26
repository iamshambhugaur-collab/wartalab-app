const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('_id username email avatar online lastSeen');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers };
