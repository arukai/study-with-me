// progressTracker.js

const progressKey = 'studyProgress';

function initializeProgress() {
    const storedProgress = localStorage.getItem(progressKey);
    return storedProgress ? JSON.parse(storedProgress) : { minutesStudied: 0 };
}

function updateProgress(minutes) {
    const progress = initializeProgress();
    progress.minutesStudied += minutes;
    localStorage.setItem(progressKey, JSON.stringify(progress));
}

function getProgress() {
    return initializeProgress();
}

function resetProgress() {
    localStorage.removeItem(progressKey);
}

document.addEventListener('DOMContentLoaded', () => {
    const progressDisplay = document.getElementById('progress-display');
    const progress = getProgress();
    progressDisplay.textContent = `Minutes Studied: ${progress.minutesStudied}`;
});

// Export functions for use in other modules
export { updateProgress, getProgress, resetProgress };