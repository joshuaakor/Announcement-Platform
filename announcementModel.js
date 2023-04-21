const { allow } = require('joi');

const mongoose = require('mongoose');

const { Schema } = mongoose;

const announcementSchema = new Schema({
  id: { type: String, required: true },
  targetUser: { type: String, default: null },
  createdBy: { type: String, required: true },
  date: { type: Date, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['normal', 'important'], required: true },
  platform: { type: String, enum: ['business', 'marketplace', 'guest'], required: true }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

exports.Announcement = Announcement;




