const Session = require('../models/Session');
const Sport = require('../models/Sport');
const User = require('../models/User');

// Generate Admin Report
exports.getReports = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const dateFilter = {};
    if (fromDate && toDate) {
      dateFilter.date = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      dateFilter.date = { $gte: fromDate };
    } else if (toDate) {
      dateFilter.date = { $lte: toDate };
    }

    // Fetch sessions matching date range
    const sessions = await Session.find(dateFilter)
      .populate('sport', 'name')
      .populate('players', 'name email');

    // 1. Total sessions in period
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.status === 'completed').length;
    const upcomingSessions = sessions.filter((s) => s.status === 'upcoming').length;
    const cancelledSessions = sessions.filter((s) => s.status === 'cancelled').length;

    // 2. Sport popularity (count of sessions and total players per sport)
    const sportStatsMap = {};

    sessions.forEach((sess) => {
      if (!sess.sport) return;
      const sportName = sess.sport.name;
      if (!sportStatsMap[sportName]) {
        sportStatsMap[sportName] = {
          sportId: sess.sport._id,
          sportName,
          sessionCount: 0,
          playerCount: 0,
        };
      }
      sportStatsMap[sportName].sessionCount += 1;
      sportStatsMap[sportName].playerCount += sess.players.length;
    });

    // Also include sports with 0 sessions so chart is complete
    const allSports = await Sport.find();
    allSports.forEach((sport) => {
      if (!sportStatsMap[sport.name]) {
        sportStatsMap[sport.name] = {
          sportId: sport._id,
          sportName: sport.name,
          sessionCount: 0,
          playerCount: 0,
        };
      }
    });

    const sportPopularity = Object.values(sportStatsMap).sort((a, b) => b.sessionCount - a.sessionCount);

    // 3. Registered Players & Games Breakdown
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const allUserSessions = await Session.find().populate('sport', 'name');

    const registeredPlayersOverview = users.map((u) => {
      const userSessions = allUserSessions.filter((s) =>
        s.players.some((p) => (p._id || p).toString() === u._id.toString())
      );

      const registeredSports = Array.from(
        new Set(userSessions.map((s) => s.sport?.name).filter(Boolean))
      );

      return {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        totalSessionsJoined: userSessions.length,
        registeredSports,
        sessions: userSessions.map((s) => ({
          id: s._id,
          sportName: s.sport?.name,
          date: s.date,
          time: s.time,
          venue: s.venue,
          status: s.status,
        })),
      };
    });

    res.status(200).json({
      fromDate: fromDate || null,
      toDate: toDate || null,
      totalSessions,
      completedSessions,
      upcomingSessions,
      cancelledSessions,
      totalPlayersCount: users.length,
      sportPopularity,
      registeredPlayersOverview,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report.', error: error.message });
  }
};
