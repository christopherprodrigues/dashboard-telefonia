export function formatPhoneNumber(phone: string): string {
    const cleaned = ('' + phone).replace(/\D/g, '');

    if (cleaned.length === 13) { // +55 (41) 98888-8888
        const match = cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
        }
    }
    if (cleaned.length === 11) { // (41) 98888-8888
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
    }
    if (cleaned.length === 12) { // +55 (41) 3333-3333
        const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})(\d{4})$/);
        if (match) {
            return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
        }
    }
    // Retorna o número original se não corresponder a nenhum formato
    return phone;
}