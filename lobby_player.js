function getUser() {
  const userData = localStorage.getItem("tictac");
  const data = JSON.parse(userData);
  if (data) {
    document.getElementById("currentUserLogin").innerText = data.name;
    document.getElementById("currentUserId").innerText = data.score;
  }
}

getUser();
