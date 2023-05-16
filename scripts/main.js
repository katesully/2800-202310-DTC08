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
    // access circle element
    const circle = document.getElementById("circle");
    // change r attribute of circle
    circle.setAttribute("r", "10");

    const ray1 = document.getElementById("ray1");
    ray1.setAttribute("y2", "10");

}
);



