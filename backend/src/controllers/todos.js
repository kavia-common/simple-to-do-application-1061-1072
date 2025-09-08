'use strict';
const Todo = require('../models/todo');

/**
 * Controller for Todo CRUD operations.
 * Handles parsing, validation, and responses.
 */
class TodosController {
  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** Returns a paginated or full list of todos. Supports filters via query. */
    try {
      const { completed, status, tag, q, limit = 100, offset = 0 } = req.query;

      const query = {};
      if (typeof completed !== 'undefined') {
        query.completed = completed === 'true';
      }
      if (status) {
        query.status = status;
      }
      if (tag) {
        query.tags = tag;
      }
      if (q) {
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ];
      }

      const items = await Todo.find(query)
        .sort({ createdAt: -1 })
        .skip(Number(offset))
        .limit(Math.min(Number(limit), 500));

      const total = await Todo.countDocuments(query);

      return res.status(200).json({
        status: 'ok',
        data: items,
        meta: { total, limit: Number(limit), offset: Number(offset) },
      });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async getById(req, res, next) {
    /** Returns a single todo by id. */
    try {
      const { id } = req.params;
      const item = await Todo.findById(id);
      if (!item) {
        return res.status(404).json({ status: 'not_found', message: 'Todo not found' });
      }
      return res.status(200).json({ status: 'ok', data: item });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Creates a new todo item. */
    try {
      const payload = this._sanitizePayload(req.body);
      if (!payload.title) {
        return res.status(400).json({ status: 'bad_request', message: 'title is required' });
      }

      const created = await Todo.create(payload);
      return res.status(201).json({ status: 'created', data: created });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async replace(req, res, next) {
    /** Replaces an existing todo item (PUT semantics). */
    try {
      const { id } = req.params;
      const payload = this._sanitizePayload(req.body, { partial: false });
      if (!payload.title) {
        return res.status(400).json({ status: 'bad_request', message: 'title is required' });
      }

      const replaced = await Todo.findByIdAndUpdate(id, payload, { new: true, overwrite: true, runValidators: true });
      if (!replaced) {
        return res.status(404).json({ status: 'not_found', message: 'Todo not found' });
      }
      return res.status(200).json({ status: 'ok', data: replaced });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Partially updates a todo item (PATCH semantics). */
    try {
      const { id } = req.params;
      const payload = this._sanitizePayload(req.body, { partial: true });

      const updated = await Todo.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      if (!updated) {
        return res.status(404).json({ status: 'not_found', message: 'Todo not found' });
      }
      return res.status(200).json({ status: 'ok', data: updated });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Deletes a todo item. */
    try {
      const { id } = req.params;
      const deleted = await Todo.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ status: 'not_found', message: 'Todo not found' });
      }
      return res.status(200).json({ status: 'ok', data: deleted });
    } catch (err) {
      next(err);
    }
  }

  _sanitizePayload(body, options = { partial: false }) {
    const allowed = [
      'title',
      'description',
      'completed',
      'status',
      'dueDate',
      'priority',
      'tags',
      'followersCount',
      'followingCount',
      'publicationsCount',
    ];
    const out = {};
    for (const key of allowed) {
      if (typeof body[key] !== 'undefined') {
        out[key] = body[key];
      } else if (!options.partial) {
        // for replace we may want to set defaults; mongoose will handle defaults on overwrite
      }
    }
    return out;
  }
}

module.exports = new TodosController();
