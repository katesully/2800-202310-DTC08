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

//create array for populating inspirational messages
const inspirationalMessages = [
    "Difficult roads often lead to beautiful destinations",
    "With every challenge, there is an opportunity for growth",
    "You are stronger than you think. Believe in yourself",
    "Embrace the unfamiliar and discover new possibilities.",
    "Remember why you started this journey and let that drive you forward",
    "You have the power to create a new story in this new chapter of your life"
]

//add event listener to the sun
const sun = document.getElementById("sun");
sun.addEventListener("click", function () {
    console.log("sun clicked");
    // access circle element
    sun.classList.add("IncreaseSunSize");

    // access element with id expanding-ray
    const expandingRay = document.getElementById("expanding-ray");

    //access inspirational message element
    const inspirationalMessage = document.getElementById("inspirational-message");
    //access random inspirational message
    const randomMessage = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
    //set inspirational message to random message
    inspirationalMessage.innerHTML = randomMessage;


    // remove hidden class from expanding-ray
    expandingRay.classList.remove("hidden");
    //remove hidden class from text
    inspirationalMessage.classList.remove("hidden");

    // after 10 seconds, add hidden class to expanding-ray and sunray image
    setTimeout(function () {
        expandingRay.classList.add("hidden");
    }, 10000);

    //after 7 seconds, add hidden class to text
    setTimeout(function () {
        inspirationalMessage.classList.add("hidden");
    }, 7000);
    console.log("sun clicked");

    var elements = document.querySelectorAll("#ray1b, #ray2b, #ray3b, #ray4b, #ray5b, #ray6b, #ray7b, #ray8b");
    sun.classList.add("IncreaseSunSize");
    elements.forEach(function(element) {
      element.style.animationPlayState = "running";
      element.style.display = "block";
    });
  
    var sunCloneContainer = document.createElement("div");
    sunCloneContainer.classList.add("sun-clone-container");
  
    var sunClone = sun.cloneNode(true);
    sunClone.classList.add("sun-animation");
  
    sunCloneContainer.appendChild(sunClone);
  
    var sunContainer = document.getElementById("sunContainer");
    sunContainer.appendChild(sunCloneContainer);
  
    var randomAngle = Math.random() * 360; // Generate a random angle in degrees
    var distance = 200; // Adjust the distance as desired
    var radians = randomAngle * (Math.PI / 180); // Convert the angle to radians
  
    var translateX = distance * Math.cos(radians);
    var translateY = distance * Math.sin(radians);
  
    sunCloneContainer.style.position = "absolute";
    sunCloneContainer.style.zIndex = "9999";
    sunCloneContainer.style.transform = `translate(${translateX}px, ${translateY}px)`;
  
    setTimeout(function() {
      sunCloneContainer.remove();
    }, 2000);
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
    roadmap.steps = roadmap.steps.map(function (message, i) {
        return { step: message, checked: checkboxeStates[i] };
    });


    fetch("/bookmarkRoadmap", {
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