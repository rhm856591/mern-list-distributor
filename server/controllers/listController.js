// server/controllers/listController.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const ListItem = require('../models/ListItem');
const Agent = require('../models/Agent');

// @desc    Upload and distribute list
// @route   POST /api/lists/upload
// @access  Private
exports.uploadList = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Get agents created by the current admin
    const agents = await Agent.find({ createdBy: req.user._id });
    
    if (agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No agents available for distribution'
      });
    }

    let data = [];
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Parse file based on extension
    if (fileExt === '.csv') {
      // Parse CSV
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          await processData(results, agents, req.user._id, res);
        });
      return;
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      // Parse Excel
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const results = xlsx.utils.sheet_to_json(worksheet);
      
      await processData(results, agents, req.user._id, res);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Process and distribute data
const processData = async (data, agents, adminId, res) => {
  try {
    // Validate data format
    for (const item of data) {
      if (!item.FirstName || !item.Phone) {
        return res.status(400).json({
          success: false,
          message: 'Invalid data format. FirstName and Phone fields are required'
        });
      }
    }

    // Distribute items among agents
    const agentCount = agents.length;
    const itemsPerAgent = Math.floor(data.length / agentCount);
    const remainder = data.length % agentCount;

    let currentIndex = 0;
    const distribution = {};

    // Initialize distribution object
    agents.forEach(agent => {
      distribution[agent._id] = [];
    });

    // Distribute items evenly
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      const itemsToAssign = i < remainder ? itemsPerAgent + 1 : itemsPerAgent;

      for (let j = 0; j < itemsToAssign; j++) {
        if (currentIndex < data.length) {
          distribution[agent._id].push(data[currentIndex]);
          currentIndex++;
        }
      }
    }

    // Save items to database
    const savedItems = [];
    for (const [agentId, items] of Object.entries(distribution)) {
      for (const item of items) {
        const listItem = await ListItem.create({
          firstName: item.FirstName,
          phone: item.Phone,
          notes: item.Notes || '',
          assignedTo: agentId,
          createdBy: adminId
        });
        savedItems.push(listItem);
      }
    }

    // Format response with distribution summary
    const distributionSummary = await ListItem.aggregate([
      {
        $match: { createdBy: adminId }
      },
      {
        $lookup: {
          from: 'agents',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'agent'
        }
      },
      {
        $unwind: '$agent'
      },
      {
        $group: {
          _id: '$assignedTo',
          agentName: { $first: '$agent.name' },
          agentEmail: { $first: '$agent.email' },
          items: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(201).json({
      success: true,
      data: distributionSummary
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error during data processing'
    });
  }
};

// @desc    Get all list items
// @route   GET /api/lists
// @access  Private
exports.getLists = async (req, res) => {
  try {
    const items = await ListItem.find({ createdBy: req.user._id })
                              .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get list items by agent
// @route   GET /api/lists/agent/:agentId
// @access  Private
exports.getListsByAgent = async (req, res) => {
  try {
    const items = await ListItem.find({ 
      assignedTo: req.params.agentId,
      createdBy: req.user._id 
    }).populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};