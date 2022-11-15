const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, trim: true, lowercase: true, unique: true, required: [true, "productName is mandatory"] },
    price: { type: Number, required: [true, "price is mandatory"] },
    status: { type: String, trim: true, default: 'Available', enum: ['Available', 'Out Of Stock'] },
    isDeleted: { type: String, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);