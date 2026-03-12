document.addEventListener('DOMContentLoaded', () => {
    const tracker = document.getElementById('progress-tracker');
    const studyDays = JSON.parse(localStorage.getItem('studyDays')) || [];

    if (tracker) {
        tracker.textContent = `Отмечено учебных дней: ${studyDays.length}`;
    }
});