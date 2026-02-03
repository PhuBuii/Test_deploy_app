const express = require('express');
const {
    register,
    login,
    getMe,
    logout,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

router.route('/users')
    .get(protect, authorize('admin', 'superadmin'), getUsers)
    .post(protect, authorize('admin', 'superadmin'), createUser);

router.route('/users/:id')
    .put(protect, authorize('admin', 'superadmin'), updateUser)
    .delete(protect, authorize('superadmin'), deleteUser);

module.exports = router;
