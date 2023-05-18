let maptodelete;
let maptoshare;


function shareRoadmap(shareButton) {
    console.log("share roadmap clicked")
    $('#shareModal').modal('toggle')

}

function deleteRoadmap(deleteButton) {
    console.log("delete roadmap clicked")
    $('#deleteModal').modal('toggle')
    maptodelete = deleteButton.closest('.card');
    console.log(maptodelete.getAttribute("value"));

}

async function confirmDelete() {
    console.log("confirm delete clicked")
    let mapid = maptodelete.getAttribute("value");
    console.log(mapid);
    await axios.post("/deleteBookmark", {mapid: mapid}, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            console.log(response);
            maptodelete.remove();
        })
        .catch(error => {

            alert("HTTP-Error: " + error);

        });
};



