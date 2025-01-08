document.addEventListener('DOMContentLoaded', () => {
    const date = new Date();
    const createAt = document.getElementById('createdAt');
    const property = {
        year: date.getFullYear(),
        month: (date.getMonth() + 1).toString().padStart(2, "0"),
        day: date.getDate().toString().padStart(2, "0"),
        hours: date.getHours().toString().padStart(2, "0"),
        minutes: date.getMinutes().toString().padStart(2, "0"),
        seconds: date.getSeconds().toString().padStart(2, "0"),
    }
    const formatDate = () => `${property.year}-${property.month}-${property.day} ${property.hours}:${property.minutes}:${property.seconds}`; // Output => 'YYYY-MM-DD HH:mm:ss'

    createAt.textContent = new Date("2024-12-10 19:37:37").toLocaleString();
    document.getElementById('year').textContent = 2024;
    document.getElementById('updatedAt').textContent = new Date("2025-01-07 21:52:24"/*formatDate() | date.getTime()*/).toLocaleString();

    if (property.year > 2024) document.getElementById('nextYear').textContent = ` - ${property.year}`;
})



