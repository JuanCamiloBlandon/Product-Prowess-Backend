const { Router } = require('express');
const router = Router();

const {createComment, searchCommentsByIdProduct} = require('../controllers/commentsController');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         content: 
 *           type: string
 *           description: The content of the comment
 *         rate:
 *           type: number
 *           description: The rating of the product (from 1 to 5)
 *       required:
 *         - content
 *         - rate
 */

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   post:
 *     summary: Create a new comment for a product
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to comment on
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *           example:
 *             content: Excelente producto
 *             rate: 5
 *     responses:
 *       200:
 *         description: successfully created comment
 *       400:
 *         description: Bad request - missing or invalid parameters
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: The product to be commented on does not exist
 *       500:
 *         description: Something went wrong, please contact the admin
 */


router.post(
  '/comments/:id', 
  [
    check('content', 'content is mandatory').not().isEmpty(),
    check('rate', 'rate is mandatory').isNumeric().isIn([1,2,3,4,5]),
    validateFields
  ],
  createComment
);

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   get:
 *     summary: Get comments for a product by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve comments for
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: The product does not exist
 */


router.get(
  '/comments/:id', 
  searchCommentsByIdProduct
);

module.exports = router;