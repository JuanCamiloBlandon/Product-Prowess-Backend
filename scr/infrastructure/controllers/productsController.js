const { response } = require('express');
const Products = require('../models/productsModel');
const Follow = require('../models/followsModel');
const Users = require('../models/usersModel');
const productService = require('../../application/services/productService');
const { verifyToken } = require('./tokenController');
const { returnCommentsByIdProduct } = require('./commentsController');
const secret = process.env.SECRET;

const createProduct = async (req, res = response) => {
    const { productName, description, url, tags, category, image } = req.body;
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Missing Token'
            }
        });
    }

    try {
        token = token.split(' ')[1];
        const idUser = await verifyToken(token, secret);

        const productData = { productName, description, url, tags, category, image };
        const newProduct = await productService.createProduct(productData, idUser);

        res.status(200).json({
            ok: true,
            msg: 'Successfully created product',
            product: {
                id: newProduct.id, productName: newProduct.productName, description: newProduct.description, url: newProduct.url,
                tags: newProduct.tags, userId: newProduct.userId, rateAverage: newProduct.rateAverage, createdAt: newProduct.createdAt, 
                updatedAt: newProduct.updatedAt , category: newProduct.category, image: newProduct.image
              }
        });
    } catch (error) {
        if (error.message === 'Error: Product already exists') {
            return res.status(409).json({
                ok: false,
                error: {
                    message: 'Product already exists'
                }
            });
        }
        if (error.message === 'Invalid Token') {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid Token'
                }
            });
        }
        res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong, please contact the admin',
                details: error.message
            }
        });
        
    }
};

const updateProduct = async (req, res = response) => {
    const productId = req.params.id;
    const { productName, description, image } = req.body;
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Missing Token'
            }
        });
    }

    try {
        token = token.split(' ')[1];

        const userId = await verifyToken(token, secret);

        const productData = {productName, description, image};
        const updatedProduct = await productService.updateProduct(productData, productId, userId);

        res.status(200).json({
            ok: true,
            msg: {
                message: 'Successfully update product'
            }
        });


    } catch (error) {
        if (error.message === 'Error: The product you want to modify is not in your product list') {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'The product you want to modify is not in your product list'
                }
            });
        }
        
        if (error.message === 'Invalid Token') {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid Token'
                }
            });
        }
        res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong, please contact the admin',
            }
        });
    }
};

const deleteProduct = async (req, res = response) => {
    const productId = req.params.id;
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Missing Token'
            }
        });
    }

    try {
        token = token.split(' ')[1];
        const userId = await verifyToken(token, secret);
        const deleteProduct = await productService.deleteProduct(productId, userId);

        res.status(200).json({
            ok: true,
            msg: {
                message: 'Successfully delete product'
            }
        });


    } catch (error) {
        if (error.message === 'Error: The product you want to delete is not in your product list') {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'The product you want to delete is not in your product list'
                }
            });
        }
        if (error.message === 'Invalid Token') {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid Token'
                }
            });
        }
        res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong, please contact the admin',
            }
        });
        
    }
    
};

const searchProductById = async (req, res = response) => {
    const productId = req.params.id;
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Missing Token'
            }
        });
    }

    try {
        token = token.split(' ')[1];

        const idUser = await verifyToken(token, secret);
        let existingProduct = '';
        try {
            existingProduct = await Products.findOne({ _id: productId });
        } catch (error) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'The product you are trying to search for does not exist'
                }
            });
        }
        

        const user = await Users.findOne({ _id: idUser });
        const comments = await returnCommentsByIdProduct(productId);

        res.status(200).json({
            ok: true,
            msg: {
                _id: existingProduct._id,
                productName: existingProduct.productName,
                publishedBy: user.username,
                description: existingProduct.description,
                url: existingProduct.url,
                tags: existingProduct.tags,
                rateAverage: existingProduct.rateAverage,
                createdAt: existingProduct.createdAt,
                comments: comments
            }
        });


    } catch (error) {
        return res.status(401).json({
            ok: false,
            error: {
                message: error.message
            }
        });
    }



};

