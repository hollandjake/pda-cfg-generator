import ObjectHelper from "./ObjectHelper.js";

export default class Superscript {
    static SUPERSCRIPTS = {
        '0': '\u2070',
        '1': '\u00B9',
        '2': '\u00B2',
        '3': '\u00B3',
        '4': '\u2074',
        '5': '\u2075',
        '6': '\u2076',
        '7': '\u2077',
        '8': '\u2078',
        '9': '\u2079',
        '+': '\u207A',
        '-': '\u207B',
        'n': '\u207F'
    }

    static of(x) {
        return String(x).toLowerCase().split('').map(c => {
            if (c in this.SUPERSCRIPTS) {
                return this.SUPERSCRIPTS[c];
            }
            if (this.getKey(c)) {
                return c;
            }
            return '';
        }).join('')
    }

    static getKey(x) {
        for (let key in this.SUPERSCRIPTS) {
            if (ObjectHelper.equals(this.SUPERSCRIPTS[key], x)) {
                return key;
            }
        }
        return null;
    }
}