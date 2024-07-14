/**
 * Render-function for the task-edit function
 * @param {number} index - index of the task
 */
function openTaskEdit(index) {
    let task = tasks[index];
    subtasks = tasks[index].subtasks;
    assigned = tasks[index].assigned;
    let details = document.getElementById("task-details-container");
    details.innerHTML = `
    <div id="detailsContainer" onclick="closeTaskInfoSideClick(event)" class="details">
      <div id="task-details">
        <form action="javascript:void(0);" onsubmit="saveEditTask(${index})" onkeydown="return event.key != 'Enter';">
          <div class="task-and-close-container">
            <div></div>
            <img src="./img/close.svg" class="close-task" onclick="closeTaskInfo()">
          </div>
          <div class="task-bucket">        
            <div class="taskbranch">
                <span>Title</span>
                <input type="text" id="title-edit" placeholder="Enter a title" maxlength="40" value="${task.title}" required>
              </div>
              <div class="taskbranch">
                <span>Description</span>
                <textarea name="" id="description-edit" cols="30" rows="10" placeholder="Enter a description" maxlength="105">${task.description}</textarea>
              </div>
              <div class="taskbranch">
                <span>Due date</span>
                <input type="date" id="duedate-edit" value="${task.date}"required>
              </div>
              <div class="taskbranch">
                <span>Prio</span>
                <div class="buttonbox">
                  <button class="priobutton" id="urgent-edit" onclick="selectPrioEdit('urgent', event)">Urgent <img src="./img/upTask.svg" alt="urgent"></button>
                  <button class="priobutton mediumselect" id="medium-edit" onclick="selectPrioEdit('medium', event)">Medium <img src="./img/medium.svg" alt="medium"></button>
                  <button class="priobutton" id="low-edit" onclick="selectPrioEdit('low', event)">Low <img src="./img/downTask.svg" alt="low"></button>
                </div>
              </div>
              <div class="taskbranch">
                <span>Assigned to</span>
                <div class="assigned-wrapper">
                  <input type="text" id="assigned-input-edit" onclick="toggleDrop('arrowassigned-edit')" class="wrapper" placeholder="Select contacts to assign">
                  <div class="roundicon wrapper" onclick="toggleDrop(id)" id="arrowassigned-edit"><img src="./img/arrow_drop_down.svg" alt="arrow"></div>
                  <div class="invis absolute drop-menu" id="drop-menu-assigned-edit">                   
                  </div>   
                </div>                     
                <div id="tag-container-edit" class="flex gap-ss"></div>
              </div>
              <div class="taskbranch">
              <span>Subtasks</span>
              <div class="relative">             
                <input type="text" id="subtasks-edit" onclick="toggleSubtasksInput(id)" placeholder="Add new subtask" onkeyup="checkEnterEdit(event,id)">             
                <div class="iconcontainer">
                  <div class="invis" id="subtask-active-icons-edit">
                    <div class="x-icon flex" onclick="clearInput('subtasks-edit')"><img src="./img/close.svg" alt="x"></div>                
                    <img src="./img/vertbar.png" alt="divider">
                    <div class="x-icon flex" onclick="assignSubtaskEdit('subtasks-edit'), clearInput('subtasks-edit')"><img src="./img/checksmall.png" alt="check"></div>
                  </div>
                  <div class="x-icon flex pad" onclick="toggleSubtasksInput('subtasks-edit')"><img src="./img/add.svg" alt="plus"></div>
                </div>
                <div id="created-subtasks-container-edit">                           
                </div>
              </div>
            </div>
          </div>
          <div class="flex between wide">
            <div></div>
            <button class="info-ok-button" type="submit">Ok<img src="./img/check.svg" alt="check"></button>
          </div>
        </form>
      </div>
    </div>
    `;
    selectPrioEdit(task.priority, event);
    displayUserMenuEdit();
    renderAssignedUsers('tag-container-edit');
    renderSubtasksEdit();
  }

  /**
 * Renders the HTML structure for a task box.
 * @param {object} task - The task object containing details like title, description, subtasks, etc.
 * @param {number} index - The index of the task.
 * @returns {string} - The HTML structure for the task box.
 */
function renderTaskHTML(task, index) {
    return `
    <div onclick="openTaskInfo(${index}),renderInfoAssigned(${index}),renderInfoSubtasks(${index})" id="id${index}" 
       class="taskbox task" draggable="true" ondragstart="dragStart(${index})" ondragover="">
      <div class="flex between wide burger-wrapper">
        <div class="${task.label.toLowerCase().split(" ").join("")} flex center">${task.label}</div>
        <div class="flex center paddot" onclick="toggleTaskBurger(${index},event)"><img src="./img/dots.png" alt="move" id="task-burger"></div>
        <div id="taskpopup${index}"  class="taskpopup d-none">        
          <p>Move to:</p>
          <div class="task-burger-divider"></div>
          <p onclick="burgerMoveTo('todo',${index},event)">To do</p>
          <p onclick="burgerMoveTo('progress',${index},event)">In progress</p>
          <p onclick="burgerMoveTo('feedback',${index},event)">Await&nbspfeedback</p>
          <p onclick="burgerMoveTo('done',${index},event)">Done</p>        
        </div>
      </div>
      <div class="flex column gap-ss">
        <h3 class="start">${task.title}</h3>
        <p class="start">${task.description}</p>
      </div>
      <div class="barbox" id="bar${index}">
        <div class="barcontainer">
          <div class="bar" style="width: ${calcBar(task)}%;"></div>
        </div>
        <span>${calcChecked(task)}/${task.subtasks.length}&nbspSubtasks</span>
      </div>
      <div class="flex between wide">
        <div class="flex wrapper" id="userbox${index}">        
        </div>
      <img src="./img/${task.priority}.png" alt="priority">
      </div>              
    </div> 
    `;
  }

  /**
 * Renders the HTML structure for the task details panel.
 * @param {object} task - The task object containing details like title, description, subtasks, etc.
 * @returns {string} - The HTML structure for the task details panel.
 */
function renderTaskInfoHTML(task, index) {
    return `
    <div id="detailsContainer" onclick="closeAddTaskSideClick(event)" class="details">
      <div id="task-details">
        <div class="task-and-close-container">
          <div class="${task.label
            .toLowerCase()
            .split(" ")
            .join("")} flex center">${task.label}</div>
          <img src="./img/close.svg" class="close-task" onclick="closeTaskInfo()">
        </div>
        <div class="task-bucket">       
          <h2 class="task-details-header">${task.title}</h2>
          <p class="task-details-text">${task.description}</p>
          <div class="task-date">Due Date: ${task.date}</div>
          <div class="task-priority">Priority: ${capitalizeString(
            task.priority
          )} <img src="./img/${task.priority}.png" alt="priority"></div>
          <div class="task-assigned">
            <span>Assigned to: </span>
            <div id="info-assigned"></div>
          </div> 
          <div class="task-assigned">
            <span>Subtasks</span>
            <div id="info-subtasks"></div>    
          </div>
        </div>  
        <div class="info-buttons-container">
          <div class="info-button-delete" onclick="removeTask(${index})">
            <img src="./img/delete.svg" alt="delete">
            Delete
          </div>
          <img src="./img/VectorLinie.svg" alt="divider">
          <div class="info-button-edit" onclick="openTaskEdit(${index})">
            <img src="./img/edit.svg" alt="edit">
            Edit
          </div>
        </div>     
      </div>
    </div>
  `;
  }