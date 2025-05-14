// server/models/ListItem.js
const mongoose = require('mongoose');

const ListItemSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  notes: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ListItem', ListItemSchema);