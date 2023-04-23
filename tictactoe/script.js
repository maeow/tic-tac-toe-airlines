function myFunction(x) {
    if (x.matches) { // If media query matches
      document.querySelector('.button').innerHTML = '<i class="bi bi-chevron-left"></i>';
  }
  else{
    document.querySelector('.button').innerHTML = '<i class="bi bi-chevron-left" style="margin-top:2vw;" ></i>ย้อนกลับ';
  }
}
  var x = window.matchMedia("(max-width: 915px)")
  myFunction(x) // Call listener function at run time
  x.addListener(myFunction) // Attach listener function on state changes