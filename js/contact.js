/**** FUNCRTION TO INITALIZIEZE THE APLICATION****/
async function init(){
    await loadContactUsers();
    templateWrapperInfo();
}

/**** RESET FUNCTION TO CLEAR ALL ****/
async function clearExistingUsers() {
    let existingUsers = [];// Setze die Benutzerliste auf ein leeres Array
    await setItem('contactUsers', existingUsers); // Speichere die geleerte Benutzerliste
    // console.log('Alle Benutzer erfolgreich gelöscht.');
}

/**** HTML TEMPLATE WRAPPER INFO RIGHT  ****/
function templateWrapperInfo(){
    const wrapper =  document.getElementById('wrapperInfo');
    wrapper.innerHTML += `
    <div class="heading"><h1>Contacts</h1><span class="linie"></span><p>Better with a team</p></div>
    <div id="userInfoDetails"></div>
    `
    if (window.innerWidth <= 1057) {wrapper.innerHTML = '';}
  }

/**** SAVE CONTACT TO LIST ****/
function addNewContact() {
    let overlay = document.getElementById('overlay');
    let container = document.getElementById('addContact');
    overlay.style.height = '100vh';
    overlay.style.position = 'fixed';
    container.style.display = 'flex';
    container.style.transform = 'translateX(1100px)';
    overlay.style.display = 'flex'; 

    setTimeout(function() {
        container.style.transform = 'translateX(0px)';
    }, 1); 
    const closeButton =  document.getElementById('closeImgNew')
    if (window.innerWidth <= 1057) {closeButton.src= './img/closeWhite.svg';}
}

/****  SAVE CONTACT  ****/
async function saveUser(){
  
    let existingUsers = await getItem('contactUsers');  // Load Contacts from Remote Storage
    existingUsers = existingUsers ? JSON.parse(existingUsers) : [];
    const colors = ['#0038FF','#00BEE8','#1FD7C1','#6E52FF','#9327FF', '#C3FF2B','#FC71FF','#FF4646','#FF5EB3','#FF745E','#FF7A00','#FFA35E','#FFBB2B','#FFC701','#FFE62B'];
    const color = colors[Math.floor(Math.random() * colors.length)];//Select random color
    existingUsers.push({
        name: nameUser.value,
        email: emailUser.value,
        phone: phoneUser.value,
        color: color
    });
    await setItem('contactUsers', JSON.stringify(existingUsers)); // Saving the updated array in remote storage.
    await loadContactUsers();
    messageSuccessfullyCreated();
    resetForm();
    let overlay = document.getElementById('overlay');
    let container = document.getElementById('addContact');
    container.style.transform = 'translateX(1600px)';
    setTimeout(function() {overlay.style.display = 'none';}, 500); 

    const firstChar = nameUser.value.charAt(0).toUpperCase();// Checking if an element for the initial letter already exists.
    const existingCharElement = document.querySelector(`.Buchstabe[data-char="${firstChar}"]`);
    if (!existingCharElement) {
        const allUsersContainer = document.getElementById('allUsers');
        allUsersContainer.innerHTML += `<p class="Buchstabe" data-char="${firstChar}">${firstChar}</p><span class="linie"></span>`;
    }
}

/****  KEYDOWN FUNCTIONV ,Block input if the key is not a number ****/
function onlyNumbers(event){
    const isNumber = /[0-9]/.test(event.key);
    if (!isNumber) { //    Block input if the key is not a number 
        event.preventDefault();
    }
}

/**** RESET FORM ****/
function resetForm(){
    nameUser.value = '';
    emailUser.value = '';
    phoneUser.value = '';
}

/**** MESSAGE ADD CONTACT  ****/
function messageSuccessfullyCreated(){
    const msg =  document.getElementById('messageBoxCreated')
    msg.innerHTML = `Contact succesfully created `;
    msg.style.transform = 'translateX(0%)';
    msg.style.display = 'block';
    setTimeout(function() {
        msg.style.transition = 'transform ease-in 1s';
        msg.style.transform = 'translateX(1000%)';
        setTimeout(function() {
            msg.style.display = 'none';
        }, 1); // Wait for the transition to complete before hiding the message box
    }, 2000); 
}

/**** OVERLAY TRANSFORM  ****/
function overlayTransform(){
    let overlay = document.getElementById('overlayEdit');
    let container = document.getElementById('editContact');
    container.style.transform = 'translateX(1600px)';
    setTimeout(function() {
        overlay.style.display = 'none';
    }, 500); 
}

/**** CLOSE CONATCT  ****/
function closeContact() {
    let overlay = document.getElementById('overlay');
    let container = document.getElementById('addContact');
    container.style.transform = 'translateX(1600px)';
    setTimeout(function() {
        overlay.style.display = 'none';
    }, 500); 
}

/**** LOAD CONTACT DATA ****/
async function loadContactUsers() {
    try { // LOAD DATA
        contactUsers = JSON.parse(await getItem('contactUsers'));
        if (contactUsers && contactUsers.length > 0) { // Check if data has been loaded.
            contactUsers.sort((a, b) => a.name.localeCompare(b.name)); // Sort contacts alphabetically by name
            const allUsersContainer = document.getElementById('allUsers');
            allUsersContainer.innerHTML = '';  //Delete existing contact list
            
            let existingChars = {}; // Object to track already added letter elements
            
            contactUsers.forEach((contact, index) => { // Iterate through sorted contacts and display them
                const firstChar = contact.name.charAt().toUpperCase(); // Get first character for grouping
                
                if (!existingChars[firstChar]) { // If the first character has not been added yet, add it.
                    allUsersContainer.innerHTML += `<p class="Buchstabe">${firstChar}</p><span class="linie"></span>`;
                    existingChars[firstChar] = true; // Mark the letter as already added.
                }
                
                const firstTwoChars = contact.name.slice(0, 2).toUpperCase(); // First two letteres uppercase
                const capitalizedWord = contact.name.charAt(0).toUpperCase() + contact.name.slice(1); // First char uppercase
                allUsersContainer.innerHTML += TemplateContactUsers(contact, index, firstTwoChars, capitalizedWord);// Show conatct html template
            });
        } else { 
            const allUsersContainer = document.getElementById('allUsers');
            allUsersContainer.innerHTML = '<p>Keine Kontaktbenutzer vorhanden</p>';
        }
    } catch (e) {
        // console.log('Fehler:', e);
    }
}


/**** HTML CONTACT LIST ****/
function TemplateContactUsers(contact, index,firstTwoChars, capitalizedWord) {
    return `
        <div class="contactUser" id="name${index}" onclick="showUserInfo('${contact.name}', '${contact.email}','${contact.color}','${contact.phone}','${index}')">
            <div id="ProfileBadge${index}" class="profileBadge" style="background-color: ${contact.color};">
                <p>${firstTwoChars}</p>
            </div>
            <div id="userInfo">
                <p id="nameContact">${capitalizedWord}</p>
                <p class="emailContact" id="${index}">${contact.email}</p>
            </div>
        </div>
    `;
}

/**** BACK FUNCTION TO NAVIGATE BACK ****/
function back(){
    const wrapper =  document.getElementById('wrapperInfo');
    wrapper.innerHTML ='';
    wrapper.style.zIndex = '-2';
}

/*** FUNCTION TO FOCUS CONTACT LIST ON USER CLICK ***/
async function onClickFocusUser(index, color) {
    if (window.innerWidth >= 1075) {
        let contactBadge = document.getElementById('name' + index);
        let emailBadge = document.getElementById(index);
        
        // Check if contactBadge is not null before accessing it.
        if (contactBadge) {
            contactBadge.style.border =  `3px solid white`;
            contactBadge.style.background = color;
            contactBadge.style.transition = '5s ease-in';
            contactBadge.style.boxShadow = '0px 0px 4px #0000001a';
            contactBadge.style.borderRadius = '20px';
            contactBadge.style.color = 'white';
            emailBadge.style.color = 'white';
        } else {
            //console.log('Der Kontakt wurde nicht geklickt');
        }
    } 
}

