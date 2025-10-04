class TodoApp {
    constructor() {
        this.todos = [];
        this.init();
    }

    init() {
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.todoCount = document.getElementById('todoCount');

        this.bindEvents();
        this.loadTodos();
    }

    bindEvents() {
        this.todoForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const title = this.todoInput.value.trim();
        
        if (!title) return;

        try {
            await this.addTodo(title);
            this.todoInput.value = '';
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('Failed to add todo. Please try again.');
        }
    }

    async loadTodos() {
        try {
            this.showLoading();
            const response = await fetch('/api/todos');
            
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            
            this.todos = await response.json();
            this.renderTodos();
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showError('Failed to load todos');
        }
    }

    async addTodo(title) {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error('Failed to add todo');
        }

        const newTodo = await response.json();
        this.todos.push(newTodo);
        this.renderTodos();
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: !todo.completed })
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();
            const index = this.todos.findIndex(t => t.id === id);
            this.todos[index] = updatedTodo;
            this.renderTodos();
        } catch (error) {
            console.error('Error toggling todo:', error);
            alert('Failed to update todo. Please try again.');
        }
    }

    async editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const newTitle = prompt('Edit todo:', todo.title);
        if (!newTitle || newTitle.trim() === '' || newTitle.trim() === todo.title) {
            return;
        }

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle.trim() })
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();
            const index = this.todos.findIndex(t => t.id === id);
            this.todos[index] = updatedTodo;
            this.renderTodos();
        } catch (error) {
            console.error('Error editing todo:', error);
            alert('Failed to edit todo. Please try again.');
        }
    }

    async deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            this.todos = this.todos.filter(t => t.id !== id);
            this.renderTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo. Please try again.');
        }
    }

    renderTodos() {
        this.updateTodoCount();

        if (this.todos.length === 0) {
            this.showEmptyState();
            return;
        }

        const todoItems = this.todos.map(todo => this.createTodoElement(todo));
        this.todoList.innerHTML = todoItems.join('');

        // Add event listeners
        this.todoList.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleTodo(e.target.dataset.id);
            });
        });

        this.todoList.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                this.editTodo(e.target.dataset.id);
            });
        });

        this.todoList.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                this.deleteTodo(e.target.dataset.id);
            });
        });
    }

    createTodoElement(todo) {
        const createdDate = new Date(todo.createdAt).toLocaleDateString();
        
        return `
            <li class="todo-item">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    data-id="${todo.id}" 
                    ${todo.completed ? 'checked' : ''}
                >
                <span class="todo-text ${todo.completed ? 'completed' : ''}" title="Created: ${createdDate}">
                    ${this.escapeHtml(todo.title)}
                </span>
                <div class="todo-actions">
                    <button class="btn-edit" data-id="${todo.id}">Edit</button>
                    <button class="btn-delete" data-id="${todo.id}">Delete</button>
                </div>
            </li>
        `;
    }

    updateTodoCount() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const remaining = total - completed;
        
        let countText = '';
        if (total === 0) {
            countText = 'No todos';
        } else if (total === 1) {
            countText = '1 todo';
        } else {
            countText = `${total} todos`;
        }
        
        if (completed > 0) {
            countText += ` (${remaining} remaining)`;
        }
        
        this.todoCount.textContent = countText;
    }

    showEmptyState() {
        this.todoList.innerHTML = `
            <li class="empty-state">
                <p>No todos yet!</p>
                <small>Add your first todo above to get started.</small>
            </li>
        `;
    }

    showLoading() {
        this.todoList.innerHTML = `
            <li class="loading">
                <p>Loading todos...</p>
            </li>
        `;
    }

    showError(message) {
        this.todoList.innerHTML = `
            <li class="empty-state">
                <p>⚠️ ${message}</p>
                <small>Please refresh the page to try again.</small>
            </li>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});