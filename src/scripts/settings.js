const settings = {
    theme: 'light', // Default theme
    sounds: {
        backgroundNoise: true,
        music: true,
    },
};

// Function to toggle theme
function toggleTheme() {
    const body = document.body;
    if (settings.theme === 'light') {
        settings.theme = 'dark';
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    } else {
        settings.theme = 'light';
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    }
    saveSettings();
}

// Function to save settings to localStorage
function saveSettings() {
    localStorage.setItem('studyWithMeSettings', JSON.stringify(settings));
}

// Function to load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('studyWithMeSettings');
    if (savedSettings) {
        Object.assign(settings, JSON.parse(savedSettings));
        document.body.classList.toggle('dark-theme', settings.theme === 'dark');
        document.body.classList.toggle('light-theme', settings.theme === 'light');
    }
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', loadSettings);