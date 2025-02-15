let team1Score = 0;
let team2Score = 0;
let currentQuestion = 0;
let currentTry = 1; // 1 = Team 1's turn, 2 = Team 2's turn

const questions = [
    { question: "What does PHP stand for?", options: ["Personal Home Page", "PHP: Hypertext Preprocessor", "Public Hosting Page", "Preprocessing Home Page"], correct: "PHP: Hypertext Preprocessor" },
    { question: "Which of the following is correct for declaring a variable in PHP?", options: ["var x;", "$x;", "int x;", "declare x;"], correct: "$x;" },
    { question: "Which PHP function is used to send a header to the browser?", options: ["send_header()", "header()", "set_header()", "http_header()"], correct: "header()" },
    { question: "Which PHP function is used to include a file?", options: ["include()", "require()", "include_once()", "require_once()"], correct: "include()" },
    { question: "How do you start a session in PHP?", options: ["session_start();", "start_session();", "init_session();", "session_open();"], correct: "session_start();" },
    { question: "What is the correct HTML tag for the largest heading?", options: ["<h1>", "<header>", "<h6>", "<title>"], correct: "<h1>" },
    { question: "Which attribute is used to specify the source of an image in HTML?", options: ["src", "href", "source", "link"], correct: "src" },
    { question: "Which CSS property is used to change the font of an element?", options: ["font-size", "font-family", "font-style", "font-weight"], correct: "font-family" },
    { question: "Which of the following is used to add a comment in CSS?", options: ["/* comment */", "// comment", "# comment", "<!-- comment -->"], correct: "/* comment */" },
    { question: "Which HTML tag is used to define an unordered list?", options: ["<ul>", "<ol>", "<li>", "<list>"], correct: "<ul>" }
];

document.addEventListener("DOMContentLoaded", loadQuestion);

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showWinner();
        return;
    }

    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("answer-options");
    const feedbackContainer = document.getElementById("feedback-container");
    feedbackContainer.innerHTML = ""; // Clear previous feedback
    
    questionElement.innerText = questions[currentQuestion].question;
    optionsElement.innerHTML = ""; // Clear previous options

    questions[currentQuestion].options.forEach(option => {
        const li = document.createElement("li");
        li.innerText = option;
        li.onclick = () => checkAnswer(option);
        optionsElement.appendChild(li);
    });
}

function checkAnswer(selected) {
    const correctAnswer = questions[currentQuestion].correct;
    const feedbackContainer = document.getElementById("feedback-container");

    if (selected === correctAnswer) {
        feedbackContainer.innerHTML = `<p>Correct! ${currentTry === 1 ? "Team 1" : "Team 2"} gets a point.</p>`;
        if (currentTry === 1) team1Score++; else team2Score++;
        updateScores();
        document.getElementById("next-button").style.display = "block"; // Show next button
    } else {
        feedbackContainer.innerHTML = `<p>Incorrect! ${currentTry === 1 ? "Team 1" : "Team 2"} answered wrong.</p>`;
        if (currentTry === 1) {
            currentTry = 2; // Switch to Team 2
        } else {
            feedbackContainer.innerHTML += `<p>The correct answer was: ${correctAnswer}</p>`;
            document.getElementById("next-button").style.display = "block"; // Show next button
        }
    }
}

function nextQuestion() {
    currentQuestion++;
    currentTry = 1; // Reset to Team 1
    document.getElementById("next-button").style.display = "none"; // Hide next button
    loadQuestion();
}

function updateScores() {
    document.getElementById("team1-score").innerText = `Team 1: ${team1Score}`;
    document.getElementById("team2-score").innerText = `Team 2: ${team2Score}`;
}

function showWinner() {
    let winnerMessage = team1Score > team2Score ? "Team 1 wins!" : team2Score > team1Score ? "Team 2 wins!" : "It's a tie!";
    alert(`Game Over! ${winnerMessage}`);
}

// Center the Next button
document.addEventListener("DOMContentLoaded", () => {
    const nextButton = document.getElementById("next-button");
    nextButton.style.display = "block";
    nextButton.style.margin = "20px auto";
    nextButton.style.display = "none";
});
