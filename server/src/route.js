const express = require('express');
const { createProduct, getProducts } = require('./controller/productController');
const { registerUser, login, sendOTP, updateUser, userProfile, getFavourites } = require('./controller/userController');
const { authentication, authorization, verifyOtp } = require('./utils/authentication');
const route = express.Router();

//todo user routes
route.post('/signup', registerUser);
route.post('/login', login);
route.post('/sendOTP', sendOTP);
route.post('/verifyOTP', verifyOtp);
route.get('/profile/:userId', authentication, authorization, userProfile);

//todo remove favourites by passing productId and product as false
route.put('/update/:userId', authentication, authorization, updateUser);


//todo product routes
route.post('/createProduct', createProduct);
route.get('/getProducts', getProducts);
route.get('/getFavourites/:userId', getFavourites);//todo getFavourites
module.exports = route;