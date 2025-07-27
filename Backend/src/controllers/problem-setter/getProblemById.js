const Problem = require('../../models/Problem');

const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id)
      .select('title statement inputFormat outputFormat difficulty tags sampleTestCases constraints createdAt acceptanceRate');
    if (!problem) return res.status(404).json({ message: 'Not found' });
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getProblemById;