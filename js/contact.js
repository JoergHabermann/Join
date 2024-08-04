/**** FUNCRTION TO INITALIZIEZE THE APLICATION****/
async function init(){
    await loadContactUsers();
    templateWrapperInfo();
}

/**** RESET FUNCTION TO CLEAR ALL ****/
async function clearExistingUsers() {
    let existingUsers = [];
    await setItem('contactUsers', existingUsers); 
    
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
    document.body.style.overflow = 'hidden';
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
    const closeButton =  document.getElementById('closeImgNew');    
}

/****  SAVE CONTACT  ****/
async function saveUser(){  
    document.body.style.overflow = 'auto';
    let existingUsers = await getItem('contactUsers');  
    existingUsers = existingUsers ? JSON.parse(existingUsers) : [];
    const colors = ['#0038FF','#00BEE8','#1FD7C1','#6E52FF','#9327FF', '#C3FF2B','#FC71FF','#FF4646','#FF5EB3','#FF745E','#FF7A00','#FFA35E','#FFBB2B','#FFC701','#FFE62B'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    existingUsers.push({
        name: nameUser.value,
        email: emailUser.value,
        phone: phoneUser.value,
        color: color
    });
    await setItem('contactUsers', JSON.stringify(existingUsers)); 
    await loadContactUsers();
    messageSuccessfullyCreated();
    resetForm();
    let overlay = document.getElementById('overlay');
    let container = document.getElementById('addContact');
    container.style.transform = 'translateX(1600px)';
    setTimeout(function() {overlay.style.display = 'none';}, 500); 
    const firstChar = nameUser.value.charAt(0).toUpperCase();
    const existingCharElement = document.querySelector(`.Buchstabe[data-char="${firstChar}"]`);
    if (!existingCharElement) {
        const allUsersContainer = document.getElementById('allUsers');
        allUsersContainer.innerHTML += `<p class="Buchstabe" data-char="${firstChar}">${firstChar}</p><span class="linie"></span>`;
    }
}

/****  KEYDOWN FUNCTIONV ,Block input if the key is not a number ****/
function onlyNumbers(event){
    const isNumber = /[0-9]/.test(event.key);
    if (!isNumber) { 
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
        }, 1); 
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
    document.body.style.overflow = 'auto';
    let overlay = document.getElementById('overlay');
    let container = document.getElementById('addContact');
    container.style.transform = 'translateX(1600px)';
    setTimeout(function() {
        overlay.style.display = 'none';
    }, 500); 
}

/**** LOAD CONTACT DATA ****/
async function loadContactUsers() {
    try { 
        contactUsers = JSON.parse(await getItem('contactUsers'));
        if (contactUsers && contactUsers.length > 0) { 
            contactUsers.sort((a, b) => a.name.localeCompare(b.name)); 
            const allUsersContainer = document.getElementById('allUsers');
            allUsersContainer.innerHTML = '';              
            let existingChars = {};             
            contactUsers.forEach((contact, index) => { 
                const firstChar = contact.name.charAt().toUpperCase();                 
                if (!existingChars[firstChar]) { 
                    allUsersContainer.innerHTML += `<p class="Buchstabe">${firstChar}</p><span class="linie"></span>`;
                    existingChars[firstChar] = true; 
                }                
                const firstTwoChars = contact.name.slice(0, 2).toUpperCase(); 
                const capitalizedWord = contact.name.charAt(0).toUpperCase() + contact.name.slice(1); 
                allUsersContainer.innerHTML += TemplateContactUsers(contact, index, firstTwoChars, capitalizedWord);
            });
        } else { 
            const allUsersContainer = document.getElementById('allUsers');
            allUsersContainer.innerHTML = '<p>Keine Kontaktbenutzer vorhanden</p>';
        }
    } catch (e) {
         console.log('Fehler:', e);
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
        if (contactBadge) {
            contactBadge.style.border =  `3px solid white`;
            contactBadge.style.background = color;
            contactBadge.style.transition = '5s ease-in';
            contactBadge.style.boxShadow = '0px 0px 4px #0000001a';
            contactBadge.style.borderRadius = '20px';
            contactBadge.style.color = 'white';
            emailBadge.style.color = 'white';
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

/**** FUNCTION SHOW CONTACT INFORMATION ****/
async function showUserInfo(name, email, color, phone, index) {
    const wrapper = document.getElementById('wrapperInfo');
    wrapper.innerHTML =  HtmlTemplateUserInfo(name, email, color, phone, index);
    const container = document.getElementById('userInfoDetails'); 
    wrapper.style.zIndex = '0';
    await loadContactUsers();
    onClickFocusUser(index, color);
    transitionUserInfoDetails(container);
    if (name) {
        const firstTwoChars = firstAndSecondCharUppercase(name);
        const capitalizedWord = firstCharUppercase(name);
        container.innerHTML = TemplateSideConatct(index, color, email, name, phone, firstTwoChars, capitalizedWord);
    }
}

/**** MORE BUTTON ****/
function more() {    
    const wrapper = document.getElementById('mobileEdit');    
    wrapper.style.display = 'block';    
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
        }, 1); 
    }, 2000); 
    showUserInfo();
}

