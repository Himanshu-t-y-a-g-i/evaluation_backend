const express = require("express");
const { verifying } = require("../auth&auth/jwt");
const { model } = require("../model/prodModel");

const routes = express.Router();

routes.get("/", async (req, res) => {
    try {
        const query = req.query;
        let queryToSend = {};
        let limit = query.limit || 10;
        let skip;
        if (query.max && query.min) {
            queryToSend = { $and: [{ rating: { $gt: query.min } }, { rating: { $lt: query.max } }] };
        }
        // if (query.genre) {
        //     queryToSend = { ...queryToSend, genre: query.genre };
        // }
        // if (query.year_of_release) {
        //     queryToSend = { ...queryToSend, year_of_release: { $gt: query.year_of_release } };
        // }
        if (query.page) {
            if (query.limit) {
                limit = +query.limit;
            }
            skip = (+query.page - 1) * limit;
        }
        const products = await model.find(queryToSend).skip(skip).limit(limit);
        const length = await model.find();
        res.status(200).send({ msg: products, status: "success", data: length.length, limit });
    } catch (e) {
        res.status(400).send({ msg: e.message });
    }
})

routes.get("/:id", async (req, res) => {
    const { verify, role } = verifying(req.headers.token);
    if ((verify && role === "admin") || (verify && role === "seller") || (verify && role === "user")) {
        try {
            const id = req.params.id;
            const product = await model.findById(id);
            res.status(200).send({ msg: product, status: "success" });
        } catch (e) {
            res.status(400).send({ msg: e.message });
        }
    } else {
        res.status(400).send({ msg: "unauthorized user" });
    }
})

routes.post("/add", async (req, res) => {
    const { verify, role } = verifying(req.headers.token);
    if ((verify && role === "admin") || (verify && role === "seller")) {
        const { title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images } = req.body;
        if (title && description && price && discountPercentage && rating && stock && brand && category && thumbnail && images) {
            try {
                const newData = new model(req.body);
                await newData.save();
                res.status(200).send({ status: "success", msg: "product added" });
            } catch (e) {
                res.status(400).send({ msg: e.message });
            }
        } else {
            res.status(400).send({ msg: "invalid format" });
        }
    } else {
        res.status(400).send({ msg: "unauthorized user" });
    }
})

routes.patch("/update/:id", async (req, res) => {
    const { verify, role } = verifying(req.headers.token);
    if ((verify && role === "admin") || (verify && role === "seller")) {
        const { id } = req.params;
        const { title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images } = req.body;
        if (title || description || price || discountPercentage || rating || stock || brand || category || thumbnail || images) {
            try {
                await model.findByIdAndUpdate(id, req.body);
                res.status(200).send({ status: "success", msg: "product details updated" });
            } catch (e) {
                res.status(400).send({ msg: e.message });
            }
        } else {
            res.status(400).send({ msg: "data type not found" });
        }
    } else {
        res.status(400).send({ msg: "unauthorized user" });
    }
})

routes.delete("/delete/:id", async (req, res) => {
    const { verify, role } = verifying(req.headers.token);
    if ((verify && role === "admin") || (verify && role === "seller")) {
        const { id } = req.params;
        if (id && model.findById(id)) {
            try {
                await model.findByIdAndDelete(id);
                res.status(200).send({ status: "success", msg: "product deleted" });
            } catch (e) {
                res.status(400).send({ msg: e.message, header: req.headers });
            }
        } else {
            res.status(400).send({ msg: "product not found", header: req.headers })
        }
    } else {
        res.status(400).send({ msg: "unauthorized user", header: req.headers });
    }
})

module.exports = { routes };


// {
//     "title": "iPhone 9",
//     "description": "An apple mobile which is nothing like apple",
//     "price": 549,
//     "discountPercentage": 12.96,
//     "rating": 4.69,
//     "stock": 94,
//     "brand": "Apple",
//     "category": "smartphones",
//     "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
//     "images": [
//       "https://i.dummyjson.com/data/products/1/1.jpg",
//       "https://i.dummyjson.com/data/products/1/2.jpg",
//       "https://i.dummyjson.com/data/products/1/3.jpg",
//       "https://i.dummyjson.com/data/products/1/4.jpg",
//       "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
//     ]
// }