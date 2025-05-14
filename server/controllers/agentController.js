// server/controllers/agentController.js
const Agent = require('../models/Agent');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Private
exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create agent
// @route   POST /api/agents
// @access  Private
exports.createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);

    res.status(201).json({
      success: true,
      data: agent
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private
exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    await agent.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};