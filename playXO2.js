const refRooms = firebase.database().ref("RoomsOnline");
// const refRoomsCountry = firebase.database().ref("PlayCountry");
const refUser = firebase.database().ref("users");
var blocks = document.querySelectorAll('.xo-blog');
var win;
var room_id;
var player1;
var player2;
var turn;
var player_1_mark;
var player_2_mark;
const country_link = (decodeURIComponent(window.location.search.replace(/^.*?\=/,''))).replaceAll('"',"")
var country_list = ['fr', 'kr', 'usa', 'jp', 'th', 'uk'];
const WINNING_COMBINATIONS = [
    ['A0', 'A1', 'A2'],
    ['B0', 'B1', 'B2'],
    ['C0', 'C1', 'C2'],
    ['A0', 'B0', 'C0'],
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2'],
    ['A0', 'B1', 'C2'],
    ['A2', 'B1', 'C0']
]


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User :", user);
        
    } else {
        alert('Pls Log in')
        setTimeout(function(){
            window.location.href = "index.html"
        }, 1000);
    }
});

// refRoomsCountry.once("value", data => {
//     data = data.val()
//     const currentUser = firebase.auth().currentUser
//     let join = false;
//     for (const playCountryID in data){
//         const playCountryInfo = data[playCountryID];

//         if(playCountryInfo["player-id"] == currentUser.uid){
//             join = true;
//             if(playCountryInfo["subLevel"] == "" || playCountryInfo["subLevel"] == undefined){
//                 alert("pls choose place to playe game")
//                 window.location.href = "semi-level.html"
//                 return
//             }
//         }
//     }
//     if(!join){
//         alert("pls choose country to playe game")
//         window.location.href = "level.html"
//     }
// })

refRooms.on("value", data => {
    data = data.val()
    const currentUser = firebase.auth().currentUser
    for (const roomID in data){
        const roomInfo = data[roomID];
        if (roomInfo["player1-id"] == currentUser.uid || roomInfo["player2-id"] == currentUser.uid){
            turn = roomInfo["turn"];
            room_id = roomID;
            player1 = roomInfo["player1-id"];
            player2 = roomInfo["player2-id"];
            win = roomInfo["win"]
            drawMark(roomID, data);

            player_1_mark = [];
            player_2_mark = [];
            for(let i in roomInfo["tables"]){
                if(roomInfo["tables"][i]=="O"){
                    player_2_mark.push(i)
                }
                if(roomInfo["tables"][i]=="X"){
                    player_1_mark.push(i)
                }
            }
            if(player1 == currentUser.uid){
                refUser.once("value", data => {
                    data = data.val()
    
                    for (const userID in data){
                        const userInfo = data[userID];
                        if(userInfo["uid"] == player2){
                            document.getElementById('name2').innerText = userInfo["username"];
                            document.getElementById('mark2').innerText = 'player O';
                            document.querySelector('.dot-display-player2').src = "profile/avatar-"+userInfo["profile-number"]+".svg"
                        }
                        if(userInfo["uid"] == player1){
                            document.getElementById('name1').innerText = userInfo["username"];
                            document.getElementById('mark1').innerText = 'player X';
                            document.querySelector('.dot-display-player1').src = "profile/avatar-"+userInfo["profile-number"]+".svg"
                        }
                    }        
                })
                
            }
            else if(player2 == currentUser.uid){
                refUser.once("value", data => {
                    data = data.val()
    
                    for (const userID in data){
                        const userInfo = data[userID];
                        if(userInfo["uid"] == player1){
                            document.getElementById('name2').innerText = userInfo["username"];
                            document.getElementById('mark2').innerText = 'player X';
                            document.querySelector('.dot-display-player2').src = "profile/avatar-"+userInfo["profile-number"]+".svg"
                        }
                        if(userInfo["uid"] == player2){
                            document.getElementById('name1').innerText = userInfo["username"];
                            document.getElementById('mark1').innerText = 'player O';
                            document.querySelector('.dot-display-player1').src = "profile/avatar-"+userInfo["profile-number"]+".svg"
                        }
                    }        
                })
            }
        }
    }
    if(data[room_id]["cancle"] == true){
        document.getElementById('tieModal').innerHTML = '<span ><b style="color: black;">จบเกม</b><br><h5 style="color: black;text-align:left;">คู่แข่งทำการยกเลิกการแข่งขัน</h5></span>'
        $('#modalTie').modal('toggle')
    }
    if(data[room_id]["win"] == true){
        if(data[room_id]["winner"] == "draw"){
            $('#modalTie').modal('toggle')
        }
        else if(data[room_id]["winner"] == currentUser.uid){
            let country = country_link.split("AND")[0].replace('"', '')
            let sublevel = country_link.split("AND")[1].replace('"', '')
            refUser.once("value", data => {
                data = data.val()

                let score_now = 0;
                const userInfo = data[currentUser.uid];

                for(let ct of country_list){
                    console.log(userInfo[ct]);
                    for(let ct_sp in userInfo[ct]){
                       if(userInfo[ct][ct_sp] == true){
                            score_now += 100;
                        }
                    }
                }
                if(userInfo[country][sublevel] == false){
                    score_now += 100;
                }
                refUser.child(currentUser.uid).update({
                    "score" : score_now,
                    [country] : {
                        "subplace1" : userInfo[country]["subplace1"],
                        "subplace2" : userInfo[country]["subplace2"],
                        "subplace3" : userInfo[country]["subplace3"],
                        "subplace4" : userInfo[country]["subplace4"],
                        "subplace5" : userInfo[country]["subplace5"],
                        "subplace6" : userInfo[country]["subplace6"],
                        "subplace7" : userInfo[country]["subplace7"],
                        "subplace8" : userInfo[country]["subplace8"],
                        "subplace9" : userInfo[country]["subplace9"],
                        [sublevel] : true,
                    }
                })   
            })
            $('#modalWin').modal('toggle')
            return
        }
        else if(data[room_id]["winner"] != currentUser.uid){
            $('#modalLose').modal('toggle')
        }
    }
})

