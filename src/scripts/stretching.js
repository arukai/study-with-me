// This file contains simple stretching exercises with a timer to encourage users to take breaks and stay active.

const stretchingExercises = [
    {
        name: "Neck Stretch",
        duration: 30 // seconds
    },
    {
        name: "Shoulder Stretch",
        duration: 30 // seconds
    },
    {
        name: "Wrist Stretch",
        duration: 30 // seconds
    },
    {
        name: "Side Stretch",
        duration: 30 // seconds
    },
    {
        name: "Hamstring Stretch",
        duration: 30 // seconds
    }
];

let currentExerciseIndex = 0;
let timer;

function startStretching() {
    if (currentExerciseIndex < stretchingExercises.length) {
        const exercise = stretchingExercises[currentExerciseIndex];
        alert(`Start: ${exercise.name} for ${exercise.duration} seconds`);
        timer = setTimeout(() => {
            currentExerciseIndex++;
            startStretching();
        }, exercise.duration * 1000);
    } else {
        alert("Stretching session complete! Great job!");
        resetStretching();
    }
}

function resetStretching() {
    clearTimeout(timer);
    currentExerciseIndex = 0;
}

// Export functions for use in other scripts if needed
export { startStretching, resetStretching };