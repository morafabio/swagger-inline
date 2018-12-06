const assert = require('chai').assert;

const ValidatorVersion = require('../src/validator-version');

describe('ValidatorVersion', () => {
    it('line is invalid', () => {
        assert.isFalse(ValidatorVersion.isValid('   '));
        assert.isFalse(ValidatorVersion.isValid('foobar'));
    });

    it('line is until', () => {
        assert.isTrue(ValidatorVersion.isUntil(' until: '));
        assert.isTrue(ValidatorVersion.isUntil('until:'));
        assert.isFalse(ValidatorVersion.isUntil('foobar:'));
    });

    it('line is since', () => {
        assert.isTrue(ValidatorVersion.isSince(' since: '));
        assert.isTrue(ValidatorVersion.isSince('since:'));
        assert.isFalse(ValidatorVersion.isSince('foobar:'));
    });

    it('line is valid', () => {
        assert.isTrue(ValidatorVersion.isValid('since:'));
        assert.isTrue(ValidatorVersion.isValid('until:'));
    });

    it('extracts version', () => {
        assert.equal(ValidatorVersion.getVersion('until: 1.5.1'), '1.5.1');
        assert.equal(ValidatorVersion.getVersion('since: 1.5.1'), '1.5.1');
        assert.equal(ValidatorVersion.getVersion('since:'), '');
        assert.equal(ValidatorVersion.getVersion(''), '');
    });

    it('check empty constraints will fail', () => {
        assert.isFalse(ValidatorVersion.check('', ''));
    });

    it('check constraints until', () => {
        assert.isTrue(ValidatorVersion.check('until: 1.5.1', '1.5.1'));
        assert.isTrue(ValidatorVersion.check('until: 1.5.x', '1.5.5'));
        assert.isTrue(ValidatorVersion.check('until: 1.5.1', '1.5.0'));
        assert.isFalse(ValidatorVersion.check('until: 1.5.1', '1.5.2'));
    });

    it('check constraints since', () => {
        assert.isTrue(ValidatorVersion.check('since: 1.5.1', '1.5.1'));
        assert.isTrue(ValidatorVersion.check('since: 1.5.x', '1.5.1'));
        assert.isTrue(ValidatorVersion.check('since: 1.5.1', '1.5.2'));
        assert.isFalse(ValidatorVersion.check('since: 1.5.1', '1.5.0'));
    });
});
