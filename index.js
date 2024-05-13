const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { connectMongoDb } = require("./connection");
const userRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const profileRouter = require("./routes/profile");
const cookieParser = require('cookie-parser');
const {checkUserAuthentication}= require("./middlewares/auth.js")


const app = express();
const port = 8001;
const url = "mongodb://127.0.0.1:27017/sharingThreads";

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("node_modules"));

// Set up views directory and view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Setting up cookie-parser
app.use(cookieParser());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectMongoDb(url);

// Routes
app.use("/users", userRouter);
app.use("/products", productsRouter);
app.use("/profile", profileRouter);

// Homepage route
app.get("/", (req, res) => {
      res.redirect("/products/getProducts");
});
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname, 'views/index.html'));
})
// Home route
app.get("/addProducts",checkUserAuthentication,(req, res) => {
    res.sendFile(path.join(__dirname, 'views/products_entry.html'));
});
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html'));
});
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/contact_us.html'));
});


// Add products route


// Start server
app.listen(port, () => {  
    console.log(`Server is running on port ${port}`);
});
