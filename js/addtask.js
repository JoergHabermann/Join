/**
 * Array to store assigned users for a task.
 * @type {Array}
 */
let assigned = [];

/**
 * Array to store subtasks for a task.
 * @type {Array}
 */
let subtasks = [];

/**
 * Priority level of the task.
 * @type {string}
 */
let priority = "medium";
let chosencolumn = "todo";

/**
 * Displays the user menu dropdown.
 * Loads users and tasks before rendering.
 */
async function displayUserMenu() {  
  await loadTasks();
  await loadContacts();  
  let dropbox = document.getElementById("drop-menu-assigned");
  dropbox.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    const user = contacts[i].name;
    const color = contacts[i].color;
    dropbox.innerHTML += renderDropboxUser(user, color, i);
  }
}

/**
 * Renders the HTML structure for a user in the dropdown menu.
 * @param {string} user - The name of the user.
 * @param {string} color - The color associated with the user.
 * @param {number} index - The index of the user.
 * @returns {string} - The HTML structure for the user in the dropdown menu.
 */
function renderDropboxUser(user, color, index) {
  return `
    <div class="flex a-center between dropbox" id="c${index}" onclick="checkUser(${index})">
      <div class="flex a-center gap-s">
        <div class="usertag flex a-center j-center" style="background-color:${color}">${getInitials(
    user
  )}</div>
        <span>${user}</span>
      </div> 
   <div class=${setCheckedUser(user, color)}> </div>                 
   </div>
  `;
}

/**
 * Checking if the selected User is in assigned, then returning the matching css class
 * @param {string} user - the user which is checked in the dropdown
 * @param {string} color - the matching color of the user
 */
function setCheckedUser(user, color) {
  for (let item of assigned) {
    if (item[0] == user && item[1] == color) {
      return "assigned-checked";
    }
  }
  return "assigned-check";
}
/**
 * setting the desired priority to be displayed as selected button, avoiding form submitting
 * @param {string} prio - input for the desired priority for the function
 * @param {string} event - event catching
 */
function selectPrio(prio, event) {
  event.preventDefault();
  document
    .querySelectorAll(".priobutton")
    .forEach((b) =>
      b.classList.remove("urgentselect", "mediumselect", "lowselect")
    );
  document.getElementById(prio).classList.add(`${prio}select`);
  priority = prio;
}

/**
 * Toggles the visibility of a dropdown menu.
 * @param {string} id - The ID of the dropdown menu container.
 */
function toggleDrop(id) {
  let container = document.getElementById(`${id}`);
  container.firstElementChild.classList.toggle("rotate");
  container.nextElementSibling.classList.toggle("invis");
}

/**
 * Handles the selection/deselection of a user in the dropdown menu.
 * @param {number} id - The ID of the user.
 */
function checkUser(id) {
  let container = document.getElementById(`c${id}`);
  let checkeduser = contacts[id].name;
  let checkedusercolor = contacts[id].color;
  let index = assigned.findIndex(
    (t) => t.includes(checkeduser) && t.includes(checkedusercolor)
  );
  if (container.lastElementChild.classList.contains("assigned-checked")) {
    assigned.splice(index, 1);
  } else {
    assigned.push([checkeduser, checkedusercolor]);
  }
  container.lastElementChild.classList.toggle("assigned-checked");
  container.lastElementChild.classList.toggle("assigned-check");
  renderAssignedUsers('tag-container');
}

/**
 * Renders the tags for the assigned users.
 */
function renderAssignedUsers(container) {
  let bucket = document.getElementById(container);
  bucket.innerHTML = "";
  let length = assigned.length > 6 ? 6 : assigned.length;
  for (let i = 0; i < length; i++) {
    const user = assigned[i][0];
    const usercolor = assigned[i][1];
    bucket.innerHTML += `
    <div class="usertag flex a-center j-center" style="background-color:${usercolor}">${getInitials(
      user
    )}</div>
    `;
  }
  renderExtraBubble(container);
}

function renderExtraBubble(container) {
  let bucket = document.getElementById(container);
  if (assigned.length > 6) {
    bucket.innerHTML += `
    <div class="usertag flex a-center j-center" style="background-color:#29abe2">+${assigned.length - 6}</div>
    `;
  }
}

