const miniCalendar = (() => {
    const studyDays = JSON.parse(localStorage.getItem('studyDays')) || [];

    const renderCalendar = () => {
        const calendarElement = document.getElementById('mini-calendar');
        if (!calendarElement) return;

        calendarElement.innerHTML = '';
        const currentDate = new Date();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-cell');
            calendarElement.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-cell');
            dayCell.textContent = day;

            const dateString = `${year}-${month + 1}-${day}`;
            if (studyDays.includes(dateString)) {
                dayCell.classList.add('studied');
            }

            dayCell.addEventListener('click', () => toggleStudyDay(dateString));
            calendarElement.appendChild(dayCell);
        }
    };

    const toggleStudyDay = (dateString) => {
        const index = studyDays.indexOf(dateString);

        if (index !== -1) {
            studyDays.splice(index, 1);
        } else {
            studyDays.push(dateString);
        }

        localStorage.setItem('studyDays', JSON.stringify(studyDays));
        renderCalendar();
    };

    return {
        init: renderCalendar
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    miniCalendar.init();
});