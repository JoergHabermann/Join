/**
 * Array to store user data
 * @type {Object[]}
 */
 let users = [];

/**** FUNCTION TO RENDER THE INITAIL ANIMATION AND LOAD USER DATA ****/
function render() {
    loadAnimation();
}

/**** LOAD USER DATA FROM STORAGE  ****/
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e) {
        console.error('Loading error:', e);
    }
}

/**** FUNCTION TO ANIMATE THE LOGO AND LOAD USER DATA  ****/
function loadAnimation() {
    let logo = document.getElementById('logoImg');
    let logoWrapper = document.getElementById('logo');
    setTimeout(function() {
        logo.classList.add('active')
        loadUsers();
    }, 800);

    setTimeout(function() {
        ContentLogin();
        if (window.innerWidth <= 767) {
            logo.style.backgroundImage = 'url(img/join-logo.svg)';
            logoWrapper.style.background = 'transparent';
        }
    }, 1000);
}

/**** FUNCTION TO RENDER THE LOGIN CONTACT  ****/
function ContentLogin() {
    let content = document.getElementById('wrapperLogin');

    content.innerHTML += `
    <form id="formLogin" onsubmit="login(); return false">
        <div class="wrapper-heading">
            <h1>Log in</h1>
            <span class="linie"></span>
        </div>
        <div class="wrapper-input-field">
            <div id="emailInput" class="wrapper-input">
                <input type="email" placeholder="Email" id="email" required> 
                <img src="./img/mail.svg" alt="Email Icon">
            </div>
            <div id="MessageEmail"></div>
            <div id="pwInput" class="wrapper-input">
                <input type="password" placeholder="Password" id="password" required>
                <img src="./img/lock.svg" alt="Schloss Icon">
            </div>
            <p id="messagePW"></p>
            <div class="checkbox">
                <input type="checkbox" id="remember-me">
                <label for="remember-me">Remember Me</label>
            </div>
        </div>  
        <div class="wrapper-button">
            <button>Log in</button>
            <button type="button"  onclick="guestLogin()">Guest Log in</button>
        </div>
    </form>    
    <div class="wrapper-sing-up"> 
        <p>Not a Join user?</p>
        <a href="./registartion.html">Sign up</a>
    </div>
    <footer>
        <a href="./saveprivacy.html">Privacy Policy</a>
        <a href="./savelegal.html">Legal Notice</a>
    </footer>
    `;
}



/**
 * Function to hash a password using SHA-256 algorithm
 * @param {string} password - The password to be hashed
 * @returns {Promise<string>} - The hashed password
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


/**** FUNCTION TO HANDLE USER LOGIN  ****/
async function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let message = document.getElementById('messagePW');
    let messageEmail = document.getElementById('MessageEmail');
    let passwordBorder = document.getElementById('pwInput');
    let emailBorder = document.getElementById('emailInput');

    // Hash the entered password
    let hashedPassword = await hashPassword(password);

    // Search for the user in the database
    let user = users.find(u => u.email === email && u.password === hashedPassword);
    
    if(user) {
        // console.log('hello', user);
        loggedInUser.push({
            userInformation: user
        });
        // Set the "loggedIn" cookie with a path of "/", attribute "SameSite=None", and "secure"
        document.cookie = 'loggedIn=true; path=/; SameSite=None; secure';
        await setItem('userInformation', JSON.stringify(loggedInUser));
        window.location.href = 'summary.html'; 
    }else{
        // Überprüfe, ob die E-Mail falsch ist
        let userByEmail = users.find(u => u.email === email);
        if (!userByEmail) {
            messageEmail.innerHTML = `Wrong Email Ups! Try again.`;
            messageEmail.style.display = 'flex';
            emailBorder.style.margin = '0p 0px 8px 0 !important';
            emailBorder.style.borderColor = '#FF8190';
        }else{
            emailBorder.style.borderColor = '#65CC7A';
            messageEmail.style.display = 'none';
        }
        let userByPassword = users.find(u => u.password === hashedPassword)
        if(!userByPassword){
            message.innerHTML = `Wrong password Ups! Try again.`;
            message.style.display = 'flex';
            passwordBorder.style.margin = '0p 0px 8px 0 !important';
            passwordBorder.style.borderColor = '#FF8190';
        }else{
            passwordBorder.style.borderColor = '#65CC7A';
            message.style.display = 'none';
        }
    }
}


/**** FUNCTION TO HANDLE GUEST LOGIN ****/
function guestLogin() {
    loggedInUser = []; // Reset the loggedInUser variable
    // Delete the "loggedIn" cookie to activate guest mode
    document.cookie = 'loggedIn=false; path=/; SameSite=None; secure'; // Set cookie to false
    window.location.href = 'summary.html';
}

/**** RESET FORM  ****/
function resetForm() {
    nameUser.value = '';
    email.value = '';
    password.value = '';
    passwordAgain = '';
    registerBtn.disabled = false;

}