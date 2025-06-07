const express = require('express');
const Todo = require('../models/todo');

const router = express.Router();

// 모든 Todo 항목 조회
router.get('/todos', (req, res) => {
  try {
    const todos = Todo.getAll();
    res.json(todos);
  } catch (error) {
    console.error('Error reading todos:', error);
    res.status(500).json({ error: 'Failed to read todos' });
  }
});

// 특정 Todo 항목 조회
router.get('/todos/:id', (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todo = Todo.getById(todoId);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error('Error reading todo:', error);
    res.status(500).json({ error: 'Failed to read todo' });
  }
});

// Todo 항목 생성
router.post('/todos', (req, res) => {
  try {
    const { title } = req.body;
    
    // 유효성 검사
    const validation = Todo.validate({ title });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    const newTodo = Todo.create({ title });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Todo 항목 수정
router.put('/todos/:id', (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const { title, completed } = req.body;
    
    // 유효성 검사
    const validation = Todo.validate({ title, completed });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    const updatedTodo = Todo.update(todoId, { title, completed });
    
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Todo 항목 삭제
router.delete('/todos/:id', (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const deletedTodo = Todo.delete(todoId);
    
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(deletedTodo);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
