const { response } = require('express');
const jwt = require('jsonwebtoken');
const commentService = require('../../application/services/commentService');
const { verifyToken } = require('./tokenController');
const Comments = require('../models/commentsModel');
const Products = require('../models/productsModel');
const Users = require('../models/usersModel');
const secret = process.env.SECRET;

const createComment = async (req, res = response) => {
    const productId = req.params.id;
    const { content, rate} = req.body;
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
        const productData = { content, rate};
        const newComment = await commentService.createComment(productData, userId, productId);  

        res.status(200).json({
            ok: true,
            error: {
                message: 'successfully created comment'
            }
        });
    } catch (error) {
        if (error.message === 'Error: The product to be commented on does not exist') {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'The product to be commented on does not exist'
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
        console.log(error)
        res.status(500).json({
            ok: false,
            error: {
                message: error,
                message: 'Something went wrong, please contact the admin'
            }
        });
        
    }
};

const returnCommentsByIdProduct = async(IdProduct)=>{
    const comments = await Comments.find({productId: IdProduct});
    const namesUsers = [];
    for (let comment of comments) {
        const user = await Users.findOne({_id: comment.userId});
        namesUsers.push(user.username);
    }

    const formatedComments = comments.map((comment, index) => ({
        username: namesUsers[index],
        rate: comment.rate,
        content: comment.content,
        createdAt: comment.createdAt
    }));
    return formatedComments
}

const searchCommentsByIdProduct = async (req, res = response) => {
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

        let existingProduct;
        try {
            existingProduct = await Products.findById(productId);
        } catch (error) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'The product does not exist'
                }
            });
        }
        
        const comments = await returnCommentsByIdProduct(productId);

        res.status(200).json({
            ok: true,
            error: {
                comments: comments
            }
        });
    } catch (error) {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Invalid Token'
            }
        });
    }
}


module.exports = {
    createComment,
    returnCommentsByIdProduct,
    searchCommentsByIdProduct
};