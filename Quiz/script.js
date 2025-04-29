document.addEventListener("DOMContentLoaded", function () {
    // Initialize EmailJS with your User ID
    emailjs.init("0bR5qvHli8_67NWOZ");

    const quizForm = document.getElementById("quiz-form");
    const questions = document.querySelectorAll(".question");
    const scoreResult = document.getElementById("score-result");

    let currentQuestion = 0;
    let score = 0;

    // Navigation Buttons
    const nextBtn = document.createElement("button");
    const backBtn = document.createElement("button");

    nextBtn.textContent = "Next";
    nextBtn.id = "next-btn";
    nextBtn.type = "button";
    nextBtn.classList.add("navigation-button");

    backBtn.textContent = "Back";
    backBtn.id = "back-btn";
    backBtn.type = "button";
    backBtn.classList.add("navigation-button");

    quizForm.appendChild(backBtn);
    quizForm.appendChild(nextBtn);

    function showQuestion() {
        questions.forEach((q, index) => {
            q.style.display = index === currentQuestion ? "block" : "none";
        });

        backBtn.disabled = currentQuestion === 0;

        if (currentQuestion === questions.length - 1) {
            nextBtn.textContent = "Submit";
        } else {
            nextBtn.textContent = "Next";
        }
    }

    nextBtn.addEventListener("click", function () {
        // Validate current question
        if (currentQuestion < 14) {
            const selected = document.querySelector(`input[name="q${currentQuestion + 1}"]:checked`);
            if (!selected) {
                alert("Please select an answer to proceed.");
                return;
            }
        } else if (currentQuestion === 14) {
            const q15 = document.getElementById("q15").value.trim();
            if (!q15) {
                alert("Please enter your answer before submitting.");
                return;
            }
        } else if (currentQuestion === 15) {
            const gmail = document.getElementById("gmail").value.trim();
            if (!gmail) {
                alert("Please enter your Gmail address.");
                return;
            }
            if (!gmail.endsWith("@gmail.com")) {
                alert("Please enter a valid Gmail address.");
                return;
            }
            
            calculateScore();
            sendScoreByEmail(score, gmail);
            return;
        }

        currentQuestion++;
        showQuestion();
    });

    backBtn.addEventListener("click", function () {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion();
        }
    });

    function calculateScore() {
        score = 0;
        for (let i = 1; i <= 14; i++) {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            if (selected && selected.value === "1") {
                score++;
            }
        }

        const q15Answer = document.getElementById("q15").value.toLowerCase();
        if (q15Answer.includes("feedback") || q15Answer.includes("confirmation") || 
            q15Answer.includes("visibility") || q15Answer.includes("status")) {
            score++;
        }
    }

    function sendScoreByEmail(score, gmail) {
        // Prepare answers summary
        let answers = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">UX Quiz Results</h2>
                <p>Hello,</p>
                <p>Here are your quiz results:</p>
                <h3 style="color: #27ae60;">Your Score: ${score}/15</h3>
                <hr>
                <h3>Question Breakdown:</h3>
                <ul style="list-style-type: none; padding: 0;">
        `;
        
        // Multiple choice answers (Q1-Q14)
        for (let i = 1; i <= 14; i++) {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            const questionText = document.querySelector(`.question:nth-child(${i}) p`).textContent.trim();
            answers += `
                <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                    <strong>Q${i}:</strong> ${questionText}<br>
                    <strong>Your Answer:</strong> ${selected ? selected.nextElementSibling.textContent : 'Not answered'}
                </li>
            `;
        }
        
        // Text answer (Q15)
        answers += `
                <li style="margin-bottom: 15px;">
                    <strong>Q15:</strong> ${document.getElementById("q15").value}
                </li>
                </ul>
                <hr>
                <p>Thank you for taking the UX Quiz!</p>
                <p>Best regards,<br>UX Quiz Team</p>
            </div>
        `;
    
        // Email parameters - MUST match your template variables
        const templateParams = {
            to_email: gmail,
            user_email: gmail,
            subject: `Your UX Quiz Results - Score: ${score}/15`,
            message: answers,
            from_name: "UX Quiz Bot",
            reply_to: "nashdatiles97@gmail.com",
            score: `${score}/15`       // matches EmailJS {{score}}
        };
    
        // Show loading state
        nextBtn.disabled = true;
        nextBtn.textContent = "Sending...";
    
        // Send email
        emailjs.send("service_56untwr", "template_prp1jw9", templateParams)
            .then(function(response) {
                console.log("Email sent!", response);
                quizForm.style.display = "none";
                scoreResult.style.display = "block";
                scoreResult.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h2 style="color: #27ae60;">Thank you! 🎉</h2>
                        <p style="font-size: 1.2em;">Your score: <strong>${score}/15</strong></p>
                        <p>Results sent to: <strong>${gmail}</strong></p>
                    </div>
                `;
            })
            .catch(function(error) {
                console.error("EmailJS Error:", error);
                alert(`Failed to send results. Error: ${error.text || "Please try again later."}`);
                nextBtn.disabled = false;
                nextBtn.textContent = "Submit";
            });
    }

    showQuestion();
});