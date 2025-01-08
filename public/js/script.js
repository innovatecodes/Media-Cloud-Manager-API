document.addEventListener('DOMContentLoaded', () => {
    const date = new Date();
    const createAt = document.getElementById('createdAt');
    const property = {
        year: date.getFullYear(),
        month: (date.getMonth() + 1).toString().padStart(2, "0"),
        day: date.getDate().toString().padStart(2, "0")
    }
    const formatDate = () => `${property.year}-${property.month}-${property.day}`; // Output => 'YYYY-MM-DD'

    createAt.textContent = new Date("2024-12-10").toLocaleDateString();
    document.getElementById('year').textContent = 2024;
    document.getElementById('updatedAt').textContent = new Date("2025-01-07"/*formatDate() | date.getTime()*/).toLocaleDateString();

    if (property.year > 2024) document.getElementById('nextYear').textContent = ` - ${property.year}`;
})



