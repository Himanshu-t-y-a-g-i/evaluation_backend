const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username: String,
    email: String,
    role: String,
    dob: String,
    password: String
})

const model = mongoose.model("user", schema);

module.exports = { model };