const firebaseConfig = {
  apiKey: "AIzaSyDJtYUHXcixCILb19wIvSisWdByixqu-8I",
  authDomain: "tic-tac-toe-airlines.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-airlines-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tic-tac-toe-airlines",
  storageBucket: "tic-tac-toe-airlines.appspot.com",
  messagingSenderId: "478588820501",
  appId: "1:478588820501:web:ad3e5fa3af5c05bbe7421c",
  measurementId: "G-FCMED4Y7RB"
};
firebase.initializeApp(firebaseConfig)
const refUser = firebase.database().ref("users");
var country_list = ['fr', 'kr', 'usa', 'jp', 'th', 'uk'];

async function readAcc() {
  firebase.auth().onAuthStateChanged((user) => {
  if(user){
    console.log(user)
      var userRef = firebase.database().ref('users')
      userRef.once("value").then((snapshot) => {
          snapshot.forEach((data) => {
            var id = data.key;
            const currentUser = firebase.auth().currentUser
            if(id == user.uid){
              let score = snapshot.child(id).child("score").val();
              let username = snapshot.child(id).child("username").val();
              let profile_num = snapshot.child(id).child("profile-number").val();

              document.querySelector('.userphoto').src = "profile/avatar-"+profile_num+".png"
              document.getElementById("usernameText").innerHTML = username;
              document.getElementById("scoreText").innerHTML = score;

              var namebuff = "";
              let ListPlayer = [],
              ListID = [],
              ListScore = [];
              snapshot.forEach((data) => {
                var id = data.key;
                let userid = snapshot.child(id).val();
                let name = snapshot.child(id).child("email").val();
                let score = snapshot.child(id).child("score").val();
                ListID.push(userid);
                ListPlayer.push(name);
                ListScore.push(score);

              })
              console.log(ListPlayer);
              var playerScore = new Array;
                for(let i = 0; i < ListScore.length; i++){
                  let score = ListScore[i];
                  let name = ListID[i]["username"];
                  let uid = ListID[i];
                  var arr = {
                      score : score, username : name, uid : uid["uid"]
                  }
          
                  playerScore = playerScore.concat(arr);
                  playerScore.sort();
                }
                playerScore.sort(function(a, b){return b.score - a.score});

                
                // newTable.innerHTML = "<thead></thead>"
                let num = 0
                for(i of playerScore){
                  if(num >= 10){
                    // break
                  }
                  else{
                    // const newRow = document.createElement("tr");
                    const newTable = document.createElement("tr")
                    const tdscope = document.createElement("td");
                    const tdPlayer = document.createElement("td");
                    const tdScore = document.createElement("td");
                    tdscope.textContent = num+1;
                    tdPlayer.textContent = i.username;
                    tdScore.textContent = i.score;    
                    newTable.appendChild(tdscope);
                    newTable.appendChild(tdPlayer);
                    newTable.appendChild(tdScore);
                    const target = document.getElementById('scoreTable');
                    target.appendChild(newTable);
                    // newTable.appendChild(newRow);
                  }
                  num++
                  console.log(i);

                  if(i.uid == currentUser.uid){
                    document.getElementById("rank").innerText = "อันดับที่ "+num;
                  }

                }
                
                return
            }
          });
        });
      }else{
        console.log("Unavailable user");
      }


});
}

window.onload = readAcc();