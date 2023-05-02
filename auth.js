const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', createUser);

const signupFeedback = document.querySelector('#feedback-msg-signup');
const signupModal = new bootstrap.Modal(document.querySelector('#modal-signup'));

function createUser(event){
    event.preventDefault();
    const email = signupForm['input-email-signup'].value;
    const password= signupForm['input-password-signup'].value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
        signupFeedback.style = "color: green";
        signupFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> Signup Completed.";
        setTimeout(() => {
            signupModal.hide();
            signupForm.reset();
            signupFeedback.innerHTML = "";
        }, 1000)
    })
    .catch((error) => {
        signupFeedback.style = "color: crimson";
        signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`;
        signupForm.reset();
    })
}

const btnCancles = document.querySelectorAll(".btn-cancle")
btnCancles.forEach((btn) => {
    btn.addEventListener("click", () => {
        signupForm.reset();
        signupFeedback.innerHTML = "";
        loginForm.reset();
        loginFeedback.innerHTML = '';
    })
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // console.log("User :", user);
        getList(user);
    } else {
        
    }
    setupUI(user);
  });

  const btnLogout = document.querySelector('#btnLogout');
  btnLogout.addEventListener('click', function(){
    firebase.auth().signOut();
    console.log("Logout comleted.");
  })

  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', loginUser);

  const loginFeedback = document.querySelector('#feedback-msg-login');
  const loginModal = new bootstrap.Modal(document.querySelector('#modal-login'));
  
  function loginUser(event){
    event.preventDefault();
    const email = loginForm['input-email-login'].value;
    const password = loginForm['input-password-login'].value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        loginFeedback.style = 'color: green';
        loginFeedback.innerHTML = '<i class="bi bi-check-circle-fill"></i> Login succeed!.';
        setTimeout(() => {
            loginModal.hide();
            loginForm.reset();
            loginFeedback.innerHTML = '';
        }, 1000)
    })
    .catch((error) => {
        loginFeedback.style = "color : crimson";
        loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill></i> ${error.message}`
        loginForm.reset();
    })
  }