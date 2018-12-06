class ValidatorScope {
    static isValid(line) {
        return line.trim().includes('scope:');
    }

    static check(line, scope) {
        if (!this.isValid(line)) {
            return false;
        }

        const scopes = String(scope).split(',');
        if (scopes.length === 0) {
            return false;
        }

        for (let i = 0; i < scopes.length; i++) {
            if (line.trim().includes(scopes[i])) {
                return true;
            }
        }
        return false;
    }
}

module.exports = ValidatorScope;
