const refRooms = firebase.database().ref("RoomSingle");
const refUser = firebase.database().ref("users");
var turn = 'X'
var win = false;
var room_id;
var winner = '';
var blocks = document.querySelectorAll('.xo-blog');
var ai_o;
var player_x;
var available = ['A0', 'A1', 'A2','B0', 'B1', 'B2','C0', 'C1', 'C2']
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
        
    } else if(!user){
        $('#modalCheckLoggedin').modal('toggle')
        setTimeout(function(){
            window.location.href = "index.html"
        }, 2000);
    }
});


refRooms.on("value", data => {
    data = data.val()
    const currentUser = firebase.auth().currentUser
    for (const roomID in data){
        const roomInfo = data[roomID];
        if (roomInfo["player-id"] == currentUser.uid){
            turn = roomInfo["turn"];
            room_id = roomID;
            win = roomInfo["win"]
            drawMark(roomID, data);
            

            refUser.once("value", data => {
                data = data.val()
    
                for (const userID in data){
                    const userInfo = data[userID];
                    if(userInfo["uid"] == currentUser.uid){
                        document.getElementById('name1').innerText = userInfo["username"];
                        document.querySelector('.dot-display-player1').src = "profile/avatar-"+userInfo["profile-number"]+".svg"
                        document.querySelector('.dot-display-player2').src = "profile/ai-profile.svg"
                    }
                }        
            })
                

            player_x = [];
            ai_o = [];
            for(let i in roomInfo["tables"]){
                if(roomInfo["tables"][i]=="O"){
                    ai_o.push(i)
                }
                if(roomInfo["tables"][i]=="X"){
                    player_x.push(i)
                }
            }
        }
    }
    if(data[room_id]["cancle"] == true){
        document.getElementById('tieModal').innerHTML = '<span ><i class="bi bi-x-octagon" style="color: black";></i><b style="color: black;">จบเกม</b><br><h5 style="color: black;text-align:left; margin-left:15px;"">คู่แข่งทำการยกเลิกการแข่งขัน</h5></span>'
        $('#modalTie').modal({backdrop: 'static', keyboard: false})
        $('#modalTie').modal('toggle')
        return
    }
    console.log(data[room_id]["win"] == true)
    if(data[room_id]["win"] == true){
        if(data[room_id]["winner"] == "draw"){
            $('#modalTie').modal('toggle')
            return
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
                       if(userInfo[ct][ct_sp] == true && ct_sp != 'completed_jigsaw'){
                            score_now += 100;
                        }
                    }
                }
                if(userInfo[country][sublevel] == false){
                    score_now += 100;
                }
                if(userInfo["already-complete"] == undefined){
                    score_now = score_now 
                }
                else{
                    score_now = score_now + (userInfo["already-complete"]*5400)
                }
                refUser.child(currentUser.uid).update({
                    "score" : score_now,
                    [country] : {
                        "completed_jigsaw" : false,
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
            return
        }
    }
    document.getElementById("whoTurn").innerText = data[room_id]["turn"];
})

function drawMark(roomID, data){
    const roomInfo = data[roomID];
    
    available = []
    for (const table in roomInfo["tables"]){
        if(roomInfo["tables"][table] ==  ""){
            available.push(table)
        }
        document.getElementById(table).innerText = roomInfo["tables"][table];
    }
}



for (var block of blocks) {
    block.onclick = function (event) {
        if (win == false && event.target.innerText == '' && turn != "O") {
            addData(event);
            checkResult(event);
        }
    }
}

function addData(e){
    let mark = 'X';

    turn = 'O'

    console.log(room_id)
    refRooms.child(room_id).update({
        "turn": turn,
    })
    refRooms.child(room_id).child("tables").update({
        [e.target.id]: mark,
    })
}


function checkResult(e) {
    var tie_game = true;
    const currentUser = firebase.auth().currentUser
    
    for (var win_comb of WINNING_COMBINATIONS) {
        if(player_x.includes(win_comb[0]) && player_x.includes(win_comb[1]) && player_x.includes(win_comb[2])){
            win = true;
            refRooms.child(room_id).update({
                "win": true,
                "winner": currentUser.uid,
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
    AIturn();
}


function AIturn(){
    let i = 0;
    let j = 0;
    let near_winX = [];
    let near_winO = [];
    let result = "";

    //กรณีai เรียง2
    for (var win_comb of WINNING_COMBINATIONS) {
        let first = (ai_o.includes(win_comb[0]) ? 1 : 0);
        let sec = (ai_o.includes(win_comb[1]) ? 1 : 0);
        let third = (ai_o.includes(win_comb[2]) ? 1 : 0);
        if(first+sec+third == 2){
            j++;
            if(first == 0){
                near_winO.push(win_comb[0]);
            }
            else if(sec == 0){
                near_winO.push(win_comb[1]);
            }
            else if(third == 0){
                near_winO.push(win_comb[2]);
            }
        }
    }
    for (var check_wincom of near_winO){
        if(available.includes(check_wincom) != true){
            near_winO = near_winO.filter(function(position){
                return position != check_wincom;
            })
            j--;
        }
    }
    if(j!=0){
        result = near_winO[getRandomInt(near_winO.length)];
    }

    //ดักไม่ให้ผู้เล่นชนะ
    for (var win_comb of WINNING_COMBINATIONS) {
        let first = (player_x.includes(win_comb[0]) ? 1 : 0);
        let sec = (player_x.includes(win_comb[1]) ? 1 : 0);
        let third = (player_x.includes(win_comb[2]) ? 1 : 0);
        if(first+sec+third == 2){
            i++;
            if(first == 0){
                near_winX.push(win_comb[0]);
            }
            else if(sec == 0){
                near_winX.push(win_comb[1]);
            }
            else if(third == 0){
                near_winX.push(win_comb[2]);
            }
        }
    }
    for (var check_wincom of near_winX){
        if(available.includes(check_wincom) != true){
            near_winX = near_winX.filter(function(position){
                return position != check_wincom;
            })
            i--;
        }
    }
    if(i != 0 && result == ""){
        result = near_winX[getRandomInt(near_winX.length)];
    }
    //ผู้เล่นไม่มีแถวที่ใกล้ชนะ
    else if(i == 0 && result == ""){
        result = available[getRandomInt(available.length)];
    }

    ai_o.push(result);
    
    
    // available = available.filter(function(position){
    //     return position != result;
    // })
    
    setTimeout(() => {
        // document.getElementById(result).innerText = "O"

        turn = 'X'
        refRooms.child(room_id).update({
            "turn": turn,
        })
        refRooms.child(room_id).child("tables").update({
            [result]: 'O',
        })

        for (var win_comb of WINNING_COMBINATIONS) {
            if(ai_o.includes(win_comb[0]) && ai_o.includes(win_comb[1]) && ai_o.includes(win_comb[2])){
                win = true;
                refRooms.child(room_id).update({
                    "win": true,
                    "winner": 'O',
                })
            }
        }

        for (var block of blocks) {
            if(block.innerText == ''){
                tie_game = false;
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
    }, 500);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function endGame(){
    // alert('d')
    refRooms.child(room_id).remove()
    window.location.href = "level.html"
}

function backGame(){
    refRooms.child(room_id).remove()
}