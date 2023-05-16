// add a blank event listener to all checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", function () {
        var checkboxId = this.id;
        if (this.checked) {
            console.log("checkbox", this.id, "checked");
        }
        if (!this.checked) {
            console.log("checkbox", this.id, "unchecked");
        }
    });
});

//add event listener to the sun
const sun = document.getElementById("sun");
sun.addEventListener("click", function () {
    console.log("sun clicked");
    //change the background color of the body
    document.body.style.backgroundColor = "#f5f5f5";
}
);



