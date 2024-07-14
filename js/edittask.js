/**
 * Displays the user menu dropdown.
 * Loads users and tasks before rendering.
 */
async function displayUserMenuEdit() {  
    await loadTasks();
    await loadContacts();  
    let dropbox = document.getElementById("drop-menu-assigned-edit");
    dropbox.innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
      const user = contacts[i].name;
      const color = contacts[i].color;
      dropbox.innerHTML += renderDropboxUserEdit(user, color, i);
    }
  }

  /**
 * Renders the HTML structure for a user in the dropdown menu.
 * @param {string} user - The name of the user.
 * @param {string} color - The color associated with the user.
 * @param {number} index - The index of the user.
 * @returns {string} - The HTML structure for the user in the dropdown menu.
 */
function renderDropboxUserEdit(user, color, index) {
    return `
      <div class="flex a-center between dropbox" id="e${index}" onclick="checkUserEdit(${index})">
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
 * setting the desired priority to be displayed as selected button, avoiding form submitting
 * @param {string} prio - input for the desired priority for the function
 * @param {string} event - event catching
 */
function selectPrioEdit(prio, event) {
    event.preventDefault();
    document
      .querySelectorAll(".priobutton")
      .forEach((b) =>
        b.classList.remove("urgentselect", "mediumselect", "lowselect")
      );
    document.getElementById(prio + '-edit').classList.add(`${prio}select`);
    priority = prio;
  }

  /**
 * Handles the selection/deselection of a user in the dropdown menu.
 * @param {number} id - The ID of the user.
 */
function checkUserEdit(id) {
    let container = document.getElementById(`e${id}`);
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
    renderAssignedUsers('tag-container-edit');
  }

  /**
 * Enables editing of a subtask.
 * @param {number} id - The ID of the subtask.
 */
function editSubtaskEdit(id) {
    let field = document.getElementById(`subtasks-input-e${id}`);
    let iconboxedit = document.getElementById(`created-subtasks-iconbox-edit${id}`);
    let iconboxcheck = document.getElementById(
      `created-subtasks-iconbox-edit${id}`
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
function checkSubtaskEdit(id) {
    let field = document.getElementById(`subtasks-input-e${id}`);
    let iconboxedit = document.getElementById(`created-subtasks-iconbox-edit${id}`);
    let iconboxcheck = document.getElementById(
      `created-subtasks-iconbox-edit${id}`
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
 * Renders the list of subtasks.
 */
function renderSubtasksEdit() {
    let container = document.getElementById("created-subtasks-container-edit");
    container.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
      const task = subtasks[i][0];
      container.innerHTML += displaySubtaskEdit(task, i);
    }
  }

  /**
 * Deletes a subtask.
 * @param {number} id - The ID of the subtask.
 */
function deleteSubtaskEdit(id, event) {
    event.stopPropagation();
    subtasks.splice(id, 1);
    renderSubtasksEdit();
  }

  /**
 * Adds a subtask to the list of subtasks.
 */
function assignSubtaskEdit(inputcontainer) {
    let task = document.getElementById(inputcontainer).value;
    if (task !== "") {
      subtasks.push([task, 0]);
      document.getElementById(inputcontainer).blur();
      renderSubtasksEdit();
    }
  }

  /**
 * When writing the subtask, checking if enter is pressed to save the subtask
 * @param {string} event - Event Object
 */
function checkEnterEdit(event, inputcontainer) {
    event.preventDefault();
    if (event.key === "Enter" || event.keyCode === 13) {
      assignSubtaskEdit(inputcontainer);
      clearInput(inputcontainer);
    }
  }

  /**
 * Displays a single subtask.
 * @param {string} task - The subtask.
 * @param {number} index - The index of the subtask.
 * @returns {string} - The HTML structure for displaying the subtask.
 */
function displaySubtaskEdit(task, index) {
    return `
    <div class="relative">
      <input type="text" class="created-subtasks-input" id="subtasks-input-e${index}" value="• ${task}"disabled="disabled">
      <div class="iconcontainer">
        <div id="created-subtasks-iconbox-edit${index}" class="subtasks-iconbox flex">
          <div class="x-icon flex" onclick="editSubtaskEdit(${index})"><img src="./img/littlepen.png" alt="pen"></div>
          <img src="./img/vertbar.png" alt="divider">
          <div class="x-icon flex" onclick="deleteSubtaskEdit(${index},event)"><img src="./img/trash.png" alt="trash"></div>
        </div>
        <div class="subtasks-iconbox invis">
          <div class="x-icon flex" onclick="deleteSubtaskEdit(${index},event)"><img src="./img/trash.png" alt="trash"></div>
          <img src="./img/vertbar.png" alt="divider">
          <div class="x-icon flex" onclick="checkSubtaskEdit(${index})"><img src="./img/checksmall.png" alt="check"></div>
        </div>
      </div>
    </div>                
    `;
  }   
  