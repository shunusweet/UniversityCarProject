
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    getRecentUsers
} = require('../controllers/userController.js');

// All routes are protected and require authentication
router.use(protect);

// Get all users in the same corporation
router.get('/getAllUsers',  getAllUsers);
// router.get('/getAllUsers', checkPermission('USERS Management', 'read'), getAllUsers);


// Get a single user by ID
// router.get('/getUserById/:userId',checkPermission('USERS Management', 'read'), getUserById);
router.get('/getUserById/:userId',getUserById);


// Create a new user
router.post('/createUser', checkPermission('USERS Management', 'create'), createUser);

// Update a user
router.put('/updateUser/:userId',  updateUser);
// router.put('/updateUser/:userId', checkPermission('USERS Management', 'update'), updateUser);


// Delete a user (soft delete)
router.delete('/deleteUser/:userId', checkPermission('USERS Management', 'delete'), deleteUser);

// Change user password
router.put('/changeUserPassword:userId/password', checkPermission('USERS Management', 'update'), changeUserPassword);

router.get("/getRecentUsers", getRecentUsers);

module.exports = router; 