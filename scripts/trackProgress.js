async function saveProgress(mapID) {
    //get all the checkboxes and save their state
    var checkboxes = document.querySelectorAll('input[type=checkbox]');
    var checkboxStates = [];
    checkboxes.forEach((checkbox) => {
        checkboxStates.push(checkbox.checked);
    }
    );

    //pass the checkboxStates array to the backend
    await axios.post("/saveProgress", { mapID: mapID, checkboxStates: checkboxStates }, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        console.log(response);
    }).catch(error => {
        console.log(error);
    });

    //reload page
    location.reload();
}

function saveCopy() {
    //get the array of steps
    var steps = document.querySelectorAll('.step');

    //create a new array to store the steps
    var stepObjects = [];

    //loop through each step and add an object with each step to the array
    steps.forEach((step) => {
        stepObjects.push({ step: step.innerText, checked: false });
    });

    //create new roadmap object to store the steps
    var roadmap = {
        title: document.getElementById('roadmapTitle').innerText,
        description: document.getElementById('roadmapDescription').innerText,
        steps: stepObjects
    };

    // pass the roadmap object to the backend
    axios.post("/saveCopy", { roadmap: roadmap }, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        console.log(response);
    }
    ).catch(error => {
        console.log(error);
    }
    );

    alert("Your roadmap has been saved to your account.");
}

function checkAll(mapID) {
    var checkboxes = document.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
    });
    unselectAll = document.getElementById("unselectAll");
    unselectAll.checked = false;
    saveProgress(mapID);
}

function uncheckAll(mapID) {
    var checkboxes = document.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    saveProgress(mapID);
}
