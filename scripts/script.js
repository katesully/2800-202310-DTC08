// Event Listener (click) for the back button to return to the previous page in the browser history
document.getElementById("btnBack").addEventListener("click", function () {
  // if current page is login page, go to home page
  if (window.location.href.includes("/login") || window.location.href.includes("/signup")) {
    window.location.href = "/";
  } else {
    window.history.back();
  }

});