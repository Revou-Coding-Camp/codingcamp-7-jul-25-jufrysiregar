const todoInput = document.querySelector('.todo-text');
const todoDate = document.querySelector('.todo-date');
const addBtn = document.querySelector('.todo-add');
const todoTableBody = document.querySelector('.todo-table tbody');
const deleteAllBtn = document.querySelector('.todo-deleteall');
const filterBtn = document.querySelector('.todo-filter');

let todos = [];
let filtered = false;

// Muat data dari localStorage saat halaman dibuka
if (localStorage.getItem('todos')) {
  todos = JSON.parse(localStorage.getItem('todos'));
}

function formatDateDDMMYYYY(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoTableBody.innerHTML = '';
  let showTodos = todos;
  if (filtered) {
    showTodos = todos.filter(todo => !todo.done);
  }
  if (showTodos.length === 0) {
    todoTableBody.innerHTML = `<tr>
      <td colspan="4" class="todo-notask">No task found</td>
    </tr>`;
    return;
  }
  showTodos.forEach((todo, idx) => {
    const realIdx = todos.indexOf(todo);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${todo.text}</td>
      <td>${formatDateDDMMYYYY(todo.date)}</td>
      <td>${todo.done ? '<span style="color:#7effc9;font-weight:600;">Done</span>' : 'Pending'}</td>
      <td>
        <button class="action-btn" data-action="done" data-idx="${realIdx}">${todo.done ? 'Undo' : 'Done'}</button>
        <button class="action-btn" data-action="delete" data-idx="${realIdx}">Delete</button>
      </td>
    `;
    todoTableBody.appendChild(row);
  });
}

addBtn.addEventListener('click', function() {
  const text = todoInput.value.trim();
  const date = todoDate.value;
  if (!text || !date) return;

  const [year, month, day] = date.split("-");
  if (!year || year.length !== 4 || isNaN(Number(year))) {
    alert("Tahun harus 4 digit!");
    return;
  }

  todos.push({ text, date, done: false });
  todoInput.value = '';
  todoDate.value = '';
  saveTodos();      // simpan ke localStorage
  renderTodos();
});

deleteAllBtn.addEventListener('click', function() {
  todos = [];
  saveTodos();      // simpan ke localStorage
  renderTodos();
});

filterBtn.addEventListener('click', function() {
  filtered = !filtered;
  filterBtn.textContent = filtered ? "SHOW ALL" : "FILTER";
  renderTodos();
});

todoTableBody.addEventListener('click', function(e) {
  if (!e.target.matches('.action-btn')) return;
  const idx = Number(e.target.getAttribute('data-idx'));
  if (e.target.getAttribute('data-action') === 'done') {
    todos[idx].done = !todos[idx].done;
  } else if (e.target.getAttribute('data-action') === 'delete') {
    todos.splice(idx, 1);
  }
  saveTodos();      // simpan ke localStorage
  renderTodos();
});

renderTodos();