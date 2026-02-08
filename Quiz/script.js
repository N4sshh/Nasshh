document.addEventListener("DOMContentLoaded", function () {
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
            const textAnswer = document.querySelector(`.question.active textarea`).value.trim();
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
            <div style="font-family: A
