const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, "firstName is mandatory"] },
    lastName: String,
    userName: { type: String, trim: true, lowercase: true, unique: true, required: [true, "userName is mandatory"] },
    number: { type: Number, unique: true, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, unique: true, required: [true, "email is mandatory"] },
    password: { type: String, required: [true, "password is mandatory"] },
    isDeleted: { type: String, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

//todo hash password before saving
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//todo user login
userSchema.statics.login = async function ({ userName, password }) {
    const user = await this.findOne({ userName });
    if (!user) throw new Error('User not found');
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) throw new Error("Incorrect Password");
    return user;
}

//todo generate jwt token
userSchema.statics.generateToken = async function (user) {
    const token = jwt.sign({
        _id: user._id,
        email: user.email
    }, process.env.JWT_Secret_key, { algorithm: 'HS256', expiresIn: '10m' });
    return token;
}

module.exports = mongoose.model('user', userSchema);