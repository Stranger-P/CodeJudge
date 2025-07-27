const Problem = require('../../models/Problem');
const Submission = require('../../models/Submission');

const getProblems = async (req, res) => {
  const { page = 1, limit = 10, search, difficulty, tag, sort } = req.query;
  const filter = {};

  if (search) filter.title = { $regex: search, $options: 'i' };
  if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
  if (tag && tag !== 'all') filter.tags = tag;

  let query = Problem.find(filter);
  query = sort === 'oldest' ? query.sort({ createdAt: 1 }) : query.sort({ createdAt: -1 });

  const skip = (page - 1) * limit;
  const total = await Problem.countDocuments(filter);
  const problems = await query.skip(skip).limit(+limit).lean();

  const userStatuses = {};

  if (req.user) {
    const userId = req.user._id;
    const problemIds = problems.map(p => p._id);

    const submissions = await Submission.aggregate([
      {
        $match: {
          userId: userId,
          problemId: { $in: problemIds }
        }
      },
      {
        $group: {
          _id: '$problemId',
          statuses: { $addToSet: '$status' }
        }
      }
    ]);

    submissions.forEach(s => {
      const hasAccepted = s.statuses.includes('Accepted');
      userStatuses[s._id.toString()] = hasAccepted ? 'Accepted' : 'Pending';
    });
  }

  const data = problems.map(p => ({
    ...p,
    status: req.user ? (userStatuses[p._id.toString()] || 'Pending') : undefined,
    acceptanceRate: p.acceptanceRate || 100,
  }));

  res.json({ total, data });
};

module.exports = getProblems;
