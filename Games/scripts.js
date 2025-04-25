const sounds = [
    {
      src: "https://www.soundjay.com/button/sounds/button-3.mp3",
      correct: "Button Click",
      options: ["Notification", "Error Alert", "Button Click", "Pop-up"]
    },
    {
      src: "https://www.soundjay.com/button/sounds/button-16.mp3",
      correct: "Success Chime",
      options: ["Error Alert", "Success Chime", "Loading Spinner", "Message"]
    },
    {
      src: "https://www.soundjay.com/button/sounds/button-10.mp3",
      correct: "Error Alert",
      options: ["Error Alert", "Message Received", "Button Tap", "Alarm"]
    },
    {
      src: "https://www.soundjay.com/button/sounds/button-15.mp3",
      correct: "Button Press",
      options: ["Button Press", "Unlock Sound", "Notification", "Device Alert"]
    },
    {
      src: "https://www.soundjay.com/button/sounds/button-11.mp3",
      correct: "Button Click",
      options: ["Success", "Error Alert", "Button Click", "Warning"]
    },
    {
      src: "https://www.soundjay.com/button/sounds/button-12.mp3",
      correct: "Warning Sound",
      options: ["Warning Sound", "Chime", "Notification", "Error"]
    },
    {
      src: "https://www.soundjay.com/button/sounds/button-5.mp3",
      correct: "Click",
      options: ["Error", "Click", "Warning", "Message"]
    },
    {
      src: "https://www.soundjay.com/button/sounds/button-13.mp3",
      correct: "Success Sound",
      options: ["Click", "Success Sound", "Error", "Alarm"]
    },
    {
      src: "https://www.soundjay.com/button/sounds/button-14.mp3",
      correct: "Popup",
      options: ["Error", "Popup", "Chime", "Notification"]
    },
    {
      src: "https://www.soundjay.com/button/sounds/button-9.mp3",
      correct: "Device Unlocked",
      options: ["Device Unlocked", "Notification", "Error", "Message"]
    }
  ];
  
  let current = 0;
  let score = 0;
  
  const audio = document.getElementById("sound");
  const choicesDiv = document.getElementById("choices");
  const feedback = document.getElementById("feedback");
  const nextBtn = document.getElementById("nextBtn");
  const scoreDisplay = document.getElementById("score");
  
  function loadSound(index) {
    audio.src = sounds[index].src;
    choicesDiv.innerHTML = "";
    feedback.textContent = "";
  
    // Shuffle options randomly
    const shuffledOptions = [...sounds[index].options].sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => checkAnswer(option);
      choicesDiv.appendChild(btn);
    });
  }
  
  function checkAnswer(selected) {
    if (selected === sounds[current].correct) {
      feedback.textContent = "✅ Correct!";
      score++;
    } else {
      feedback.textContent = `❌ Wrong! Correct answer: ${sounds[current].correct}`;
    }
    scoreDisplay.textContent = `Score: ${score}`;
  }
  
  nextBtn.addEventListener("click", () => {
    current++;
    if (current < sounds.length) {
      loadSound(current);
    } else {
      feedback.textContent = `🎉 Game Over! Final Score: ${score}/${sounds.length}`;
      nextBtn.disabled = true;
      audio.style.display = "none";
      choicesDiv.innerHTML = "";
    }
  });
  
  loadSound(current);
  