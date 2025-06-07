const request = require('supertest');
const fs = require('fs');
const path = require('path');

// 테스트용 데이터 파일 경로
const testDataFilePath = path.join(__dirname, '..', 'data', 'todos.json');

// 테스트 전에 서버 모듈을 직접 불러오지 않고 별도로 실행
// 이렇게 하면 각 테스트마다 서버를 재시작할 필요가 없음
const app = require('../server');

describe('Todo API', () => {
  // 각 테스트 전에 데이터 초기화
  beforeEach(() => {
    // 데이터 디렉토리가 없으면 생성
    if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'data'));
    }
    
    // 테스트용 데이터 초기화
    fs.writeFileSync(testDataFilePath, JSON.stringify([]));
  });
  
  // 모든 Todo 항목 조회 테스트
  test('GET /api/todos should return all todos', async () => {
    // 테스트 데이터 생성
    const testTodos = [
      { id: 1, title: '테스트 1', completed: false },
      { id: 2, title: '테스트 2', completed: true }
    ];
    fs.writeFileSync(testDataFilePath, JSON.stringify(testTodos));
    
    // API 요청
    const response = await request(app).get('/api/todos');
    
    // 응답 검증
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('테스트 1');
    expect(response.body[1].title).toBe('테스트 2');
  });
  
  // Todo 항목 생성 테스트
  test('POST /api/todos should create a new todo', async () => {
    // API 요청
    const response = await request(app)
      .post('/api/todos')
      .send({ title: '새로운 할 일' });
    
    // 응답 검증
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('새로운 할 일');
    expect(response.body.completed).toBe(false);
    
    // 데이터 파일 확인
    const data = JSON.parse(fs.readFileSync(testDataFilePath, 'utf8'));
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('새로운 할 일');
  });
  
  // Todo 항목 수정 테스트
  test('PUT /api/todos/:id should update a todo', async () => {
    // 테스트 데이터 생성
    const testTodos = [
      { id: 1, title: '수정 전', completed: false }
    ];
    fs.writeFileSync(testDataFilePath, JSON.stringify(testTodos));
    
    // API 요청
    const response = await request(app)
      .put('/api/todos/1')
      .send({ title: '수정 후', completed: true });
    
    // 응답 검증
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('수정 후');
    expect(response.body.completed).toBe(true);
    
    // 데이터 파일 확인
    const data = JSON.parse(fs.readFileSync(testDataFilePath, 'utf8'));
    expect(data[0].title).toBe('수정 후');
    expect(data[0].completed).toBe(true);
  });
  
  // Todo 항목 삭제 테스트
  test('DELETE /api/todos/:id should delete a todo', async () => {
    // 테스트 데이터 생성
    const testTodos = [
      { id: 1, title: '삭제할 항목', completed: false }
    ];
    fs.writeFileSync(testDataFilePath, JSON.stringify(testTodos));
    
    // API 요청
    const response = await request(app).delete('/api/todos/1');
    
    // 응답 검증
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('삭제할 항목');
    
    // 데이터 파일 확인
    const data = JSON.parse(fs.readFileSync(testDataFilePath, 'utf8'));
    expect(data).toHaveLength(0);
  });
});
