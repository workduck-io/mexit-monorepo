function getValue(s) {
    return s.split('').reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0) - 1;
}

function setValue(n) {
    var result = '';
    do {
        result = (n % 26 + 10).toString(36) + result;
        n = Math.floor(n / 26) - 1;
    } while (n >= 0)
    return result.toUpperCase();
}

export function incrementChar(string) {
    return setValue(getValue(string) + 1);
}