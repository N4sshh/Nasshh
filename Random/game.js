let team1Score = 0;
let team2Score = 0;
let currentQuestion = 0;
let currentTry = 1;  // 1 for Team 1's turn, 2 for Team 2's turn

const questions = [
    {
        question: "Which PHP function is used to display output?",
        options: ["echo", "print", "write", "show"],
        correct: "echo"
    },
    {
        question: "What does the `$_POST` variable do in PHP?",
        options: ["Stores form data", "Stores session data", "Stores URL parameters", "Stores cookies"],
        correct: "Stores form data"
    },
    {
        question: "Which of the following is used to start a session in PHP?",
        options: ["session_start()", "session_begin()", "session_create()", "start_session()"],
        correct: "session_start()"
    },
    {
        question: "How can you write a single-line comment in PHP?",
        options: ["// Comment", "# Comment", "/* Comment */", "Both // and #"],
        correct: "Both // and #"
    },
    {
        question: "Which symbol is used for variables in PHP?",
        options: ["$", "&", "#", "@"],
        correct: "$"
    },
    {
        question: "How do you define a constant in PHP?",
        options: ["define('CONSTANT', value)", "const CONSTANT = value", "constant('CONSTANT', value)", "Both 1 and 2"],
        correct: "Both 1 and 2"
    },
    {
        question: "What is the default port number for MySQL?",
        options: ["3306", "8080", "443", "21"],
        correct: "3306"
    },
    {
        question: "Which function is used to open a file in PHP?",
        options: ["fopen()", "file_open()", "open_file()", "open()"],
        correct: "fopen()"
    },
    {
        question: "How do you declare an array in PHP?",
        options: ["array()", "[]", "array[]", "new Array()"],
        correct: "array()"
    },
    {
        question: "What does `$_SESSION` store in PHP?",
        options: ["User session data", "Cookies", "Form data", "URL parameters"],
        correct: "User session data"
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
