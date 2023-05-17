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
    // console.log("sun clicked");
    // var elements = document.querySelectorAll("#ray1b, #ray2b, #ray3b, #ray4b, #ray5b, #ray6b, #ray7b, #ray8b");
    // // access circle element
    // sun.classList.add("IncreaseSunSize");
    // elements.forEach(function (element) {
    //     element.style.animationPlayState = "running";
    //     element.style.display = "block";
    // });
    // var sunClone = sun.cloneNode(true);
    // sunClone.classList.add("sun-animation");

    // var sunContainer = document.getElementById("sunContainer");
    // sunContainer.appendChild(sunClone);

    // var randomAngle = Math.random() * 360; // Generate a random angle in degrees

    // var distance = 200; // Adjust the distance as desired
    // var radians = randomAngle * (Math.PI / 180); // Convert the angle to radians

    // // Calculate the X and Y components based on the angle and distance
    // var translateX = distance * Math.sin(radians);
    // var translateY = -distance * Math.cos(radians);

    // sunClone.style.transform = `translate(${translateX}px, ${translateY}px)`;
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
    // setTimeout(function () {
    //     sunClone.remove();
    // }, 2000);
}
);



