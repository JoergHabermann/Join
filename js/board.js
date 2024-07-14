let columns = ["todo", "progress", "feedback", "done"];

/**
 * Updates the board of tasks setting emptycolumns
 */
async function updateTasks() {
  await loadTasks();
  emptyColumns();
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    let container = document.getElementById(`task_${task.category}`);
    container.innerHTML += renderTaskHTML(task, i);
    showAssigned(task, task.assigned, i);
  }
  setNoTaskBox();
}

/**
 * Displays a message when there are no tasks in a column.
 */
function setNoTaskBox() {
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const container = document.getElementById(`task_${column}`);
    if (container.innerHTML === "") {
      container.innerHTML += `
      <div class="emptybox flex center">
        <span>No tasks to do</span>
      </div>
      `;
    }
  }
}

/**
 * Clears all columns on the task board.
 */
function emptyColumns() {
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    document.getElementById(`task_${column}`).innerHTML = "";
  }
}

/**
 * Calculates the width of the progress bar for a task.
 * @param {object} task - The task object.
 * @returns {number} The width of the progress bar.
 */
function calcBar(task) {
  let length = task.subtasks.length;
  let done = calcChecked(task);
  return length === 0 ? 0 : (done / length) * 100;
}

/**
 * Calculates the number of completed subtasks for a task.
 * @param {object} task - The task object.
 * @returns {number} The number of completed subtasks.
 */
function calcChecked(task) {
  let done = 0;
  for (let i = 0; i < task.subtasks.length; i++) {
    const checked = task.subtasks[i][1];
    done += checked;
  }
  return done;
}

/**
 * Renders the assigned users for a task.
 * @param {object} task - The task object.
 * @param {Array} assigned - The array of assigned users.
 * @param {number} index - The index of the task.
 */
function showAssigned(task, assigned, index) {
  let container = document.getElementById(`userbox${index}`);
  let length = assigned.length > 6 ? 6 : assigned.length;
  let left = 0;
  for (let i = 0; i < length; i++) {
    const user = assigned[i];
    let id = getInitials(user[0]);
    container.innerHTML += renderAssigned(id, user[1], i, left);
    left += 24;
  }
  renderExtraUsers(assigned, index, left);
  if (task.subtasks.length == 0) {
    document.getElementById(`bar${index}`).style.display = "none";
  }
}

function renderExtraUsers(assigned, index, left) {
  let container = document.getElementById(`userbox${index}`);
  if (assigned.length > 6) {
    container.innerHTML += `
      <div class="usertag absolute flex center" style="background-color:#29abe2;z-index:5;left:${left}px">+${assigned.length - 6}</div>  
    `;
  }
}

/**
 * Filters tasks based on the search input.
 */
function filterTasks() {
  let found = 0;
  let alert = document.getElementById('notfound');
  let search = document.getElementById("findtask").value;
  emptyColumns();
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase())) {
      found++;
      let container = document.getElementById(`task_${task.category}`);
      container.innerHTML += renderTaskHTML(task, i);
      showAssigned(task, task.assigned, i);}
  }
  (found === 0) ? alert.classList.remove('d-none') : alert.classList.add('d-none');  
  setNoTaskBox();
}

/**
 * Renders the assigned users for a task.
 * @param {string} id - The user ID.
 * @param {string} color - The color of the user tag.
 * @param {number} zIndex - The z-index of the user tag.
 * @param {number} left - The left position of the user tag.
 * @returns {string} The HTML for the user tag.
 */
function renderAssigned(id, color, zIndex, left) {
  return `<div class="usertag absolute flex center" style="background-color:${color};z-index:${zIndex};left:${left}px">${id}</div>`;
}

/**
 * Moves a task to a different category when dropped.
 * @param {string} category - The category to move the task to.
 * @returns {Promise<void>} A Promise that resolves after the task is moved and updated.
 */
async function dragTo(category) {
  tasks[draggedElement]["category"] = category;
  await setItem("taskobject", JSON.stringify(tasks));
  updateTasks();
}

/**
 * Initiates the drag of a task.
 * @param {number} id - The ID of the task being dragged.
 */
function dragStart(id) {
  draggedElement = id;
  document.getElementById(`id${id}`).classList.add("fade");
}

/**
 * Prevents the default behavior of an element during a drag-and-drop operation.
 * @param {Event} event - The drag event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Highlights a drop zone during a drag-and-drop operation.
 * @param {string} id - The ID of the drop zone to highlight.
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from a drop zone after a drag-and-drop operation.
 * @param {string} id - The ID of the drop zone to remove the highlight from.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Toggles the visibility of the floating add task container.
 */
function toggleFloatingAddTask(column) {  
  let container = document.getElementById("blockcontainer");
  let floatingcontainer = document.getElementById("add-task-container");
  clearAddTask(event);
  chosencolumn = column;  
  if (container.classList.contains('d-none')) {
    toggleTemplateContainer();
    container.classList.toggle('d-none');    
    floatingcontainer.classList.toggle('slidein');
    document.body.style.overflow = 'hidden';
  } else {
    floatingcontainer.classList.toggle("slideout"); 
    document.body.style.overflow = 'auto';   
    setTimeout(toggleBlock, 200);  
    setTimeout(toggleTemplateContainer, 350);  
  }
}

/**
 * Function to toggle the template container
 */
function toggleTemplateContainer() {
  let templatecontainer = document.getElementById('task-template');
  templatecontainer.classList.toggle('d-none');
}

/**
 * Function to toggle the block container
 */
function toggleBlock() {
  let container = document.getElementById("blockcontainer");
  let floatingcontainer = document.getElementById("add-task-container");
  container.classList.toggle("d-none");
  floatingcontainer.classList.remove("slidein");
  floatingcontainer.classList.remove("slideout");
}

