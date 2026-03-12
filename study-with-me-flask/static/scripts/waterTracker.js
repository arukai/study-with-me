const waterIntake = {
    total: 0,

    logIntake(amount) {
        this.total += amount;
        this.updateDisplay();
        localStorage.setItem('waterIntake', this.total);
    },

    updateDisplay() {
        const display = document.getElementById('water-intake-display');
        if (display) {
            display.textContent = `Выпито: ${this.total} мл`;
        }
    },

    loadIntake() {
        const storedIntake = localStorage.getItem('waterIntake');
        this.total = storedIntake ? parseInt(storedIntake, 10) : 0;
        this.updateDisplay();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    waterIntake.loadIntake();

    const btn250 = document.getElementById('log-250ml');
    const btn500 = document.getElementById('log-500ml');
    const btn1000 = document.getElementById('log-1000ml');

    if (btn250) btn250.addEventListener('click', () => waterIntake.logIntake(250));
    if (btn500) btn500.addEventListener('click', () => waterIntake.logIntake(500));
    if (btn1000) btn1000.addEventListener('click', () => waterIntake.logIntake(1000));
});