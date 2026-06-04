const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');

const STORAGE_KEY = 'todoApp.items';

let todos = [];

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
    const saved = localStorage.getItem(STORAGE_KEY);
    todos = saved ? JSON.parse(saved) : [];
}

function createTodoElement(todo) {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;
    item.dataset.id = todo.id;

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = todo.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'toggle';
    toggle.textContent = todo.completed ? 'Undo' : 'Done';
    toggle.addEventListener('click', () => toggleTodo(todo.id));

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.textContent = 'Delete';
    remove.addEventListener('click', () => deleteTodo(todo.id));

    actions.append(toggle, remove);
    item.append(label, actions);
    return item;
}

function renderTodos() {
    list.innerHTML = '';

    if (todos.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-state';
        empty.textContent = 'No todos yet. Add one to get started.';
        list.append(empty);
        return;
    }

    todos.forEach(todo => {
        list.append(createTodoElement(todo));
    });
}

function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    todos.push({
        id: Date.now().toString(),
        text: trimmed,
        completed: false,
    });

    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
    );

    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

form.addEventListener('submit', event => {
    event.preventDefault();
    addTodo(input.value);
    input.value = '';
    input.focus();
});

loadTodos();
renderTodos();
