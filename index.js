const express = require("express");
const { connection } = require("./config/db");
const { routes } = require("./controller/product.routes");
const cors = require("cors");
const { authRoutes } = require("./controller/authentication.routes");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Home page");
})
app.use("/user", authRoutes);
app.use("/products", routes);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (e) {
        console.log(e.message);
    }
    console.log(`Server is running at port ${process.env.port}`);
})