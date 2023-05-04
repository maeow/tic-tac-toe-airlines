const refRoomsSingle = firebase.database().ref("RoomSingle");
// const country = (decodeURIComponent(window.location.search.replace(/^.*?\=/,'')))
console.log(country)

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User :", user);
        
    } else if(!user){
        $('#modalCheckLoggedin').modal('toggle')
        setTimeout(function(){
            window.location.href = "index.html"
        }, 2000);
    }
    else if(!country){
        alert('Pls choose country')
        setTimeout(function(){
            window.location.href = "level.html"
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
//     if(!join || !data){
//         alert("pls choose country to playe game")
//         window.location.href = "level.html"
//     }
// })

function playWithBot(){
    refRoomsSingle.once("value", (data) => {
        data = data.val()
        const currentUser = firebase.auth().currentUser
        let join = false;

        for( const roomID in data){
            const roomInfo = data[roomID];

            if (roomInfo["player-id"] == currentUser.uid){
                join = true;
            }
        }
        if(!join){
            refRoomsSingle.push({
                "player-id": currentUser.uid,
                "turn": "X",
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
            })
        }
        window.location.href = "XOwithBot.html?data="+encodeURIComponent(JSON.stringify(country));
    })
}

function backtoSubLV(){
    window.location.href = "semi-level.html?data="+encodeURIComponent(JSON.stringify(country.split("AND")[0]));
}