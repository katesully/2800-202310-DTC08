// const { func } = require("joi");

// add a blank event listener to all checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
let additionalStepsSelected = "";
let savedRoadmapId = "";


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


    var elements = document.querySelectorAll("#ray1b, #ray2b, #ray3b, #ray4b, #ray5b, #ray6b, #ray7b, #ray8b");
    elements.forEach(function (element) {
        element.style.animationPlayState = "running";
        element.style.display = "block";
    });


    for (var i = 0; i < 20; i++) {
        setTimeout(function () {
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

            setTimeout(function () {
                sunCloneContainer.remove();
            }, 1000);
        }, i * 500);
    }
    //remove IncreaseSunSize from sun classlist
    setTimeout(function () {
        sun.classList.remove("IncreaseSunSize");
        elements.forEach(function (element) {
            element.style.animationPlayState = "paused";
            element.style.display = "none";
        }
        );
    }
        , 9000);
});




//save roadmap object to MongoDB under user's account
async function saveRoadmap(roadmap) {
    closeBookmarkModal();
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
        .then(response => {
            if (response.ok) {
              return response.json(); // Parse response body as JSON
            } else {
              throw new Error('Error: ' + response.status);
            }
        })
          .then(data => {
            // Handle the server response
            console.log('Server response:', data);
            // Perform any further actions or update the page based on the response
            savedRoadmapId = data.data
            console.log("Roadmap id =" + savedRoadmapId);
        })
        .catch(error => {
            console.error('Error making POST request:', error);
        });

        document.getElementById("bookmarkSymbol").classList.toggle("fa-bounce");
        document.getElementById("bookmarkSymbol").classList.toggle("fa-solid");
        document.getElementById("bookmarkSymbolModal").classList.toggle("fa-bounce");
        document.getElementById("bookmarkSymbolModal").classList.toggle("fa-solid");
        document.getElementById("bookmarkSymbolStepsModal").classList.toggle("fa-bounce");
        document.getElementById("bookmarkSymbolStepsModal").classList.toggle("fa-solid");

        let bookmarkTexts = document.getElementsByClassName('bookmarkText')
        console.log('bookmark texts: ' + bookmarkTexts)
        for (let i = 0; i < bookmarkTexts.length; i++) {
            bookmarkTexts[i].textContent = " Roadmap saved!"
        }

}

async function createAdditionalSteps() {
    closeStepsModal();
    toggleLoader();
    console.log("create additional steps");
    console.log(additionalStepsSelected);
    console.log(savedRoadmapId);

    fetch("/sendAdditionalRequest", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({additionalSteps: additionalStepsSelected, roadmapId: savedRoadmapId})
        })
        .then(response => response.text())
        .then(html => {
        // Update the current page with the new HTML content
        document.documentElement.innerHTML = html;
        })
        .catch(error => {
            console.error('Error making POST request:', error);
        });


}

function additionalStepsModal(stepParagraph) {
    console.log("create additonal roadmap clicked");
    //access modal
    $('#additionalStepsModal').modal('show')
    
    additionalStepsSelected = stepParagraph.textContent.trim();
    console.log(additionalStepsSelected);
}

function bookmarkModal() {
    $('#bookmarkModal').modal('show')
}

function closeStepsModal() {
    $('#additionalStepsModal').modal('hide');
}

function closeBookmarkModal() {
    $('#bookmarkModal').modal('hide');
}

function toggleLoader() {
    var loader = document.getElementById('containerLoader');
    var content = document.getElementById('hideWhenLoading');
    
    if (loader.style.display === 'none') {
        loader.style.display = 'block';
        content.style.display = 'none';
    }
}
