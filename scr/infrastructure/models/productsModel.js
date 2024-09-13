const { Schema, model, Types: { ObjectId } } = require('mongoose');

const ProdutsSchema = Schema({
    productName: {
        type: String,
        require: true
    },

    description: {
        type: String,
        require: true
    },

    url: {
        type: String,
        require: true
    },

    tags: {
        type: [String],
        require: true
    },

    userId: {
        type: ObjectId,
        require: true
    },

    rateAverage: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        require: true
    },

    updatedAt: {
        type: Date,
        require: true
    },

    category: {
        type: String,
        require: true
    },

    image: {
        type: String,
        require: true
    }

});

module.exports = model('Products', ProdutsSchema);