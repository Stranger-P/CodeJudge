// GET /api/problems/tags
const Problem = require('../../models/Problem');
const getTags = async (req, res) => {
  const tags = await Problem.distinct('tags')
  res.json(tags)
}

module.exports = getTags;
