document.addEventListener("DOMContentLoaded", function() {
    const instructionText = document.getElementById("instruction-text");
    const startButton = document.getElementById("start-breathing");
    let interval;

    function startBreathingExercise() {
        clearInterval(interval);
        let count = 0;
        instructionText.textContent = "Вдох...";

        interval = setInterval(() => {
            count++;

            if (count === 4) {
                instructionText.textContent = "Задержка...";
            } else if (count === 7) {
                instructionText.textContent = "Выдох...";
            } else if (count === 11) {
                clearInterval(interval);
                instructionText.textContent = "Упражнение завершено!";
            }
        }, 1000);
    }

    if (startButton) {
        startButton.addEventListener("click", startBreathingExercise);
    }
});