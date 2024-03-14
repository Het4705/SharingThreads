const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { connectMongoDb } = require("./connection");
const userRouter = require("./routes/users");
const productsRouter = require("./routes/products");

const app = express();
const port = 8001;
const url = "mongodb://127.0.0.1:27017/sharingThreads";

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
// Set up views directory and view engine

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectMongoDb(url);

// Routes
app.use("/users", userRouter);
app.use("/products", productsRouter);

// Homepage route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

// Home route
app.get('/home', (req, res) => {
    return res.render('home'); 
});

// Add products route
app.get("/addProducts", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/products_entry.html'));
});

// Start server
app.listen(port, () => {+
    console.log(`Server is running on port ${port}`);
});
