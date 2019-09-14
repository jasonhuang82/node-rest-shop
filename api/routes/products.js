const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

// Query All
router.get('/', (req, res, next) => {
    const {
        query: {
            limit
        }
    } = req;
    
    const intLimit = parseInt(limit)

    Product
        .find()
        .limit(intLimit)
        .exec()
        .then(_products => {
            console.log('_products',_products);
            // if resource is empty will not return null or anything, it will return []
            res
                .status(200)
                .json({
                    products: _products,
                })
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .json({
                    error: err,
                });
        })
});

// Query By ID
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(product => {
            if (product.legth === 0) {
                res
                    .status(200)
                    .json({
                        product: [],
                    })
                return;
            }
            res
                .status(200)
                .json({
                    product,
                })
        })
        .catch(err => {
            console.log('err', err)
            res
                .status(500)
                .json({
                    error: err,
                })
        })
});

// Create
router.post('/', (req, res, next) => {
    const paramsKeys = ['name', 'price'];
    for (let key of paramsKeys) {
        if (!(key in req.body)) {
            console.log(`${key} not give`);
            res
                .status(403)
                .json({
                    message: `${key} not give`
                })
            return;
        }
    }
    
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    product
        .save()
        .then(_product => {
            console.log('_product', _product);
            res
                .status(201)
                .json({
                    message: 'Add Data Success',
                    product: _product,
                })
        })
        .catch(err => {
            console.error('err', err);
            res
                .status(500)
                .json({
                    error: err,
                })
        })
});

// Update
router.put('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product
        .update(
            {
                _id: id,
            },
            {
                $set: {
                    ...req.body
                },
            }
        )
        .exec()
        .then(result => {
            res
                .status(200)
                .json({
                    result,
                });
        })
        .catch(err => {
            console.log(err)
            res
                .status(500)
                .json({
                    error: err
                })
        })
});

// Delete
router.delete('/:productId', (req, res, next) => {
    // const id = req.params.productId;
    const {
        params: {
            productId: id,
        }
    } = req;
    Product
        .remove({
            _id: id,
        })
        .exec()
        .then(result => {
            res
                .status(200)
                .json({
                    result,
                })
        })
        .catch(err => {
            console.log(err)
            res
                .status(500)
                .json({
                    error: err,
                })
        })
});



module.exports = router;