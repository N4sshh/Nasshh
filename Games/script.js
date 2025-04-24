let currentImage = 0;
let imagesShown = 0;
let feedbackShown = false;
let score = 0;

const images = shuffleArray([
    { url: "https://n4sshh.github.io/EXP/Images/guimaras.png", isGood: true },
    { url: "https://n4sshh.github.io/EXP/Images/tresha.png", isGood: false },
    { url: "https://n4sshh.github.io/EXP/Images/nash.png", isGood: true },
    { url: "https://n4sshh.github.io/EXP/Images/radin.png", isGood: false },
    { url: "https://n4sshh.github.io/EXP/Images/mypage.png", isGood: true },
    { url: "https://n4sshh.github.io/EXP/Images/Airbnb.png", isGood: true },
    { url: "https://n4sshh.github.io/EXP/Images/Apple.png", isGood: true },
    { url: "https://n4sshh.github.io/EXP/Images/Dropbox.png", isGood: true },
    { url: "https://n4sshh.github.io/EXP/Images/Forbes.png", isGood: false },
    { url: "https://n4sshh.github.io/EXP/Images/Google.png", isGood: true },
    { url: "https://n4sshh.github.io/EXP/Images/Notion.png", isGood: true },
    { url: "https://n4sshh.github.io/EXP/Images/NYT.png", isGood: false },
    { url: "https://n4sshh.github.io/EXP/Images/USA.png", isGood: false },
    { url: "https://n4sshh.github.io/EXP/Images/Yale.png", isGood: false },
    { url: "https://n4sshh.github.io/EXP/Images/Time.png", isGood: false }
]);

document.getElementById('screenshot').src = images[currentImage].url;

document.getElementById('uxButton').addEventListener('click', () => handleAnswer(true));
document.getElementById('uhOhButton').addEventListener('click', () => handleAnswer(false));

function handleAnswer(userThinksGood) {
    const actualGood = images[currentImage].isGood;
    const result = document.getElementById('result');

    if (userThinksGood === actualGood) {
        result.textContent = "✅ Correct!";
        result.style.color = "green";
        score++;
    } else {
        result.textContent = "❌ Wrong!";
        result.style.color = "red";
    }

    const explanation = document.createElement("p");
    explanation.textContent = actualGood ? "This is a good UX design." : "This has poor UX practices.";
    result.appendChild(explanation);

    document.getElementById('score').textContent = `Score: ${score}/${images.length}`;

    setTimeout(() => {
        result.innerHTML = "";
        loadNextImage();
    }, 2500);
}

function loadNextImage() {
    currentImage++;
    imagesShown++;

    if (currentImage >= images.length) {
        document.getElementById('screenshot').style.display = "none";
        document.querySelector('.buttons').style.display = "none";
        document.getElementById('result').textContent = `🎉 Game over! Final score: ${score}/${images.length}`;
        setTimeout(askForFeedback, 2000);
        return;
    }

    const screenshot = document.getElementById('screenshot');
    screenshot.src = images[currentImage].url;
    screenshot.classList.remove("fade");
    void screenshot.offsetWidth; // Trigger reflow
    screenshot.classList.add("fade");
}

function askForFeedback() {
    if (document.getElementById('feedbackContainer')) return;

    const container = document.createElement('div');
    container.id = 'feedbackContainer';
    container.innerHTML = `
        <div class="feedback-container">
            <p>Do you think this game is helpful for learning UX principles?</p>
            <button class="button" id="goodButton">Yes</button>
            <button class="button" id="badButton">Needs Improvement</button>
            <button class="button" id="retryButton">Retry</button>
        </div>
    `;
    document.querySelector('.container').appendChild(container);

    document.getElementById('goodButton').onclick = () => {
        alert("Thanks for your feedback!");
        container.remove();
    };

    document.getElementById('badButton').onclick = () => {
        alert("Thanks! We'll improve it!");
        container.remove();
    };

    document.getElementById('retryButton').onclick = () => {
        location.reload();
    };
}

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
