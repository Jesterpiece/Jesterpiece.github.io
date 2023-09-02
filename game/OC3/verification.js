const rotateSlider = document.getElementById("rotateSlider");
const waterLevel2 = document.querySelector(".water-level2");
const verifyButton = document.getElementById("verifyButton");
const verificationResult = document.getElementById("verificationResult");
const firstBody = document.getElementById("firstbody");
const site = document.getElementById("site");

const verifySliderValue = () => {
    const rotationValue = parseInt(rotateSlider.value);

    if (rotationValue >= -46 && rotationValue <= -44) {
        verificationResult.textContent = "Welcome, friend";
        console.log("Verified");
        // Hide firstbody
        firstBody.style.display = "none";
        // Unhide site
        site.removeAttribute("hidden");
    } else {
        verificationResult.textContent = "This isn't a site for cooking recipes. Leave!";
        console.log("Failed");
        rotateSlider.disabled = true;
    }
};

rotateSlider.addEventListener("input", () => {
    const rotationValue = rotateSlider.value;
    waterLevel2.style.transform = `rotate(${rotationValue}deg)`;
});

verifyButton.addEventListener("click", verifySliderValue);