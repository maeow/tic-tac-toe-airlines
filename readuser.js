// Hash password
function func(string) {
  var hash = 0;
  if (string.length == 0) return hash;
  for (i = 0; i < string.length; i++) {
    ch = string.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}

// SignUp
let addUserList = () => {
  var username = document.getElementById("usernameBox").value;
  var password = document.getElementById("passwordBox").value;

  const signupFeedback = document.querySelector("#error-msg-signup");
  const score = 0;

  const btn_login2 = document.querySelector("#btn_login2");

  if (username.length >= 5 && password.length >= 5) {
    console.log("true");
    let passhash = parseInt(func(password));
    console.log(passhash);

    const firebaseRef = firebase.database().ref("User");
    const playersRef = firebase.database().ref("players");

    firebaseRef
      .push({
        username: username,
        password: passhash,
        score: score,
      })
      .then((res) => {
        console.log(res.getKey()); // this will return you ID
        const refId = res.getKey();
        console.log(refId);
        playersRef.set({
          playerID: refId,
          username: username,
          score: score,
        });
      });

    signupFeedback.style = "color: green";
    signupFeedback.innerHTML = `ลงทะเบียนสำเร็จ`;
    btn_login2.innerHTML = `<button type="button" style="text-align: center;" id="btnLogin" class="logged-out" data-bs-toggle="modal" data-bs-target="#modal-login">เข้าสู่ระบบ</button>`;
    document.getElementById("usernameBox").value = "";
    document.getElementById("passwordBox").value = "";
  } else {
    console.log("invalid");
    signupFeedback.style = "color: red";
    signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> Username or Password Invalid`;
    document.getElementById("usernameBox").value = "";
    document.getElementById("passwordBox").value = "";
  }
};

const form = document.querySelector("#personalInfoForm");

// login
function checkUser() {
  var useLogin = document.querySelector("#usernameLogin");
  var passLogin = document.querySelector("#passwordLogin").value;
  let passLogin_hash = parseInt(func(passLogin));
  var userLogin = document.querySelector("#usernameLogin").value;
  var ref = firebase.database().ref("User");
  const loginFeedback = document.querySelector("#error-msg");
  const playersRef = firebase.database().ref("players");
  const statePlayer = firebase.database().ref("state");
  const score = 0;

  statePlayer
  .set({
    username: userLogin,
    password: passLogin_hash,
    score: score,
  });

  playersRef.once("value").then((snapshot) => {
    snapshot.forEach((data) => {
      var id = data.key;
      playersRef.once("value").then((snapshot) => {
        let playerID = snapshot.child(id).val();
        console.log(id + " " + playerID);
      });
    });
});

  ref.once("value").then((snapshot) => {
    snapshot.forEach((data) => {
      var id = data.key;
      ref.once("value").then((snapshot) => {
        let username = snapshot.child(id).child("username").val();
        let password = snapshot.child(id).child("password").val();
        if (useLogin.value == username) {
          console.log(useLogin.value);
          console.log(username);
        if (passLogin_hash == password) {
            console.log("Login complete");
            location.replace("./player_lb.html");
            statePlayer.set({
              username: userLogin,
              password: passLogin_hash,
              score: score,
            });
          }
        } else {
          console.log("invalid");
          loginFeedback.style = "color: red";
          loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> Username or Password Invalid`;
          document.getElementById("usernameBox").value = "";
          document.getElementById("passwordBox").value = "";
        }
      });
    });
  });
  
}

function cleardata() {
  const signupFeedback = document.querySelector("#error-msg-signup");
  const loginFeedback = document.querySelector("#error-msg");
  document.getElementById("usernameBox").value = "";
  document.getElementById("passwordBox").value = "";
  document.getElementById("usernameLogin").value = "";
  document.getElementById("passwordLogin").value = "";
  loginFeedback.innerHTML = "";
  signupFeedback.innerHTML = "";
}

const firebaseConfig = {
  apiKey: "AIzaSyDJtYUHXcixCILb19wIvSisWdByixqu-8I",
  authDomain: "tic-tac-toe-airlines.firebaseapp.com",
  databaseURL:
    "https://tic-tac-toe-airlines-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tic-tac-toe-airlines",
  storageBucket: "tic-tac-toe-airlines.appspot.com",
  messagingSenderId: "478588820501",
  appId: "1:478588820501:web:ad3e5fa3af5c05bbe7421c",
  measurementId: "G-FCMED4Y7RB",
};
firebase.initializeApp(firebaseConfig);
