const Problem = require('../../models/Problem');

const previewProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problem.findOne({ _id: id, isDeleted: false });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    if (problem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ problem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = previewProblem;