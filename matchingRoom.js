const refRooms = firebase.database().ref("RoomsOnline");
var waiting_status = "none";
var modal = document.getElementById("modalFindRoom");
var findct = document.getElementById("findcontent");
const country = (decodeURIComponent(window.location.search.replace(/^.*?\=/,''))).replaceAll('"',"")


// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       console.log("User :", user);
        
//     } else {
//         alert('Pls Log in')
//         setTimeout(function(){
//             window.location.href = "index.html"
//         }, 5000);
//     }
// });

function FindingMatch(){
    const currentUser = firebase.auth().currentUser
            
    if(!currentUser){
        alert('not login')
    }
    else{
        refRooms.once("value", data => {
            data = data.val()
            // console.log(data)

            if(!data){
                refRooms.push({
                    "player1-id": currentUser.uid,
                })
            }
            else{
                let joinedStatus = false;
                for (const roomID in data){
                    const roomInfo = data[roomID];
                    if (roomInfo["player1-id"] == currentUser.uid || roomInfo["player2-id"] == currentUser.uid){
                        joinedStatus = true;
                    }
                    else if (!roomInfo["player1-id"]){
                        refRooms.child(roomID).update({
                            "player1-id": currentUser.uid
                        })
                        joinedStatus = true;
                    }
                    else if (!roomInfo["player2-id"]){
                        refRooms.child(roomID).update({
                            "player2-id": currentUser.uid
                        })
                        joinedStatus = true;
                    }
                    if (joinedStatus){
                        return
                    }
                }
                if (!joinedStatus){
                    refRooms.push({
                        "player1-id": currentUser.uid,
                    })
                }
            }
        })
    }
}


function CancleMatching(){
    const currentUser = firebase.auth().currentUser

    refRooms.once("value", data => {
        data = data.val()
        for (const d in data){
            const objData = data[d]
            if (currentUser.uid === objData["player1-id"]){
                refRooms.child(d).child("player1-id").remove()
                return
            }
            else if (currentUser.uid === objData["player2-id"]) {
                refRooms.child(d).child("player2-id").remove()
                return
            }
        }
    })
}

function updateFindMatchContent(cmd, room={}){
    if (cmd === "match") {
        const currentUser = firebase.auth().currentUser
        if (currentUser.uid == room["player1-id"] || currentUser.uid == room["player2-id"]){          
                    console.log(room)
    
            let count = 5;
            const countGoToRoom = setInterval(() => {
                findct.innerHTML = '<span><b>พบคู่แข่งแล้ว!</b> <br><h5>รอสักครู่ เรากำลังพาคุณไปยังห้องเล่น!</h5></span>'
                $('#modalFindRoom').modal('show')
                count--;
                if (count == 0){
                    clearInterval(countGoToRoom)
                    window.location.href = "XOwithPlayer.html?data="+encodeURIComponent(JSON.stringify(country));
                }
            }, 1000)
        }
    }
    else if(cmd === "finding"){
        $('#modalFindRoom').modal('toggle')
    }
}


refRooms.on("value", (data) => {
    data = data.val()
    const currentUser = firebase.auth().currentUser

    for (const d in data){
        const objData = data[d]

        //กรณีห้องเปล่า
        if (!objData["player1-id"] && !objData["player2-id"]){
            refRooms.child(d).remove()
        }

        //กรณีห้องเต็มแต่ยังไม่มี status
        if (!objData.status && objData["player1-id"] && objData["player2-id"]){
            if (!objData.status){
                refRooms.child(d).update({
                    status: "match"
                })
            }
            updateFindMatchContent("match", objData)
            return
        }

        //ใส่ uid
        if (!objData.uid){
            refRooms.child(d).update({
                uid: d
            })
        }

        //ไม่มี status เราอยู่ในห้อง
        if (!objData.status && (currentUser.uid === objData["player1-id"] || currentUser.uid === objData["player2-id"])){
            updateFindMatchContent("finding", objData)
            return
        }
        //หาห้องเจอ
        else if (currentUser.uid === objData["player1-id"] || currentUser.uid === objData["player2-id"])
        {
            if(objData.status == "match" || objData.status == "start"){
                const player1 = objData["player1-id"];
                refRooms.child(d).update({
                    "turn": player1,
                    "cancle": false,
                    "tables": {
                        'A0': "", 
                        'A1': "", 
                        'A2': "",
                        'B0': "", 
                        'B1': "", 
                        'B2': "",
                        'C0': "", 
                        'C1': "", 
                        'C2': ""
                    },
                    "win" : false,
                    "winner": "",
                    // 
                  });
                updateFindMatchContent("match", objData)
            }
            else{

            }
        }
    }
})

window.addEventListener("load", (event) => {
    if(!country || !country.split("AND")[1]){
        alert('Pls choose country')
        setTimeout(function(){
            window.location.href = "level.html"
        }, 1000);
    }
  });