/**** DELETED CONTACT FUNCTION ****/
// @param {string} name - The name of the user to delete
async function deleteUser(name) {
    await loadContactUsers();
    try {
        let existingUsers = await getItem('contactUsers');
       existingUsers = JSON.parse(await getItem('contactUsers'))
        const index = existingUsers.findIndex(user => user.name === name); 
        if (index !== -1) {
            messageDeleted(name);
            existingUsers.splice(index, 1);
            await setItem('contactUsers', JSON.stringify(existingUsers));            
            await loadContactUsers(); 
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
    document.body.style.overflow = 'hidden';
    await loadContactUsers();
    let overlayEdit = document.getElementById('overlayEdit');
    let containerEdit = document.getElementById('editContact');
    overlayEdit.style.height = '100vh';    
    containerEdit.style.display = 'flex';
    containerEdit.style.transform = 'translateX(1100px)';
    overlayEdit.style.display = 'flex';
    setTimeout(function() {
        containerEdit.style.transform = 'translateX(0px)';
    }, 1);    
    const firstTwoChars = firstAndSecondCharUppercase(name); 
    containerEdit.innerHTML = TemplateContainerUpdate(name, email, color, phone, firstTwoChars);
    const closeButton =  document.getElementById('closeImg');        
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
        }, 1); 
    }, 2000); 
    showUserInfo();
}

/**** FUNCTION TO UPDATE A CONTACT****/
/* Async function to update a use @param {string} name - The name of the user to update*/
async function updateUser(name, index, color) {
    document.body.style.overflow = 'auto';
    const nameInput = document.getElementById('userInputUpdate').value;
    const email = document.getElementById('emailInputUpdate').value;
    const phone = document.getElementById('phoneInputUpdate').value;
    let existingUsers = await getItem('contactUsers');   
    existingUsers = JSON.parse(existingUsers) || [];
    let userToUpdate = existingUsers.find(user => user.name === name);    
    if (userToUpdate) {     
        userToUpdate.name = nameInput;
        userToUpdate.email = email;
        userToUpdate.phone = phone;
         await setItem('contactUsers', JSON.stringify(existingUsers));  
         await loadContactUsers(); 
         overlayTransform();
         messageSuccessfully(name);
         showUserInfo(); 
         const wrapper = document.getElementById('mobileEdit');
         wrapper.style.display = 'none'
         /* if (window.innerWidth <= 1250) {
            window.location.href = 'contact.html'; 
        }   */
    }
}

/**** FUNCTION TO CLOSE THE OVERLAY AND THE CONTACT USER EDIT FORM ****/
function closeUpdate() {
    document.body.style.overflow = 'auto';
    let overlay = document.getElementById('overlayEdit');
    let container = document.getElementById('editContact');
    container.style.transform = 'translateX(1600px)';
    const wrapper = document.getElementById('mobileEdit');
    wrapper.style.display = 'none'
    setTimeout(function() {
        overlay.style.display = 'none';
    }, 500); 
}

