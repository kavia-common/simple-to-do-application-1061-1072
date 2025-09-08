'use strict';
const express = require('express');
const { connectToDatabase } = require('../config/db');
const todosController = require('../controllers/todos');

const router = express.Router();

// Ensure MongoDB connection before handling any requests
router.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         title:
 *           type: string
 *           description: Title of the todo
 *         description:
 *           type: string
 *         completed:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         followersCount:
 *           type: integer
 *         followingCount:
 *           type: integer
 *         publicationsCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: List todos
 *     description: Returns a list of todos with optional filters and pagination.
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema: { type: boolean }
 *         description: Filter by completion (true/false)
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, in_progress, completed] }
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Text search in title and description
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 100 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     limit: { type: integer }
 *                     offset: { type: integer }
 */
router.get('/', todosController.list.bind(todosController));

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get todo by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: Todo id
 *     responses:
 *       200:
 *         description: Todo retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Not found
 */
router.get('/:id', todosController.getById.bind(todosController));

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               completed: { type: boolean }
 *               status: { type: string, enum: [pending, in_progress, completed] }
 *               dueDate: { type: string, format: date-time }
 *               priority: { type: string, enum: [low, medium, high] }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', todosController.create.bind(todosController));

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Replace a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               completed: { type: boolean }
 *               status: { type: string, enum: [pending, in_progress, completed] }
 *               dueDate: { type: string, format: date-time }
 *               priority: { type: string, enum: [low, medium, high] }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Replaced
 *       404:
 *         description: Not found
 */
router.put('/:id', todosController.replace.bind(todosController));

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Partially update a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               completed: { type: boolean }
 *               status: { type: string, enum: [pending, in_progress, completed] }
 *               dueDate: { type: string, format: date-time }
 *               priority: { type: string, enum: [low, medium, high] }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.patch('/:id', todosController.update.bind(todosController));

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', todosController.remove.bind(todosController));

module.exports = router;
