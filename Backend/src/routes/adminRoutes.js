const express = require('express');
const { getUsers, updateUserRole } = require('../controllers/adminController.js');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();
router.get('/', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.send("you are admin");
})
router.get('/users', authMiddleware, roleMiddleware(['admin']), getUsers);
router.put('/users/role', authMiddleware, roleMiddleware(['admin']), updateUserRole);

module.exports = router;  