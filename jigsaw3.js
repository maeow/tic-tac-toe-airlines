const img = new Image();
const country = (decodeURIComponent(window.location.search.replace(/^.*?\=/,'')))
country.replaceAll('"')
const refUser = firebase.database().ref("users");
var country_list = {'fr' : "ประเทศฝรั่งเศส", 'kr':"ประเทศเกาหลี" , 'usa':"ประเทศฐอเมริกา" , 'jp':"ประเทศญี่ปุ่น", 'th':"ประเทศไทย", 'uk':"ประเทศอังกฤษ"};

if(screen.width < 1000){
  img.src = 'img/'+country.toUpperCase()+'_small.png';
}
else{
  img.src = 'img/'+country.toUpperCase()+'.png';
}
const canvas = document.getElementById('myCanvas');
const canvas_img = document.getElementById('ImgBlock');
const ctx = canvas.getContext('2d');
const ctx_img = canvas_img.getContext('2d')
var screen_width = screen.width;
var screen_height = screen.height;
var isDragging = null;
var startX, startY;
var mouseX = 0;
var mouseY = 0;
var zIndex_pnt = 1;
var piecesOfJigsaw = [];
var piecesOfJigsaw2 = [];
var complete = 0;
var alredy_comleted = false;

refUser.once("value", data => {
    data = data.val()
    const currentUser = firebase.auth().currentUser
    let join = false;
    for (const userID in data){
        const userInfo = data[userID];

        if(userInfo["uid"] == currentUser.uid){
          if(userInfo[country]['completed_jigsaw'] == true){
            complete = 9;
            alredy_comleted = true;
            _destroy(null)
            return
          }
        }
    }
})

img.addEventListener('load', function() {
    canvas.width = img.width;
    canvas.height = img.height;

    canvas_img.width = img.width
    canvas_img.height = img.width

    const numPieces = 3; // change this to change the number of pieces
    const pieceWidth = img.width / numPieces;
    const pieceHeight = img.height / numPieces;
    
    let num = 0;

    for (let y = 0; y < numPieces; y++) {
        for (let x = 0; x < numPieces; x++) {
          num++;
          const piece = document.createElement('canvas');
          const ctxP = piece.getContext('2d');

          const piece2 = document.createElement('canvas');
          const ctxP2 = piece2.getContext('2d');

          piece.width = pieceWidth;
          piece.height = pieceHeight;
          piece.id = 'piece'+(num)
          piece.style.position = "absolute";

          piece2.width = pieceWidth;
          piece2.height = pieceHeight;
          piece2.style.position = "absolute";
          piece2.style.zIndex = "-100";

          piece2.style.left = (x * pieceWidth) + (screen_width/2) - (img.width/2) + "px";
          piece2.style.top = (y * pieceHeight) + (screen_height/2) - (img.height/2) + "px";
          piece2.style.border = "1px solid #fff";
          piece2.style.opacity = 0.5

          piece.style.top = getRandom(screen_height-pieceHeight, pieceHeight)+'px'
          piece.style.left = getRandom(screen_width-pieceWidth, 0)+'px'
          piece.style.boxShadow = "5px 5px 2px #0002";
          piece.style.border = "1px solid #fff";

          piece.addEventListener("mousedown", handleMouseDown);
          piece.addEventListener('touchmove', function(e) {
            var touchLocation = e.targetTouches[0];

            zIndex_pnt += 1;
            piece.style.zIndex = zIndex_pnt;
            piece.style.left = (touchLocation.pageX-(pieceWidth/2)) + 'px';
            piece.style.top = (touchLocation.pageY-(pieceHeight/2)) + 'px';
          })
          
          ctxP.drawImage(img, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

          ctxP2.drawImage(img, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

          document.getElementsByClassName('board-wrap')[0].appendChild(piece2);

          document.getElementsByClassName('board-wrap')[1].appendChild(piece); 

          piecesOfJigsaw.push(piece);

          piecesOfJigsaw2.push(piece2);

          // clipToJigsawShape(ctxP, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight);
      }
    }
});
addEventListener("resize", (event) => {
  screen_width = screen.width;
  screen_height = screen.height;
  let num = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // console.log(piecesOfJigsaw2[num])
      piecesOfJigsaw2[num].style.left = (j * (img.width/3)) + (screen_width/2) - (img.width/2) + "px";
      piecesOfJigsaw2[num].style.top = (i * (img.height/3)) + (screen_height/2) - (img.height/2) + "px";
      num++;
    }
  }
});

function clipToJigsawShape(ctx, x, y, width, height) {
}

function getRandom(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var selected = null

function handleMouseDown(){
  _drag_init(this);
}

function _drag_init(elem) {
    selected = elem;
}

function _move_elem(e) {
    if (selected !== null) {
        selected.style.top = e.clientY-((img.height / 3)/2)  + "px";
        selected.style.left = e.clientX -((img.width / 3)/2)  + "px";
        zIndex_pnt += 1;
        selected.style.zIndex = zIndex_pnt;
    }
}

function _destroy(e) {
  if(selected != null){
    // console.log(selected)
    snapPieces(selected, piecesOfJigsaw2[parseInt(selected.id.replace("piece", ""))-1], e)
  }
  if(complete == 9){
    const currentUser = firebase.auth().currentUser

    document.querySelector('.country-name').innerText = country_list[country]
    refUser.once("value", data => {
    data = data.val()

    for (const userID in data){
      const userInfo = data[userID];
      if(userInfo["uid"] == currentUser.uid){
        refUser.child(userID).child(country.replace('"')).update({
          "completed_jigsaw" : true,
        })
      }
    }        
    })
    setTimeout(function(){
      document.getElementsByClassName('board-wrap')[0].innerHTML = '';
      document.getElementsByClassName('board-wrap')[1].innerHTML = ''; 
  
      const piece2 = document.createElement('canvas');
      const ctxP2 = piece2.getContext('2d');
      piece2.width = img.width;
      piece2.height = img.height;
      piece2.style.position = "absolute";
  
      ctxP2.drawImage(img, 0, 0);
  
      piece2.style.left = (screen_width/2) - (img.width/2) + "px";
      piece2.style.top = (screen_height/2) - (img.height/2) + "px";
  
      document.getElementsByClassName('board-wrap')[0].appendChild(piece2);
      if(alredy_comleted != true){
        setTimeout(function(){
          $('#modalJigsaw').modal('toggle')
        }, 500)
      }
    }, 1000)

    // ctx.drawImage(img, 0, 0, img.width, img.height);

    selected = null;
    complete = true;
  }
    selected = null;
}

function snapPieces(piece1, piece2, e) {
  const piece2Rect = piece2.getBoundingClientRect();
  if(e.clientX < piece2Rect.right && e.clientX > piece2Rect.left && e.clientY < piece2Rect.bottom && e.clientY > piece2Rect.top){
    piece1.style.left = piece2.style.left;
    piece1.style.top = piece2.style.top;
    piece1.style.boxShadow = "none";
    piece1.style.zIndex = -10
    piece1.removeEventListener("mousedown", handleMouseDown, false);
    complete += 1
  }
}

document.onmousemove = _move_elem;
document.onmouseup = _destroy;

function backtoSubLV(){
  window.location.href = "semi-level.html?data="+encodeURIComponent(JSON.stringify(country));
}

function toCountry(){
  window.location.href = "country/"+country+".html";
}