/**
 * Selects the category for the task.
 * @param {string} category - The selected category.
 */
function selectCategory(category) {
  toggleDrop("arrowcategory");
  document.getElementById("category-input").value = category;
}

/**
 * Toggles the visibility of the subtasks input field.
 */
function toggleSubtasksInput(inputcontainer) {
  let field = document.getElementById(inputcontainer);
  let hiddenicons = field.nextElementSibling.firstElementChild;
  let plusicon = hiddenicons.nextElementSibling;  
  if (!field.focus()) {
    field.focus();
  }
  hiddenicons.classList.toggle("invis");
  hiddenicons.classList.toggle("flex");
  plusicon.classList.toggle("invis");
  plusicon.classList.toggle("flex");
}

/**
 * Clears the input fields for adding a task.
 */
function clearInput(inputcontainer) {
  document.getElementById(inputcontainer).value = "";
  toggleSubtasksInput(inputcontainer);
  document.getElementById(inputcontainer).blur();
}

/**
 * Enables editing of a subtask.
 * @param {number} id - The ID of the subtask.
 */
function editSubtask(id) {
  let field = document.getElementById(`subtasks-input-c${id}`);
  let iconboxedit = document.getElementById(`created-subtasks-iconbox${id}`);
  let iconboxcheck = document.getElementById(
    `created-subtasks-iconbox${id}`
  ).nextElementSibling;
  field.value = field.value.split("").splice(2).join("");
  field.disabled = false;
  field.focus();
  iconboxedit.classList.toggle("invis");
  iconboxedit.classList.toggle("flex");
  iconboxcheck.classList.toggle("invis");
  iconboxcheck.classList.toggle("flex");
}

/**
 * Saves the edited subtask.
 * @param {number} id - The ID of the subtask.
 */
function checkSubtask(id) {
  let field = document.getElementById(`subtasks-input-c${id}`);
  let iconboxedit = document.getElementById(`created-subtasks-iconbox${id}`);
  let iconboxcheck = document.getElementById(
    `created-subtasks-iconbox${id}`
  ).nextElementSibling;
  subtasks[id][0] = field.value;
  field.value = `• ${field.value}`;
  field.disabled = true;
  iconboxedit.classList.toggle("invis");
  iconboxedit.classList.toggle("flex");
  iconboxcheck.classList.toggle("invis");
  iconboxcheck.classList.toggle("flex");
}

/**
 * Deletes a subtask.
 * @param {number} id - The ID of the subtask.
 */
function deleteSubtask(id) {
  subtasks.splice(id, 1);
  renderSubtasks();
}

/**
 * Checks if the category field is filled before creating the task.
 */
function checkRequired() {
  let category = document.getElementById("category-input");
  if (category.value == "") {
    category.style.borderColor = "red";
    category.style.borderWidth = "2px";
  } else {
    createTask(chosencolumn);
  }
}

/**
 * Creates a new task.
 */
async function createTask(column) {
  let category = column;
  let label = document.getElementById("category-input").value;
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let date = document.getElementById("duedate").value;
  let tasktoadd = new Task(category,label,title,description,date,subtasks,priority,assigned);
  tasks.push(tasktoadd);
  await setItem("taskobject", JSON.stringify(tasks));
  animateCreatedTask();
}

/**
 * Animates the display of the created task and redirects to the board page.
 */
function animateCreatedTask() {
  let addedbox = document.getElementById("added-to-board-box");
  addedbox.style.display = "flex";
  setTimeout(() => {
    addedbox.style.top = "40%";
  }, 200);
  setTimeout(() => {
    window.location.href = "board.html";
  }, 1500);
}

/**
 * Clears all input fields for adding a task.
 * @param {Event} event - The event object.
 */
function clearAddTask(event) {
  if (event) {event.preventDefault();}
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("duedate").value = "";
  document.getElementById("category-input").value = "";
  document.getElementById("subtasks").value = "";
  document.getElementById("tag-container").innerHTML = "";
  document
    .querySelectorAll(".assigned-checked")
    .forEach((c) => c.classList.remove("assigned-checked"));
  assigned = [];
  subtasks = [];  
  renderSubtasks();
  selectPrio("medium", event);
  displayUserMenu();
}

