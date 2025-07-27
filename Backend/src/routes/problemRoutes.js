const express = require('express');
const { uploadToS3 } = require('../utils/s3Utils');
const { 
  createProblem, 
  updateProblem, 
  deleteProblem, 
  previewProblem, 
  getProblems, 
  getProblemById ,
  getMyProblem,
  getTags,

} = require('../controllers/problem-setter');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
const upload = require('../utils/multerConfig');
const router = express.Router();
router.get('/tag', getTags);
router.post('/', 
  authMiddleware, 
  roleMiddleware(['problem-setter', 'admin']), 
  upload.single('testCaseFile'),
  createProblem
);
router.put('/:id', 
  authMiddleware, 
  roleMiddleware(['problem-setter', 'admin']),   
  upload.single('testCaseFile'), 
  updateProblem
);


router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['problem-setter', 'admin']), 
  deleteProblem
);
router.get('/preview/:id', 
  authMiddleware, 
  roleMiddleware(['problem-setter', 'admin']), 
  previewProblem
);
router.get('/mine', 
  authMiddleware, 
  roleMiddleware(['problem-setter', 'admin']), 
  getMyProblem
);
router.get('/', 
  optionalAuth, 
  // roleMiddleware(['student', 'problem-setter', 'admin']), 
  getProblems
);
router.get('/:id', 
  getProblemById
);

module.exports = router;