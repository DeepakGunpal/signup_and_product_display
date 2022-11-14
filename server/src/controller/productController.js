const productModel = require("../model/productModel");
const handleErrors = require("../utils/errorHandler");

const createProduct = async (req, res) => {
    try {
        if (req.body.price) req.body.price = parseInt(req.body.price);
        const product = await productModel.create(req.body);
        res.status(201).send({ status: true, data: product });
    } catch (error) {
        const err = handleErrors(error);
        res.status(400).send({ status: false, message: err });
    }
};

const getProducts = async (req, res) => {
    const products = await productModel.find();
    res.status(200).send({ status: true, data: products });
};

module.exports = { createProduct, getProducts };