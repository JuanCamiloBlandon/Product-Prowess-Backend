const followModel = require('../../infrastructure/models/followsModel');
const Follow = require('../../domain/entities/follow');
const { version } = require('mongoose');

class FollowService {
    async createFollow(followData, userId) {
        try {
            const {followedUserId} = followData;
            let verifyFollow;
            try {
                verifyFollow = await followModel.findOne({
                    userId: userId,
                    followedUserId: followedUserId
                })
            } catch (error) {
                throw new Error('The user you are trying to follow does not exist')
            }
            if (verifyFollow) {
                throw new Error('You are already following this user');
            }
    
            const follow = new Follow(userId, followedUserId);
            const newFollow = await followModel.create(follow);
            await newFollow.save();
            return newFollow;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteFollow(followData, userId) {
        try {
            const {followedUserId} = followData;
            let unfollow;
            try {
                unfollow =  await followModel.findOneAndDelete({
                    userId: userId,
                    followedUserId: followedUserId
                  });
            } catch (error) {
                throw new Error('You are not currently following this person')
            }
            if (!unfollow) {
                throw new Error('You are not currently following this person')
            }
            return unfollow
        } catch (error) {
            throw new Error(error);
        }
    }

    
}


module.exports = new FollowService();