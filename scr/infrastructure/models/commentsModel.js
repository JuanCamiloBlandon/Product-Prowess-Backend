const { Schema, model, Types: { ObjectId } } = require('mongoose');

const CommentsSchema = Schema({
    productId: {
        type: ObjectId,
        require: true
    },

    userId: {
        type: ObjectId,
        require: true
    },

    content: {
        type: String,
        require: true
    },

    rate:{
        type: Number,
        require: true
    },

    createdAt: {
        type: Date,
        require: true
    },

    updatedAt: {
        type: Date,
        require: true
    },
});

module.exports = model('Comments', CommentsSchema);