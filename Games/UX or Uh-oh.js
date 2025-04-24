let currentImage = 0; // Keep track of the current image
let imagesShown = 0;  // Counter to track how many images have been shown
let feedbackShown = false; // Flag to track if the feedback has already been shown

const images = [
    "https://n4sshh.github.io/EXP/Images/guimaras.png",
    "https://n4sshh.github.io/EXP/Images/tresha.png",
    "https://n4sshh.github.io/EXP/Images/nash.png",
    "https://n4sshh.github.io/EXP/Images/radin.png",
    "https://n4sshh.github.io/EXP/Images/mypage.png"
];

document.getElementById('screenshot').src = images[currentImage];

// Event listener for UX button
document.getElementById('uxButton').addEventListener('click', function() {
    showResult(true);
});

// Event listener for Uh-Oh button
document.getElementById('uhOhButton').addEventListener('click', function() {
    showResult(false);
});

// Show result and prepare next image
function showResult(isGoodUX) {
    const result = document.getElementById('result');
    result.textContent = isGoodUX
        ? "Great! This website follows good UX design."
        : "Uh-oh! This website has some UX issues.";
    result.style.color = isGoodUX ? "green" : "red";

    setTimeout(loadNextImage, 2000);
}

function loadNextImage() {
    currentImage++;
    imagesShown++;

    if (currentImage >= images.length) {
        currentImage = 0; // Optional: loop or stop here
    }

    document.getElementById('screenshot').src = images[currentImage];
    document.getElementById('result').textContent = "";

    if (imagesShown >= images.length && !feedbackShown) {
        setTimeout(askForFeedback, 2000);
        feedbackShown = true;
    }
}

function askForFeedback() {
    if (document.getElementById('feedbackContainer')) return; // Prevent duplicates

    const feedbackContainer = document.createElement('div');
    feedbackContainer.id = 'feedbackContainer';
    feedbackContainer.innerHTML = `
        <div class="feedback-container">
            <p>Do you think the overall website/game is good?</p>
            <button class="button" id="goodButton">Good</button>
            <button class="button" id="badButton">Bad</button>
        </div>
    `;
    document.querySelector('.container').appendChild(feedbackContainer);

    document.getElementById('goodButton').addEventListener('click', function () {
        alert("Thanks for your feedback! You think the website/game is good.");
        feedbackContainer.remove();
    });

    document.getElementById('badButton').addEventListener('click', function () {
        alert("Thanks for your feedback! You think the website/game needs improvement.");
        feedbackContainer.remove();
    });
}
