// Get references to DOM elements
const addTaskBtn = document.getElementById("add-task-btn");
const newTaskInput = document.getElementById("new-task");
const taskList = document.getElementById("task-list");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");
const prioritySelect = document.getElementById("priority");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");

// Load tasks from localStorage
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

// Function to create a new task element
function createTaskElement(taskText, priority = "Low", isCompleted = false) {
  const li = document.createElement("li");
  li.className = `task ${priority.toLowerCase()}`;
  if (isCompleted) li.classList.add("completed");

  const taskTextElement = document.createElement("span");
  taskTextElement.textContent = taskText;

  const priorityLabel = document.createElement("span");
  priorityLabel.className = "priority-label";
  priorityLabel.textContent = priority;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const completeBtn = document.createElement("button");
  completeBtn.innerHTML = "✔️";
  completeBtn.addEventListener("click", () => toggleCompleteTask(li));

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.addEventListener("click", () => editTask(li));

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.addEventListener("click", () => deleteTask(li));

  actionsDiv.appendChild(completeBtn);
  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(taskTextElement);
  li.appendChild(priorityLabel);
  li.appendChild(actionsDiv);

  return li;
}

// Function to add a new task
function addTask() {
  const taskText = newTaskInput.value.trim();
  const priority = prioritySelect.value;
  if (taskText === "") return;

  const taskElement = createTaskElement(taskText, priority);
  taskList.appendChild(taskElement);

  saveTasksToLocalStorage();
  newTaskInput.value = "";
  newTaskInput.focus();
}

// Function to toggle the completed status of a task
function toggleCompleteTask(taskElement) {
  taskElement.classList.toggle("completed");
  saveTasksToLocalStorage();
}

// Function to edit a task
function editTask(taskElement) {
  const taskTextElement = taskElement.querySelector("span");
  const newTaskText = prompt("Edit your task", taskTextElement.textContent);

  if (newTaskText !== null && newTaskText.trim() !== "") {
    taskTextElement.textContent = newTaskText;
    saveTasksToLocalStorage();
  }
}

// Function to delete a task
function deleteTask(taskElement) {
  taskElement.remove();
  saveTasksToLocalStorage();
}

// Function to clear completed tasks
function clearCompletedTasks() {
  document.querySelectorAll(".task.completed").forEach((task) => task.remove());
  saveTasksToLocalStorage();
}

// Function to clear all tasks
function clearAllTasks() {
  taskList.innerHTML = "";
  saveTasksToLocalStorage();
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll(".task").forEach((task) => {
    tasks.push({
      text: task.querySelector("span").textContent,
      priority: task.querySelector(".priority-label").textContent,
      completed: task.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const taskElement = createTaskElement(
      task.text,
      task.priority,
      task.completed
    );
    taskList.appendChild(taskElement);
  });
}

// Function to filter tasks based on criteria
function filterTasks() {
  const filter = filterSelect.value;
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task) => {
    const isCompleted = task.classList.contains("completed");
    const priority = task.querySelector(".priority-label").textContent;

    switch (filter) {
      case "all":
        task.style.display = "flex";
        break;
      case "completed":
        task.style.display = isCompleted ? "flex" : "none";
        break;
      case "not-completed":
        task.style.display = !isCompleted ? "flex" : "none";
        break;
      case "high":
      case "medium":
      case "low":
        task.style.display =
          priority.toLowerCase() === filter ? "flex" : "none";
        break;
    }
  });
}

// Function to sort tasks by priority
function sortTasks() {
  const sortOption = sortSelect.value;
  const tasksArray = Array.from(document.querySelectorAll(".task"));

  tasksArray.sort((a, b) => {
    const priorityA = a
      .querySelector(".priority-label")
      .textContent.toLowerCase();
    const priorityB = b
      .querySelector(".priority-label")
      .textContent.toLowerCase();

    const priorityOrder = { high: 3, medium: 2, low: 1 };

    if (sortOption === "priority") {
      return priorityOrder[priorityB] - priorityOrder[priorityA];
    }
  });

  taskList.innerHTML = "";
  tasksArray.forEach((task) => taskList.appendChild(task));
  saveTasksToLocalStorage();
}

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
newTaskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
clearCompletedBtn.addEventListener("click", clearCompletedTasks);
clearAllBtn.addEventListener("click", clearAllTasks);
filterSelect.addEventListener("change", filterTasks);
sortSelect.addEventListener("change", sortTasks);
