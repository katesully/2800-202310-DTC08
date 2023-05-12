if (window.location.pathname === "/main") {
    document.getElementById("btnBack").style.display = "none";
    document.getElementById("btnBack").disabled = true;
}

document.getElementById("btnBack").addEventListener("click", function() {
    // Go back to the previous page in the browser history
   window.history.back();
 });