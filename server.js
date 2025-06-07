const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터 파일 경로
const dataFilePath = path.join(__dirname, 'data', 'todos.json');

// 데이터 디렉토리가 없으면 생성
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// 데이터 파일이 없으면 빈 배열로 초기화
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 모든 Todo 항목 조회
app.get('/api/todos', (req, res) => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const todos = JSON.parse(data);
    res.json(todos);
  } catch (error) {
    console.error('Error reading todos:', error);
    res.status(500).json({ error: 'Failed to read todos' });
  }
});

// 특정 Todo 항목 조회
app.get('/api/todos/:id', (req, res) => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const todos = JSON.parse(data);
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    
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
app.post('/api/todos', (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const todos = JSON.parse(data);
    
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
    
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Todo 항목 수정
app.put('/api/todos/:id', (req, res) => {
  try {
    const { title, completed } = req.body;
    const todoId = parseInt(req.params.id);
    
    const data = fs.readFileSync(dataFilePath, 'utf8');
    let todos = JSON.parse(data);
    
    const todoIndex = todos.findIndex(t => t.id === todoId);
    
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    todos[todoIndex] = {
      ...todos[todoIndex],
      title: title !== undefined ? title : todos[todoIndex].title,
      completed: completed !== undefined ? completed : todos[todoIndex].completed,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
    
    res.json(todos[todoIndex]);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Todo 항목 삭제
app.delete('/api/todos/:id', (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    
    const data = fs.readFileSync(dataFilePath, 'utf8');
    let todos = JSON.parse(data);
    
    const todoIndex = todos.findIndex(t => t.id === todoId);
    
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const deletedTodo = todos[todoIndex];
    todos = todos.filter(t => t.id !== todoId);
    
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
    
    res.json(deletedTodo);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
