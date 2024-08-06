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
                <textarea name="" id="description-edit" cols="30" rows="10" placeholder="Enter a description" maxlength="150">${task.description}</textarea>
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

  /**** FUNCTION TO GENERATE THE HTML FOR DISPLAYING USER INFORMATION****/
/*
@param {number} index - The index of the user
@param {string} color - The color associated with the user
@param {string} email - The email of the user
@param {string} name - The name of the user
@param {string} phone - The phone number of the user
@param {string} firstTwoChars - The first two characters of the user's name in uppercase
@param {string} capitalizedWord - The user's name with the first character capitalized
@returns {string} - The HTML template for displaying user information
 */
function TemplateSideConatct(index,color,email,name,phone,firstTwoChars,capitalizedWord){
  return`
      <div id="userInfoSide">
      <div id="ProfileBadge${index}" class="profileBadge big" style="background-color: ${color};"> <p>${firstTwoChars}</p></div>
      
      <div class="wrapperFlex">
          <p id="nameContact" class="nameAside">${capitalizedWord}</p>
          <div id="editeDeleteWrapper" class="editeDeleteWrapper">
              <div class="edit"  onclick="editUser('${name}', '${email}','${color}','${phone}','${index}','${firstTwoChars}','${capitalizedWord}')">
                  <img id="editimg" src="./img/edit.svg" alt="edit icon">
                  <p>Edit</p>
              </div>
              <div class="delete" onclick="deleteUser('${name}')">
                  <img id="deleteImg" src="./img/delete.svg" alt="delete icon">
                  <p>Delete</p>
              </div>
          </div>
      </div>
      </div>
      <p class="contactInfo">Contact Information</p>
      <div>
      <div class="wrapperE">
          <p>Email</p>
          <a href="mailto:${email}">${email}</a>
      </div>
      <div class="wrapperP">
          <p>Phone</p>
          <a class="phone" href="tel:${phone}">+41(0)${phone}</a>
      </div>
      </div>
  `;
}

/**** FUNCTION TO GENERATE TH HTML TEMPLATE FOR EDITING A USER ****/
/*
@param {string} name - The name of the user
@param {string} email - The email of the user
@param {string} color - The color associated with the user
@param {string} phone - The phone number of the user
@param {string} firstTwoChars - The first two characters of the user's name in uppercase
@returns {string} - The HTML template for editing a user
 */
function TemplateContainerUpdate(name, email, color, phone, firstTwoChars) {
  return `
  <div class="wrapper-left">
      <img src="./img/join-logo-weiss.svg" alt="logo">
      <div class="text">
          <h1>Edit contact</h1>
          <span class="linie"></span>
      </div>
  </div>
  <div class="wrapper-right">
      <div id="close"><img  id="closeImg" class="close" src="./img/close.svg" alt="close" onclick="closeUpdate()"></div>
      <div class="badge edit " style="background: ${color};">
      <p>${firstTwoChars}</p>
      </div>
      <form class="saveUser" onsubmit="return false;">
          <div class="wrapper-input-field">
              <div class="wrapper-input">
                  <input type="text" id="userInputUpdate" placeholder="Name" value="${name}" required>
                  <img src="./img/person.svg" alt="Person Icon" req>
              </div>
              <div class="wrapper-input">
                  <input type="email" id="emailInputUpdate" placeholder="Email" value="${email}" required>
                  <img src="./img/mail.svg" alt="Email Icon">
              </div>
             
              <div class="wrapper-input">
                  <input type="tel" onkeypress="onlyNumbers(event)" id="phoneInputUpdate" placeholder="Phone" value="${phone}" required>
                  <img src="./img/call.svg" alt="Phone Icon">
              </div>
              <div class="wrapper-button">
                  <div class="wrapperButton">
                      <button class="cancel" onclick="deleteUser('${name}')"><img id="updateDeleteImg" src="./img/delete.svg" alt="delete icon">Delete</button>
                      <button class="BT-Black" onclick="updateUser('${name}')">Save<img src="./img/check.svg" alt="check"></button>
                  </div>
              </div>
          </div>
      </form>
  </div>
  `;
}

/**** HTML TEMPLATE SHOW CONTACT INFORMATION ****/
function HtmlTemplateUserInfo(name, email, color, phone, index){
  return`
  <div class="more" onclick="more()"><img src="./img/more_vert.svg" alt="see more"></div>
      <div  id="mobileEdit" class="editeDeleteWrapper" >
          <div class="edit" onclick="editUser('${name}', '${email}','${color}','${phone}','${index}')">
              <img class="editimg" src="./img/edit.svg" alt="edit icon">
              <p>Edit</p>
          </div>
          <div class="delete" onclick="deleteUser('${name}')">
              <img  class="deleteimg"src="./img/delete.svg" alt="delete icon">
              <p>Delete</p>
          </div>
      </div>
      <div id="back" onclick="back()">
          <img src="./img/arrow-left-line.svg" alt="">
      </div>
      <div class="heading">
          <h1>Contacts</h1>
          <div class="wrapperInnerHeaing">
              <span class="linie"></span>
              <p>Better with a team</p>
          </div>
      </div>
      <div id="userInfoDetails"></div> `
}