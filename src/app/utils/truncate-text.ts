export const truncateText = (text: string, characterCount: number): string => {
    return text.length >= characterCount ? `${text.substring(0, characterCount)}... ` : text;
};