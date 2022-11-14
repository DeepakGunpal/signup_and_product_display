const userModel = require("../model/model");
const handleErrors = require("../utils/errorHandler");
const otpGenerator = require('otp-generator');
const fast2sms = require('fast-two-sms');
const otpModel = require('../model/otpModel');
const bcrypt = require('bcrypt');

//todo user signup
const registerUser = async (req, res) => {
    try {
        if (req.body.number && req.body.number.toString().length !== 10) throw new Error("Invalid number");
        const user = await userModel.create(req.body);
        res.status(201).send({ status: true, data: user });
    } catch (error) {
        const err = handleErrors(error);
        res.status(400).send({ status: false, message: err });
    }
}

//todo user login, generate token and set token as cookie
const login = async (req, res) => {
    try {
        if (!req.body.userName || !req.body.password) throw new Error("Invalid Credentials");
        const user = await userModel.login(req.body);
        if (!user) throw new Error('Invalid login credentials');
        const token = await userModel.generateToken(user);
        res.setHeader('Authorization', token);
        res.status(200).send({ status: true, Token: token, data: user });
    } catch (error) {
        res.status(401).send({ status: false, message: error.message });
    }
}


const sendOTP = async (req, res) => {
    try {
        if (!req.body.number || req.body.number.toString().length !== 10) throw new Error("Invalid number");
        const user = await userModel.findOne({ number: req.body.number, isDeleted: false });
        if (!user) throw new Error(`${req.body.number} is not registered.`);
        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });
        const number = parseInt(req.body.number);
        await otpModel.create({ number, otp });
        //todo send otp fia fast2sms
        let options = {
            authorization: process.env.FAST2SMS_AUTH_KEY,
            message: `${otp} is your OTP for user registration`,
            numbers: [number]
        }
        // console.log(options);
        fast2sms.sendMessage(options)
            .catch((err) => res.status(400).send({ status: false, message: err.message }));

        res.status(200).send({ status: true, message: 'otp sent successfully' });

    } catch (error) {
        res.status(400).send({ status: true, message: error.message });
    }
}


const updateUser = async (req, res) => {
    try {
        if (req.body.number && req.body.number.toString().length !== 10) throw new Error("Invalid number");
        req.body.number = parseInt(req.body.number);
        if (req.body.isDeleted) {
            req.body.deletedAt = new Date(Date.now()).toISOString();
        }
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await userModel.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });
        res.status(200).send({ status: true, data: updatedUser });
    } catch (error) {
        if (error.code === 11000) {
            error.message = `${Object.keys(error.keyValue)[0]} is not available`;
        }
        res.status(400).send({ status: false, message: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({ isDeleted: false });
        res.status(200).send({ status: true, count: users.length, data: users });
    } catch (error) {
        res.status(400).send({ status: false, message: error.message });
    }
}

const userProfile = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.userId, isDeleted: false });
        res.status(200).send({ status: true, data: user });
    } catch (error) {
        res.status(400).send({ status: false, message: error.message });
    }
}



module.exports = { registerUser, login, updateUser, sendOTP, getUsers, userProfile };