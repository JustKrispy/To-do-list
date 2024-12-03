const createListButton = document.getElementById('createList');
const listsContainer = document.getElementById('lists');

function createList() {
    const listId = `list-${Date.now()}`;
    const listContainer = document.createElement('div');
    listContainer.className = 'list-container';
    listContainer.setAttribute('data-list-id', listId);

    listContainer.innerHTML = `
        <div class="list-header">
            <h2 class="list-title">To-Do List</h2>
            <button class="delete-list">Delete List</button>
        </div>
        <form class="taskForm">
            <input type="text" placeholder="Task Title" class="taskTitle" required>
            <textarea placeholder="Task Description" class="taskDescription" required></textarea>
            <input type="date" class="taskDeadline" required>
            <button type="submit">Add Task</button>
        </form>
        <h3>Total Tasks: <span class="taskCounter">0</span></h3>
        <ul class="taskList"></ul>
    `;

    listsContainer.appendChild(listContainer);

    initializeListLogic(listContainer, listId);
}

function initializeListLogic(listContainer, listId) {
    const taskForm = listContainer.querySelector('.taskForm');
    const taskTitleInput = listContainer.querySelector('.taskTitle');
    const taskDescriptionInput = listContainer.querySelector('.taskDescription');
    const taskDeadlineInput = listContainer.querySelector('.taskDeadline');
    const taskList = listContainer.querySelector('.taskList');
    const taskCounter = listContainer.querySelector('.taskCounter');
    const listTitle = listContainer.querySelector('.list-title');
    const deleteListButton = listContainer.querySelector('.delete-list');

    let editModeTask = null;

    function updateTaskCounter() {
        taskCounter.textContent = taskList.children.length;
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach((task) => {
            tasks.push({
                title: task.querySelector('h3')?.textContent,
                description: task.querySelector('p')?.textContent,
                deadline: task.querySelector('span')?.textContent.replace('Deadline: ', ''),
                completed: task.querySelector('input[type="checkbox"]').checked,
            });
        });
        localStorage.setItem(listId, JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem(listId));
        if (savedTasks) {
            savedTasks.forEach((task) => createTaskElement(task));
        }
    }

    function createTaskElement(task) {
        const listItem = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed || false;
        checkbox.addEventListener('change', () => {
            listItem.classList.toggle('completed', checkbox.checked);
            checkAllTasksCompleted();
            saveTasks();
        });

        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.title;

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.description;

        const taskDeadline = document.createElement('span');
        taskDeadline.textContent = `Deadline: ${task.deadline}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList = 'edit-btn';
        editButton.addEventListener('click', () => {

            taskTitleInput.value = taskTitle.textContent;
            taskDescriptionInput.value = taskDescription.textContent;
            taskDeadlineInput.value = taskDeadline.textContent.replace('Deadline: ', '');

            editModeTask = listItem;
            listItem.remove();

        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList = 'delete-btn';
        deleteButton.addEventListener('click', () => {
            listItem.remove();
            checkAllTasksCompleted();
            saveTasks();
            updateTaskCounter();
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(taskTitle);
        listItem.appendChild(taskDescription);
        listItem.appendChild(taskDeadline);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        if (task.completed) {
            listItem.classList.add('completed');
        }

        taskList.appendChild(listItem);
        updateTaskCounter();
        checkAllTasksCompleted();
    }

    function checkAllTasksCompleted() {
        const allTasks = taskList.querySelectorAll('li');
        const allChecked = Array.from(allTasks).every((task) =>
            task.querySelector('input[type="checkbox"]').checked
        );

        if (allTasks.length > 0 && allChecked) {
            listTitle.textContent = 'Completed List';
        } else {
            listTitle.textContent = 'To-Do List';
        }
    }

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const deadline = taskDeadlineInput.value;

        if (title && description && deadline) {
            if (editModeTask) {
                
                editModeTask.querySelector('h3').textContent = title;
                editModeTask.querySelector('p').textContent = description;
                editModeTask.querySelector('span').textContent = `Deadline: ${deadline}`;

                taskList.appendChild(editModeTask);

                editModeTask = null;
            } else {
                createTaskElement({ title, description, deadline, completed: false });
            }

            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
            taskDeadlineInput.value = '';

            saveTasks();
        } else {
            alert('Please fill in all fields.');
        }
    });
    

    deleteListButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this list?')) {
            listContainer.remove();
            localStorage.removeItem(listId);
        }
    });

    loadTasks();
    updateTaskCounter();
    checkAllTasksCompleted();
}

createListButton.addEventListener('click', createList);

function loadExistingLists() {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('list-')) {
            const listContainer = document.createElement('div');
            listContainer.className = 'list-container';
            listContainer.setAttribute('data-list-id', key);

            listContainer.innerHTML = `
                <div class="list-header">
                    <h2 class="list-title">To-Do List</h2>
                    <button class="delete-list">Delete List</button>
                </div>
                <form class="taskForm">
                    <input type="text" placeholder="Task Title" class="taskTitle" required>
                    <textarea placeholder="Task Description" class="taskDescription" required></textarea>
                    <input type="date" class="taskDeadline" required>
                    <button type="submit">Add Task</button>
                </form>
                <h3>Total Tasks: <span class="taskCounter">0</span></h3>
                <ul class="taskList"></ul>
            `;

            listsContainer.appendChild(listContainer);
            initializeListLogic(listContainer, key);
        }
    });
}

window.addEventListener('DOMContentLoaded', loadExistingLists);
