document.addEventListener('DOMContentLoaded', () => {
    const date = new Date();
    const createAt = document.getElementById('createdAt');

    const property = {
        year: date.getFullYear(),  // Obtém o ano atual (ex: 2024).
        month: (date.getMonth() + 1).toString().padStart(2, "0"),
        /**
         *  Obtém o mês atual (0-11, ajusta para 1-12), converte para string
         *  e usa padStart(2, "0") para garantir que o mês tenha dois dígitos (ex: "01").
         *  O padStart(2, "0") é usado para garantir que o mês e o dia tenham sempre dois caracteres,
         *   adicionando um zero à esquerda quando necessário.
         */
        day: date.getDate().toString().padStart(2, "0"),
        /**
         * Obtém o dia do mês, converte para string e usa padStart(2, "0") para garantir que o dia tenha dois dígitos (ex: "05").
         *  O padStart(2, "0") é usado para garantir que o mês e o dia tenham sempre dois caracteres,
         * adicionando um zero à esquerda quando necessário.
         */
    };

    const formatDate = () => `${property.year}-${property.month}-${property.day}`; // Output => 'YYYY-MM-DD'

    createAt.textContent = new Date("2024-12-10").toLocaleDateString();
    document.getElementById('year').textContent = 2024;
    document.getElementById('updatedAt').textContent = new Date("2025-01-07").toLocaleDateString();
    document.getElementById('version').textContent = '2.0';
    
    if (property.year > 2024) document.getElementById('nextYear').textContent = ` - ${property.year}`;
})






