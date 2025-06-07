const database = require('../config/database');

// Todo 모델
class Todo {
  constructor(data) {
    this.id = data.id || Date.now();
    this.title = data.title;
    this.completed = data.completed || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt;
  }
  
  // 모든 Todo 항목 조회
  static getAll() {
    return database.getAllTodos();
  }
  
  // 특정 Todo 항목 조회
  static getById(id) {
    return database.getTodoById(id);
  }
  
  // Todo 항목 생성
  static create(data) {
    const todo = new Todo(data);
    return database.createTodo(todo);
  }
  
  // Todo 항목 수정
  static update(id, updates) {
    updates.updatedAt = new Date().toISOString();
    return database.updateTodo(id, updates);
  }
  
  // Todo 항목 삭제
  static delete(id) {
    return database.deleteTodo(id);
  }
  
  // Todo 항목 유효성 검사
  static validate(data) {
    const errors = [];
    
    if (!data.title) {
      errors.push('Title is required');
    }
    
    if (data.title && data.title.length > 100) {
      errors.push('Title cannot be longer than 100 characters');
    }
    
    if (data.completed !== undefined && typeof data.completed !== 'boolean') {
      errors.push('Completed must be a boolean value');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = Todo;
