
const productsModel = require('../../infrastructure/models/productsModel');
const Product = require('../../domain/entities/produc');

class ProductsService {
    async createProduct(productData, userId) {
        try {
            const { productName, description, url, tags, category, image } = productData;
            const existingProduct = await productsModel.findOne({ productName, userId });

            if (existingProduct) {
                throw new Error('Product already exists');
            }

            const product = new Product(productName, description, url, tags, userId, category, image);
            const newProduct = await productsModel.create(product);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProduct(productData, productId, userId) {
        try {
            const { productName, description } = productData;
            try {
                const product = await productsModel.findOne({ _id: productId, userId: userId });
                product.updatedAt = new Date();
                product.productName = productName;
                product.description = description;
        
                await product.save();
                return product;
            } catch (error) {
                throw new Error('The product you want to modify is not in your product list');
            }
  
            

        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteProduct(productId, id) {
        try {
            let product
            try {
                product = await productsModel.findOne({ _id: productId, userId: id });
            } catch (error) {
                throw new Error('The product you want to delete is not in your product list')
            }
            
            if (!product) {
                throw new Error('The product you want to delete is not in your product list')
            }
    
            await productsModel.deleteOne({ _id: productId });

        } catch (error) {
            throw new Error(error);
        }
    }


}

module.exports = new ProductsService();