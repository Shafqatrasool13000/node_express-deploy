const express = require('express');
const { getAllUsers, getUserDetails, searchUser, updateUserStatus, updateUser } = require('../controllers/adminController');

const router = express.Router();

router.post('/user/getAllUsers', getAllUsers);
router.post('/user/getdetails', getUserDetails);
router.post('/user/search', searchUser);
router.post('/user/updateStatus', updateUserStatus);
router.post('/user/updateUser', updateUser);


module.exports = router;