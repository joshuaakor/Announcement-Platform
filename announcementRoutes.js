const express = require('express');
const router = express.Router();
const authMiddleware = require('../Controllers/auth');
const Announcement = require('../Models/announcement');


router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort('-date');
    res.send(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}, 10000);


router.post('/', authMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
    });
    res.send(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}, 10000);

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
      },
      { new: true }
    );
    if (!announcement)
      return res.status(404).send('The announcement with the given ID was not found.');
    res.send(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndRemove(req.params.id);
    if (!announcement)
      return res.status(404).send('The announcement with the given ID was not found.');
    res.send(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
