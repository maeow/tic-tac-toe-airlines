function func(string) {
    var hash = 0;
    if (string.length == 0) return hash;
    for (i = 0 ;i<string.length ; i++)
    {
    ch = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash;
    }
    return hash;
    }

let addUserList = () => {
    var username = document.getElementById("usernameBox").value;
    var password = document.getElementById("passwordBox").value;
    const signupFeedback = document.querySelector("#error-msg-signup");
    const score = 0;

    if(username.length >= 5 && password.length >=5){
        console.log("true")
        let passhash = parseInt(func(password))
        console.log(passhash)

        const firebaseRef = firebase.database().ref("User");
        firebaseRef.push({
            username: username,
            password: passhash,
            score: score
        })
        signupFeedback.style = "color: green";
        signupFeedback.innerHTML = `ลงทะเบียนสำเร็จ`
        document.getElementById("usernameBox").value = "";
        document.getElementById("passwordBox").value = "";
    }else{
        console.log('invalid')
        signupFeedback.style = "color: red";
        signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> Username or Password Invalid`
        document.getElementById("usernameBox").value = "";
        document.getElementById("passwordBox").value = "";
    }

}

const form = document.querySelector('#personalInfoForm');
function checkUser(){
    var useLogin = document.querySelector("#usernameLogin");
    var passLogin = document.querySelector("#passwordLogin").value;
    let passLogin_hash = parseInt(func(passLogin))
    var ref = firebase.database().ref("User");
    const loginFeedback = document.querySelector("#error-msg");

    ref.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            var id = data.key;
            ref.once("value").then((snapshot) => {
                let username = snapshot.child(id).child("username").val();
                let password = snapshot.child(id).child("password").val();
                // console.log(username)
                if(useLogin.value == username){
                    console.log("Match")
                    if(passLogin_hash == password){
                        console.log("Login complete")
                        // location.replace("https://tic-tac-toe-airlines.web.app/player_lb.html");
                        location.replace("./player_lb.html");
                    }
                }else{
                    console.log('invalid')
                    loginFeedback.style = "color: red";
                    loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> Username or Password Invalid`
                    document.getElementById("usernameBox").value = "";
                    document.getElementById("passwordBox").value = "";
                }
            })
        })
    })
}

