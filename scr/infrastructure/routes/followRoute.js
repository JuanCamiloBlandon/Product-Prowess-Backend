const { Router } = require('express');
const router = Router();

const { createFollow, deleteFollow, getFollowers, getFollowings} = require('../controllers/followController');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');

/**
 * @swagger
 * components:
 *   schemas:
 *     Follow:
 *       type: object
 *       properties:
 *         userId: 
 *           type: string
 *         followedUserId:
 *           type: string
 *       required:
 *         - followedUserId
 *       example:
 *        followedUserId: "6646a124ef7890f1ef568610"
 */

/**
 * @swagger
 * /api/v1/follow:
 *   post:
 *     summary: Create a new product
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Follow'
 *           example:
 *             followedUserId: "6646a124ef7890f1ef568610"
 *     responses:
 *       200:
 *         description: Successfully follow
 *       409:
 *         description: You are already following this user
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Something went wrong, please contact the admin
 */


router.post(
  '/follow',
  [
    check('followedUserId', 'followedUserId is mandatory').not().isEmpty(),
    validateFields
  ],
  createFollow
);

/**
 * @swagger
 * /api/v1/unfollow:
 *   delete:
 *     summary: Delete follow
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Follow'
 *           example:
 *             followedUserId: "6646a124ef7890f1ef568610"
 *     responses:
 *       200:
 *         description: Successfully delete follow
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       409:
 *         description: You are not currently following this person
 *       500:
 *         description: Something went wrong, please contact the admin
 */


router.delete(
    '/unfollow',
    [
      check('followedUserId', 'followedUserId is mandatory').not().isEmpty(),
      validateFields
    ],
    deleteFollow
  );

  /**
 * @swagger
 * /api/v1/followers/{id}:
 *   get:
 *     summary: Get all followers of a user by their id
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Followers retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: The user you are trying to search for does not exist
 */


  router.get(
    '/followers/:id',
    getFollowers
  );

/**
 * @swagger
 * /api/v1/followings/{id}:
 *   get:
 *     summary: Get all followings of a user by their id
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Followers retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: The user you are trying to search for does not exist
 */

  router.get(
    '/followings/:id',
    getFollowings
  );


module.exports = router;