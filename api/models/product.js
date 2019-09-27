const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // productImage: {
    //     type: String,
    //     required: true,
    // },
    productImage: {
        jpg: {
            type: String,
            required: true,
        },
        webp: {
            type: String,
            required: true,
        }
    },
    createTime: Date,
});

module.exports = mongoose.model('Product', productSchema);