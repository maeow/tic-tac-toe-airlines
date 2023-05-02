const refUser = firebase.database().ref("users");
var country_list = ['fr', 'kr', 'usa', 'jp', 'th', 'uk'];
// var complete_jigsaw = false;


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User :", user);
        
    } else {
        alert('Pls Log in')
        setTimeout(function(){
            window.location.href = "index.html"
        }, 5000);
    }
});

function country_check(country){
    var data = encodeURIComponent(JSON.stringify(country));
    refUser.once("value", data => {
        data = data.val()
    
        const currentUser = firebase.auth().currentUser
    
        for (const userID in data){
            const userInfo = data[userID];
             if(userInfo["uid"] == currentUser.uid){
                if(userInfo[country]["completed_jigsaw"] == true){
                    window.location.href = "country/"+country+".html";
                }
                else{
                    window.location.href = "semi-level.html?data="+country;
                }
            }
        }        
    })
}

refUser.once("value", data => {
    data = data.val()

    const currentUser = firebase.auth().currentUser

    for (const userID in data){
        const userInfo = data[userID];
         if(userInfo["uid"] == currentUser.uid){
            for(let i = 1 ; i <= 6 ; i++){
                let country_chose = country_list[i-1];
                if(userInfo[country_chose]["completed_jigsaw"] == true){
                    complete_jigsaw = true;
                    for(let j of document.querySelectorAll('.'+country_chose+'-no')){
                        j.style.display = "none"
                    }
                    for(let i of document.querySelectorAll('.'+country_chose)){
                        i.style.display = "block"
                    }
                    
                // document.getElementById('goToJigsaw').disabled = false;
                }
            }
        }
    }        
})