/*** TRANSITION FOR SIDE CONTACT INFORMATION ***/
function transitionUserInfoDetails(container) {
    if (container.style.transform === 'translateX(0px)') {
        container.style.transform = 'translateX(1100px)'; 
        setTimeout(function() {
            container.style.transform = 'translateX(0px)';
        }, 500); 
        if (window.innerWidth <= 1075) {
            wrapper.innerHTML= '';
        }
    } else {
        container.style.display = 'block';
        container.style.transform = 'translateX(1100px)';
        setTimeout(function() {
            container.style.transform = 'translateX(0px)';
        }, 1);
    }
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

/**** FUNCTION SHOW CONTACT INFORMATION ****/
async function showUserInfo(name, email, color, phone, index) {
    const wrapper = document.getElementById('wrapperInfo');
    wrapper.innerHTML =  HtmlTemplateUserInfo(name, email, color, phone, index);// Kontakt Template anzeigen
    const container = document.getElementById('userInfoDetails'); 
    wrapper.style.zIndex = '0';
    await loadContactUsers();
    onClickFocusUser(index, color);
    transitionUserInfoDetails(container); // Pass container as an argument
    if (name) {
        const firstTwoChars = firstAndSecondCharUppercase(name);
        const capitalizedWord = firstCharUppercase(name);
        container.innerHTML = TemplateSideConatct(index, color, email, name, phone, firstTwoChars, capitalizedWord);
    }
}

/**** MORE BUTTON ****/
function more() {
    // console.log('funktioniert')
    const wrapper = document.getElementById('mobileEdit');
    if (window.innerWidth <= 1075) {
        wrapper.style.display = 'block';
    } else {
        wrapper.style.display = 'none';
    }
}

/**** FIRST AND SECOND CHAR UPPERCASE ****/
function firstAndSecondCharUppercase(name) {
    const string = name;
    return string.slice(0, 2).toUpperCase();
}

/**** FIRST CHAR UPPERCASE ****/
/* @param {string} name - The name string / @returns {string} - The modified string with the first character in uppercase*/
function firstCharUppercase(name) {
    const firstLetter = name.charAt(0).toUpperCase();
    const restOfWord = name.slice(1);
    return firstLetter + restOfWord;
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


/**** DELETED MESSAGE ****/
function messageDeleted(name){
    const msg = document.getElementById('messageBox');
    msg.innerHTML = `User *${name}* deleted successfully`;
    msg.style.display = 'block';
    msg.style.transform = 'translateX(0%)';
    setTimeout(function() {
        msg.style.transition = 'transform ease-in 1s';
        msg.style.transform = 'translateX(1000%)';
        setTimeout(function() {
            msg.style.display = 'none';
        }, 1); // Wait for the transition to complete before hiding the message box
    }, 2000); 
    showUserInfo();
}


/**** DELETED CONTACT FUNCTION ****/
// @param {string} name - The name of the user to delete
async function deleteUser(name) {
    await loadContactUsers();
    try {
        let existingUsers = await getItem('contactUsers'); // Load existing users
       existingUsers = JSON.parse(await getItem('contactUsers'))
        const index = existingUsers.findIndex(user => user.name === name); // Find the index of the user to delete
        if (index !== -1) {
            messageDeleted(name);
            existingUsers.splice(index, 1); // Remove the user from the array
            await setItem('contactUsers', JSON.stringify(existingUsers));
            // console.log(`User ${name} deleted successfully.`);
            await loadContactUsers(); // Update the user list
            overlayTransform();
            resetForm(); 
        } else {
            console.error(`User ${name} not found.`);
        }
    } catch (error) {
        console.error(`Error deleting user ${name}:`, error);
    }
}

/**** EDIT CONTACT FUNCTION ****/
/* @param {string} name - The name of the user
    @param {string} email - The email of the user
    @param {string} color - The color associated with the user
    @param {string} phone - The phone number of the user
*/
async function editUser(name, email, color, phone) {
    await loadContactUsers();
    let overlayEdit = document.getElementById('overlayEdit');
    let containerEdit = document.getElementById('editContact');
    overlayEdit.style.height = '100vh';
    overlayEdit.style.position = 'absolute';
    containerEdit.style.display = 'flex';
    containerEdit.style.transform = 'translateX(1100px)';
    overlayEdit.style.display = 'flex';

    setTimeout(function() {
        containerEdit.style.transform = 'translateX(0px)';
    }, 1);
    
    const firstTwoChars = firstAndSecondCharUppercase(name); // Use the result of firstCharUppercase here
    containerEdit.innerHTML = TemplateContainerUpdate(name, email, color, phone, firstTwoChars);

   const closeButton =  document.getElementById('closeImg')
    if (window.innerWidth <= 1075) {
        closeButton.src= './img/closeWhite.svg';
    }
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

/**** FUNCTION TO DISPLAY A CUSCESS MESSAGE UPON UPDATING A CONTACT****/
function messageSuccessfully(){
    const msg =  document.getElementById('messageBox')
    msg.innerHTML = `User updated successfully`;
    msg.style.transform = 'translateX(0%)';
    msg.style.display = 'block';
    setTimeout(function() {
        msg.style.transition = 'transform ease-in 1s';
        msg.style.transform = 'translateX(1000%)';
        setTimeout(function() {
            msg.style.display = 'none';
        }, 1); // Wait for the transition to complete before hiding the message box
    }, 2000); 
    showUserInfo();
}

/**** FUNCTION TO UPDATE A CONTACT****/
/* Async function to update a use @param {string} name - The name of the user to update*/
async function updateUser(name, index, color) {
    const nameInput = document.getElementById('userInputUpdate').value;
    const email = document.getElementById('emailInputUpdate').value;
    const phone = document.getElementById('phoneInputUpdate').value;

    let existingUsers = await getItem('contactUsers');    // Load existing users from storage
    existingUsers = JSON.parse(existingUsers) || [];

    let userToUpdate = existingUsers.find(user => user.name === name);// Find the user to update by iterating through the array
    
    if (userToUpdate) {     // Update user data
        userToUpdate.name = nameInput;
        userToUpdate.email = email;
        userToUpdate.phone = phone;
         await setItem('contactUsers', JSON.stringify(existingUsers));  // Save the updated array to remote storage
         await loadContactUsers(); // Update the user list
         overlayTransform();
         messageSuccessfully(name);
         showUserInfo(); 
         const wrapper = document.getElementById('mobileEdit');
         wrapper.style.display = 'none'

         if (window.innerWidth <= 1250) {
            window.location.href = 'contact.html'; 
        }  
    } else {
        // console.log('User not found!');
    }
}

/**** FUNCTION TO CLOSE THE OVERLAY AND THE CONTACT USER EDIT FORM ****/
function closeUpdate() {
    let overlay = document.getElementById('overlayEdit');
    let container = document.getElementById('editContact');
    container.style.transform = 'translateX(1600px)';
    const wrapper = document.getElementById('mobileEdit');
    wrapper.style.display = 'none'
    setTimeout(function() {
        overlay.style.display = 'none';
    }, 500); 
}

