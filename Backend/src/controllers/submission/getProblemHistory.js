const Submission = require('../../models/Submission');
const getMyProblemHistory = async (req, res) => {


  const { problemId } = req.params;
  const { page = 1, limit = 5 } = req.query;
  try {
    const submissions = await Submission.find({ problemId })
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Submission.countDocuments({ problemId });
    res.json({ submissions, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getProblemHistory = async (req, res) => {

  const userId = req.user._id;  
  const { problemId } = req.params;
  const { page = 1, limit = 5 } = req.query;
  try {
    const submissions = await Submission.find({ problemId, user: userId })
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Submission.countDocuments({ problemId, user: userId });
    res.json({ submissions, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyProblemHistory, getProblemHistory };