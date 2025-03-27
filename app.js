document.addEventListener('DOMContentLoaded', () => {
    console.log('app.js loaded');

    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoListUL = document.getElementById('todo-list');
    const notesInput = document.getElementById('task-notes');
    const priorityInput = document.getElementById('task-priority');
    const timeInput = document.getElementById('task-time');
    const statusInput = document.getElementById('task-status');
    const toggleDetails = document.getElementById('toggle-details');
    const formDetails = document.querySelector('.form-details');

    if (!todoForm || !todoInput || !addButton || !todoListUL || !notesInput || !priorityInput || !timeInput || !statusInput || !toggleDetails || !formDetails) {
        console.error('Missing DOM elements:', {
            todoForm: !!todoForm,
            todoInput: !!todoInput,
            addButton: !!addButton,
            todoListUL: !!todoListUL,
            notesInput: !!notesInput,
            priorityInput: !!priorityInput,
            timeInput: !!timeInput,
            statusInput: !!statusInput,
            toggleDetails: !!toggleDetails,
            formDetails: !!formDetails
        });
        return;
    }
    console.log('DOM elements found');

    let allTodos = getTodos();
    console.log('Initial todos:', allTodos);
    updateTodoList();

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    });

    addButton.addEventListener('click', (e) => {
        e.preventDefault();
        addTodo();
    });

    toggleDetails.addEventListener('click', () => {
        formDetails.style.display = formDetails.style.display === 'none' ? 'block' : 'none';
        toggleDetails.textContent = formDetails.style.display === 'none' ? 'Show Details' : 'Hide Details';
    });

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText.length > 0) {
            const todoObject = {
                text: todoText,
                completed: false,
                subTasks: [],
                notes: notesInput.value.trim(),
                priority: priorityInput.value || 'medium', // Ensure priority is always set
                timeEstimate: parseInt(timeInput.value) || 0,
                status: statusInput.value || 'not-started'
            };
            allTodos.push(todoObject);
            sortTodosByPriority();
            updateTodoList();
            saveTodos();
            todoInput.value = '';
            notesInput.value = '';
            timeInput.value = '';
            statusInput.value = 'not-started';
            formDetails.style.display = 'none';
            toggleDetails.textContent = 'Show Details';
            console.log('Added todo:', todoObject);
        } else {
            console.log('Empty input');
            todoInput.placeholder = 'Please enter a task!';
            todoInput.style.border = '1px solid red';
            setTimeout(() => {
                todoInput.placeholder = 'Write anything and hit enter to add';
                todoInput.style.border = '';
            }, 2000);
        }
    }

    function sortTodosByPriority() {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        allTodos.sort((a, b) => (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2));
    }

    function updateTodoList() {
        todoListUL.innerHTML = '';
        console.log('Updating list with:', allTodos);
        allTodos.forEach((todo, todoIndex) => {
            const todoItem = createTodoItem(todo, todoIndex);
            todoListUL.appendChild(todoItem);
        });
        const totalTasks = allTodos.length;
        const completedTasks = allTodos.filter(todo => todo.completed).length;
        const overallProgress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
        document.querySelector('.progress-bar .progress').style.width = `${overallProgress}%`;
        const totalTime = allTodos.reduce((sum, todo) => sum + (todo.timeEstimate || 0), 0);
        document.querySelector('.total-time').textContent = `Total: ${totalTime} mins`;
    }

    function createTodoItem(todo, todoIndex) {
        const todoId = `todo-${todoIndex}`;
        const todoLI = document.createElement('li');
        todoLI.className = `todo priority-${todo.priority || 'medium'} status-${todo.status || 'not-started'}`; // Fallbacks

        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress-bar-container';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressPercentage = document.createElement('span');
        progressPercentage.className = 'progress-percentage';
        progressBarContainer.appendChild(progressBar);
        progressBarContainer.appendChild(progressPercentage);

        const todoHeader = document.createElement('div');
        todoHeader.className = 'todo-header';
        const priorityDisplay = todo.priority ? todo.priority.charAt(0).toUpperCase() : 'M'; // Fallback to 'M' if undefined
        todoHeader.innerHTML = `
            <input type="checkbox" id="${todoId}" ${todo.completed ? 'checked' : ''}>
            <label class="custom-checkbox" for="${todoId}">
                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </label>
            <label for="${todoId}" class="todo-text">${todo.text}</label>
            <span class="priority-badge">${priorityDisplay}</span>
            <button class="delete-button">
                <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
        `;

        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';
        taskDetails.style.display = 'none';
        taskDetails.innerHTML = `
            <p><strong>Notes:</strong> ${todo.notes || 'None'}</p>
            <p><strong>Time:</strong> ${todo.timeEstimate ? `${todo.timeEstimate} mins` : 'N/A'}</p>
            <select class="status-select">
                <option value="not-started" ${todo.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                <option value="in-progress" ${todo.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="done" ${todo.status === 'done' ? 'selected' : ''}>Done</option>
            </select>
        `;

        const statusSelect = taskDetails.querySelector('.status-select');
        statusSelect.addEventListener('change', () => {
            allTodos[todoIndex].status = statusSelect.value;
            allTodos[todoIndex].completed = statusSelect.value === 'done';
            saveTodos();
            updateTodoList();
        });

        const expandButton = document.createElement('button');
        expandButton.className = 'expand-button';
        expandButton.textContent = 'Details';
        expandButton.addEventListener('click', () => {
            taskDetails.style.display = taskDetails.style.display === 'none' ? 'block' : 'none';
            expandButton.textContent = taskDetails.style.display === 'none' ? 'Details' : 'Hide';
        });

        const subTaskUL = document.createElement('ul');
        subTaskUL.className = 'sub-tasks';
        todo.subTasks.forEach((subTask, subTaskIndex) => {
            const subTaskLI = createSubTaskItem(subTask, todoIndex, subTaskIndex);
            subTaskUL.appendChild(subTaskLI);
        });

        const addSubTaskButton = document.createElement('button');
        addSubTaskButton.className = 'add-subtask-button';
        addSubTaskButton.innerHTML = `
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-120q-33 0-56.5-23.5T400-200v-160H240q-33 0-56.5-23.5T160-440q0-33 23.5-56.5T240-520h160v-160q0-33 23.5-56.5T480-760q33 0 56.5 23.5T560-680v160h160q33 0 56.5 23.5T800-440q0 33-23.5 56.5T720-360H560v160q0 33-23.5 56.5T480-120Z"/></svg>
        `;
        addSubTaskButton.addEventListener('click', () => {
            const subTaskText = prompt('Enter sub-task:');
            if (subTaskText) {
                allTodos[todoIndex].subTasks.push({ text: subTaskText, completed: false });
                saveTodos();
                updateTodoList();
            }
        });

        todoLI.appendChild(todoHeader);
        todoLI.appendChild(progressBarContainer);
        todoLI.appendChild(taskDetails);
        todoLI.appendChild(expandButton);
        todoLI.appendChild(subTaskUL);
        todoLI.appendChild(addSubTaskButton);

        const deleteButton = todoLI.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            deleteTodoItem(todoIndex);
        });

        const checkbox = todoLI.querySelector('input');
        checkbox.addEventListener('change', () => {
            allTodos[todoIndex].completed = checkbox.checked;
            allTodos[todoIndex].status = checkbox.checked ? 'done' : 'in-progress';
            saveTodos();
            updateProgressBar(todoIndex, progressBar, progressPercentage);
        });

        updateProgressBar(todoIndex, progressBar, progressPercentage);

        return todoLI;
    }

    function createSubTaskItem(subTask, todoIndex, subTaskIndex) {
        const subTaskId = `subtask-${todoIndex}-${subTaskIndex}`;
        const subTaskLI = document.createElement('li');
        subTaskLI.className = 'sub-task';
        subTaskLI.innerHTML = `
            <input type="checkbox" id="${subTaskId}" ${subTask.completed ? 'checked' : ''}>
            <label class="custom-checkbox" for="${subTaskId}">
                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </label>
            <label for="${subTaskId}" class="sub-task-text">${subTask.text}</label>
            <button class="delete-button">
                <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
        `;

        const deleteButton = subTaskLI.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            deleteSubTaskItem(todoIndex, subTaskIndex);
        });

        const checkbox = subTaskLI.querySelector('input');
        checkbox.addEventListener('change', () => {
            allTodos[todoIndex].subTasks[subTaskIndex].completed = checkbox.checked;
            saveTodos();
            updateTodoList();
        });

        return subTaskLI;
    }

    function deleteTodoItem(todoIndex) {
        allTodos = allTodos.filter((_, i) => i !== todoIndex);
        saveTodos();
        updateTodoList();
    }

    function deleteSubTaskItem(todoIndex, subTaskIndex) {
        allTodos[todoIndex].subTasks = allTodos[todoIndex].subTasks.filter((_, i) => i !== subTaskIndex);
        saveTodos();
        updateTodoList();
    }

    function updateProgressBar(todoIndex, progressBar, progressPercentage) {
        const subTasks = allTodos[todoIndex].subTasks;
        const completedSubTasks = subTasks.filter(subTask => subTask.completed).length;
        const progress = subTasks.length ? (completedSubTasks / subTasks.length) * 100 : (allTodos[todoIndex].completed ? 100 : 0);
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.round(progress)}%`;
        if (progress < 25) {
            progressBar.style.backgroundColor = 'red';
        } else if (progress < 50) {
            progressBar.style.backgroundColor = 'orange';
        } else if (progress < 80) {
            progressBar.style.backgroundColor = 'yellow';
        } else {
            progressBar.style.backgroundColor = 'green';
        }
    }

    function saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(allTodos));
            console.log('Saved todos:', allTodos);
        } catch (error) {
            console.error('Save error:', error);
        }
    }

    function getTodos() {
        try {
            const todos = localStorage.getItem('todos');
            const parsed = todos ? JSON.parse(todos) : [];
            // Add missing fields to old todos
            return parsed.map(todo => ({
                text: todo.text || '',
                completed: todo.completed || false,
                subTasks: todo.subTasks || [],
                notes: todo.notes || '',
                priority: todo.priority || 'medium',
                timeEstimate: todo.timeEstimate || 0,
                status: todo.status || 'not-started'
            }));
        } catch (error) {
            console.error('Load error:', error);
            return [];
        }
    }
});