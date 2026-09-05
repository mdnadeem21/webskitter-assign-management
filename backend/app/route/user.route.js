const express = require('express');
const uploadFile = require('../utils/fileUploadOnLocal');
const UserController = require('../controller/user.controller');
const { authenticateToken } = require('../middleware/auth.permission.check');
const router = express.Router();

router.post('/register/user',uploadFile.single('avatar'),UserController.registerUser)
router.post('/login/user',UserController.loginUser)
router.get('/get/all/users',UserController.getAllUsers)
router.get('/get/user/:id',UserController.getUserById)
router.put('/update/user/:id',UserController.getAllUsers)
router.get('/logout/user',authenticateToken,UserController.logoutUser)
router.put('/assign/user',UserController.changeUserRole)
router.put('/delete/user',UserController.archieveUser)
router.post('/reset-password/link',UserController.resetPasswordLink)
router.post('/reset-password/:id/:token',UserController.resetPassword)
router.post('/verify/otp',UserController.verifyOtp)



module.exports = router