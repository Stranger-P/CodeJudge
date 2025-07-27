// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const authMiddleware = require('../middleware/authMiddleware');
router.get('/stats', authMiddleware, async (req, res) => {
  // console.log("dashboard stats endpoint hit");
  try {
    const userId = req.user._id;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Fetch submissions for the user and year
    const submissions = await Submission.find({
      userId,
      submittedAt: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31, 23, 59, 59),
      },
    })
      .populate('problemId', 'title difficulty category acceptanceRate')
      .sort({ submittedAt: -1 });

    // Aggregate submissions by date for heatmap
    const heatmapData = {};
    submissions.forEach(sub => {
      const dateStr = new Date(sub.submittedAt).toISOString().split('T')[0];
      heatmapData[dateStr] = (heatmapData[dateStr] || 0) + 1;
    });
    
    // Calculate problems solved
    const solvedProblems = [...new Set(
      submissions
        .filter(sub => sub.status === 'Accepted')
        .map(sub => sub.problemId._id.toString())
    )];
    // console.log(solvedProblems);
    // Calculate acceptance rate
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(sub => sub.status === 'Accepted').length;
    const acceptanceRate = totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) : '0.0';

    // Calculate difficulty breakdown
    const difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
    solvedProblems.forEach(problemId => {
      const problem = submissions.find(sub => sub.problemId._id.toString() === problemId).problemId;
      difficultyBreakdown[problem.difficulty]++;
    });
    // console.log('hello');
    // console.log(solvedProblems);
    // Calculate streaks
    const sortedDates = [...new Set(
      submissions
        .filter(sub => sub.status === 'Accepted')
        .map(sub => new Date(sub.submittedAt).toDateString())
    )].sort((a, b) => new Date(a) - new Date(b));

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    for (const date of sortedDates) {
      const currentDate = new Date(date);
      if (lastDate) {
        const diffDays = (currentDate - new Date(lastDate)) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      currentStreak = tempStreak;
      maxStreak = Math.max(maxStreak, tempStreak);
      lastDate = date;
    }
    console.log("every thing working fine");
    res.json({
      problemsSolved: solvedProblems.length,
      difficultyBreakdown,
      acceptanceRate,
      currentStreak,
      maxStreak,
      submissions,
      heatmapData, // Daily submission counts
    });
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
});

router.get('/recommended', authMiddleware, async (req, res) => {
  // console.log("dashboard recommended endpoint hit");
  try {
    const userId = req.user._id;
    const submissions = await Submission.find({ userId }).select('problemId');
    const solvedProblemIds = [...new Set(submissions.map(sub => sub.problemId.toString()))];

    const recommendedProblems = await Problem.find({
      _id: { $nin: solvedProblemIds },
    })
      .limit(10)
      .select('title difficulty category acceptanceRate');

    res.json(recommendedProblems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;