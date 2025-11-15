const express = require("express");
const authRouter = express.Router();
const authController = require ('./auth.controller')
const isUnauthorized = require("../../middleware/isUnauthorized");
const { upload } = require('../../middleware/upload.middleware');

authRouter.get('/', authController.home)
authRouter.post('/login', authController.loginUser)
authRouter.post('/registration',upload.single('image'), authController.registrationUser)
authRouter.post("/send-otp", authController.sendOTPEmail);
authRouter.post('/verify-otp', authController.verifyOTP);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.patch('/edit',isUnauthorized,upload.single('photo'), authController.editUserInfo);
authRouter.patch('/change-password',isUnauthorized, authController.changePassword);
authRouter.get('/AllUser', authController.getAllUsers);
authRouter.get('/user/:id', authController.getUserById);

authRouter.get('/all-items-available', authController.getAllAvailableItems);

module.exports = authRouter;