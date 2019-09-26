const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const getDomain = require('../../utils/getDomain');
// Query
router.get('/', async (req, res, next) => {
    try {
        const {
            query: {
                limit = 0,
            }
        } = req;
        const intLimit = parseInt(limit);
        // - => 排除某個 field
        const _field = '-__v';
        const _orders = (
            await Order
                .find()
                .select(_field)
                // populate 將資料做相聯式擴充，比如像這裡式拿 product id 去取回整包 product Object 擴充回去
                // ([property select], [Allow field], [Others])
                .populate('product', '_id name price')
                .limit(intLimit)
                .exec()
        );
        if (!_orders) {
            res
                .status(200)
                .json({
                    orders: [],
                })
        }
        res
            .status(200)
            .json({
                orders: _orders.map(({ _doc }) => ({
                    ..._doc,
                    request: {
                        type: 'GET',
                        url: `${getDomain()}/orders/${_doc._id}`,
                    },
                })),
            })

    } catch (err) {
        res
            .status(500)
            .json({
                error: err,
            });
    }

});

router.get('/:orderId', async (req, res, next) => {
    const {
        params: {
            orderId,
        }
    } = req;

    const _field = '-__v';
    try {
        const _order = (
            await Order
                .findById(orderId)
                .select(_field)
                .populate('product', '_id name price')
                .exec()
        );
    
        if (!_order) {
            res
                .status(404)
                .json({
                    message: 'Order not found',
                });
        }
        res
            .status(200)
            .json({
                order: _order,
            });
    } catch (err) {
        res
            .status(500)
            .json({
                order: err,
            });
    }
});

// Create
router.post('/', async (req, res, next) => {
    // Check valid Product ID
    try {
        const _product = (
            await Product
                .findById(req.body.productId)
                .exec()
        );
    
        if (!_product) {
            res
                .status(404)
                .json({
                    error: `Product not found`,
                })
        }
    } catch (err) {
        res
            .status(500)
            .json({
                error: err,
            })
    }

    const {
        body: {
            productId,
            quantity,
        },
    } = req;
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity,
        product: productId,
    });

    try {
        const _order = await order.save();
        res
            .status(201)
            .json({
                created: {
                    _id: _order._id,
                    product: _order.product,
                    quantity: _order.quantity,
                }
            })
    } catch (err) {
        res
            .status(500)
            .json({
                errpr: err,
            })
    }
});

// Update
router.put('/:orderId', async (req, res, next) => {
    const {
        params: {
            orderId,
        }
    } = req;

    try {
        const _order = (
            await Order
                .update(
                    {
                        _id: orderId,
                    },
                    {
                        $set: {
                            ...req.body,
                        }
                    },
                )
                .exec()
        );
        
        res
            .status(200)
            .json({
                updated: {
                    _id: orderId,
                    ...req.body,
                }
            });
    } catch (err) {
        res
            .status(500)
            .json({
                error: err,
            });
    }
});

// Delete
router.delete('/:orderId', async (req, res, next) => {
    const {
        params: {
            orderId,
        }
    } = req;
    try {
        const result = (
            await Order
                .deleteOne({
                    _id: orderId,
                })
                .exec()
        );

        res
            .status(200)
            .json({
                count: result.deletedCount,
            })
    } catch (err) {
        res
            .status(500)
            .json({
                error: err,
            })
    }
});



module.exports = router;