/**
 * Adds a subtask to the list of subtasks.
 */
function assignSubtask(inputcontainer) {
  let task = document.getElementById(inputcontainer).value;
  if (task !== "") {
    subtasks.push([task, 0]);
    document.getElementById(inputcontainer).blur();
    renderSubtasks();
  }
}

/**
 * Renders the list of subtasks.
 */
function renderSubtasks() {
  let container = document.getElementById("created-subtasks-container");
  container.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const task = subtasks[i][0];
    container.innerHTML += displaySubtask(task, i);
  }
}

/**
 * When writing the subtask, checking if enter is pressed to save the subtask
 * @param {string} event - Event Object
 */
function checkEnter(event, inputcontainer) {
  event.preventDefault();
  if (event.key === "Enter" || event.keyCode === 13) {
    assignSubtask(inputcontainer);
    clearInput(inputcontainer);
  }
}

/**
 * Displays a single subtask.
 * @param {string} task - The subtask.
 * @param {number} index - The index of the subtask.
 * @returns {string} - The HTML structure for displaying the subtask.
 */
function displaySubtask(task, index) {
  return `
  <div class="relative">
    <input type="text" class="created-subtasks-input" id="subtasks-input-c${index}" value="• ${task}"disabled="disabled">
    <div class="iconcontainer">
      <div id="created-subtasks-iconbox${index}" class="subtasks-iconbox flex">
        <div class="x-icon flex" onclick="editSubtask(${index})"><img src="./img/littlepen.png" alt="pen"></div>
        <img src="./img/vertbar.png" alt="divider">
        <div class="x-icon flex" onclick="deleteSubtask(${index})"><img src="./img/trash.png" alt="trash"></div>
      </div>
      <div class="subtasks-iconbox invis">
        <div class="x-icon flex" onclick="deleteSubtask(${index})"><img src="./img/trash.png" alt="trash"></div>
        <img src="./img/vertbar.png" alt="divider">
        <div class="x-icon flex" onclick="checkSubtask(${index})"><img src="./img/checksmall.png" alt="check"></div>
      </div>
    </div>
  </div>                
  `;
}

/**
 * Handles Click Events to close Dropdowns adn Burger-Menus.
 */
function closeDropDowns(event) {  
  if (document.getElementById("drop-menu-assigned")) {
    let assigneddrop = document.getElementById("drop-menu-assigned");
    let categorydrop = document.getElementById("drop-menu-category");  
    if (!event.target.closest('#assigned-input') && !event.target.closest('#arrowassigned') && !event.target.closest('.dropbox') &&
      !assigneddrop.classList.contains("invis")) {
      toggleDrop("arrowassigned");
    }
    if (!event.target.closest('#category-input') && !event.target.closest('#arrowcategory') && !event.target.closest('.dropbox') &&
      !categorydrop.classList.contains("invis")) {
      toggleDrop("arrowcategory");
    }
  }
}

/**
 * Handles Click Events to close Dropdown-Menu
 */
function closeDropDownsEdit(event) {  
  if (document.getElementById("drop-menu-assigned-edit")) {
      let assigneddrop = document.getElementById("drop-menu-assigned-edit");    
      if (!event.target.closest('#assigned-input-edit') && !event.target.closest('#arrowassigned-edit') && !event.target.closest('.dropbox') &&
      !assigneddrop.classList.contains("invis")) {
      toggleDrop("arrowassigned-edit");
      } 
  }   
} 

/**
 * Handles Click Event to close Burger-Menu.
 */
function closeTaskBurgers(event) {
  if (document.getElementById('taskpopup0')) {
    if(!event.target.closest('.paddot')) {
      for (let i = 0; i < tasks.length; i++) {
        const popup = document.getElementById(`taskpopup${i}`);
        if (!popup.classList.contains('d-none')) {
          popup.classList.add('d-none');
        }        
      }
    }
  }
}

/**
 * Handles Click Events to close Dropdowns and Burger-Menus.
 */
document.onclick = function (event) {
  closeDropDowns(event);
  closeDropDownsEdit(event);  
  closeTaskBurgers(event);    
};
