const express = require('express');
const router = express.Router();
const User = require("../models/users");



router.post("/profile", async (req, res) => {
    const {
        UserID,
        name,
        city,
        gender
    } = req.body;

    if (!UserID || !name || !city || !gender) {
        return res.status(400).json({
            msg: "All fields are required."
        });
    }

    try {
        // Find the user by UserID
        let user = await User.findOne({
            UserID
        });

        // If the user doesn't exist, create a new user
        if (!user) {
            user = await User.create({
                UserID,
                name,
                city,
                gender
            });
            console.log("New user created:", user);
            return res.status(201).json({
                msg: "User created successfully"
            });
        }

        // If the user exists, append the profile information
        user.name = name;
        user.city = city;
        user.gender = gender;
        await user.save();

        console.log("Profile information appended to existing user:", user);
        return res.status(200).json({
            msg: "Profile information appended successfully"
        });
    } catch (error) {
        console.error("Error appending profile information:", error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
});

router.post("/signup", async (req, res) => {
    const body = req.body;

    try {
        const existingUser = await User.findOne({
            $or: [{ UserID: body.UserID }, { email: body.email }]
        });

        if (existingUser) {
            return res.status(400).json({ msg: "UserID or email already exists." });
        }

        if (!body.UserID || !body.password || !body.email) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        const result = await User.create({
            UserID: body.UserID,
            password: body.password,
            email: body.email
        });

        // Redirect to home page upon successful sign-up
        res.redirect('/home');
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ msg: "Internal server error." });
    }
});

router.post("/signin", async (req, res) => {
    const UserID = req.body.UserID;
    const password = req.body.password;

    try {
        const user = await User.findOne({ UserID });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ msg: "Incorrect password" });
        }

        // Redirect to home page upon successful sign-in
        res.redirect('/home');
    } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router;