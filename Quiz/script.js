document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded - script.js initialized"); // Debug log
    
    // Initialize EmailJS
    emailjs.init("0bR5qvHli8_67NWOZ");
    console.log("EmailJS initialized"); // Debug log

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
    
    // Debug: Check if elements are found
    console.log("Elements found:", {
        startQuizBtn: !!startQuizBtn,
        quizIntro: !!quizIntro,
        quizForm: !!quizForm
    });

    // Enhanced Quiz Data (12 questions)
    const questions = [
        {
            question: "1. What is the primary goal of User Experience (UX) design?",
            options: [
                { text: "Creating visually appealing interfaces", correct: false },
                { text: "Ensuring optimal performance and speed", correct: false },
                { text: "Enhancing overall user satisfaction and usability", correct: true },
                { text: "Implementing complex animations and effects", correct: false }
            ]
        },
        {
            question: "2. Which element is crucial for establishing visual hierarchy in interface design?",
            options: [
                { text: "Using multiple font families", correct: false },
                { text: "Varying size, weight, and spacing of elements", correct: true },
                { text: "Implementing complex gradients", correct: false },
                { text: "Adding decorative borders", correct: false }
            ]
        },
        {
            question: "3. What does the 'Fitts's Law' principle state in UX design?",
            options: [
                { text: "Users prefer minimalistic designs", correct: false },
                { text: "The time to reach a target depends on distance and size", correct: true },
                { text: "Colors affect user emotions", correct: false },
                { text: "Consistency reduces cognitive load", correct: false }
            ]
        },
        {
            question: "4. Which color scheme uses colors opposite each other on the color wheel?",
            options: [
                { text: "Analogous", correct: false },
                { text: "Monochromatic", correct: false },
                { text: "Complementary", correct: true },
                { text: "Triadic", correct: false }
            ]
        },
        {
            question: "5. What is the purpose of a 'wireframe' in the design process?",
            options: [
                { text: "To showcase final visual design", correct: false },
                { text: "To test color combinations", correct: false },
                { text: "To define structure and layout", correct: true },
                { text: "To measure loading performance", correct: false }
            ]
        },
        {
            question: "6. Which accessibility principle ensures content is perceivable by all users?",
            options: [
                { text: "Sufficient color contrast", correct: true },
                { text: "Fast loading times", correct: false },
                { text: "Minimal scrolling", correct: false },
                { text: "Complex interactions", correct: false }
            ]
        },
        {
            question: "7. What is 'affordance' in UI design?",
            options: [
                { text: "The loading speed of elements", correct: false },
                { text: "How clearly an element's function is communicated", correct: true },
                { text: "The color harmony of the interface", correct: false },
                { text: "The animation smoothness", correct: false }
            ]
        },
        {
            question: "8. Which design pattern helps users understand their location within an application?",
            options: [
                { text: "Breadcrumb navigation", correct: true },
                { text: "Modal windows", correct: false },
                { text: "Infinite scrolling", correct: false },
                { text: "Parallax effects", correct: false }
            ]
        },
        {
            question: "9. What does 'responsive design' ensure?",
            options: [
                { text: "Fast server response times", correct: false },
                { text: "Optimal viewing across all devices", correct: true },
                { text: "High-resolution images", correct: false },
                { text: "Complex animations", correct: false }
            ]
        },
        {
            question: "10. Which principle states that interfaces should keep users informed about system status?",
            options: [
                { text: "Jakob's Law", correct: false },
                { text: "Miller's Law", correct: false },
                { text: "Hick's Law", correct: false },
                { text: "Visibility of system status", correct: true }
            ]
        },
        {
            question: "11. What is a 'user persona' used for in UX design?",
            options: [
                { text: "To track individual user behavior", correct: false },
                { text: "To represent target user characteristics", correct: true },
                { text: "To measure design effectiveness", correct: false },
                { text: "To create marketing campaigns", correct: false }
            ]
        },
        {
            question: "12. Imagine you're designing a dashboard for a fitness app. Describe how you would apply UX principles to ensure the dashboard is effective, engaging, and user-friendly for tracking daily activity and goals.",
            isTextAnswer: true,
            keywords: ["clarity", "visual hierarchy", "progress indicators", "personalization", "motivation", "simplicity", "actionable insights", "goal tracking", "feedback", "usability"]
        }
    ];

    // Quiz State
    let currentQuestionIndex = 0;
    let userAnswers = Array(questions.length).fill(null);
    let score = 0;

    // Initialize Quiz
    function initializeQuiz() {
        console.log("Initializing quiz..."); // Debug log
        quizForm.classList.add('fade-in');
        renderCurrentQuestion();
        updateProgress();
    }

    // Render current question
    function renderCurrentQuestion() {
        console.log("Rendering question:", currentQuestionIndex); // Debug log
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
            textarea.placeholder = 'Share your design approach... Consider aspects like visual hierarchy, user motivation, clarity, and engagement strategies.';
            textarea.value = userAnswers[currentQuestionIndex] || '';
            textarea.rows = 6;
            
            const hint = document.createElement('div');
            hint.className = 'form-text mt-2';
            hint.innerHTML = '<i class="fas fa-lightbulb me-1"></i>Tip: Consider aspects like visual hierarchy, user motivation, clarity, and engagement strategies.';
            
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
        
        console.log("Question rendered successfully"); // Debug log
    }

    // Navigation functions
    function goToPreviousQuestion() {
        console.log("Going to previous question"); // Debug log
        saveCurrentAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderCurrentQuestion();
            updateProgress();
        }
    }

    function goToNextQuestion() {
        console.log("Going to next question"); // Debug log
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
            console.log("Showing email section"); // Debug log
        }
    }

    function saveCurrentAnswer() {
        const currentQ = questions[currentQuestionIndex];
        console.log("Saving answer for question:", currentQuestionIndex); // Debug log
        
        if (currentQ.isTextAnswer) {
            const textarea = document.querySelector(`.question.active textarea`);
            if (!textarea) {
                console.log("Textarea not found"); // Debug log
                return false;
            }
            const textAnswer = textarea.value.trim();
            if (!textAnswer) {
                console.log("Text answer is empty"); // Debug log
                return false;
            }
            userAnswers[currentQuestionIndex] = textAnswer;
        } else {
            const selectedOption = document.querySelector(`.question.active input[type="radio"]:checked`);
            if (!selectedOption) {
                console.log("No option selected"); // Debug log
                return false;
            }
            userAnswers[currentQuestionIndex] = selectedOption.value;
        }
        console.log("Answer saved:", userAnswers[currentQuestionIndex]); // Debug log
        return true;
    }

    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
        console.log("Progress updated:", progressText.textContent); // Debug log
    }

    function calculateScore() {
        score = 0;
        questions.forEach((q, index) => {
            if (q.isTextAnswer) {
                const answer = userAnswers[index] ? userAnswers[index].toLowerCase() : '';
                if (q.keywords) {
                    const keywordCount = q.keywords.filter(keyword => 
                        answer.includes(keyword.toLowerCase())
                    ).length;
                    // Award points based on keyword coverage (up to 2 points for text answers)
                    if (keywordCount >= 3) score += 2;
                    else if (keywordCount >= 1) score += 1;
                }
            } else {
                const selectedOptionIndex = userAnswers[index];
                if (selectedOptionIndex !== null && q.options[selectedOptionIndex].correct) {
                    score++;
                }
            }
        });
        console.log("Score calculated:", score); // Debug log
        return score;
    }

    function submitQuiz() {
        console.log("Submitting quiz..."); // Debug log
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
        console.log("Sending results to:", email); // Debug log
        
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
                answersHtml += `<p><strong>Keywords to consider:</strong> ${q.keywords.join(', ')}</p>`;
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

        console.log("Sending email with params:", templateParams); // Debug log
        
        // Send email
        emailjs.send("service_56untwr", "template_prp1jw9", templateParams)
            .then(() => {
                console.log("Email sent successfully"); // Debug log
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
        console.log("Showing final results"); // Debug log
        emailSection.style.display = 'none';
        scoreResult.style.display = 'block';
        scoreResult.classList.add('fade-in');
        
        finalScoreDisplay.textContent = `${score}/${questions.length}`;
        resultEmail.textContent = email;
        
        const percentage = (score / questions.length) * 100;
        scoreFill.style.width = `${percentage}%`;
        
        // Set result message based on score
        if (percentage >= 90) {
            resultMessage.textContent = "Outstanding! You have excellent UX design knowledge.";
            scoreFill.style.background = 'linear-gradient(90deg, var(--tech-accent), #27ae60)';
        } else if (percentage >= 70) {
            resultMessage.textContent = "Great job! You have a solid understanding of UX principles.";
            scoreFill.style.background = 'linear-gradient(90deg, var(--tech-accent), var(--tech-highlight))';
        } else if (percentage >= 50) {
            resultMessage.textContent = "Good effort! You're on the right track with UX fundamentals.";
            scoreFill.style.background = 'linear-gradient(90deg, var(--tech-highlight), #f39c12)';
        } else {
            resultMessage.textContent = "Keep learning! Review the UX principles and try again.";
            scoreFill.style.background = 'linear-gradient(90deg, #f39c12, var(--tech-danger))';
        }
        
        console.log("Final results shown with score:", score); // Debug log
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

    // Event Listeners - FIXED THIS SECTION
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            console.log("Start Quiz button clicked!"); // Debug log
            quizIntro.style.display = 'none';
            quizForm.style.display = 'block';
            initializeQuiz();
        });
    } else {
        console.error("Start Quiz button not found!");
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
            progressText.textContent = '1/12';
            console.log("Quiz reset"); // Debug log
        });
    }

    // Initial state check
    console.log("Quiz initialized successfully"); // Debug log
});
