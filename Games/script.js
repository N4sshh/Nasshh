// Game state
let currentImage = 0;
let score = 0;
let gameStarted = false;

// DOM elements
const screenshot = document.getElementById('screenshot');
const resultEl = document.getElementById('result');
const explanationEl = document.getElementById('explanation');
const scoreEl = document.getElementById('score');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const imageOverlay = document.getElementById('imageOverlay');
const welcomeModal = document.getElementById('welcomeModal');
const feedbackModal = document.getElementById('feedbackModal');
const finalScoreEl = document.getElementById('finalScore');
const uxButton = document.getElementById('uxButton');
const uhOhButton = document.getElementById('uhOhButton');

// Game data
const images = shuffleArray([
    { url: "https://n4sshh.github.io/EXP/Images/guimaras.png", isGood: true, explanation: "Clean layout with clear hierarchy and good use of white space." },
    { url: "https://n4sshh.github.io/EXP/Images/tresha.png", isGood: false, explanation: "Cluttered interface with poor contrast and confusing navigation." },
    { url: "https://n4sshh.github.io/EXP/Images/nash.png", isGood: true, explanation: "Minimalist design with clear focus and excellent readability." },
    { url: "https://n4sshh.github.io/EXP/Images/radin.png", isGood: false, explanation: "Overwhelming color scheme and lack of visual hierarchy." },
    { url: "https://n4sshh.github.io/EXP/Images/mypage.png", isGood: true, explanation: "Responsive layout with intuitive navigation and consistent styling." },
    { url: "https://n4sshh.github.io/EXP/Images/Airbnb.png", isGood: true, explanation: "Excellent visual hierarchy with clear calls to action." },
    { url: "https://n4sshh.github.io/EXP/Images/Apple.png", isGood: true, explanation: "Clean aesthetic with strong focus on product imagery." },
    { url: "https://n4sshh.github.io/EXP/Images/Drop%20box.png", isGood: true, explanation: "Simple interface with clear value proposition." },
    { url: "https://n4sshh.github.io/EXP/Images/Forbes.png", isGood: false, explanation: "Excessive ads disrupt content flow and readability." },
    { url: "https://n4sshh.github.io/EXP/Images/Google.png", isGood: true, explanation: "Legendary simplicity with focused functionality." },
    { url: "https://n4sshh.github.io/EXP/Images/Notion.png", isGood: true, explanation: "Clean interface with excellent information architecture." },
    { url: "https://n4sshh.github.io/EXP/Images/NYT.png", isGood: false, explanation: "Overwhelming amount of content without clear hierarchy." },
    { url: "https://n4sshh.github.io/EXP/Images/USA.png", isGood: false, explanation: "Cluttered layout with too many competing elements." },
    { url: "https://n4sshh.github.io/EXP/Images/yale.png", isGood: false, explanation: "Dated design with poor mobile responsiveness." },
    { url: "https://n4sshh.github.io/EXP/Images/time.png", isGood: false, explanation: "Excessive pop-ups and intrusive advertising." }
]);

// Initialize game
function initGame() {
    showWelcomeModal();
    updateScore();
    updateProgress();
}

// Show welcome modal
function showWelcomeModal() {
    welcomeModal.classList.add('show');
    document.getElementById('startGame').addEventListener('click', startGame);
}

// Start the game
function startGame() {
    welcomeModal.classList.remove('show');
    gameStarted = true;
    loadCurrentImage();
}

// Load current image with preloading for faster transitions
function loadCurrentImage() {
    if (!gameStarted) return;
    
    // Fade out current image
    screenshot.style.opacity = '0';
    
    // Load and display new image
    screenshot.src = images[currentImage].url;
    
    // Ensure smooth transition if image is already cached
    if (screenshot.complete) {
        screenshot.style.opacity = '1';
    } else {
        screenshot.onload = function() {
            screenshot.style.opacity = '1';
        };
    }
    
    // Preload next two images for faster transitions
    if (currentImage < images.length - 1) {
        const nextImg1 = new Image();
        nextImg1.src = images[currentImage + 1].url;
    }
    if (currentImage < images.length - 2) {
        const nextImg2 = new Image();
        nextImg2.src = images[currentImage + 2].url;
    }
}

// Handle user answer with optimized transitions
function handleAnswer(userAnswer) {
    if (!gameStarted) return;
    
    // Disable buttons during transition
    uxButton.disabled = true;
    uhOhButton.disabled = true;
    
    const correctAnswer = images[currentImage].isGood;
    const isCorrect = userAnswer === correctAnswer;
    
    // Show result
    resultEl.textContent = isCorrect ? "✅ Correct!" : "❌ Incorrect";
    resultEl.style.color = isCorrect ? "var(--success-color)" : "var(--error-color)";
    if (isCorrect) score++;
    
    // Show explanation
    explanationEl.textContent = images[currentImage].explanation;
    updateScore();
    
    // Show overlay with feedback
    imageOverlay.textContent = correctAnswer ? "Good UX" : "Poor UX";
    imageOverlay.style.backgroundColor = correctAnswer ? "rgba(100, 255, 218, 0.8)" : "rgba(255, 95, 126, 0.8)";
    imageOverlay.style.opacity = '1';
    
    setTimeout(() => {
        imageOverlay.style.opacity = '0';
        resultEl.style.opacity = '0';
        explanationEl.style.opacity = '0';

        setTimeout(() => {
            currentImage++;
            updateProgress();

            if (currentImage >= images.length) {
                endGame();
            } else {
                loadCurrentImage();
                resultEl.textContent = "";
                explanationEl.textContent = "";
                resultEl.style.opacity = '1';
                explanationEl.style.opacity = '1';
                uxButton.disabled = false;
                uhOhButton.disabled = false;
            }
        }, 300);
    }, 1200);
}

// Update score display
function updateScore() {
    scoreEl.innerHTML = `<span>${score}</span> / <span>${images.length}</span>`;
}

// Update progress bar
function updateProgress() {
    const progress = (currentImage / images.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${currentImage + 1}/${images.length}`;
}

// End the game
function endGame() {
    finalScoreEl.innerHTML = `Your final score: ${score}/${images.length}`;
    feedbackModal.classList.add('show');
}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event listeners
uxButton.addEventListener('click', () => handleAnswer(true));
uhOhButton.addEventListener('click', () => handleAnswer(false));

// Initialize the game
initGame();
