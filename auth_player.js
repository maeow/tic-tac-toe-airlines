const signupForm = document.querySelector("#signup-form");
// signupForm.addEventListener("submit", createUser);
const signupFeedback = document.querySelector("#feedback-msg-signup");
const signupModal = new bootstrap.Modal(document.querySelector("#modal-signup"));


// signup
function createUser(event){
    event.preventDefault();
    const email = signupForm["input-email-signup"].value;
    const password = signupForm["input-password-signup"].value;
    const userRef = firebase.database().ref("UserList");
    const score = 0;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
        console.log("signup")
        signupFeedback.style = "color: green";
        signupFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> signup completed.";
        writeUserData(user)
        signupForm.reset();
        setTimeout(() => {
            signupModal.hide();
        }, 1000)
    })
    .catch((error) => {
        console.log('invalid')
        signupFeedback.style = "color: red";
        signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
        signupForm.reset();
    })
};
signupForm.addEventListener("submit", createUser);


//WriteUser in realtime
async function createNewAccount() {
    firebase.auth().onAuthStateChanged((user) => {
    if(user){
        var user = {
            score: 0,
            uid: user.uid,
            email: user.email,
        }
        writeUserData(user);
        getUserData(user.uid)
    }else{
        console.log("Unavailable user");
    }
});
}

function writeUserData(user) {
    console.log("Write Data")
    firebase.database().ref('users/' + user.uid).set(user).catch(error => {
        console.log(error.message)
    });
}

function getUserData(uid) {
    console.log("Read");
    var userRef = firebase.database().ref('users')
    userRef.once("value", snap => {
        console.log(snap.val());
    })
}


window.onload = createNewAccount();


//login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", loginUser);
const loginFeedback = document.querySelector("#feedback-msg-login");
const loginModal = new bootstrap.Modal(document.querySelector("#modal-login"));
function loginUser(event){
    event.preventDefault();
    const email = loginForm["input-email-login"].value;
    const password = loginForm["input-password-login"].value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        console.log("login")
        loginFeedback.style = "color: green";
        loginFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> login succeed!.";
        loginForm.reset();
        
        location.replace("./player_lb.html");
        setTimeout(() => {
            loginModal.hide();
        }, 1000)
    })
    .catch((error) => {
        console.log('invalid')
        loginFeedback.style = "color: red";
        loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
        loginForm.reset();
    })
}








