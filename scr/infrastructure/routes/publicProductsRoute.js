const { Router } = require('express');
const router = Router();

const { getAllProductsPublic } = require('../controllers/productsController');

router.get('/products/public', getAllProductsPublic);

module.exports = router;