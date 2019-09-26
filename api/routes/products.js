const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// 產生唯一值
const uuid = require('node-uuid');
const Product = require('../models/product');
const getDomain = require('../../utils/getDomain');
const path = require('path');
const sharp = require('sharp');
// multer -> body-parser 無法處理二進位以及 form-data 格式的 body，multer 是專門處理 form-data 的 middleware
const multerConfig = require('../../utils/multerConfig');
const upload = multerConfig();
// Query All
router.get('/', async (req, res, next) => {
    const {
        query: {
            limit
        }
    } = req;
    
    const intLimit = parseInt(limit)

    const field = `_id name price productImage`;

    try {
        const _products = (
            await Product
                .find()
                .select(field)
                .limit(intLimit)
                .exec()
        );
        
        if (!_products) {
            res
                .status(200)
                .json({
                    products: [],
                })
            return;
        }
        // if resource is empty will not return null or anything, it will return []
        res
            .status(200)
            .json({
                products: _products.map(_product => {
                    return {
                        ..._product._doc,
                        request: {
                            type: 'GET',
                            url: `${getDomain()}/products/${_product._id}`,
                        },
                    };
                }),
            })
    } catch (err) {
        res
            .status(500)
            .json({
                error: err,
            });
    }
});

// Query By ID
router.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    const field = '_id name price productImage';
    try {
        const _product = (
            await Product.findById(id)
                .select(field)
                .exec()
        );
        
        if (!_product) {
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
                product: _product,
            })

    } catch (err) {
        res
            .status(500)
            .json({
                error: err,
            })
    }
});

// Create
/**
* @param {string}  name
* @param {number}  price
 */
router.post('/', upload.single('productImage'), async (req, res, next) => {
    const {
        body: {
            name: productName,
            price: productPrice,
        },
        file,
    } = req;
    try {
        const originFile = file.originalname.replace(/.(jpg|jpeg|png|webp)/g,'');
        // 以 webp 方式壓縮
        await sharp(file.path)
            .webp({quality: 50})
            .toFile(
                path.resolve(__dirname,'../../uploads',`${ uuid.v1()}${originFile}.webp`)
            )

        const product = new Product({
            _id: mongoose.Types.ObjectId(),
            name: productName,
            price: productPrice,
            createTime: Date.now(),
            productImage: file.path,
        });
        
        const _product = await product.save();
        res
            .status(201)
            .json({
                message: 'Add Data Success',
                created: {
                    _id: _product._id,
                    name: _product.name,
                    price: _product.price,
                    productImage: _product.productImage,
                    request: {
                        type: 'GET',
                        url: `${getDomain()}/products/${_product._id}`,
                    },
                },
            })
    } catch (err){
        console.error(err);
        res
            .status(500)
            .json({
                error: err.message,
            })
    }
});

// Update
/**
 * @param {string} id
 * @param {string}  name
 * @param {number}  price
 */
router.put('/:productId', async (req, res, next) => {
    const {
        params: {
            productId: id,
        },
    } = req;

    try {
        const _product = (
            await Product
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
        );
        
        res
            .status(200)
            .json({
                updated: {
                    _id: id,
                    ...req.body,
                }
            });
    } catch (err) {
        res
            .status(500)
            .json({
                error: err,
            })
    }
});

// Delete
router.delete('/:productId', async (req, res, next) => {
    // const id = req.params.productId;
    const {
        params: {
            productId: id,
        }
    } = req;
    try {
        const result = (
            await  Product
                .deleteOne({
                    _id: id,
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