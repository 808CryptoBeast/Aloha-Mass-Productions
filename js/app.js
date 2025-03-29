document.addEventListener('DOMContentLoaded', () => {
    console.log('app.js loaded');

    /* === DOM ELEMENTS === */
    const elements = {
        todoForm: document.getElementById('todo-form'),
        todoInput: document.getElementById('todo-input'),
        addButton: document.getElementById('add-button'),
        todoListUL: document.getElementById('todo-list'),
        notesInput: document.getElementById('task-notes'),
        priorityInput: document.getElementById('task-priority'),
        timeInput: document.getElementById('task-time'),
        statusInput: document.getElementById('task-status'),
        toggleDetails: document.getElementById('toggle-details'),
        formDetails: document.querySelector('.form-details')
    };

    /* === INITIALIZATION === */
    // Check for missing DOM elements
    if (Object.values(elements).some(el => !el)) {
        console.error('Missing DOM elements:', {
            todoForm: !!elements.todoForm,
            todoInput: !!elements.todoInput,
            addButton: !!elements.addButton,
            todoListUL: !!elements.todoListUL,
            notesInput: !!elements.notesInput,
            priorityInput: !!elements.priorityInput,
            timeInput: !!elements.timeInput,
            statusInput: !!elements.statusInput,
            toggleDetails: !!elements.toggleDetails,
            formDetails: !!elements.formDetails
        });
        return;
    }
    console.log('DOM elements found');

    let allTodos = getTodos();
    console.log('Initial todos:', allTodos);
    updateTodoList();

    /* === EVENT LISTENERS === */
    elements.todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    });

    elements.addButton.addEventListener('click', (e) => {
        e.preventDefault();
        addTodo();
    });

    elements.toggleDetails.addEventListener('click', () => {
        elements.formDetails.style.display = elements.formDetails.style.display === 'none' ? 'block' : 'none';
        elements.toggleDetails.textContent = elements.formDetails.style.display === 'none' ? 'Show Details' : 'Hide Details';
    });

    /* === TODO MANAGEMENT === */
    function addTodo() {
        const todoText = elements.todoInput.value.trim();
        if (todoText.length > 0) {
            const todoObject = {
                text: todoText,
                completed: false,
                subTasks: [],
                notes: elements.notesInput.value.trim(),
                priority: elements.priorityInput.value || 'medium',
                timeEstimate: parseInt(elements.timeInput.value) || 0,
                status: elements.statusInput.value || 'not-started'
            };
            allTodos.push(todoObject);
            sortTodosByPriority();
            updateTodoList();
            saveTodos();
            resetForm();
            console.log('Added todo:', todoObject);
        } else {
            handleEmptyInput();
        }
    }

    function sortTodosByPriority() {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        allTodos.sort((a, b) => (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2));
    }

    function resetForm() {
        elements.todoInput.value = '';
        elements.notesInput.value = '';
        elements.timeInput.value = '';
        elements.statusInput.value = 'not-started';
        elements.formDetails.style.display = 'none';
        elements.toggleDetails.textContent = 'Show Details';
    }

    function handleEmptyInput() {
        console.log('Empty input');
        elements.todoInput.placeholder = 'Please enter a task!';
        elements.todoInput.style.border = '1px solid red';
        setTimeout(() => {
            elements.todoInput.placeholder = 'Write anything and hit enter to add';
            elements.todoInput.style.border = '';
        }, 2000);
    }

    /* === TODO LIST RENDERING === */
    function updateTodoList() {
        elements.todoListUL.innerHTML = '';
        console.log('Updating list with:', allTodos);
        allTodos.forEach((todo, todoIndex) => {
            const todoItem = createTodoItem(todo, todoIndex);
            elements.todoListUL.appendChild(todoItem);
        });
        updateProgressStats();
    }

    function updateProgressStats() {
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
        todoLI.className = `todo priority-${todo.priority || 'medium'} status-${todo.status || 'not-started'}`;

        const progressBarContainer = createProgressBarContainer(todoIndex);
        const todoHeader = createTodoHeader(todo, todoId, todoIndex);
        const taskDetails = createTaskDetails(todo, todoIndex);
        const expandButton = createExpandButton(taskDetails);
        const subTaskUL = createSubTaskList(todo.subTasks, todoIndex);
        const addSubTaskButton = createAddSubTaskButton(todoIndex);

        todoLI.appendChild(todoHeader);
        todoLI.appendChild(progressBarContainer);
        todoLI.appendChild(taskDetails);
        todoLI.appendChild(expandButton);
        todoLI.appendChild(subTaskUL);
        todoLI.appendChild(addSubTaskButton);

        return todoLI;
    }

    /* === TODO ITEM COMPONENTS === */
    function createProgressBarContainer(todoIndex) {
        const container = document.createElement('div');
        container.className = 'progress-bar-container';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressPercentage = document.createElement('span');
        progressPercentage.className = 'progress-percentage';
        container.appendChild(progressBar);
        container.appendChild(progressPercentage);
        updateProgressBar(todoIndex, progressBar, progressPercentage);
        return container;
    }

    function createTodoHeader(todo, todoId, todoIndex) {
        const header = document.createElement('div');
        header.className = 'todo-header';
        const priorityDisplay = todo.priority ? todo.priority.charAt(0).toUpperCase() : 'M';
        header.innerHTML = `
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

        header.querySelector('.delete-button').addEventListener('click', () => deleteTodoItem(todoIndex));
        const checkbox = header.querySelector('input');
        checkbox.addEventListener('change', () => {
            allTodos[todoIndex].completed = checkbox.checked;
            allTodos[todoIndex].status = checkbox.checked ? 'done' : 'in-progress';
            saveTodos();
            updateTodoList();
        });

        return header;
    }

    function createTaskDetails(todo, todoIndex) {
        const details = document.createElement('div');
        details.className = 'task-details';
        details.style.display = 'none';
        details.innerHTML = `
            <p><strong>Notes:</strong> ${todo.notes || 'None'}</p>
            <p><strong>Time:</strong> ${todo.timeEstimate ? `${todo.timeEstimate} mins` : 'N/A'}</p>
            <select class="status-select">
                <option value="not-started" ${todo.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                <option value="in-progress" ${todo.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="done" ${todo.status === 'done' ? 'selected' : ''}>Done</option>
            </select>
        `;

        const statusSelect = details.querySelector('.status-select');
        statusSelect.addEventListener('change', () => {
            allTodos[todoIndex].status = statusSelect.value;
            allTodos[todoIndex].completed = statusSelect.value === 'done';
            saveTodos();
            updateTodoList();
        });

        return details;
    }

    function createExpandButton(taskDetails) {
        const button = document.createElement('button');
        button.className = 'expand-button';
        button.textContent = 'Details';
        button.addEventListener('click', () => {
            taskDetails.style.display = taskDetails.style.display === 'none' ? 'block' : 'none';
            button.textContent = taskDetails.style.display === 'none' ? 'Details' : 'Hide';
        });
        return button;
    }

    function createSubTaskList(subTasks, todoIndex) {
        const ul = document.createElement('ul');
        ul.className = 'sub-tasks';
        subTasks.forEach((subTask, subTaskIndex) => {
            const subTaskLI = createSubTaskItem(subTask, todoIndex, subTaskIndex);
            ul.appendChild(subTaskLI);
        });
        return ul;
    }

    function createAddSubTaskButton(todoIndex) {
        const button = document.createElement('button');
        button.className = 'add-subtask-button';
        button.innerHTML = `
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-120q-33 0-56.5-23.5T400-200v-160H240q-33 0-56.5-23.5T160-440q0-33 23.5-56.5T240-520h160v-160q0-33 23.5-56.5T480-760q33 0 56.5 23.5T560-680v160h160q33 0 56.5 23.5T800-440q0 33-23.5 56.5T720-360H560v160q0 33-23.5 56.5T480-120Z"/></svg>
        `;
        button.addEventListener('click', () => {
            const subTaskText = prompt('Enter sub-task:');
            if (subTaskText) {
                allTodos[todoIndex].subTasks.push({ text: subTaskText, completed: false });
                saveTodos();
                updateTodoList();
            }
        });
        return button;
    }

    function createSubTaskItem(subTask, todoIndex, subTaskIndex) {
        const subTaskId = `subtask-${todoIndex}-${subTaskIndex}`;
        const li = document.createElement('li');
        li.className = 'sub-task';
        li.innerHTML = `
            <input type="checkbox" id="${subTaskId}" ${subTask.completed ? 'checked' : ''}>
            <label class="custom-checkbox" for="${subTaskId}">
                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </label>
            <label for="${subTaskId}" class="sub-task-text">${subTask.text}</label>
            <button class="delete-button">
                <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
        `;

        li.querySelector('.delete-button').addEventListener('click', () => deleteSubTaskItem(todoIndex, subTaskIndex));
        li.querySelector('input').addEventListener('change', (e) => {
            allTodos[todoIndex].subTasks[subTaskIndex].completed = e.target.checked;
            saveTodos();
            updateTodoList();
        });

        return li;
    }

    /* === DATA MANAGEMENT === */
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
        progressBar.style.backgroundColor = 
            progress < 25 ? 'red' :
            progress < 50 ? 'orange' :
            progress < 80 ? 'yellow' : 'green';
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