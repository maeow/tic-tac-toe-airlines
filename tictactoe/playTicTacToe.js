var turn = 'X'
var win = false;
var winner = '';
var blocks = document.querySelectorAll('.xo-blog');
var ai_o = [];
var player_x = [];
var available = ['A0', 'A1', 'A2','B0', 'B1', 'B2','C0', 'C1', 'C2']
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
console.log(blocks)
for (var block of blocks) {
    block.onclick = function (event) {
        // console.log(event.target)
        if (win == false && event.target.innerText == '' && turn != "O") {
            event.target.innerHTML = turn;
            checkResult(event);
        }
    }
}
function checkResult(e) {
    var tie_game = true;
    available = available.filter(function(position){
        return position != e.target.id;
    })
    player_x.push(e.target.id);
    for (var win_comb of WINNING_COMBINATIONS) {
        if(player_x.includes(win_comb[0]) && player_x.includes(win_comb[1]) && player_x.includes(win_comb[2])){
            win = true;
        }
    }

    for (var block of blocks) {
        if(block.innerText == ''){
            tie_game = false;
        }
    }

    if (win == true) {
        winner = turn;
        if(turn == "O"){
            winner = "Comp";
        }
        else{
            winner = "Player";
        }
        alert(winner)
    } else if (win == false && tie_game == true) {
        // Game end and no-one wins the game
        alert("Tie")
    } else {
        // The game is on going
        turn = turn === 'O' ? 'X' : 'O';
        if(turn == "O"){
            AIturn();
        }
    }
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
    available = available.filter(function(position){
        return position != result;
    })
    
    setTimeout(() => {
        document.getElementById(result).innerText = "O"

        for (var win_comb of WINNING_COMBINATIONS) {
            if(ai_o.includes(win_comb[0]) && ai_o.includes(win_comb[1]) && ai_o.includes(win_comb[2])){
                win = true;
            }
        }

        for (var block of blocks) {
            if(block.innerText == ''){
                tie_game = false;
            }
        }

        if (win == true) {
            winner = turn;
            if(turn == "O"){
                winner = "Comp";
            }
            else{
                winner = "Player";
            }
            alert(winner, "Wins")
        } else if (win == false && tie_game == true) {
            alert("Tie")
        } else {
            turn = turn === 'O' ? 'X' : 'O';
        }
    }, 500);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }