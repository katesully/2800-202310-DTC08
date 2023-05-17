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

    // access element with id expanding-ray
    const expandingRay = document.getElementById("expanding-ray");
    const expandingImageRay = document.getElementById("imageRay");

    // remove hidden class from expanding-ray
    expandingRay.classList.remove("hidden");
    expandingImageRay.classList.remove("hidden");

    // unhide sunray image
    sunray.classList.remove('hidden');

    // after 5 seconds, add hidden class to expanding-ray and sunray image
    setTimeout(function () {
        expandingRay.classList.add("hidden");
        expandingImageRay.classList.add("hidden");
        sunray.classList.add('hidden');
    }, 5000);
});











const sunray = document.getElementById('sunray');
sunray.addEventListener('click', function () {
    this.classList.toggle('clicked');
});


//save roadmap object to MongoDB under user's account
async function saveRoadmap(roadmap) {
    console.log("save roadmap clicked");
    console.log(roadmap);
    console.log(roadmap.title);
    //make checkbox array for state of each checkbox
    var checkboxeStates = [];
    
    //loop through each checkbox and add to array
    checkboxes.forEach((checkbox) => {
        checkboxeStates.push(checkbox.checked);
    });

    //make array of step objects including step message and checked state
    roadmap.steps = roadmap.steps.map(function(message, i) {
        return {step: message, checked: checkboxeStates[i]};
      });

    
    fetch("/bookmarkRoadmap" , {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(roadmap)
    })
    .catch(error => {
        console.error('Error making POST request:', error);
    });
}
