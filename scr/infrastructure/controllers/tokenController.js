const { response } = require('express');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
    return token;
  };

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                reject(new Error('Invalid Token'));
            }
            resolve(decoded.id);
        });
    });
};

module.exports = {
    generateToken,
    verifyToken
  };