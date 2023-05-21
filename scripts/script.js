// Check if the current page is the main page, if so, hide the back button
if (window.location.pathname === "/main") {
    document.getElementById("btnBack").style.display = "none";
    document.getElementById("btnBack").disabled = true;
}

// Event Listener (click) for the back button to return to the previous page in the browser history
document.getElementById("btnBack").addEventListener("click", function() {
   window.history.back();
 });