const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const  generateAiReveiw  = require('../utils/generateAiResponse');

router.post("/ai-review", authMiddleware, async (req, res) => {
  const { problem, code } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({ 
      success: false,
      error: "Code cannot be empty"
    });
  }

  try {
    const aiResponse = await generateAiReveiw(problem, code);
    res.json({
      success: true,
      review: aiResponse
    });
  } catch (error) {
    console.error("Error generating AI review:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate AI review"
    });
  }
});

module.exports = router;
