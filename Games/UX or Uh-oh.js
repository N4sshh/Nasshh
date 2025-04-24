function checkAnswer(answer) {
    const correct = "ux"; // Change to "uh-oh" depending on the image
    const result = document.getElementById("result");
  
    if (answer === correct) {
      result.textContent = "Correct! 🎉";
      result.style.color = "green";
    } else {
      result.textContent = "Oops! Try again.";
      result.style.color = "red";
    }
  }
  