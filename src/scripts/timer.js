// timer.js

let timer; // Variable to hold the timer interval
let isPomodoro = true; // Flag to indicate if it's a Pomodoro session
let pomodoroDuration = 25 * 60; // 25 minutes in seconds
let breakDuration = 5 * 60; // 5 minutes in seconds
let timeLeft; // Variable to hold the time left in seconds

const timerDisplay = document.getElementById('timer-display'); // Display element for the timer
const startButton = document.getElementById('start-button'); // Start button
const resetButton = document.getElementById('reset-button'); // Reset button

// Function to start the timer
function startTimer() {
    timeLeft = isPomodoro ? pomodoroDuration : breakDuration; // Set time left based on session type
    timer = setInterval(updateTimer, 1000); // Update timer every second
}

// Function to update the timer display
function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timer); // Stop the timer when it reaches zero
        alert(isPomodoro ? "Pomodoro session ended! Time for a break!" : "Break time is over! Back to studying!");
        isPomodoro = !isPomodoro; // Toggle between Pomodoro and break
        startTimer(); // Start the next session
    } else {
        timeLeft--; // Decrease time left by one second
        const minutes = Math.floor(timeLeft / 60); // Calculate minutes
        const seconds = timeLeft % 60; // Calculate seconds
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Update display
    }
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timer); // Stop the timer
    timerDisplay.textContent = "25:00"; // Reset display to default
    isPomodoro = true; // Reset to Pomodoro session
}

// Event listeners for buttons
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);