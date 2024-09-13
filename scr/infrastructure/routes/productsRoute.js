const { Router } = require('express');
const router = Router();

const { createProduct, updateProduct, deleteProduct, searchProductById, searchProductsByTagOrName, 
        searchRateAverageByProductId,getAllProducts, getAllProductsPublic, searchProductsByDate, getProductsWithFilters} = require('../controllers/productsController');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productName: 
 *           type: string
 *           description: The product name
 *         description:
 *           type: string
 *           description: The product description
 *         url:
 *           type: string
 *           description: The product URL
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags associated with the product
 *       required:
 *         - productName
 *         - description
 *         - url
 *         - tags
 *       example:
 *        productName: "New Product"
 *        description: "Product Description"
 *        url: "https://example.com/product"
 *        tags: ["tag1", "tag2"]
 */

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             productName: Cafetera portatil
 *             description: Hersoma cafetera portatil, ligera y facil de usar
 *             url: https://example.com/product
 *             tags: ["Hogar", "Electrodomesticos"]
 *     responses:
 *       200:
 *         description: Successfully created product
 *       404:
 *         description: Product already exists
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Something went wrong, please contact the admin
 */

router.post(
  '/products',
  [
    check('productName', 'productName is mandatory').not().isEmpty(),
    check('description', 'description is mandatory').not().isEmpty(),
    check('url', 'url is mandatory').not().isEmpty(),
    check('tags', 'tags is mandatory').not().isEmpty(),
    check('category', 'category is mandatory').optional(),
    check('image').optional(),
    validateFields
  ],
  createProduct
);


/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             productName: Cafetera industrial
 *             description: Magnifica cafetera industrial
 *     responses:
 *       200:
 *         description: Successfully update product
 *       404:
 *         description: The product you want to modify is not in your product list
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Something went wrong, please contact the admin
 */

router.put(
  '/products/:id',
  [
    check('productName', 'productName is mandatory').not().isEmpty(),
    check('description', 'description is mandatory').not().isEmpty(),
    check('image').optional(),
    validateFields
  ],
  updateProduct
);


/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully delete product
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: The product you want to delete is not in your product list
 *       500:
 *         description: Something went wrong, please contact the admin
 */


router.delete(
  '/products/:id',
  deleteProduct
);



/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: The product you are trying to search for does not exist
 */

router.get(
  '/products/:id',
  searchProductById
);


/**
 * @swagger
 * /api/v1/searchProducts:
 *   get:
 *     summary: Search products by tag, qualification or name
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: searchKey
 *         required: true
 *         description: Tag, name or qualification to search for
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products found successfully
 *       400:
 *         description: Bad request - missing or invalid parameters
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: No products found matching the search criteria
 */


router.get(
  '/searchProducts',
  searchProductsByTagOrName
);


/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */

router.get(
  '/products',
  getAllProducts
);

/**
 * @swagger
 * /api/v1/products/searchRateAverage/{id}:
 *   get:
 *     summary: Get the average rate of a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve the average rate
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Average rate retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: The product you are trying to search for does not exist
 */

router.get(
  '/products/searchRateAverage/:id',
  searchRateAverageByProductId
);

/**
 * @swagger
 * /api/v1/product/getProductsWithFilters:
 *   post:
 *     summary: Get products based on search criteria
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               tags:
 *                 type: array
 *               minRating:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Date in format (YYYY-MM-DD)
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Date in format (YYYY-MM-DD)
 *             example:
 *              name:      "elec"
 *              tags:      ["Hogar"]
 *              minRating: 0
 *              startDate: "2024-05-10"
 *              "endDate": "2024-05-19"
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Something went wrong, please contact the admin
 */


router.post(
  '/product/getProductsWithFilters',
  getProductsWithFilters
);

module.exports = router;