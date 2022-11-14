const express = require('express');
const { registerUser, login, sendOTP, updateUser, getUsers, userProfile } = require('./controller/controller');
const { authentication, authorization, verifyOtp } = require('./utils/authentication');
const route = express.Router();

route.post('/signup', registerUser);
route.post('/login', login);
route.post('/sendOTP', sendOTP);
route.post('/verifyOTP', verifyOtp);
route.get('/users', getUsers);
route.get('/profile/:userId', authentication, authorization, userProfile);
route.put('/update/:userId', authentication, authorization, updateUser);

module.exports = route;