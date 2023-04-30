window.console.log("Lobby");
let readUser = () => {
    var firebaseRef = firebase.database().ref();
    var ref = firebase.database().ref("User");
    var playersRef = firebase.database().ref("players");
    var state = firebase.database().ref("state");
    
    // Score borad
    ref.once("value").then((snapshot) => {
      var namebuff = "";
      let ListPlayer = [],
          ListID = [],
          ListScore = [];
      snapshot.forEach((data) => {
        var id = data.key;
          let userid = snapshot.child(id).val();
          let name = snapshot.child(id).child("username").val();
          let score = snapshot.child(id).child("score").val();
          // document.getElementById("userName").innerHTML = name;
          ListID.push(userid);
          ListPlayer.push(name);
          ListScore.push(score);

          //ShowName
          state.once("value").then((snapshot) => {
            snapshot.forEach((data)=>{
              var stateid = data.key;
              if(stateid == 'username'){
                let statename = snapshot.child(stateid).val();
                if(statename == name){
                  document.getElementById("userName").innerHTML = name;
                  namebuff = statename;
                }
              }
              if(stateid == 'score'){
                console.log("1" + namebuff);
                console.log("2" + name);
                let statescore = snapshot.child(stateid).val();
                console.log("Name buff " + namebuff);
                console.log("Name " + name);
                if(namebuff == name){
                  console.log("Match Name " + name + " " + namebuff);
                }
              }
            })
          })
      })

      var playerScore = new Array;
      for(let i = 0; i < ListScore.length; i++){
        let score = ListScore[i];
        let name = ListPlayer[i];
        var arr = {
            score : score, username : name
        }

        playerScore = playerScore.concat(arr);
        playerScore.sort();
      }
      playerScore.sort(function(a, b){return b.score - a.score});

      const newTable = document.createElement("tbody")
      newTable.innerHTML = "<thead></thead>"
      for(i of playerScore){
        const newRow = document.createElement("tr");
        const tdPlayer = document.createElement("td");
        const tdScore = document.createElement("td");
        tdPlayer.textContent = i.username;
        tdScore.textContent = i.score;    
        newRow.appendChild(tdPlayer);
        newRow.appendChild(tdScore);
        newTable.appendChild(newRow);
      }
      const target = document.getElementById('scoreTable');
      target.appendChild(newTable);
});
}
        // if(id == 'username'){
        //   let name = snapshot.child(id).val();
        //   console.log("Name " + name);
        //   document.getElementById("userName").innerHTML = name;
        // }
        // if(id == 'score'){
        //   let score = snapshot.child(id).val();
        //   document.getElementById("userScore").innerHTML = score;
        //   console.log("Score " + score);

window.onload = readUser;