document.addEventListener('DOMContentLoaded', () => {
    const date = new Date();

    document.getElementById('createdAt').textContent = getFormattedDate("2024-12-10");
    document.getElementById('updatedAt').textContent = getFormattedDate("2025-02-07"); //date.toLocaleDateString();
    document.getElementById('year').textContent = 2025;
    document.getElementById('version').textContent = '1.0';

    if (date.getFullYear() > 2025) document.getElementById('nextYear').textContent = ` - ${date.getFullYear()}`;


    function getFormattedDate(value) {
        let dateInfo = new Date(value);
        if (isNaN(dateInfo)) return;
        return `${String(dateInfo.getUTCDate()).padStart(2, '0')}/${String(dateInfo.getUTCMonth() + 1).padStart(2, '0')}/${dateInfo.getUTCFullYear()}`;
    }
})

