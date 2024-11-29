const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskDeadlineInput = document.getElementById("taskDeadline");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

let isEditing = false;
let editingTaskElement = null;

function updateTaskCounter() {
  const totalTasks = taskList.querySelectorAll("li").length;
  taskCounter.textContent = totalTasks;
}

function addTask(event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const deadline = taskDeadlineInput.value;

  if (title && description && deadline) {
    if (isEditing) {
      updateTaskElement(editingTaskElement, {
        title,
        description,
        deadline,
        completed: false,
      });
      isEditing = false;
      editingTaskElement = null;
    } else {
      createTaskElement({ title, description, deadline, completed: false });
    }

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDeadlineInput.value = "";

    saveTasks();
    updateTaskCounter();
  } else {
    alert("Please fill all the missing fields.");
  }
}

function createTaskElement(task) {
  const listItem = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", function () {
    listItem.classList.toggle("completed", checkbox.checked);
    saveTasks();
  });

  const taskTitle = document.createElement("h3");
  taskTitle.textContent = task.title;

  const taskDescription = document.createElement("p");
  taskDescription.textContent = task.description;

  const taskDeadline = document.createElement("span");
  taskDeadline.textContent = `Deadline: ${task.deadline}`;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("action-btn", "edit-btn");
  editButton.addEventListener("click", function () {
    editTask(listItem, task);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("action-btn", "delete-btn");
  deleteButton.addEventListener("click", function () {
    listItem.remove();
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
    listItem.classList.add("completed");
  }

  taskList.appendChild(listItem);
  updateTaskCounter();
}

function editTask(listItem, task) {
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskDeadlineInput.value = task.deadline;

  isEditing = true;
  editingTaskElement = listItem;

  listItem.remove();
  updateTaskCounter();
}

function updateTaskElement(listItem, updatedTask) {
  listItem.querySelector("h3").textContent = updatedTask.title;
  listItem.querySelector("p").textContent = updatedTask.description;
  listItem.querySelector("span").textContent = `Deadline: ${updatedTask.deadline}`;
  listItem.querySelector('input[type="checkbox"]').checked =
    updatedTask.completed;

  listItem.classList.toggle("completed", updatedTask.completed);

  taskList.appendChild(listItem);
  updateTaskCounter();
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(function (listItem) {
    const title = listItem.querySelector("h3").textContent;
    const description = listItem.querySelector("p").textContent;
    const deadline = listItem.querySelector("span").textContent.replace("Deadline: ", "");
    const completed = listItem.querySelector('input[type="checkbox"]').checked;

    tasks.push({ title, description, deadline, completed });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (storedTasks) {
    storedTasks.forEach(createTaskElement);
  }
}

taskForm.addEventListener("submit", addTask);

window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  updateTaskCounter();
});
