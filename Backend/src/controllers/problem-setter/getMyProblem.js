
const Problem = require('../../models/Problem');

// GET /api/problems/mine
 const getMyProblems = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      difficulty,
      tag,
      sort = 'newest',
    } = req.query

    const filter = {}
    if (search) {
      // text index on title/statement
      filter.$text = { $search: search }
    }
    if (difficulty) {
      filter.difficulty = difficulty
    }
    if (tag) {
      filter.tags = tag
    }

    const sortOption =
      sort === 'oldest'
        ? { createdAt: 1 }
        : { createdAt: -1 } // newest by default

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit)
    const [total, data] = await Promise.all([
      Problem.countDocuments(filter),
      Problem.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
    ])

    res.json({ total, data })
  } catch (err) {
    next(err)
  }
}

module.exports = getMyProblems;