const waterIntake = {
    total: 0,
    logIntake(amount) {
        this.total += amount;
        this.updateDisplay();
        localStorage.setItem('waterIntake', this.total);
    },
    updateDisplay() {
        const display = document.getElementById('water-intake-display');
        display.textContent = `Выпито: ${this.total} мл`;
    },
    loadIntake() {
        const storedIntake = localStorage.getItem('waterIntake');
        this.total = storedIntake ? parseInt(storedIntake) : 0;
        this.updateDisplay();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    waterIntake.loadIntake();

    document.getElementById('log-250ml').addEventListener('click', () => {
        waterIntake.logIntake(250);
    });

    document.getElementById('log-500ml').addEventListener('click', () => {
        waterIntake.logIntake(500);
    });

    document.getElementById('log-1000ml').addEventListener('click', () => {
        waterIntake.logIntake(1000);
    });
});