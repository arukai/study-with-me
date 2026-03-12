let timer;
let isPomodoro = true;
let pomodoroDuration = 25 * 60;
let breakDuration = 5 * 60;
let timeLeft = pomodoroDuration;

document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const startButton = document.getElementById('start-timer');
    const resetButton = document.getElementById('reset-timer');

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert(isPomodoro ? "Pomodoro завершён! Время отдохнуть." : "Перерыв закончился! Пора учиться.");
                isPomodoro = !isPomodoro;
                timeLeft = isPomodoro ? pomodoroDuration : breakDuration;
                updateDisplay();
                return;
            }
            timeLeft--;
            updateDisplay();
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timer);
        isPomodoro = true;
        timeLeft = pomodoroDuration;
        updateDisplay();
    }

    startButton.addEventListener('click', startTimer);
    resetButton.addEventListener('click', resetTimer);

    updateDisplay();
});