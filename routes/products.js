const express = require('express');
const router = express.Router();
const products = require("../models/products");
const multer = require('multer');
const path = require('path');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Specify the destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Add unique identifier to avoid filename conflicts
        cb(null, req.body.UserID + '-' + req.body.productID + '-' + uniqueSuffix + path.extname(file.originalname)); // Construct filename
    }
});

const upload = multer({ storage: storage });

router.post("/add", upload.single('image'), async (req, res) => {
    const body = req.body;
    if (!body.UserID || !body.productID || !body.pname || !body.price || !body.stock || !body.details ||
        !body.size||!body.tags) {
        return res.status(400).json({
            msg: "All fields are required."
        });
    } else {
        try {
            const image_location = req.file ? '/images/' + req.file.filename : ''; // Construct image location
            const result = await products.create({
                UserID: body.UserID,
                pname: body.pname,
                productID: body.productID,
                price: body.price,
                image_location: image_location,
                stock: body.stock,
                details: body.details,
                size: body.size,
                tags: body.tags.split(',').map(tag => tag.trim()), 
            });
            console.log("result", result);
            return res.status(201).json({
                msg: "success"
            });
        } catch (error) {
            console.error("Error creating product:", error);
            return res.status(500).json({
                msg: "Internal server error."
            });
        }
    }
});

module.exports = router;