/**
 * Opens the task details panel and renders task information.
 * @param {number} index - The index of the task.
 */
function openTaskInfo(index) {
  let bodycontainer = document.body;
  let task = tasks[index];
  let details = document.getElementById("task-details-container");  
  details.innerHTML = "";
  details.innerHTML = renderTaskInfoHTML(task, index);
  let container = document.getElementById("task-details");
  container.classList.add("slidein");
  bodycontainer.style.overflow = 'hidden';
}

/**
 * Function to capitalize the first letter of a string
 * @param {string} str - string to be capitalized
 */
function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Renders the assigned users for a task in the task details panel.
 * @param {number} index - The index of the task.
 */
function renderInfoAssigned(index) {
  let container = document.getElementById("info-assigned");
  let assigned = tasks[index].assigned;
  container.innerHTML = "";
  for (let i = 0; i < assigned.length; i++) {
    const user = assigned[i][0];
    const usercolor = assigned[i][1];
    container.innerHTML += `
    <div class="flex gap-s">
      <div class="usertag flex a-center j-center" style="background-color:${usercolor}">${getInitials(user)}</div>
      <span>${user}</span>
    </div>
    `;
  }
}

/**
 * Renders the subtasks for a task in the task details panel.
 * @param {number} index - The index of the task.
 */
function renderInfoSubtasks(index) {
  let container = document.getElementById("info-subtasks");
  let subtasks = tasks[index].subtasks;
  container.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const st = subtasks[i];
    container.innerHTML += `
    <div class="flex gap-s info-st-img" id="st${i}" onclick="toggleInfoSubtask(${index},${i},${st[1]})">
      <img src="./img/${checkChecked(st)}.svg" alt="checkbox">
      ${st[0]}
    </div>    
    `;
  }
}

/**
 * Checks whether a subtask is checked or not.
 * @param {Array} st - The subtask array containing the task name and its status.
 * @returns {string} - Returns 'checkbox' if the subtask is unchecked, and 'checkedbox' if it's checked.
 */
function checkChecked(st) {
  return st[1] == 0 ? "checkbox" : "checkedbox";
}

/**
 * Function to remove a task from the board and saving the task object to remote storage
 * @param {number} index - index of the task
 */
async function removeTask(index) {
  hideDetailsContainer();
  tasks.splice(index, 1);
  await setItem("taskobject", JSON.stringify(tasks));
  document.body.style.overflow = 'auto'; 
  updateTasks();
}

/**
 * Function to toggle the subtask (done or not done)
 * @param {number} taskindex - index of the maintask
 * @param {number} subtaskindex - index of the subtask of the main task
 * @param {number} subtaskchecked - value if the subtask is done or not
 */
async function toggleInfoSubtask(taskindex, subtaskindex, subtaskchecked) {
  let subcheck = subtaskchecked;
  subcheck == 0 ? (subcheck = 1) : (subcheck = 0);
  tasks[taskindex].subtasks[subtaskindex][1] = subcheck;
  await setItem("taskobject", JSON.stringify(tasks));
  renderInfoSubtasks(taskindex);
  updateTasks();
}

/**
 * Function to close the task info container 
 */
function closeTaskInfo() {
  let bodycontainer = document.body;
  let container = document.getElementById("task-details");
  bodycontainer.style.overflow = 'auto';
  container.classList.remove("slidein");
  container.classList.add("slideout");
  setTimeout(hideDetailsContainer, 200);  
}

/**
 * Hides the task details container.
 */
function hideDetailsContainer() {
  document.getElementById("task-details").classList.remove("slideout");
  document.getElementById("detailsContainer").classList.add("d-none");
}

/**
 * Saving the changes of the edit task feature
 * @param {number} index - index of the task
 */
async function saveEditTask(index) {
  let task = tasks[index];
  task.title = document.getElementById("title-edit").value;
  task.description = document.getElementById("description-edit").value;
  task.date = document.getElementById("duedate-edit").value;
  task.priority = priority;
  task.assigned = assigned;
  task.subtasks = subtasks;
  await setItem("taskobject", JSON.stringify(tasks));  
  updateTasks();
  closeTaskInfo();  
}

/**
 * toggling the task burger menu in responsive mode, stoping the opentaskinfo function
 * with an event stopPropagation
 * @param {number} index - index of the task
 * @param {event} event - event object
 */
function toggleTaskBurger(index,event) {
  event.stopPropagation();
  let popupcontainer = document.getElementById(`taskpopup${index}`);
  popupcontainer.classList.toggle('d-none');
}

/**
 * function to move a task via burger menu to another category
 * @param {string} category - user-selected category
 * @param {number} index - index of the task
 * @param {event} event - event object
 */
async function burgerMoveTo(category,index,event) {
  event.stopPropagation();
  tasks[index]["category"] = category;
  await setItem("taskobject", JSON.stringify(tasks));
  updateTasks();
}

/**
 * Hides the block container when clicked outside of the add task container
 * @param {event} event - clickevent
 */
function closeAddTaskSideClick(event) {  
  let blockcontainer = document.getElementById('blockcontainer');
  if (!blockcontainer.classList.contains('d-none')) {    
    if (!event.target.closest('#add-task-container')) {
      toggleFloatingAddTask();
    }
  }  
}

/**
 * Hides the task-details-container when clicked outside of the task-details
 * @param {event} event - clickevent
 */
function closeTaskInfoSideClick(event) {  
  let blockcontainer = document.getElementById('detailsContainer');
  if (!blockcontainer.classList.contains('d-none')) {    
    if (!event.target.closest('#task-details') && !event.target.closest('#created-subtasks-container-edit') ) {
      closeTaskInfo();
    }
  }  
}
