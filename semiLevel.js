const refUser = firebase.database().ref("users");

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User :", user);
      if(!country){
        document.getElementById("headModal").innerText = "คุณยังไม่ได้เลือกด่าน";
        document.getElementById("bodyModal").innerText = "เลือกด่านก่อนเข้าเล่นเกม";
        $('#modalCheckLoggedin').modal('toggle')
        setTimeout(function(){
            window.location.href = "level.html"
        }, 2000);
    }
    } 
    else if(!user){
        $('#modalCheckLoggedin').modal('toggle')
        setTimeout(function(){
            window.location.href = "index.html"
        }, 2000);
    }
});

const country = (decodeURIComponent(window.location.search.replace(/^.*?\=/,''))).replaceAll('"',"")
document.getElementById('goToJigsaw').disabled = true;

function subplace(targetID){
    var data = encodeURIComponent(JSON.stringify(country));
    if(document.getElementById(targetID).style.opacity == "1"){
        window.location.href = "choose-player.html?data="+country+"AND"+targetID;
    }
}

refUser.once("value", data => {
    data = data.val()

    const currentUser = firebase.auth().currentUser

    for (const userID in data){
        const userInfo = data[userID];
         if(userInfo["uid"] == currentUser.uid){
            if(userInfo[country]['subplace1'] == true && userInfo[country]['subplace2'] == true 
            && userInfo[country]['subplace3'] == true && userInfo[country]['subplace4'] == true 
            && userInfo[country]['subplace5'] == true && userInfo[country]['subplace6'] == true 
            && userInfo[country]['subplace7'] == true && userInfo[country]['subplace8'] == true 
            && userInfo[country]['subplace9'] == true){
                document.getElementById('goToJigsaw').disabled = false;
            }
            for(let i = 1 ; i <= 9 ; i++){
                if(userInfo[country]['subplace'+i] == true){
                    document.querySelectorAll('.arrive')[i-1].style.display = "block";
                    document.getElementById('subplace'+i).style.opacity = "0.5";
                }
                else if(userInfo[country]['subplace'+i] != true){
                    document.getElementById('subplace'+i).style.opacity = "1";
                }
            }
        }
    }        
})


function jigsaw(){
    window.location.href = "playJigsaw.html?data="+country;
}
