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
    sun.classList.add("IncreaseSunSize");

    //access element with id expanding-ray
    const expandingRay = document.getElementById("expanding-ray");
    //remove hidden class from expanding-ray
    expandingRay.classList.remove("hidden");

    //after 5 seconds, add hidden class to expanding-ray
    setTimeout(function () {
        expandingRay.classList.add("hidden");
    }
        , 5000);
}
);

const sunray = document.getElementById('sunray');
sunray.addEventListener('click', function () {
    this.classList.toggle('clicked');
});
