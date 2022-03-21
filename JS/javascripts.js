function block1() {
  document.getElementById("Drop-content1").classList.toggle("show");
  document.querySelector(".dropbtn__one-block").classList.toggle("active");
}

function block2() {
  document.getElementById("Drop-content2").classList.toggle("show");
  document.querySelector(".dropbtn__two-block").classList.toggle("active");
}

function block3() {
  document.getElementById("Drop-content3").classList.toggle("show");
  document.querySelector(".dropbtn__three-block").classList.toggle("active");
}

function block4() {
  document.getElementById("Drop-content4").classList.toggle("show");
  document.querySelector(".dropbtn__four-block").classList.toggle("active");
}


// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.dropbtn')) {
  var dropdowns = document.getElementsByClassName("services__card-dropdown");
  var i;
}
}




