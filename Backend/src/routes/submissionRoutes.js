const express = require('express');
const { 
  runCode,
  submitSolution, 
  getSubmissionResult, 
  getSubmissionHistory ,
  getMyProblemHistory,
  getProblemHistory,
} = require('../controllers/submission');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { get } = require('mongoose');
const router = express.Router();

// Run code against sample or custom test cases
router.post('/run', 
authMiddleware, 
  roleMiddleware(['student', 'problem-setter', 'admin']), 
  runCode
);

// Submit code for full evaluation


router.post('/', 
  authMiddleware, 
  roleMiddleware(['student', 'problem-setter', 'admin']), 
  submitSolution
);

// Get submission result by ID
router.get('/result/:submissionId', 
  authMiddleware, 
  roleMiddleware(['student', 'problem-setter', 'admin']), 
  getSubmissionResult
);

// Get submission history for a problem
router.get('/history/:problemId', 
  authMiddleware, 
  roleMiddleware(['student', 'problem-setter', 'admin']), 
  getSubmissionHistory
);
router.get('/problem/:problemId',
//  authMiddleware,
 getProblemHistory
);
router.get('/problem/:problemId/mine',
//  authMiddleware,
  getMyProblemHistory
);
module.exports = router;