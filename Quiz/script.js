document.addEventListener("DOMContentLoaded", function () {
    // Initialize EmailJS with your User ID
    emailjs.init("0bR5qvHli8_67NWOZ");

    // DOM Elements
    const quizIntro = document.getElementById("quiz-intro");
    const quizForm = document.getElementById("quiz-form");
    const emailSection = document.getElementById("email-section");
    const scoreResult = document.getElementById("score-result");
    const startQuizBtn = document.getElementById("start-quiz");
    const backToQuizBtn = document.getElementById("back-to-quiz");
    const submitQuizBtn = document.getElementById("submit-quiz");
    const tryAgainBtn = document.getElementById("try-again");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const finalScoreDisplay = document.getElementById("final-score");
    const scoreFill = document.getElementById("score-fill");
    const resultEmail = document.getElementById("result-email");
    const gmailInput = document.getElementById("gmail");
    
    // Quiz Data
    const questions = [
        {
            question: "1. What is the primary focus of User Experience (UX) design?",
            options: [
                { text: "Visual aesthetics of a website", correct: false },
                { text: "Overall experience and usability of a product", correct: true },
                { text: "Coding and backend functionality", correct: false },
                { text: "Marketing and branding", correct: false }
            ]
        },
        {
            question: "2. Which of the following is an example of a User Interface (UI) element?",
            options: [
                { text: "Buttons and menus", correct: true },
                { text: "Server response time", correct: false },
                { text: "Customer support chat", correct: false },
                { text: "Website loading speed", correct: false }
            ]
        },
        {
            question: "3. Why is visual hierarchy important in UI/UX design?",
            options: [
                { text: "To add decorative elements to a page", correct: false },
                { text: "To prioritize and direct user attention logically", correct: true },
                { text: "To reduce the need for navigation menus", correct: false },
                { text: "To increase the number of colors used", correct: false }
            ]
        },
        {
            question: "4. A website uses complementary colors for its buttons and headers. Which design principle is this following?",
            options: [
                { text: "Consistency", correct: false },
                { text: "Color harmony", correct: true },
                { text: "Affordance", correct: false },
                { text: "Feedback", correct: false }
            ]
        },
        {
            question: "5. What is a key benefit of a grid-aligned layout?",
            options: [
                { text: "It allows for more text-heavy content", correct: false },
                { text: "It creates a clear, organized structure", correct: true },
                { text: "It reduces the need for images", correct: false },
                { text: "It eliminates the need for spacing", correct: false }
            ]
        },
        {
            question: "6. Which of these violates accessibility principles?",
            options: [
                { text: "Low contrast between text and background", correct: true },
                { text: "Clear navigation labels", correct: false },
                { text: "Responsive design", correct: false },
                { text: "Consistent button styles", correct: false }
            ]
        },
        {
            question: "7. What is the purpose of visual hierarchy in UI/UX design?",
            options: [
                { text: "To make the design look artistic", correct: false },
                { text: "To guide users' attention to important elements", correct: true },
                { text: "To increase the number of colors used", correct: false },
                { text: "To reduce the need for text", correct: false }
            ]
        },
        {
            question: "8. Which of the following is NOT a UI element?",
            options: [
                { text: "Dropdown menu", correct: false },
                { text: "Checkbox", correct: false },
                { text: "Server processing time", correct: true },
                { text: "Search bar", correct: false }
            ]
        },
        {
            question: "9. What does UX design primarily focus on improving?",
            options: [
                { text: "The visual appeal of buttons", correct: false },
                { text: "The user's overall interaction and satisfaction", correct: true },
                { text: "The website's loading speed", correct: false },
                { text: "The number of features available", correct: false }
            ]
        },
        {
            question: "10. What is one of the key benefits of good UI/UX design mentioned in the PDF?",
            options: [
                { text: "Reduced need for content", correct: false },
                { text: "Enhanced user engagement", correct: true },
                { text: "Lower development costs", correct: false },
                { text: "Fewer design iterations", correct: false }
            ]
        },
        {
            question: "11. Which principle is demonstrated when a website's layout remains consistent across different pages?",
            options: [
                { text: "Consistency", correct: true },
                { text: "Affordance", correct: false },
                { text: "Accessibility", correct: false },
                { text: "Feedback", correct: false }
            ]
        },
        {
            question: "12. What is the main goal of responsive design?",
            options: [
                { text: "To make the website load faster", correct: false },
                { text: "To ensure the website works well on all devices", correct: true },
                { text: "To reduce the number of images used", correct: false },
                { text: "To make the website more colorful", correct: false }
            ]
        },
        {
            question: "13. Which of the following is an example of good UI/UX from the PDF?",
            options: [
                { text: "A cluttered navigation menu", correct: false },
                { text: "Clear call-to-action buttons", correct: true },
                { text: "Low-contrast text", correct: false },
                { text: "Inconsistent spacing", correct: false }
            ]
        },
        {
            question: "14. What does the principle of 'affordance' refer to in UI design?",
            options: [
                { text: "The loading speed of a button", correct: false },
                { text: "How clearly an element's function is communicated", correct: true },
                { text: "The color scheme of a website", correct: false },
                { text: "The number of menu items", correct: false }
            ]
        },
        {
            question: "15. What is one of the key takeaways about UI/UX design mentioned in the PDF's conclusion?",
            isTextAnswer: true
        }
    ];

    // Quiz State
    let currentQuestionIndex = 0;
    let userAnswers = Array(questions.length).fill(null);
    let score = 0;

    // Initialize Quiz
    function initializeQuiz() {
        renderCurrentQuestion();
        updateProgress();
    }

    // Render current question
    function renderCurrentQuestion() {
        quizForm.innerHTML = '';
        const question = questions[currentQuestionIndex];
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question active';
        
        const questionText = document.createElement('p');
        questionText.className = 'question-text';
        questionText.textContent = question.question;
        questionDiv.appendChild(questionText);
        
        if (question.isTextAnswer) {
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.id = `q${currentQuestionIndex+1}`;
            textInput.name = `q${currentQuestionIndex+1}`;
            textInput.placeholder = 'Type your answer here...';
            textInput.value = userAnswers[currentQuestionIndex] || '';
            questionDiv.appendChild(textInput);
        } else {
            question.options.forEach((option, optIndex) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.id = `q${currentQuestionIndex+1}-opt${optIndex+1}`;
                radio.name = `q${currentQuestionIndex+1}`;
                radio.value = optIndex;
                if (userAnswers[currentQuestionIndex] === optIndex.toString()) {
                    radio.checked = true;
                }
                
                const label = document.createElement('label');
                label.htmlFor = `q${currentQuestionIndex+1}-opt${optIndex+1}`;
                label.textContent = option.text;
                
                optionDiv.appendChild(radio);
                optionDiv.appendChild(label);
                questionDiv.appendChild(optionDiv);
            });
        }
        
        quizForm.appendChild(questionDiv);

        // Navigation buttons
        const navButtons = document.createElement('div');
        navButtons.className = 'navigation-buttons';
        
        const prevButton = document.createElement('button');
        prevButton.type = 'button';
        prevButton.className = 'btn-secondary';
        prevButton.innerHTML = '<i class="fas fa-arrow-left"></i> Previous';
        prevButton.addEventListener('click', goToPreviousQuestion);
        prevButton.disabled = currentQuestionIndex === 0;
        
        const nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.className = 'btn-primary';
        nextButton.innerHTML = currentQuestionIndex === questions.length - 1 ? 
            'Review Answers <i class="fas fa-check"></i>' : 
            'Next <i class="fas fa-arrow-right"></i>';
        nextButton.addEventListener('click', goToNextQuestion);
        
        navButtons.appendChild(prevButton);
        navButtons.appendChild(nextButton);
        quizForm.appendChild(navButtons);
    }

    // Navigation functions
    function goToPreviousQuestion() {
        saveCurrentAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderCurrentQuestion();
            updateProgress();
        }
    }

    function goToNextQuestion() {
        if (!saveCurrentAnswer()) return;
        
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderCurrentQuestion();
            updateProgress();
        } else {
            quizForm.style.display = 'none';
            emailSection.style.display = 'block';
        }
    }

    function saveCurrentAnswer() {
        const currentQ = questions[currentQuestionIndex];
        
        if (currentQ.isTextAnswer) {
            const textAnswer = document.querySelector(`.question.active input[type="text"]`).value.trim();
            if (!textAnswer) {
                alert('Please provide an answer before proceeding.');
                return false;
            }
            userAnswers[currentQuestionIndex] = textAnswer;
        } else {
            const selectedOption = document.querySelector(`.question.active input[type="radio"]:checked`);
            if (!selectedOption) {
                alert('Please select an answer before proceeding.');
                return false;
            }
            userAnswers[currentQuestionIndex] = selectedOption.value;
        }
        return true;
    }

    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
    }

    function calculateScore() {
        score = 0;
        questions.forEach((q, index) => {
            if (q.isTextAnswer) {
                const answer = userAnswers[index] ? userAnswers[index].toLowerCase() : '';
                if (answer.includes('user-centered') || answer.includes('usability') || 
                    answer.includes('accessibility') || answer.includes('engagement')) {
                    score++;
                }
            } else {
                const selectedOptionIndex = userAnswers[index];
                if (selectedOptionIndex !== null && q.options[selectedOptionIndex].correct) {
                    score++;
                }
            }
        });
        return score;
    }

    function submitQuiz() {
        const email = gmailInput.value.trim();
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        submitQuizBtn.disabled = true;
        submitQuizBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        calculateScore();
        sendResults(email);
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function sendResults(email) {
        // Prepare email content
        let answersHtml = `<h2>UX Quiz Results</h2>
                          <p>Your Score: ${score}/${questions.length}</p>
                          <h3>Question Breakdown:</h3>`;
        
        questions.forEach((q, index) => {
            answersHtml += `<p><strong>Q${index + 1}:</strong> ${q.question}</p>`;
            if (q.isTextAnswer) {
                answersHtml += `<p>Your answer: ${userAnswers[index] || 'Not answered'}</p>`;
            } else {
                const selectedOptionIndex = userAnswers[index];
                const isCorrect = selectedOptionIndex !== null && q.options[selectedOptionIndex].correct;
                answersHtml += `<p>Your answer: ${selectedOptionIndex !== null ? 
                    q.options[selectedOptionIndex].text : 'Not answered'}`;
                answersHtml += isCorrect ? ' (Correct)' : ' (Incorrect)';
                if (!isCorrect && selectedOptionIndex !== null) {
                    const correctOption = q.options.find(opt => opt.correct);
                    answersHtml += `<br>Correct answer: ${correctOption.text}`;
                }
                answersHtml += `</p>`;
            }
        });

        // Email parameters - ensure these match your template variables
        const templateParams = {
            to_email: email,
            email: email,  // Some templates use this instead
            user_email: email,  // Some templates use this
            to_name: email.split('@')[0],
            from_name: "UX Quiz Team",
            subject: `Your UX Quiz Results - Score: ${score}/${questions.length}`,
            message: answersHtml,
            score: `${score}/${questions.length}`
        };

        // Send email
        emailjs.send("service_56untwr", "template_prp1jw9", templateParams)
            .then(() => {
                showFinalResults(email);
            })
            .catch(error => {
                console.error('EmailJS Error:', error);
                alert(`Failed to send results. Please try again. Error: ${error.text || error}`);
                submitQuizBtn.disabled = false;
                submitQuizBtn.innerHTML = 'Submit Quiz <i class="fas fa-paper-plane"></i>';
            });
    }

    function showFinalResults(email) {
        emailSection.style.display = 'none';
        scoreResult.style.display = 'block';
        finalScoreDisplay.textContent = `${score}/${questions.length}`;
        resultEmail.textContent = email;
        
        const percentage = (score / questions.length) * 100;
        scoreFill.style.width = `${percentage}%`;
        
        if (percentage >= 80) {
            scoreFill.style.backgroundColor = '#27ae60';
        } else if (percentage >= 50) {
            scoreFill.style.backgroundColor = '#f39c12';
        } else {
            scoreFill.style.backgroundColor = '#e74c3c';
        }
    }

    // Event Listeners
    startQuizBtn.addEventListener('click', () => {
        quizIntro.style.display = 'none';
        quizForm.style.display = 'block';
        initializeQuiz();
    });

    backToQuizBtn.addEventListener('click', () => {
        emailSection.style.display = 'none';
        quizForm.style.display = 'block';
    });

    submitQuizBtn.addEventListener('click', submitQuiz);

    tryAgainBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        userAnswers = Array(questions.length).fill(null);
        score = 0;
        gmailInput.value = '';
        scoreResult.style.display = 'none';
        quizIntro.style.display = 'block';
    });
});
