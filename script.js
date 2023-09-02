function isVerificationCompleted() {
    return localStorage.getItem('verificationCompleted') === 'true';
}
function markVerificationCompleted() {
    localStorage.setItem('verificationCompleted', 'true');
}
const yesButton = document.getElementById('yes-button');
const onionVerification = document.getElementById('verify');

if (!isVerificationCompleted()) {
    yesButton.addEventListener('click', function () {
        onionVerification.style.display = 'none';
        markVerificationCompleted();
    });
} else {
    onionVerification.style.display = 'none';
}
function changeContent(backgroundImage, customHeaderText, customParagraphText) {
    const background = document.querySelector('.background-image');
    background.style.backgroundImage = `url(${backgroundImage})`;
  
    const centerH1 = document.getElementById('center_h1');
    const centerText = document.getElementById('center_text');
    centerH1.textContent = `${customHeaderText}`;
    centerText.textContent = `${customParagraphText}`;
  }
  
  function resetContent() {
    const background = document.querySelector('.background-image');
    background.style.backgroundImage = 'url(images/background.png)';
  
    const centerH1 = document.getElementById('center_h1');
    const centerText = document.getElementById('center_text');
    centerH1.textContent = 'Welcome, Onion friend!';
    centerText.textContent = 'Here you can find all my projects!';
  }