function endGame(){
    window.location.href = "level.html"
    refRooms.child(room_id).remove()
    
}

function drawMark(roomID, data){
    const roomInfo = data[roomID];

    for (const table in roomInfo["tables"]){
        document.getElementById(table).innerText = roomInfo["tables"][table];
    }
}

function addData(e){
    let mark;
    if(turn == player1){
        mark = 'X'
    }
    else if(turn == player2){
        mark = 'O'
    }

    if(player1 == turn){
        turn = player2;
    }
    else if(player2 == turn){
        turn = player1;
    }
    refRooms.child(room_id).update({
        "turn": turn,
    })
    refRooms.child(room_id).child("tables").update({
        [e.target.id]: mark,
    })
}

function checkResult(){
    let tie_game = true;

    for (var win_comb of WINNING_COMBINATIONS) {
        if(player_2_mark.includes(win_comb[0]) && player_2_mark.includes(win_comb[1]) && player_2_mark.includes(win_comb[2])){
            win = true;
            refRooms.child(room_id).update({
                "win": true,
                "winner": player2,
            })
            return
        }
        if(player_1_mark.includes(win_comb[0]) && player_1_mark.includes(win_comb[1]) && player_1_mark.includes(win_comb[2])){
            win = true;
            refRooms.child(room_id).update({
                "win": true,
                "winner": player1,
            })
            return
        }
    }

    refRooms.once("value", data => {
        data = data.val()
        const gameInfo = data[room_id];
        
        for (let table in gameInfo["tables"]) {
            if(gameInfo["tables"][table] == ''){
                tie_game = false;
            }
        }
    })

    if (win != true && tie_game == true) {
        // Game end and no-one wins the game
        refRooms.child(room_id).update({
            "win": true,
            "winner": "draw",
        })
        return
    } 
}

for (var block of blocks) {
    block.onclick = function (event) {
        const currentUser = firebase.auth().currentUser
        if (event.target.innerText == '' && turn == currentUser.uid && win != true){
            addData(event);
            checkResult();
        }
    }
}

function backGame(){
    refRooms.child(room_id).update({
        "cancle": true,
    })
    window.location.href = "level.html"
    refRooms.child(room_id).remove()
}