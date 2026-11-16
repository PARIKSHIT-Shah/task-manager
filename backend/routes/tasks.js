const express = require('express');
const { body, validationResult } = require('express-validator');
const { Task, User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', authenticate, async (req, res) => {
  try {
    const where =
      req.user.role === 'admin'
        ? {}
        : { userId: Number(req.user.id) };

    const tasks = await Task.findAll({
      where,
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(tasks);
  } catch (err) {
    console.error('GET TASKS ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get task by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name', 'email'] }],
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (
      req.user.role !== 'admin' &&
      Number(task.userId) !== Number(req.user.id)
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    console.error('GET TASK ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create task
router.post(
  '/',
  authenticate,
  [body('title').notEmpty().withMessage('Title is required')],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, status } = req.body;

      const task = await Task.create({
        title,
        description,
        status: status || 'pending',
        userId: Number(req.user.id),
      });

      res.status(201).json(task);
    } catch (err) {
      console.error('CREATE TASK ERROR:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Update task
router.put('/:id', authenticate, async (req, res) => {
  try {
    console.log('Updating Task ID:', req.params.id);
    console.log('Logged User:', req.user);

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log('Task Found:', task.toJSON());

    if (
      req.user.role !== 'admin' &&
      Number(task.userId) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        error: 'Access denied',
        taskUserId: task.userId,
        loggedInUserId: req.user.id,
      });
    }

    const { title, description, status } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    await task.save();

    res.json(task);
  } catch (err) {
    console.error('UPDATE TASK ERROR:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// Delete task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (
      req.user.role !== 'admin' &&
      Number(task.userId) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        error: 'Access denied',
        taskUserId: task.userId,
        loggedInUserId: req.user.id,
      });
    }

    await task.destroy();

    res.json({
      message: 'Task deleted successfully',
    });
  } catch (err) {
    console.error('DELETE TASK ERROR:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;