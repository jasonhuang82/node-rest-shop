const express = require('express');
const app = express();
const cors = require('cors');
// Log message at command line when node runtime
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.connect(
    `mongodb+srv://dbNodeShop:${process.env.MOBGO_ATLAS_PASSWORD}@node-rest-shop-aizvz.mongodb.net/test?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
    }
);
// Will parse request body params and set value in req.body
const bodyParser = require('body-parser');
const productsRouter = require('./api/routes/products');
const ordersRouter = require('./api/routes/orders');
// cors
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
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); 
//     res.header('Access-Control-Allow-Origin-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//         return res.status(200).json({});
//     }
//     // if you don't call next() node api flow will stop this
//     // because app.use is middleware, it will do something after action, like pipeline 
//     // So Don't call next() just like stop water flow here.
//     // So that it will cause api pedding, and then timeout.
//     next();
// });

// log
app.use(morgan('dev'));
// body-parse
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(bodyParser.json());

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
                message: error.message,
            }
        });
    console.log('final test')
});
module.exports = app;