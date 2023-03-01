/**
 * @swagger
 * tags:
 *   name: User
 *   description: User route
 */

import user from '../controllers/user'
import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:id', user.getUserById)

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update a user
 *     tags: [User]
 *     requestBody:
 *       description: User object to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user object supplied
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/', user.upadteUser)

export = router
