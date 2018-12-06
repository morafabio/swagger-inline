const semver = require('semver');

class ValidatorVersion {
    static isValid(line) {
        return this.isSince(line) || this.isUntil(line);
    }

    static isUntil(line) {
        return line.trim().includes('until:');
    }

    static isSince(line) {
        return line.trim().includes('since:');
    }

    static getVersion(line) {
        const parts = line.trim().split(':');
        if (parts.length < 2) {
            return '';
        }
        return parts.pop().trim();
    }

    static check(line, target) {
        if (!this.isValid(line)) {
            return false;
        }

        const current = this.getVersion(line);
        if (this.isUntil(line) && semver.satisfies(target, `<=${current}`)) {
            return true;
        }
        if (this.isSince(line) && semver.satisfies(target, `>=${current}`)) {
            return true;
        }
        return false;
    }
}

module.exports = ValidatorVersion;
