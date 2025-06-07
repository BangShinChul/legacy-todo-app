document.addEventListener('DOMContentLoaded', () => {
  // DOM 요소
  const todoInput = document.getElementById('todo-input');
  const addTodoBtn = document.getElementById('add-todo');
  const todoList = document.getElementById('todo-list');
  const todoCount = document.getElementById('todo-count');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // 현재 필터 상태
  let currentFilter = 'all';
  
  // 초기 데이터 로드
  fetchTodos();
  
  // 이벤트 리스너
  addTodoBtn.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });
  
  clearCompletedBtn.addEventListener('click', clearCompleted);
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      setFilter(filter);
      
      // 활성 버튼 스타일 변경
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // Todo 항목 가져오기
  function fetchTodos() {
    fetch('/api/todos')
      .then(response => response.json())
      .then(todos => {
        renderTodos(todos);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  }
  
  // Todo 항목 렌더링
  function renderTodos(todos) {
    // 필터링
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') {
        return !todo.completed;
      } else if (currentFilter === 'completed') {
        return todo.completed;
      }
      return true;
    });
    
    // 목록 초기화
    todoList.innerHTML = '';
    
    // 항목 추가
    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(todo.title)}</span>
        <button class="delete-todo" data-id="${todo.id}">×</button>
      `;
      
      // 체크박스 이벤트
      const checkbox = li.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => {
        toggleTodoCompleted(todo.id, checkbox.checked);
      });
      
      // 삭제 버튼 이벤트
      const deleteBtn = li.querySelector('.delete-todo');
      deleteBtn.addEventListener('click', () => {
        deleteTodo(todo.id);
      });
      
      todoList.appendChild(li);
    });
    
    // 남은 항목 수 업데이트
    const activeTodos = todos.filter(todo => !todo.completed);
    todoCount.textContent = `${activeTodos.length} 항목 남음`;
  }
  
  // Todo 항목 추가
  function addTodo() {
    const title = todoInput.value.trim();
    
    if (!title) {
      return;
    }
    
    fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    })
      .then(response => response.json())
      .then(() => {
        todoInput.value = '';
        fetchTodos();
      })
      .catch(error => {
        console.error('Error adding todo:', error);
      });
  }
  
  // Todo 항목 완료 상태 토글
  function toggleTodoCompleted(id, completed) {
    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    })
      .then(response => response.json())
      .then(() => {
        fetchTodos();
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  }
  
  // Todo 항목 삭제
  function deleteTodo(id) {
    fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        fetchTodos();
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  }
  
  // 완료된 항목 모두 삭제
  function clearCompleted() {
    fetch('/api/todos')
      .then(response => response.json())
      .then(todos => {
        const completedTodos = todos.filter(todo => todo.completed);
        
        // 완료된 항목을 순차적으로 삭제
        const deletePromises = completedTodos.map(todo => {
          return fetch(`/api/todos/${todo.id}`, {
            method: 'DELETE'
          });
        });
        
        return Promise.all(deletePromises);
      })
      .then(() => {
        fetchTodos();
      })
      .catch(error => {
        console.error('Error clearing completed todos:', error);
      });
  }
  
  // 필터 설정
  function setFilter(filter) {
    currentFilter = filter;
    fetchTodos();
  }
  
  // HTML 이스케이프 (XSS 방지)
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
