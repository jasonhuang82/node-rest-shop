const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        // Relation to Product
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    createTime: {
        type: Date,
        require: true,
        default: Date.now(),
    },
    updateTime: {
        type: Date,
        require: true,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Order', orderSchema);