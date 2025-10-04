const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for todos
let todos = [
  {
    id: uuidv4(),
    title: 'Learn Node.js',
    completed: false,
    category: 'learning',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Build a todo app',
    completed: false,
    category: 'project',
    priority: 'medium',
    createdAt: new Date().toISOString()
  }
];

// Available categories and priorities
const CATEGORIES = ['personal', 'work', 'learning', 'project', 'health', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

// Routes

// Get all todos
app.get('/api/todos', (req, res) => {
  res.status(200).json({
    message: 'Successfully fetched todos',
    count: todos.length,
    todos: todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      category: todo.category,
      priority: todo.priority,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    }))
  });
});

// Get todos statistics (must come before /:id route)
app.get('/api/todos/stats', (req, res) => {
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    byCategory: {},
    byPriority: {}
  };
  
  // Count by category
  CATEGORIES.forEach(cat => {
    stats.byCategory[cat] = todos.filter(t => t.category === cat).length;
  });
  
  // Count by priority
  PRIORITIES.forEach(pri => {
    stats.byPriority[pri] = todos.filter(t => t.priority === pri).length;
  });
  
  res.status(200).json({
    success: true,
    message: 'Successfully fetched todo statistics',
    stats
  });
});

// Get todos by category (must come before /:id route)
app.get('/api/todos/category/:category', (req, res) => {
  const { category } = req.params;
  
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category',
      availableCategories: CATEGORIES
    });
  }
  
  const filteredTodos = todos.filter(todo => todo.category === category);
  
  res.status(200).json({
    success: true,
    message: `Successfully fetched todos for category: ${category}`,
    count: filteredTodos.length,
    category,
    todos: filteredTodos
  });
});

// Get todos by priority (must come before /:id route)
app.get('/api/todos/priority/:priority', (req, res) => {
  const { priority } = req.params;
  
  if (!PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid priority',
      availablePriorities: PRIORITIES
    });
  }
  
  const filteredTodos = todos.filter(todo => todo.priority === priority);
  
  res.status(200).json({
    success: true,
    message: `Successfully fetched todos for priority: ${priority}`,
    count: filteredTodos.length,
    priority,
    todos: filteredTodos
  });
});

// Get a single todo by id
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) {
    return res.status(404).json({ 
      success: false,
      message: 'Todo not found',
      error: 'No todo exists with the provided ID'
    });
  }
  res.status(200).json({
    success: true,
    message: 'Successfully fetched todo',
    todo: {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      category: todo.category,
      priority: todo.priority,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    }
  });
});

// Create a new todo with validation
app.post('/api/todos', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .escape(), // Sanitize HTML entities
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  body('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('priority')
    .optional()
    .isIn(PRIORITIES)
    .withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`)
], (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }

  const { title, category = 'other', priority = 'medium' } = req.body;

  const newTodo = {
    id: uuidv4(),
    title: title.trim(),
    completed: false,
    category,
    priority,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  res.status(201).json({
    success: true,
    message: 'Todo successfully created',
    todo: {
      id: newTodo.id,
      title: newTodo.title,
      completed: newTodo.completed,
      createdAt: newTodo.createdAt
    }
  });
});

// Update a todo
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { title, completed } = req.body;
  
  if (title !== undefined) {
    if (title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    todo.title = title.trim();
  }
  
  if (completed !== undefined) {
    todo.completed = Boolean(completed);
  }

  todo.updatedAt = new Date().toISOString();
  res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === req.params.id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];
  res.json(deletedTodo);
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;