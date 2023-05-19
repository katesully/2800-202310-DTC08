async function saveProgress(mapID) {
    console.log('Saving progress...');

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

}