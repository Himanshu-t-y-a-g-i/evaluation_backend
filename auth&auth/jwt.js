const jwt = require("jsonwebtoken");

const tokenR = (role) => {
    const token = jwt.sign({ role }, "this is private", { expiresIn: "1h" })
    return token;
};

// Verification

const verifying = (token, role) => jwt.verify(token, "this is private", (err, decoded) => {
    if (err) {
        return { verify: false, err };
    } else {
        return { verify: true, role: decoded.role };
    }
})

module.exports = { verifying, tokenR };