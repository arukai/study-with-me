const stretchingExercises = [
    { name: "Neck Stretch", duration: 30 },
    { name: "Shoulder Stretch", duration: 30 },
    { name: "Wrist Stretch", duration: 30 },
    { name: "Side Stretch", duration: 30 },
    { name: "Hamstring Stretch", duration: 30 }
];

let currentExerciseIndex = 0;
let stretchTimer;

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-stretching');
    const statusText = document.getElementById('stretching-status');

    function startStretching() {
        if (currentExerciseIndex < stretchingExercises.length) {
            const exercise = stretchingExercises[currentExerciseIndex];
            statusText.textContent = `Сейчас: ${exercise.name} — ${exercise.duration} сек.`;

            stretchTimer = setTimeout(() => {
                currentExerciseIndex++;
                startStretching();
            }, exercise.duration * 1000);
        } else {
            statusText.textContent = "Сессия растяжки завершена! Отличная работа!";
            resetStretching();
        }
    }

    function resetStretching() {
        clearTimeout(stretchTimer);
        currentExerciseIndex = 0;
    }

    if (startButton) {
        startButton.addEventListener('click', () => {
            resetStretching();
            startStretching();
        });
    }
});