const searchProductsByTagOrName = async (req, res = response) => {
    const { searchKey } = req.query;

    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Missing Token'
            }
        });
    }

    try {
        token = token.split(' ')[1];
        const idUser = await verifyToken(token, secret);
        let products = ""
        if(!isNaN(searchKey)){
            products = await Products.find ({rateAverage: searchKey})
        }else{
            products = await Products.find({
                $or: [
                    { tags: { $in: [searchKey] } },
                    { productName: searchKey }, 
                ]
            });
        }


        if (!products || products.length === 0) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'No products found matching the search criteria'
                }
            });
        }

        res.json({
            ok: true,
            msg: {
                products: products
            }
        });

    } catch (error) {
        return res.status(401).json({
            ok: false,
            error: {
                message: error.message
            }
        });
    }
};

const searchRateAverageByProductId = async (req, res = response) => {
    const productId = req.params.id;
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Missing Token'
            }
        });
    }

    try {
        token = token.split(' ')[1];

        const idUser = await verifyToken(token, secret);
        let existingProduct = "";
        try {
            existingProduct = await Products.findOne({ _id: productId });
        } catch (error) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'The product you are trying to search for does not exist'
                }
            });
        }
         

        res.status(200).json({
            ok: true,
            msg: {
                rateAverage: existingProduct.rateAverage
            }
        });


    } catch (error) {
        return res.status(401).json({
            ok: false,
            error: {
                message: error.message
            }
        });
    }



};

const getAllProducts = async (req, res = response) => {
    const productId = req.params.id;
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Missing Token'
            }
        });
    }
    try {
        token = token.split(' ')[1];
        const idUser = await verifyToken(token, secret);

        const products = await Products.find({});


        res.status(200).json({
            ok: true,
            msg: {
                products: products
            }
        });


    } catch (error) {
        return res.status(401).json({
            ok: false,
            error: {
                message: error.message
            }
        });
    }
};

const getAllProductsPublic = async (req, res = response) => {
    try {
        const products = await Products.find({});

        
        const productsWithUsernames = await Promise.all(products.map(async (product) => {
            const user = await Users.findById(product.userId).select('username  avatar'); 
            return {
                ...product._doc, 
                publishedBy: user ? user.username : 'Desconocido',
                publishedByAvatar: user ? user.avatar: null
            };
        }));

        res.status(200).json({
            ok: true,
            msg: {
                products: productsWithUsernames
            }
        });
    } catch (error) {
        console.error('Error en getAllProductsPublic:', error);
        return res.status(500).json({
            ok: false,
            error: {
                message: error.message
            }
        });
    }
}


const getProductsWithFilters = async (req, res = response) => {
    const { name, tags, minRating, startDate, endDate } = req.body;
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Missing Token'
            }
        });
    }
    try {
        token = token.split(' ')[1];
        const idUser = await verifyToken(token, secret);
        let query = {};

        if (name) {
            query.productName = { $regex: name, $options: 'i' };
        }
        if (tags) {
            query.tags = { $in: tags };
        }
        if (minRating) {
            query.rateAverage = { $gte: minRating }; 
        }
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            query.createdAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.createdAt = { $lte: new Date(endDate) };
        }

        const products = await Products.find(query);

        res.status(200).json({
            ok: true,
            products
        });
    } catch (error) {
        if (error.message === 'Invalid Token') {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid Token'
                }
            });
        }
        res.status(500).json({
            ok: false,
            error: {
                message: 'Something went wrong, please contact the admin'
            }
        });
    }
};


module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    searchProductById,
    searchProductsByTagOrName,
    searchRateAverageByProductId,
    getAllProducts,
    getAllProductsPublic,
    getProductsWithFilters
};