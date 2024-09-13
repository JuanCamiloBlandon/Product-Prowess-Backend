class Comment {
    constructor(productId, userId, content, rate) {
        this.productId = productId;
        this.userId = userId;
        this.content = content;
        this.rate = rate;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = Comment;