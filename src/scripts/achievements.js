// achievements.js

const achievements = {
    consecutiveDays: 0,
    milestones: [
        { days: 5, reward: "5 дней без пропуска" },
        { days: 10, reward: "10 дней без пропуска" },
        { days: 20, reward: "20 дней без пропуска" },
        { days: 30, reward: "Месяц без пропуска!" }
    ],
    achieved: [],

    checkAchievements: function() {
        this.milestones.forEach(milestone => {
            if (this.consecutiveDays >= milestone.days && !this.achieved.includes(milestone.reward)) {
                this.achieved.push(milestone.reward);
                this.displayAchievement(milestone.reward);
            }
        });
    },

    displayAchievement: function(reward) {
        const achievementList = document.getElementById('achievement-list');
        const achievementItem = document.createElement('li');
        achievementItem.textContent = reward;
        achievementList.appendChild(achievementItem);
    },

    incrementDays: function() {
        this.consecutiveDays++;
        this.checkAchievements();
        this.saveProgress();
    },

    resetDays: function() {
        this.consecutiveDays = 0;
        this.saveProgress();
    },

    saveProgress: function() {
        localStorage.setItem('consecutiveDays', this.consecutiveDays);
        localStorage.setItem('achievements', JSON.stringify(this.achieved));
    },

    loadProgress: function() {
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

// Initialize achievements on page load
document.addEventListener('DOMContentLoaded', () => {
    achievements.loadProgress();
});