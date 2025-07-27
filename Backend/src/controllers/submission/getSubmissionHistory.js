const Submission = require('../../models/Submission');

const getSubmissionHistory = async (req, res) => {
  const { problemId } = req.params;

  try {
    const submissions = await Submission.find({ 
      userId: req.user.id,
      problemId 
    }).select('code language status submittedAt');
    
    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getSubmissionHistory;