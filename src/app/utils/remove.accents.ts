// Função que remove os acentos de uma string.
export const removeAccents = (text?: string): string => {
    // A função normalize() é utilizada para decompor caracteres acentuados em sua forma decomponível.
    // O parâmetro "NFD" indica que queremos decompor os caracteres acentuados, ou seja, separar a letra do acento.
    // Por exemplo, 'é' se tornaria 'e' + acento agudo.
    return text?.normalize("NFD")

        // A função replace() é usada para remover os caracteres diacríticos (acentos).
        // A regex [\u0300-\u036f] é usada para identificar os caracteres diacríticos, que são os acentos.
        // A faixa \u0300-\u036f corresponde aos acentos usados em caracteres latinos.
        // O 'g' no final da regex garante que a substituição ocorra globalmente em toda a string.
        // Estamos substituindo os acentos encontrados por uma string vazia, removendo-os.
        .replace(/[\u0300-\u036f]/g, '') || "";
       
}
