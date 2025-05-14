// server/routes/agents.js
const express = require('express');
const {
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAgents)
  .post(createAgent);

router.route('/:id')
  .get(getAgent)
  .put(updateAgent)
  .delete(deleteAgent);

module.exports = router;