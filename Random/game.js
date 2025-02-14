let team1Score = 0;
let team2Score = 0;
let currentQuestion = 0;
let currentTry = 1;  // 1 for Team 1's turn, 2 for Team 2's turn
let answered = false; // Track if both teams have answered

const questions = [
    {
        question: "What does PHP stand for?",
        options: ["Personal Home Page", "PHP: Hypertext Preprocessor", "Public Hosting Page", "Preprocessing Home Page"],
        correct: "PHP: Hypertext Preprocessor"
    },
    {
        question: "Which of the following is correct for declaring a variable in PHP?",
        options: ["var x;", "$x;", "int x;", "declare x;"],
        correct: "$x;"
    },
    {
        question: "Which PHP function is used to send a header to the browser?",
        options: ["send_header()", "header()", "set_header()", "http_header()"],
        correct: "header()"
    },
    {
        question: "Which PHP function is used to include a file?",
        options: ["include()", "require()", "include_once()", "require_once()"],
        correct: "include()"
    },
    {
        question: "How do you start a session in PHP?",
        options: ["session_start();", "start_session();", "init_session();", "session_open();"],
        correct: "session_start();"
    },
    {
        question: "What is the correct HTML tag for the largest heading?",
        options: ["<h1>", "<header>", "<h6>", "<title>"],
        correct: "<h1>"
    },
    {
        question: "Which attribute is used to specify the source of an image in HTML?",
        options: ["src", "href", "source", "link"],
        correct: "src"
    },
    {
        question: "Which CSS property is used to change the font of an element?",
        options: ["font-size", "font-family", "font-style", "font-weight"],
        correct: "font-family"
    },
    {
        question: "Which of the following is used to add a comment in CSS?",
        options: ["/* comment */", "// comment", "# comment", "<!-- comment -->"],
        correct: "/* comment */"
    },
    {
        question: "Which HTML tag is used to define an unordered list?",
        options: ["<ul>", "<ol>", "<li>", "<list>"],
        correct: "<ul>"
    }
];

function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('answer-options');
    const feedbackElement = document.getElementById('feedback'); // Clear feedback before loading new question
    if (feedbackElement) feedbackElement.remove(); // Remove previous feedback

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

    // Reset the answered flag for this question
    answered = false;
}

function checkAnswer(selected) {
    const correctAnswer = questions[currentQuestion].correct;
    const feedbackElement = document.createElement('p');
    const feedbackContainer = document.getElementById('question-container');

    if (currentTry === 1) {
        // If Team 1 answers
        feedbackElement.innerText = selected === correctAnswer ? 'Correct! Team 1' : 'Incorrect! Team 1';
        document.getElementById('team1-score').innerText = selected === correctAnswer ? team1Score + 1 : team1Score;
        currentTry = 2;  // Switch to Team 2's turn
    } else if (currentTry === 2) {
        // If Team 2 answers
        feedbackElement.innerText = selected === correctAnswer ? 'Correct! Team 2' : 'Incorrect! Team 2';
        document.getElementById('team2-score').innerText = selected === correctAnswer ? team2Score + 1 : team2Score;
        currentTry = 1;  // Switch back to Team 1's turn
        answered = true;
    }
    
    // Add feedback (correct or incorrect) to the screen
    feedbackContainer.appendChild(feedbackElement);

    // Once both teams have answered, show the correct answer
    if (answered) {
        setTimeout(() => {
            alert(`The correct answer was: ${correctAnswer}`);
            document.getElementById('next-button').disabled = false;
        }, 500);
    } else {
        // Disable the next button until both teams have answered
        document.getElementById('next-button').disabled = true;
    }
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
