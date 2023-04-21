const express = require('express');

const authen = require('../Controllers/auth')
//const adminAuth = require('.

const Announcement = require('../Models/announcement').Announcement;

export default{
   getAllAnnouncements: async (req, res) => {
      const { type = 'all' } = req.query;
      let platform;
    
      switch (req.userType) {
        case 'admin':
        case 'support':
          platform = req.query.platform || 'all';
          break;
        case 'seller':
          platform = 'business';
          break;
        default:
          platform = 'guest';
      }
    
      const filter = { platform };
    
      if (type !== 'all') {
        filter.type = type;
      }
    
      if (req.userType === 'seller') {
        filter.targetUser = req.userId;
      }
    
      Announcement.find(filter)
        .populate('targetUser', 'name')
        .populate('createdBy', 'name')
        .then((announcements) => {
          res.json({ announcements });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Server error' });
        });
    },
    
    // Add a new announcement
  addAnnouncement: async (req, res) => {

      const { message, type, targetUser = null } = req.body;
      const createdBy = req.userId;
    
      const announcement = new Announcement({ message, type, targetUser, createdBy });
    
      announcement
        .save()
        .then((newAnnouncement) => {
          res.json({ announcement: newAnnouncement });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Server error' });
        });
    },
    
    // Edit an announcement
     editAnnouncement: async(req, res) => {
      const { message, type, targetUser = null } = req.body;
      const createdBy = req.userId;
    
      Announcement.findOneAndUpdate(
        { _id: req.params.id },
        { message, type, targetUser, createdBy },
        { new: true }
      )
        .then((updatedAnnouncement) => {
          if (!updatedAnnouncement) {
            return res.status(404).json({ error: 'Announcement not found' });
          }
    
          res.json({ announcement: updatedAnnouncement });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Server error' });
        });
    },
    
    // Delete an announcement
    deleteAnnouncement:  async (req, res) => {

      Announcement.deleteOne({ _id: req.params.id })
      .then((result) => {
          if (result.deletedCount === 0) {
              return res.status(404).json({ error: 'Announcement not found' });
        }
        res.json({ message: 'Announcement deleted successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
      
     },
  };
  
  
  
  
  
  
  
  