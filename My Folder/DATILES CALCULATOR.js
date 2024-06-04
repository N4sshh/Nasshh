'use strict';

const display = document.getElementById("display");

function appendToDisplay(input) {
  display.value += input;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    const result = eval(display.value);
    if (isNaN(result) || !isFinite(result)) {
      throw new Error("Invalid input or operation");
    }
    display.value = result;
  } catch (error) {
    display.value = "Error: " + error.message;
  }
}

function backspace() {
  display.value = display.value.slice(0, -1); 
}
