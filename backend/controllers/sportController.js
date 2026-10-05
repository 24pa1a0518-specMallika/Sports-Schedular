const Sport = require('../models/Sport');

// Get all sports
exports.getSports = async (req, res) => {
  try {
    const sports = await Sport.find().populate('createdBy', 'name email').sort({ name: 1 });
    res.status(200).json(sports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sports.', error: error.message });
  }
};

// Create a new sport (Admin only)
exports.createSport = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Sport name is required.' });
    }

    const existingSport = await Sport.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existingSport) {
      return res.status(400).json({ message: 'A sport with this name already exists.' });
    }

    const sport = await Sport.create({
      name: name.trim(),
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: 'Sport created successfully.',
      sport,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating sport.', error: error.message });
  }
};
