const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single idea
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Cannot find idea' });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create one idea
router.post('/', async (req, res) => {
  const idea = new Idea({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category
  });

  try {
    const newIdea = await idea.save();
    res.status(201).json(newIdea);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one idea
router.delete('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Cannot find idea' });
    
    await idea.deleteOne();
    res.json({ message: 'Deleted Idea' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
