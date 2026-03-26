const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { sendMessage, getConversationMessages } = require('../controllers/chatController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.resolve(__dirname, '../../uploads')),
  filename: (_, file, cb) => cb(null, `${uuidv4()}-${file.originalname.replace(/\s+/g, '_')}`)
});

const upload = multer({ storage });

router.get('/:peerId', auth, getConversationMessages);
router.post('/send', auth, upload.single('image'), sendMessage);

module.exports = router;
