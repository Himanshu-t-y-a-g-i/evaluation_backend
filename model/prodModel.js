const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: Array
})

const model = mongoose.model("product", schema);

module.exports = { model };