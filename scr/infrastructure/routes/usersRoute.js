const { Router } = require('express');
const router = Router();

const { createUser, loginUser, updateUser , getUserDetails} = require('../controllers/usersController');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');

// User
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: JWT authentication token in authorization header with "Bearer" prefix
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *           description: the user name
 *         email:
 *           type: string
 *           format: email
 *           description: the user email
 *         password:
 *           type: string
 *           format: password
 *           description: the user password
 *         bio:
 *           type: string
 *           description: the user biography
 *         avatar:
 *           type: string
 *           description: the user avatar url
 *       required:
 *         - username
 *         - email
 *         - password
 *         - bio
 *       example:
 *         username: enrique
 *         email: enrique@email.com
 *         password: 123456
 *         avatar: https://example.com/avatar
 *         bio: vendedor antiguo con experiencia y productos de calidad
 */


/**
 * @swagger
 * /api/v1/users:
 *  post:
 *    summary: register user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200: 
 *        description: user registered
 *      409:
 *        description: User already exists
 *      400:
 *        description: the json body is poorly structured
 *      500: 
 *        description: Something went worng, please contact to admin
 */

router.post(
  '/users', 
  [
    check('username', 'Username is mandatory').not().isEmpty(),
    check('email', 'Email is mandatory').isEmail(),
    check('password', 'Password min length is 6').isLength({ min: 6 }),
    check('bio', 'Bio is mandatory').not().isEmpty(),
    validateFields
  ],
  createUser
);



/**
 * @swagger
 * /api/v1/auth/logIn:
 *   post:
 *     summary: Log In
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *           example:
 *               email: enrique@email.com
 *               password: "123456"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Wrong credentials
 *       500:
 *         description: Something went wrong, please contact the administrator
 *       400:
 *         description: the json body is poorly structured
 */

router.post(
  '/auth/logIn', 
  [
    check('email', 'Email is mandatory').isEmail(),
    check('password', 'Password is mandatory').not().isEmpty(),
    validateFields
  ],
  loginUser
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's new username
 *               bio:
 *                 type: string
 *                 description: The user's new biography
 *               avatar:
 *                 type: string
 *                 description: The user's new avatar URL
 *           example:
 *            username: Enrique Perez
 *            avatar: https://example.com/product
 *            bio: Vendedor de productos para el hogar
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: The json body is poorly structured
 *       400:
 *         description: User not found
 *       500:
 *         description: Something went wrong, please contact the administrator
 */


router.put(
  '/users/:id',
  [
    check('username', 'Username is mandatory').not().isEmpty(),
    check('bio', 'Bio is mandatory').not().isEmpty(),
    check('avatar').optional(),
    validateFields
  ],
  updateUser
);

router.get(
  '/users/:id',
  getUserDetails
);

module.exports = router;