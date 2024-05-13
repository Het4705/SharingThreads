const Products = require("../models/products.js")
const Orders = require("../models/orders.js");
const {
    json
} = require("body-parser");

async function profileProductsDisplay(req, res) {
    const userid = req.user.uid;
    offeredProducts = await Products.find({
        UserID: userid
    })
    res.render("profile", {
        Offered_products: offeredProducts,
        user: req.user
    })
}

async function displayOrders(req, res) {
    try {
        const orders = await Orders.find({
            renterId: req.user.uid
        });

        // Segregate product IDs and statuses
        const pIds = [];
        const statuses = [];
        orders.forEach(order => {
            pIds.push(order.productId);
            statuses.push(order.status);
        });

        // Find products based on the extracted product IDs
        const products = await Products.find({
            _id: { $in: pIds }
        });

        // Segregate products based on their status
        const segregatedProducts = {
            pending: [],
            completed: [],
            rejected: []
        };

        products.forEach((product, index) => {
            const status = statuses[index];
            switch (status) {
                case 'pending':
                    segregatedProducts.pending.push(product);
                    break;
                case 'completed':
                    segregatedProducts.completed.push(product);
                    break;
                case 'rejected':
                    segregatedProducts.rejected.push(product);
                    break;
                default:
                    break;
            }
        });

        res.render("renter_order",{segregatedProducts});
    } catch (error) {
        console.error("Error fetching orders:", error);
        const errorMessage = "Error displaying orders. Please try again later.";
        res.status(500).json({ error: errorMessage });
    }
}


module.exports = {
    profileProductsDisplay,
    displayOrders
}