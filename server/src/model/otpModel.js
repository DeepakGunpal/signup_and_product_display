const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const otpSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } } //todo delete after 5 minutes

}, { timestamps: true })

//todo hash otp before saving
otpSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
});

//todo verify otp
otpSchema.statics.verify = async function ({ number, otp }) {
    const otps = await this.find({ number });
    if (otps.length === 0) throw new Error('Otp Expired');
    //todo verify the latest otp by taking last saved doc with provided number
    const lastOTP = otps[otps.length - 1];
    const verifyOtp = await bcrypt.compare(otp, lastOTP.otp);
    if (!verifyOtp || lastOTP.number !== parseInt(number)) throw new Error('Incorrect otp');
    await this.deleteMany({ number });
    return true;
}

module.exports = mongoose.model('otp', otpSchema);