document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const tasksContainer = document.getElementById('tasksContainer');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }
    function renderTasks() {
        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>No tasks yet. Add a task to get started!</p>
                </div>
            `;
            return;
        }
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.completed ? 'completed' : ''}`;
            taskElement.setAttribute('data-id', task.id);

            taskElement.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn"><i class="fas fa-check"></i></button>
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
            tasksContainer.appendChild(taskElement);
            taskElement.addEventListener('dblclick', function () {
                toggleComplete(task.id);
            });
            taskElement.querySelector('.complete-btn').addEventListener('click', function () {
                toggleComplete(task.id);
            });
            taskElement.querySelector('.edit-btn').addEventListener('click', function () {
                editTask(task.id);
            });
            taskElement.querySelector('.delete-btn').addEventListener('click', function () {
                deleteTask(task.id);
            });
        });
    }
    function toggleComplete(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }
    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        const newText = prompt('Edit your task:', task.text);

        if (newText !== null && newText.trim() !== '') {
            tasks = tasks.map(t =>
                t.id === id ? { ...t, text: newText.trim() } : t
            );
            saveTasks();
            renderTasks();
        }
    }
    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }
    }
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
