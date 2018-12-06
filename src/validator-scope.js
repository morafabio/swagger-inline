class ValidatorScope {
    static isValid(line) {
        return line.trim().includes('scope:');
    }

    static check(line, scope) {
        if (!this.isValid(line)) {
            return false;
        }

        const scopes = scope.split(',');
        if (!scopes || scopes.length === 0) {
            return false;
        }

        for (let i = 0; i < scopes.length; i += 1) {
            if (line.trim().includes(scopes[i])) {
                return true;
            }
        }
        return false;
    }
}

module.exports = ValidatorScope;
