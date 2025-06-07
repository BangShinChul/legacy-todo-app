const fs = require('fs');
const path = require('path');

// 데이터 파일 경로
const dataFilePath = path.join(__dirname, '..', 'data', 'todos.json');

// 데이터베이스 모듈
const database = {
  // 모든 Todo 항목 조회
  getAllTodos: () => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading todos:', error);
      return [];
    }
  },
  
  // 특정 Todo 항목 조회
  getTodoById: (id) => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const todos = JSON.parse(data);
      return todos.find(todo => todo.id === id) || null;
    } catch (error) {
      console.error('Error reading todo:', error);
      return null;
    }
  },
  
  // Todo 항목 생성
  createTodo: (todo) => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const todos = JSON.parse(data);
      
      todos.push(todo);
      fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
      
      return todo;
    } catch (error) {
      console.error('Error creating todo:', error);
      return null;
    }
  },
  
  // Todo 항목 수정
  updateTodo: (id, updates) => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      let todos = JSON.parse(data);
      
      const todoIndex = todos.findIndex(todo => todo.id === id);
      
      if (todoIndex === -1) {
        return null;
      }
      
      todos[todoIndex] = { ...todos[todoIndex], ...updates };
      fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
      
      return todos[todoIndex];
    } catch (error) {
      console.error('Error updating todo:', error);
      return null;
    }
  },
  
  // Todo 항목 삭제
  deleteTodo: (id) => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      let todos = JSON.parse(data);
      
      const todoIndex = todos.findIndex(todo => todo.id === id);
      
      if (todoIndex === -1) {
        return null;
      }
      
      const deletedTodo = todos[todoIndex];
      todos = todos.filter(todo => todo.id !== id);
      
      fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
      
      return deletedTodo;
    } catch (error) {
      console.error('Error deleting todo:', error);
      return null;
    }
  }
};

module.exports = database;
