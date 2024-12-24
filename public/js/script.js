document.addEventListener('DOMContentLoaded', () => {
    let apiVersion = 'v1';
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
    const formatDate = () => {
        return `${property.year}-${property.month}-${property.day} ${property.hours}:${property.minutes}:${property.seconds}`; // Output => 'YYYY-MM-DD HH:mm:ss'
    };

    createAt.textContent = formatDate();
    document.getElementById('year').textContent = 2024;
    if (property.year > 2024) document.getElementById('nextYear').textContent = ` - ${property.year}`;

    if (apiVersion !== 'v1')
        document.getElementById('updatedAt').textContent = formatDate();
    else
        document.getElementById('updatedAt').textContent = 'N/A';
})