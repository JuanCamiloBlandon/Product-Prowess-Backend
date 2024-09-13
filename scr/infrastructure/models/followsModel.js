const { Schema, model, Types: { ObjectId } } = require('mongoose');

const followSchema = Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    followedUserId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
});

module.exports = model('Follow', followSchema);