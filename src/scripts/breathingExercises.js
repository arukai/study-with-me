// This file implements the breathing exercises functionality, including the animated "4-7-8" exercise or a breathing circle.

document.addEventListener("DOMContentLoaded", function() {
    const exerciseContainer = document.getElementById("breathing-exercise");
    const instructionText = document.getElementById("instruction-text");
    const startButton = document.getElementById("start-button");
    let interval;

    function startBreathingExercise() {
        let count = 0;
        instructionText.textContent = "Inhale...";

        interval = setInterval(() => {
            count++;
            if (count === 4) {
                instructionText.textContent = "Hold...";
            } else if (count === 7) {
                instructionText.textContent = "Exhale...";
            } else if (count === 11) {
                clearInterval(interval);
                instructionText.textContent = "Exercise Complete!";
                return;
            }
        }, 1000);
    }

    startButton.addEventListener("click", startBreathingExercise);
});