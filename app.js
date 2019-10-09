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
mongoose.Promise = global.Promise;

// bodyParser
// Will parse request body params and set value in req.body
const bodyParser = require('body-parser');


// Api Router
const productsRouter = require('./api/routes/products');
const ordersRouter = require('./api/routes/orders');
const userRouter = require('./api/routes/user');

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
// 將圖片資料夾路徑，設成可以給外部存取，不然 Browser 會因為 Server 所有資料夾都是外部無法存取的所以讀不到圖片，Server 只看 Router 有
// 設定的路徑，這麼做也合理若 Browser 能透過 URL 就能讀取 Server 的資源那麼 Source Code ，還有像 .env 這種較隱私檔案就直接給人看光
//，解法是可以只將圖片資料夾設成可給外部存取的資源路徑。
app.use('/uploads', express.static('uploads'));
// body-parse
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(bodyParser.json());
// Api Router
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/user', userRouter);

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
});
module.exports = app;