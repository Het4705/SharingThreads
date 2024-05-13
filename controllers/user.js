const User = require("../models/users");
const products = require("../models/products");
const Orders = require("../models/orders");
const {
    setUser
} = require("../services/auth.js")


async function userSignInHandler(req, res) {
    const UserID = req.body.UserID;
    const password = req.body.password;

    try {
        const user = await User.findOne({
            UserID
        });

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                msg: "Incorrect password"
            });
        }

        const token = setUser(user);
        res.cookie("token", token);

        console.log("cookie-made")
        res.redirect('/products/getProducts');
    } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({
            msg: "Internal server error"
        });
    }

}

async function userSignUpHandler(req, res) {
    const body = req.body;

    try {

        if (!body.UserID || !body.password || !body.email) {
            return res.status(400).json({
                msg: "All fields are required."
            });
        }

        const existingUser = await User.findOne({
            $or: [{
                UserID: body.UserID
            }, {
                email: body.email
            }]
        });

        if (existingUser) {
            return res.status(400).json({
                msg: "UserID or email already exists."
            });
        }

        const result = await User.create({
            UserID: body.UserID,
            password: body.password,
            email: body.email
        });
        console.log(`Profile updated ${result}`)
        // Redirect to home page upon successful sign-up
        res.redirect('/products/getProducts');
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            msg: "Internal server error."
        });
    }


}


async function userProfileHandler(req, res) {
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
}

async function userRentRequest(req, res) {
    try {
        const productId = req.body.productId;
        const uId = req.user.uid;

        let order = await Orders.findOne({
            renterId: uId,
            productId: productId,
            status: "pending"
        });

        if (order) {
            res.redirect("/products/getProducts?order=true");
        } else {
            const product = await products.findOne({
                _id: productId
            });

            if (!product) {
                return res.status(404).json({
                    error: "Product not found"
                });
            }

            const ownerId = product.UserID;
            if (uId == ownerId) {
                return res.redirect("/products/getProducts?rentingOwnClothes=true");
            }

            const newOrder = await Orders.create({
                renterId: uId,
                productId: productId,
                ownerId: ownerId,
                status: "pending"
            });

            res.redirect("/");
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}






module.exports = {
    userProfileHandler,
    userSignInHandler,
    userSignUpHandler,
    userRentRequest
}