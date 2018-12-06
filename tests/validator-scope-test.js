const assert = require('chai').assert;

const ValidatorScope = require('../src/validator-scope');

describe('ValidatorScope', () => {
    it('line is invalid', () => {
        assert.isFalse(ValidatorScope.isValid('zzz:'));
        assert.isFalse(ValidatorScope.isValid(''));
        assert.isFalse(ValidatorScope.isValid('   '));
        assert.isFalse(ValidatorScope.isValid('scope'));
    });

    it('line is valid', () => {
        assert.isTrue(ValidatorScope.isValid('scope:'));
        assert.isTrue(ValidatorScope.isValid(' scope: '));
    });

    it('scope is matched', () => {
        assert.isTrue(ValidatorScope.check('scope: foo', 'foo'));
    });

    it('multiple scopes are matched', () => {
        assert.isTrue(ValidatorScope.check('scope: foo', 'foo, bar'));
        assert.isTrue(ValidatorScope.check('scope: bar', 'foo, bar'));
    });

    it('scope is not matched', () => {
        assert.isFalse(ValidatorScope.check('scope: foo', 'bar'));
    });
});
