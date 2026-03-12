const achievements = {
    consecutiveDays: 0,
    milestones: [
        { days: 5, reward: "5 дней без пропуска" },
        { days: 10, reward: "10 дней без пропуска" },
        { days: 20, reward: "20 дней без пропуска" },
        { days: 30, reward: "Месяц без пропуска!" }
    ],
    achieved: [],

    checkAchievements() {
        this.milestones.forEach(milestone => {
            if (this.consecutiveDays >= milestone.days && !this.achieved.includes(milestone.reward)) {
                this.achieved.push(milestone.reward);
                this.displayAchievement(milestone.reward);
            }
        });
    },

    displayAchievement(reward) {
        const achievementList = document.getElementById('achievement-list');
        if (!achievementList) return;

        const existingItems = [...achievementList.querySelectorAll('li')].map(li => li.textContent);
        if (existingItems.includes(reward)) return;

        const achievementItem = document.createElement('li');
        achievementItem.textContent = reward;
        achievementList.appendChild(achievementItem);
    },

    incrementDays() {
        this.consecutiveDays++;
        this.checkAchievements();
        this.saveProgress();
    },

    resetDays() {
        this.consecutiveDays = 0;
        this.achieved = [];
        localStorage.removeItem('achievements');
        this.saveProgress();

        const achievementList = document.getElementById('achievement-list');
        if (achievementList) achievementList.innerHTML = '';
    },

    saveProgress() {
        localStorage.setItem('consecutiveDays', this.consecutiveDays);
        localStorage.setItem('achievements', JSON.stringify(this.achieved));
    },

    loadProgress() {
        const savedDays = localStorage.getItem('consecutiveDays');
        const savedAchievements = localStorage.getItem('achievements');

        if (savedDays) {
            this.consecutiveDays = parseInt(savedDays, 10);
        }

        if (savedAchievements) {
            this.achieved = JSON.parse(savedAchievements);
            this.achieved.forEach(reward => this.displayAchievement(reward));
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    achievements.loadProgress();

    const incrementBtn = document.getElementById('increment-days');
    const resetBtn = document.getElementById('reset-days');

    if (incrementBtn) incrementBtn.addEventListener('click', () => achievements.incrementDays());
    if (resetBtn) resetBtn.addEventListener('click', () => achievements.resetDays());
});