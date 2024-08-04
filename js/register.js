
/**** ARRAY CONTAINING PREDIFENED COLORS FOR USER REGISTRATION ****/
// @type {string[]}
const colors = [
    '#FF7A00',
    '#9327FF',
    '#6E52FF',
    '#FC71FF',
    '#FFBB2B', 
    '#1FD7C1',
    '#462F8A',
    '#FF4646',
    '#00BEE8',
    '#FF7A00',
];

/**** FUNCTION TO GET RANDOM COLOR FROM THE PREDEFINED ARRAY OF COLORS ****/
// @returns {string} - A randomly selected color hex code
function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

let color = getRandomColor();
let registerBtn = document.getElementById('registerBTN').disabled


// Hash the password
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**** FUNCTION TO DISPLAY A ERROR MESSAGE ****/
function messageRedPasswort() {
    const msg =  document.getElementById('messagePW');
    const input = document.getElementById('wrapperInputPW')
    msg.innerHTML = `It's not the same Password, please try again !`;
    msg.style.display = 'flex';
    input.style.margin = '0 0 8px 0 ';
}

/**** FUNCTION TO DISPLAY A ERROR MESSAGE INDICATING CHJECKBOX NOT CHECKED ****/

function messageRedCheckbox() {
    const msg =  document.getElementById('MessageCheckBox');
    msg.innerHTML = `Please agree the Checkbox before proceeding!`;
    msg.style.display = 'flex';
}

/**** FUNCTION TO DISPLAY SUCCES MESSAGE AFTER SUCCESSFUL REGISTRATION ****/
function messageSuccessfully() {
    const msg =  document.getElementById('messageBox')
    msg.innerHTML = `You Signed Up successfully`
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

/**** FUNCTION TO DISPLAY A ERROR MESSAGE INDICATIONG EMAIL ALREADY REGISTERED****/
function messageEmailRegistered() {
    const msg =  document.getElementById('MessageEmail');
    const input = document.getElementById('wrapperInputEmail')
    msg.innerHTML = `Email Address Already Registered`;
    msg.style.display = 'flex';
    input.style.margin = '0 0 5px 0 ';
}

/**** FUNCTION TO ADD A USER TO THE SYSTEM AFTER VALIDATION****/
async function addUser() {
    let checkbox = document.getElementById('remember-me');
    const hashedPassword = await hashPassword(password.value);
    const hashedPasswordAgain = await hashPassword(passwordAgain.value);    
    const isEmailRegistered = users.some(user => user.email === email.value);
    
    if (password.value === passwordAgain.value && !checkbox.checked == false && !isEmailRegistered) {
        users.push({
            name: nameUser.value,
            email: email.value,
            password: hashedPassword,
            passwordAgain: hashedPasswordAgain,
            color: color
        });
        await setItem('users', JSON.stringify(users));
        resetForm();
        messageSuccessfully(); 
        window.location.href = 'index.html'; 
    } else { 
        if (!checkbox.checked == true && !isEmailRegistered) {
            messageRedCheckbox();
        } 
        if (isEmailRegistered) {
            messageEmailRegistered();
        }
        if (password.value !== passwordAgain.value) {
            messageRedPasswort(); 
        }  
    }
}

/**** FUNCTION TO RESET THE VALIDATION FORM ****/
function resetForm() {
    nameUser.value = '';
    email.value = '';
    password.value = '';
    passwordAgain = '';
    registerBtn.disabled = false;
}