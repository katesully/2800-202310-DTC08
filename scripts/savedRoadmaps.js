let maptodelete;
let maptoshare;

function copyToClipboard() {
    console.log("copy to clipboard clicked")
    let inputIdField = document.getElementById("savedID")
    inputIdField.select();
    inputIdField.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    // add word copied! to the bottom of the modal
    let copiedText = document.getElementById("copiedText");
    copiedText.innerHTML = "Copied!";

}


function shareRoadmap(shareButton) {
    console.log("share roadmap clicked")
    $('#shareModal').modal('toggle')
    let maptoshare = shareButton.closest('.card');
    console.log(maptoshare.getAttribute("value"));
    let mapid = maptoshare.getAttribute("value");
    let shareURL = "https://outrageous-gold-pullover.cyclic.app/trackProgress?id=" + mapid;
    console.log(shareURL);
    let inputIdField = document.getElementById("savedID")
    // set value attribute to shareURL
    inputIdField.setAttribute("value", shareURL);
    let emailContent = document.getElementById("emailContent");
    emailContent.setAttribute("value", "I'm using this awesome app to track my progress on my roadmap. Check it out here: " + shareURL);


    copyBtn = document.getElementById("copyButton");
    copyBtn.addEventListener("click", copyToClipboard);

    let modalElement = document.getElementById("shareModal");
    modalElement.addEventListener("hidden.bs.modal", function () {
        let copiedText = document.getElementById("copiedText");
        copiedText.innerHTML = "";
        let emailDiv = document.getElementById("emailDiv");
        emailDiv.setAttribute("hidden", true);
        let emailContent = document.getElementById("emailContent");
        emailContent.setAttribute("value", "");

    });

    //add event listener to email button
    let emailBtn = document.getElementById("emailBtn");
    emailBtn.addEventListener("click", function () {
        // reveal div called .emailDiv
        let emailDiv = document.getElementById("emailDiv");
        // remove attribute hidden
        emailDiv.removeAttribute("hidden");
    });

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
    await axios.post("/deleteBookmark", { mapid: mapid }, {
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



