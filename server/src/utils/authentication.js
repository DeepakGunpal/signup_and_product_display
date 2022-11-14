const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const otpModel = require('../model/otpModel');
const userModel = require("../model/model");
require('dotenv/config');

//todo check whether user is registered or not
const authentication = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) throw new Error('Authentication failed login again');
        const decodedToken = jwt.verify(token, process.env.JWT_Secret_key,
            { algorithms: ['HS256'], ignoreExpiration: true });
        if (Date.now() > decodedToken.exp * 1000) {
            return res.status(401).send({ status: false, message: "Session expired login again" });
        }
        req.userId = decodedToken._id;
        next();
    } catch (error) {
        res.status(401).send({ status: false, message: error.message });
    }
}

//todo check user actions authority
const authorization = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await userModel.findById(mongoose.Types.ObjectId(userId));
        if (!user) throw new Error('You are not registered. signup now');
        if (req.userId !== user._id.toString()) throw new Error('Unauthorized access');
        next();
    } catch (error) {
        res.status(403).send({ status: false, message: error.message });
    }
}

const verifyOtp = async (req, res) => {
    try {
        if (!req.body.otp) return res.status(401).send({ status: false, message: 'Enter OTP' });
        const verifyOtp = await otpModel.verify(req.body);
        if (!verifyOtp) throw new Error('Incorrect OTP');
        const user = await userModel.findOne({ number: req.body.number, isDeleted: false });
        //generateTOken and setHeader
        const token = await userModel.generateToken(user);
        return res.status(200).send({ status: true, Token: token, data: user });
    } catch (error) {
        res.status(401).send({ status: false, message: error.message });
    }
}

module.exports = { authentication, authorization, verifyOtp };