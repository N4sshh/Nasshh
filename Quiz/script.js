document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded - script.js initialized");

    // Initialize EmailJS
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
    const resultMessage = document.getElementById("result-message");
    const gmailInput = document.getElementById("gmail");

    // ORIGINAL 15 QUESTIONS - MUCH EASIER!
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
            question: "10. What is one of the key benefits of good UI/UX design?",
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
            question: "13. Which of the following is an example of good UI/UX?",
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
            question: "15. In your own words, what is one of the most important things about UI/UX design?",
            isTextAnswer: true,
            keywords: ["user-centered", "usability", "accessibility", "engaging", "easy to use", "intuitive", "clear", "simple"]
        }
    ];

    // Quiz State
    let currentQuestionIndex = 0;
    let userAnswers = Array(questions.length).fill(null);
    let score = 0;

    // Initialize Quiz
    function initializeQuiz() {
        quizForm.classList.add('fade-in');
        renderCurrentQuestion();
        updateProgress();
    }

    // Render current question
    function renderCurrentQuestion() {
        quizForm.innerHTML = '';
        const question = questions[currentQuestionIndex];

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question active slide-in';

        const questionText = document.createElement('h4');
        questionText.className = 'question-text';
        questionText.textContent = question.question;
        questionDiv.appendChild(questionText);

        if (question.isTextAnswer) {
            const textContainer = document.createElement('div');
            textContainer.className = 'text-answer-container';

            const textarea = document.createElement('textarea');
            textarea.id = `q${currentQuestionIndex+1}`;
            textarea.name = `q${currentQuestionIndex+1}`;
            textarea.placeholder = 'Type your answer here...';
            textarea.value = userAnswers[currentQuestionIndex] || '';
            textarea.rows = 4;

            const hint = document.createElement('div');
            hint.className = 'form-text mt-2';
            hint.innerHTML = '<i class="fas fa-lightbulb me-1"></i>Just share your thoughts about what makes good design!';

            textContainer.appendChild(textarea);
            textContainer.appendChild(hint);
            questionDiv.appendChild(textContainer);
        } else {
            question.options.forEach((option, optIndex) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                if (userAnswers[currentQuestionIndex] === optIndex.toString()) {
                    optionDiv.classList.add('selected');
                }

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.id = `q${currentQuestionIndex+1}-opt${optIndex+1}`;
                radio.name = `q${currentQuestionIndex+1}`;
                radio.value = optIndex;
                if (userAnswers[currentQuestionIndex] === optIndex.toString()) {
                    radio.checked = true;
                }

                radio.addEventListener('change', function() {
                    document.querySelectorAll('.option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    optionDiv.classList.add('selected');
                });

                const label = document.createElement('label');
                label.htmlFor = `q${currentQuestionIndex+1}-opt${optIndex+1}`;
                label.textContent = option.text;
                label.style.cursor = 'pointer';
                label.style.marginBottom = '0';
                label.style.flex = '1';

                optionDiv.appendChild(radio);
                optionDiv.appendChild(label);
                questionDiv.appendChild(optionDiv);
            });
        }

        quizForm.appendChild(questionDiv);

        // Navigation buttons
        const navButtons = document.createElement('div');
        navButtons.className = 'd-flex justify-content-between align-items-center mt-4';

        const prevButton = document.createElement('button');
        prevButton.type = 'button';
        prevButton.className = 'btn-secondary';
        prevButton.innerHTML = '<i class="fas fa-arrow-left me-2"></i> Previous';
        prevButton.addEventListener('click', goToPreviousQuestion);
        prevButton.disabled = currentQuestionIndex === 0;

        const nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.className = 'btn-primary';
        nextButton.innerHTML = currentQuestionIndex === questions.length - 1 ?
            '<i class="fas fa-check me-2"></i> Review Answers' :
            'Next <i class="fas fa-arrow-right ms-2"></i>';
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
        if (!saveCurrentAnswer()) {
            showNotification('Please provide an answer before proceeding.', 'warning');
            return;
        }

        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderCurrentQuestion();
            updateProgress();
        } else {
            quizForm.style.display = 'none';
            emailSection.style.display = 'block';
            emailSection.classList.add('fade-in');
        }
    }

    function saveCurrentAnswer() {
        const currentQ = questions[currentQuestionIndex];

        if (currentQ.isTextAnswer) {
            const textarea = document.querySelector(`.question.active textarea`);
            if (!textarea) {
                return false;
            }
            const textAnswer = textarea.value.trim();
            if (!textAnswer) {
                return false;
            }
            userAnswers[currentQuestionIndex] = textAnswer;
        } else {
            const selectedOption = document.querySelector(`.question.active input[type="radio"]:checked`);
            if (!selectedOption) {
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
                // Give credit for any reasonable answer
                if (answer.length > 10) {
                    score += 1; // Give 1 point for any thoughtful answer
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
            showNotification('Please enter a valid email address.', 'danger');
            gmailInput.focus();
            return;
        }

        submitQuizBtn.disabled = true;
        submitQuizBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending Results...';

        calculateScore();
        sendResults(email);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function sendResults(email) {
        // Prepare detailed results
        let answersHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0a192f; border-bottom: 3px solid #64ffda; padding-bottom: 10px;">UX Design Principles Quiz Results</h2>
                <div style="background: linear-gradient(135deg, #64ffda, #1e90ff); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="margin: 0;">Your Score: ${score}/${questions.length}</h3>
                </div>
                <h3 style="color: #0a192f;">Question Breakdown:</h3>
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 15px 0;">
        `;

        questions.forEach((q, index) => {
            answersHtml += `
                <div style="margin-bottom: 20px; padding: 15px; background: ${index % 2 === 0 ? '#f8f9fa' : 'white'}; border-radius: 6px;">
                    <p style="font-weight: bold; color: #0a192f;">Q${index + 1}: ${q.question}</p>
            `;

            if (q.isTextAnswer) {
                const answer = userAnswers[index] || 'Not answered';
                answersHtml += `<p><strong>Your Answer:</strong> ${answer}</p>`;
            } else {
                const selectedOptionIndex = userAnswers[index];
                const isCorrect = selectedOptionIndex !== null && q.options[selectedOptionIndex].correct;
                const userAnswer = selectedOptionIndex !== null ?
                    q.options[selectedOptionIndex].text : 'Not answered';

                answersHtml += `<p><strong>Your Answer:</strong> ${userAnswer}`;
                answersHtml += isCorrect ? ' ✅ <span style="color: green;">(Correct)</span>' : ' ❌ <span style="color: red;">(Incorrect)</span>';

                if (!isCorrect && selectedOptionIndex !== null) {
                    const correctOption = q.options.find(opt => opt.correct);
                    answersHtml += `<br><strong>Correct Answer:</strong> ${correctOption.text}`;
                }
                answersHtml += `</p>`;
            }
            answersHtml += `</div>`;
        });

        answersHtml += `
                </div>
                <p style="color: #666; font-style: italic;">Thank you for taking the UX Design Principles Quiz!</p>
            </div>
        `;

        // Email parameters
        const templateParams = {
            to_email: email,
            email: email,
            user_email: email,
            to_name: email.split('@')[0],
            from_name: "UX Design Quiz",
            subject: `Your UX Design Quiz Results - Score: ${score}/${questions.length}`,
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
                showNotification(`Failed to send results. Please try again.`, 'danger');
                submitQuizBtn.disabled = false;
                submitQuizBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Quiz';
            });
    }

    function showFinalResults(email) {
        emailSection.style.display = 'none';
        scoreResult.style.display = 'block';
        scoreResult.classList.add('fade-in');

        finalScoreDisplay.textContent = `${score}/${questions.length}`;
        resultEmail.textContent = email;

        const percentage = (score / questions.length) * 100;
        scoreFill.style.width = `${percentage}%`;

        // Set result message based on score
        if (percentage >= 80) {
            resultMessage.textContent = "Excellent! You really know your UX design stuff! 🎉";
            scoreFill.style.background = 'linear-gradient(90deg, var(--tech-accent), #27ae60)';
        } else if (percentage >= 60) {
            resultMessage.textContent = "Good job! You have a solid understanding of UX principles.";
            scoreFill.style.background = 'linear-gradient(90deg, var(--tech-accent), var(--tech-highlight))';
        } else if (percentage >= 40) {
            resultMessage.textContent = "Not bad! You're getting the hang of UX concepts.";
            scoreFill.style.background = 'linear-gradient(90deg, var(--tech-highlight), #f39c12)';
        } else {
            resultMessage.textContent = "Keep learning! UX design is a journey - try again!";
            scoreFill.style.background = 'linear-gradient(90deg, #f39c12, var(--tech-danger))';
        }
    }

    // Notification function
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'warning' ? 'warning' : type === 'danger' ? 'danger' : 'info'} alert-dismissible fade show`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Event Listeners
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            console.log("Start Quiz button clicked!");
            quizIntro.style.display = 'none';
            quizForm.style.display = 'block';
            initializeQuiz();
        });
    }

    if (backToQuizBtn) {
        backToQuizBtn.addEventListener('click', function() {
            emailSection.style.display = 'none';
            quizForm.style.display = 'block';
        });
    }

    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', submitQuiz);
    }

    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            currentQuestionIndex = 0;
            userAnswers = Array(questions.length).fill(null);
            score = 0;
            gmailInput.value = '';
            scoreResult.style.display = 'none';
            quizIntro.style.display = 'block';
            progressBar.style.width = '0%';
            progressText.textContent = '1/15';
        });
    }

    console.log("Quiz initialized successfully - EASY MODE! 😊");
});
