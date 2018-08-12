const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string value', () => {
        var res = isRealString(98);
        expect(res).toBeFalsy;
    });

    it('should reject string with only spaces', () => {
        var res = isRealString('  ');
        expect(res).toBeFalsy;
    });

    it('Should allow string with non-space chars', () => {
        var res = isRealString('  an  ');
        expect(res).toBeTruthy;
    });
});