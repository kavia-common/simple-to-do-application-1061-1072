'use strict';
const { Schema, model } = require('mongoose');

/**
 * A Todo item schema.
 * Fields are inspired by MyProfile Figma style cues (labels, description, counts)
 * while keeping a clean, minimal structure for CRUD.
 */
const TodoSchema = new Schema(
  {
    // Basic info
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },

    // Completion / status
    completed: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },

    // Optional metadata
    dueDate: { type: Date, required: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    tags: { type: [String], default: [] },

    // Profile-like meta (counts that could be surfaced in UI if desired)
    followersCount: { type: Number, default: 0, min: 0 },
    followingCount: { type: Number, default: 0, min: 0 },
    publicationsCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = model('Todo', TodoSchema);
