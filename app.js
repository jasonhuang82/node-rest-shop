// env
// https://dwatow.github.io/2019/01-26-node-with-env-first/
const env = require('dotenv');
env.config();
const express = require('express');
const app = express();
const cors = require('cors');
// Log message at command line when node runtime
const morgan = require('morgan');
// MongoDB
const mongoose = require('mongoose');
mongoose.connect(
    `mongodb+srv://dbNodeShop:${process.env.MOBGO_ATLAS_PASSWORD}@node-rest-shop-aizvz.mongodb.net/test?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
    }
);

// bodyParser
// Will parse request body params and set value in req.body
const bodyParser = require('body-parser');

// Api Router
const productsRouter = require('./api/routes/products');
const ordersRouter = require('./api/routes/orders');

// CORS
const corsOptions = {
    // origin: [
    //     '*',
    //     'http://localhost:3000',
    // ],
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// log
app.use(morgan('dev'));
// body-parse
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(bodyParser.json());
// Api Router
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res
        .status(error.status || 500)
        .json({
            error: {
                status: error.status,
                message: error.message,
            }
        });
});
module.exports = app;