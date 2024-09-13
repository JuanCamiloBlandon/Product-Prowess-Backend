class Product {
    constructor(productName, description, url, tags, userId, category, image) {
        this.productName = productName;
        this.description = description;
        this.url = url;
        this.tags = tags;
        this.category = category;
        this.image = image;
        this.userId = userId;
        this.rateAverage = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = Product;