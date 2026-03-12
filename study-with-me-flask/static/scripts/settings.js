const settings = {
    theme: 'light'
};

function saveSettings() {
    localStorage.setItem('studyWithMeSettings', JSON.stringify(settings));
}

function applyTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme', settings.theme === 'dark');
    body.classList.toggle('light-theme', settings.theme === 'light');
}

function toggleTheme() {
    settings.theme = settings.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveSettings();
}

function loadSettings() {
    const savedSettings = localStorage.getItem('studyWithMeSettings');
    if (savedSettings) {
        Object.assign(settings, JSON.parse(savedSettings));
    }
    applyTheme();
}

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    const toggleButton = document.getElementById('toggle-theme');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTheme);
    }
});