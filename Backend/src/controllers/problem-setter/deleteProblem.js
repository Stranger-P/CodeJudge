const Problem = require('../../models/Problem');
const Submission = require('../../models/Submission');
const { deleteFromS3 } = require('../../utils/s3Utils');

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  try {
    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Access control: Only the creator or an admin/problem-setter can delete
    const userId = req.user.id;
    const userRole = req.user.role;
    const isOwner = problem.createdBy.toString() === userId;
    const isPrivileged = userRole === 'admin' || userRole === 'problem-setter';

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete test case file from S3
    if (problem.testCaseS3Url) {
      await deleteFromS3(problem.testCaseS3Url);
    }

    // Delete all submissions related to this problem
    await Submission.deleteMany({ problemId: id });

    // Delete the problem
    await Problem.deleteOne({ _id: id });

    res.json({ message: 'Problem and related submissions permanently deleted' });

  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = deleteProblem;
