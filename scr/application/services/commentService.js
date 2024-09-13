
const commentModel = require('../../infrastructure/models/commentsModel');
const Comment = require('../../domain/entities/comment');
const productsModel = require('../../infrastructure/models/productsModel');

class ProductsService {
    async createComment(productData, userId, productId) {
        try {
            const { content, rate} = productData;
            let existingProduct;
            try {
                existingProduct = await productsModel.findById(productId);
            } catch (error) {
                throw new Error('The product to be commented on does not exist');
            }

            
            const comment = new Comment(productId, userId, content, rate);
            const newComment = await commentModel.create(comment);
            await newComment.save();

            const comments = await commentModel.find({ productId });
            const totalRates = comments.reduce((acc, curr) => acc + curr.rate, 0);
            const rateAverage = totalRates / comments.length;
            existingProduct.rateAverage = rateAverage;
            await existingProduct.save();
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = new ProductsService();