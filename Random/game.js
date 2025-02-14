// game.js
let team1Score = 0;
let team2Score = 0;
let currentQuestion = 0;
let currentTry = 1;  // 1 for Team 1's turn, 2 for Team 2's turn

const questions = [
    {
        question: "Which HTML tag is used to define a hyperlink?",
        options: ["<a>", "<link>", "<href>", "<script>"],
        correct: "<a>"
    },
    {
        question: "Which CSS property is used to change text color?",
        options: ["color", "font-color", "background-color", "text-color"],
        correct: "color"
    },
    {
        question: "What will the following code output? console.log(3 + '3');",
        options: ["33", "6", "error", "NaN"],
        correct: "33"
    },
    {
        question: "Which JavaScript method is used to add an event listener?",
        options: ["addEventListener()", "eventListener()", "onEvent()", "bindEvent()"],
        correct: "addEventListener()"
    },
    {
        question: "What does CSS stand for?",
        options: ["Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets", "Custom Style Sheets"],
        correct: "Cascading Style Sheets"
    },
    {
        question: "Which HTML attribute specifies an alternate text for an image?",
        options: ["alt", "title", "src", "href"],
        correct: "alt"
    },
    {
        question: "Which of the following is used for styling web pages?",
        options: ["HTML", "CSS", "JavaScript", "XML"],
        correct: "CSS"
    },
    {
        question: "Which JavaScript function is used to parse a string to an integer?",
        options: ["parseInt()", "parseFloat()", "intParse()", "parseString()"],
        correct: "parseInt()"
    },
    {
        question: "Which HTML element is used to define a list item?",
        options: ["<li>", "<item>", "<ul>", "<list>"],
        correct: "<li>"
    },
    {
        question: "Which CSS property is used to set the background color of an element?",
        options: ["background-color", "color", "bgcolor", "background"],
        correct: "background-color"
    }
];

function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('answer-options');

    // Load the current question
    questionElement.innerText = questions[currentQuestion].question;

    // Clear previous options
    optionsElement.innerHTML = '';

    // Load answer options
    questions[currentQuestion].options.forEach(option => {
        const li = document.createElement('li');
        li.innerText = option;
        li.onclick = () => checkAnswer(option);
        optionsElement.appendChild(li);
    });
}

function checkAnswer(selected) {
    const correctAnswer = questions[currentQuestion].correct;

    if (selected === correctAnswer) {
        if (currentTry === 1) {
            // Team 1 gets the point for the correct first answer
            team1Score++;
            alert('Correct! Team 1 gets 1 point.');
        } else if (currentTry === 2) {
            // Team 2 gets the point for the correct second answer
            team2Score++;
            alert('Correct! Team 2 gets 1 point.');
        }
    } else {
        alert('Incorrect!');

        if (currentTry === 1) {
            // If Team 1 gets it wrong, switch to Team 2
            currentTry = 2;
        } else if (currentTry === 2) {
            // If Team 2 gets it wrong, move to the next question
            alert('Both teams got it wrong. Moving to the next question.');
            nextQuestion();
            return;
        }
    }

    // Update scores
    document.getElementById('team1-score').innerText = team1Score;
    document.getElementById('team2-score').innerText = team2Score;

    // Disable the "Next Question" button until an answer is chosen
    document.getElementById('next-button').disabled = false;
}

function nextQuestion() {
    // Go to the next question
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
        document.getElementById('next-button').disabled = true;
        currentTry = 1;  // Reset to Team 1's turn
    } else {
        alert('Game Over!');
        // Display final scores
        if (team1Score > team2Score) {
            alert('Team 1 wins!');
        } else if (team2Score > team1Score) {
            alert('Team 2 wins!');
        } else {
            alert('It\'s a tie!');
        }
    }
}

// Start the game
loadQuestion();
