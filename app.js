document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoListUL = document.getElementById('todo-list');

    let allTodos = getTodos();
    updateTodoList();

    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTodo();
    });

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText.length > 0) {
            const todoObject = {
                text: todoText,
                completed: false,
                subTasks: []
            };
            allTodos.push(todoObject);
            updateTodoList();
            saveTodos();
            todoInput.value = "";
        }
    }

    function updateTodoList() {
        todoListUL.innerHTML = "";
        allTodos.forEach((todo, todoIndex) => {
            const todoItem = createTodoItem(todo, todoIndex);
            todoListUL.append(todoItem);
        });
    }

    function createTodoItem(todo, todoIndex) {
        const todoId = "todo-" + todoIndex;
        const todoLI = document.createElement("li");
        todoLI.className = "todo";
        
        const progressBarContainer = document.createElement("div");
        progressBarContainer.className = "progress-bar-container";
        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        const progressPercentage = document.createElement("span");
        progressPercentage.className = "progress-percentage";
        progressBarContainer.appendChild(progressBar);
        progressBarContainer.appendChild(progressPercentage);
        
        const todoHeader = document.createElement("div");
        todoHeader.className = "todo-header";
        todoHeader.innerHTML = `
            <input type="checkbox" id="${todoId}">
            <label class="custom-checkbox" for="${todoId}">
                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </label>
            <label for="${todoId}" class="todo-text">${todo.text}</label>
            <button class="delete-button">
                <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
        `;
        
        const subTaskUL = document.createElement("ul");
        subTaskUL.className = "sub-tasks";
        
        todo.subTasks.forEach((subTask, subTaskIndex) => {
            const subTaskLI = createSubTaskItem(subTask, todoIndex, subTaskIndex);
            subTaskUL.appendChild(subTaskLI);
        });
        
        const addSubTaskButton = document.createElement("button");
        addSubTaskButton.className = "add-subtask-button";
        addSubTaskButton.innerHTML = `
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-120q-33 0-56.5-23.5T400-200v-160H240q-33 0-56.5-23.5T160-440q0-33 23.5-56.5T240-520h160v-160q0-33 23.5-56.5T480-760q33 0 56.5 23.5T560-680v160h160q33 0 56.5 23.5T800-440q0 33-23.5 56.5T720-360H560v160q0 33-23.5 56.5T480-120Z"/></svg>
        `;
        addSubTaskButton.addEventListener("click", () => {
            const subTaskText = prompt("Enter sub-task:");
            if (subTaskText) {
                allTodos[todoIndex].subTasks.push({ text: subTaskText, completed: false });
                saveTodos();
                updateTodoList();
            }
        });
        
        todoLI.appendChild(todoHeader);
        todoLI.appendChild(progressBarContainer);
        todoLI.appendChild(subTaskUL);
        todoLI.appendChild(addSubTaskButton);
        
        const deleteButton = todoLI.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
            deleteTodoItem(todoIndex);
        });
        
        const checkbox = todoLI.querySelector("input");
        checkbox.addEventListener("change", () => {
            allTodos[todoIndex].completed = checkbox.checked;
            saveTodos();
            updateProgressBar(todoIndex, progressBar, progressPercentage); // Update progress on main task toggle
        });
        checkbox.checked = todo.completed;
        
        updateProgressBar(todoIndex, progressBar, progressPercentage);
        
        return todoLI;
    }

    function createSubTaskItem(subTask, todoIndex, subTaskIndex) {
        const subTaskId = `subtask-${todoIndex}-${subTaskIndex}`;
        const subTaskLI = document.createElement("li");
        subTaskLI.className = "sub-task";
        subTaskLI.innerHTML = `
            <input type="checkbox" id="${subTaskId}">
            <label class="custom-checkbox" for="${subTaskId}">
                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </label>
            <label for="${subTaskId}" class="sub-task-text">${subTask.text}</label>
            <button class="delete-button">
                <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
        `;
        
        const deleteButton = subTaskLI.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
            deleteSubTaskItem(todoIndex, subTaskIndex);
        });
        
        const checkbox = subTaskLI.querySelector("input");
        checkbox.addEventListener("change", () => {
            allTodos[todoIndex].subTasks[subTaskIndex].completed = checkbox.checked;
            saveTodos();
            updateTodoList(); // Re-render to update progress bar
        });
        checkbox.checked = subTask.completed;
        
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
        // Change color based on progress
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
        const todosJson = JSON.stringify(allTodos);
        localStorage.setItem("todos", todosJson);
    }

    function getTodos() {
        const todos = localStorage.getItem("todos") || "[]";
        return JSON.parse(todos);
    }
});