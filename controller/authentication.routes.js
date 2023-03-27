const express = require("express");
const authRoutes = express.Router();
const bcrypt = require("bcrypt");
const { model } = require("../model/authModel");
const { tokenR } = require("../auth&auth/jwt");


authRoutes.post("/register", async (req, res) => {
    const { username, email, dob, password, role } = req.body;
    const preCheck = await model.findOne({ $or: [{ username }, { email }] });
    if (username && email && dob && password && role) {
        if (!preCheck) {
            try {
                const hashPass = await bcrypt.hash(password, 12);
                const userData = new model({ username, email, dob, role, password: hashPass });
                await userData.save();
                res.status(200).send({ msg: "User has been registered", status: "success" });
            } catch (e) {
                res.status(400).send({ msg: e.message });
            }
        } else {
            res.status(400).send({ msg: "User already present" });
        }
    } else {
        res.status(400).send({ msg: "Invalid format" });
    }
})

authRoutes.post("/login", async (req, res) => {
    const { username, email, password } = req.body;
    if ((username && password) || (email && password)) {
        try {
            const loginCheck = await model.findOne({ $or: [{ username }, { email }] });
            // User check
            if (loginCheck) {
                const token = tokenR(loginCheck.role);
                const compare = await bcrypt.compare(password, loginCheck.password);
                if (compare) {
                    res.status(200).send({ status: "success", msg: "User logged in", token, role: loginCheck.role });
                } else {
                    res.status(400).send({ msg: "Invalid password" });
                }
            } else {
                res.status(400).send({ msg: "User not found" });
            }
        } catch (e) {
            res.status(400).send({ msg: e.message });
        }
    } else {
        res.status(400).send({ msg: "Data type not found" });
    }
})


module.exports = { authRoutes };