const Session = require('../models/Session');
const Sport = require('../models/Sport');

// Get all sessions with filters
exports.getSessions = async (req, res) => {
  try {
    const { status, sport } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (sport) {
      filter.sport = sport;
    }

    const sessions = await Session.find(filter)
      .populate('sport', 'name')
      .populate('createdBy', 'name email')
      .populate('players', 'name email')
      .sort({ date: 1, time: 1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions.', error: error.message });
  }
};

// Get session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('sport', 'name')
      .populate('createdBy', 'name email')
      .populate('players', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session.', error: error.message });
  }
};

// Get sessions for current logged in user (as Creator OR Participant)
exports.getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      $or: [{ createdBy: userId }, { players: userId }],
    })
      .populate('sport', 'name')
      .populate('createdBy', 'name email')
      .populate('players', 'name email')
      .sort({ date: 1, time: 1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user sessions.', error: error.message });
  }
};

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const { sportId, date, time, venue, additionalPlayersRequired } = req.body;

    if (!sportId || !date || !time || !venue || additionalPlayersRequired === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const sportExists = await Sport.findById(sportId);
    if (!sportExists) {
      return res.status(404).json({ message: 'Selected sport not found.' });
    }

    const numAdditionalNeeded = parseInt(additionalPlayersRequired, 10);
    if (isNaN(numAdditionalNeeded) || numAdditionalNeeded < 0) {
      return res.status(400).json({ message: 'Additional players required must be a non-negative number.' });
    }

    // Check for conflicting session at the same date and time for creator
    const conflictingSession = await Session.findOne({
      players: req.user._id,
      date,
      time,
      status: 'upcoming',
    });

    if (conflictingSession) {
      return res.status(400).json({
        message: `Schedule Conflict: You are already registered for a session on ${date} at ${time}.`,
      });
    }

    // Creator is automatically included as a participant
    const session = await Session.create({
      sport: sportId,
      createdBy: req.user._id,
      players: [req.user._id],
      additionalPlayersRequired: numAdditionalNeeded,
      date,
      time,
      venue: venue.trim(),
      status: 'upcoming',
    });

    const populatedSession = await Session.findById(session._id)
      .populate('sport', 'name')
      .populate('createdBy', 'name email')
      .populate('players', 'name email');

    res.status(201).json({
      message: 'Session created successfully.',
      session: populatedSession,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session.', error: error.message });
  }
};

// Join an existing session
exports.joinSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    if (session.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot join a cancelled session.' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Cannot join a completed session.' });
    }

    // Check if user is already joined
    const isAlreadyJoined = session.players.some((p) => p.toString() === userId.toString());
    if (isAlreadyJoined) {
      return res.status(400).json({ message: 'You have already joined this session.' });
    }

    // Check if session is full
    if (session.additionalPlayersRequired <= 0) {
      return res.status(400).json({ message: 'This session is already full.' });
    }

    // Check for conflicting session at the same date and time
    const conflictingSession = await Session.findOne({
      players: userId,
      date: session.date,
      time: session.time,
      status: 'upcoming',
    });

    if (conflictingSession) {
      return res.status(400).json({
        message: `Schedule Conflict Warning: You are already signed up for a match on ${session.date} at ${session.time}. You cannot join multiple sessions at the same date and time.`,
      });
    }

    // Add player and decrement required count
    session.players.push(userId);
    session.additionalPlayersRequired -= 1;
    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate('sport', 'name')
      .populate('createdBy', 'name email')
      .populate('players', 'name email');

    res.status(200).json({
      message: 'You joined the session successfully.',
      session: updatedSession,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error joining session.', error: error.message });
  }
};

// Cancel a session (Only creator can cancel)
exports.cancelSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { cancellationReason } = req.body;

    if (!cancellationReason || !cancellationReason.trim()) {
      return res.status(400).json({ message: 'Cancellation reason is required.' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    // Verify creator (or Admin)
    const isCreator = session.createdBy.toString() === req.user._id.toString();
    if (!isCreator && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You can only cancel sessions created by you.' });
    }

    session.status = 'cancelled';
    session.cancellationReason = cancellationReason.trim();
    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate('sport', 'name')
      .populate('createdBy', 'name email')
      .populate('players', 'name email');

    res.status(200).json({
      message: 'Session cancelled successfully.',
      session: updatedSession,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling session.', error: error.message });
  }
};
