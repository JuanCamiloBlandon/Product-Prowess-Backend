const users = require('../../domain/entities/user');
const userModel = require('../../infrastructure/models/usersModel');

class UserService {
    async createUsers(userData) {
        try {
            const { username, email, password, bio, avatarUrl } = userData;
            const user = new users(username, email, password, bio, avatarUrl);
            const newUser = await userModel.create(user);
            newUser.password = await newUser.encryptPassword(newUser.password);
            await newUser.save();
            return newUser;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateUsers(userId, userData) {
        try {
            const { username, bio, avatar } = userData;
    
            const user = await userModel.findById(userId);
    
            user.updatedAt = new Date();
    
            if (username) {
                user.username = username;
            }
            if (bio) {
                user.bio = bio;
            }
            if (avatar !== undefined) {
                user.avatar = avatar;
            }
    
            await user.save();
    
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    async loginUsers(email, password) {
        try {
            const user = await userModel.findOne({ email });

            if (!user) {
                throw new Error('You are not registered');
            }

            const validPassword = await user.comparePassword(password, user.password);

            if (!validPassword) {
                throw new Error('Wrong Credentials');
            }

            return {
                _id: user._id,
                email: user.email,
                password: user.password
            }

        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = new UserService();