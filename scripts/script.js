// Event Listener (click) for the back button to return to the previous page in the browser history

// if current page is /main do nothing
if (!window.location.href.includes("/main")) {
  document.getElementById("btnBack").addEventListener("click", function () {
    // if current page is login page, go to home page
    if (window.location.href.includes("/login") || window.location.href.includes("/signup")) {
      window.location.href = "/";
    } else {
      window.history.back();
    }

  });
}