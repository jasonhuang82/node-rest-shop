const express = require('express');
const router = express.Router();

// Query
router.get('/', (req, res, next) => {
    res
        .status(200)
        .json({
            status: 200,
            message: 'Order Data Success'
        })
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id === 'special') {
        res.status(200).json({
            status: 200,
            message: 'Order InCorrect ID',
        });
    } else {
        res.status(200).json({
            status: 200,
            message: 'Order  Correct ID',
        });
    }
});

// Create
router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity,
    };
    res
        .status(201)
        .json({
            status: 201,
            message: 'Add Order Data Success',
            order,
        })
});

// Update
router.put('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id === 'special') {
        res.status(200).json({
            message: 'Order patch InCorrect ID',
        });
    } else {
        res.status(200).json({
            message: 'Order patch Correct ID',
        });
    }
});

// Delete
router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id === 'special') {
        res.status(200).json({
            message: 'Order delete InCorrect ID',
        });
    } else {
        res.status(200).json({
            message: 'Order delete Correct ID',
        });
    }
});



module.exports = router;