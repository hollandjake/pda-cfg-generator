import ObjectHelper from "./ObjectHelper.js";

export default class Subscript {
    static SUBSCRIPTS = {
        '0': '\u2080',
        '1': '\u2081',
        '2': '\u2082',
        '3': '\u2083',
        '4': '\u2084',
        '5': '\u2085',
        '6': '\u2086',
        '7': '\u2087',
        '8': '\u2088',
        '9': '\u2089',
        '+': '\u208A',
        '-': '\u208B',
        'a': '\u2090',
        'e': '\u2091',
        'h': '\u2095',
        'k': '\u2096',
        'l': '\u2097',
        'm': '\u2098',
        'n': '\u2099',
        'o': '\u2092',
        'p': '\u209A',
        's': '\u209B',
        't': '\u209C',
        'x': '\u2093',
    }

    static of(x) {
        return String(x).toLowerCase().split('').map(c => {
            if (c in this.SUBSCRIPTS) {
                return this.SUBSCRIPTS[c];
            }
            if (this.getKey(c)) {
                return c;
            }
            return '';
        }).join('')
    }

    static getKey(x) {
        for (let key in this.SUBSCRIPTS) {
            if (ObjectHelper.equals(this.SUBSCRIPTS[key], x)) {
                return key;
            }
        }
        return null;
    }
}