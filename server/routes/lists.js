// server/routes/lists.js
const express = require('express');
const {
  uploadList,
  getLists,
  getListsByAgent
} = require('../controllers/listController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLists);

router.route('/upload')
  .post(upload.single('file'), uploadList);

router.route('/agent/:agentId')
  .get(getListsByAgent);

module.exports = router;