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
  console.log("read lobby");
  refUser.once("value", data => {
    data = data.val()
    const currentUser = firebase.auth().currentUser
    for (const userID in data){
      let score_now = 0;
        const userInfo = data[userID];
         if(userInfo["uid"] == currentUser.uid){
            for(let ct of country_list){
              console.log(userInfo[ct]);
               for(let ct_sp in userInfo[ct]){
                if(userInfo[ct][ct_sp] == true){
                  score_now += 100;
                    refUser.child(userID).update({
                      "score" : score_now,
                    })
                    document.getElementById("scoreText").innerHTML = score_now;
                    console.log(score_now);
                    console.log(userInfo['score']);
                }
               }
            }
        }
    }        
})

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
              // console.log(id);
              // console.log(score);
              // console.log(user.uid);
              // console.log("Match");
              document.getElementById("usernameText").innerHTML = username;
              // document.getElementById("scoreText").innerHTML = score;

              // console.log("Scoreboard");
              // console.log(score);

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
                // console.log(ListPlayer);

                // var playerScore = new Array;
                // for(let i = 0; i < ListScore.length; i++){
                //   let score = ListScore[i];
                //   let name = ListPlayer[i];
                //   var arr = {
                //       score : score, username : name
                //   }
          
                //   playerScore = playerScore.concat(arr);
                //   playerScore.sort();
                // }
                // playerScore.sort(function(a, b){return b.score - a.score});
                // // console.log(playerScore);

                // const newTable = document.createElement("tbody")
                // newTable.innerHTML = "<thead></thead>"
                // for(i of playerScore){
                //   const newRow = document.createElement("tr");
                //   const tdPlayer = document.createElement("td");
                //   const tdScore = document.createElement("td");
                //   tdPlayer.textContent = i.username;
                //   tdScore.textContent = i.score;    
                //   newRow.appendChild(tdPlayer);
                //   newRow.appendChild(tdScore);
                //   newTable.appendChild(newRow);
                // }
                // const target = document.getElementById('scoreTable');
                // target.appendChild(newTable);
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
                // console.log(playerScore);

                
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
                
                
            }
          });
        });
      }else{
        console.log("Unavailable user");
      }

  // console.log("Scoreborad");


});
}

window.onload = readAcc();




// firebase.auth().onAuthStateChanged((user) => {
//     if(user){
//         console.log(user.uid)
//     }else{
//         console.log("Unavailable user");
//     }
// });

// let addUserList = () => {
//     const score = 0;
//     firebase.auth().onAuthStateChanged((user) => {
//         if(user){
//             const userid = firebase.auth().currentUser;
//             if (userid != "") {
//                 const email = user.email;
//                 const uid = user.uid;
//                 console.log(email);
//                 console.log(uid);
//                 console.log(score);
//                 document.getElementById("usernameText").innerHTML = email;

//             }
//         }else{
//             console.log("Unavailable user");
//         }
//         });
// };
// window.onload = addUserList();