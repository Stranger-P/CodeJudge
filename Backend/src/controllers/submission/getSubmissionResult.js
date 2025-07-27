const Submission = require('../../models/Submission');

const getSubmissionResult = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const submission = await Submission.findOne({ _id: submissionId, userId: req.user.id });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({
        _id: submission._id,
        status: submission.status,
        runtime: submission.runtime,
        memory: submission.memory,
        failedTestCase: submission.failedTestCase,
        submittedAt: submission.submittedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getSubmissionResult;