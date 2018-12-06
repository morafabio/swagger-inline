const extractComments = require('multilang-extract-comments');
const jsYaml = require('js-yaml');

function pushLine(array, line) {
    if (line.trim()) {
        array.push(line);
        return true;
    }
    return false;
}

function buildEndpoint(route, yamlLines) {
    const endpoint = {};

    if (route) {
        const yamlObject = jsYaml.load(yamlLines.join('\n'));

        endpoint.method = route[1];
        endpoint.route = route[2];
        if (route[3]) {
          endpoint.summary = route[3];
        }
        Object.assign(endpoint, yamlObject);
    }
    return endpoint;
}

function isVersionDeclarationSince(line) {
    return line.trim().includes('since:');
}

function isVersionDeclarationUntil(line) {
    return line.trim().includes('until:');
}

function isVersionDeclaration(line) {
    return isVersionDeclarationSince(line) || isVersionDeclarationUntil(line);
}

function isVersionDeclarationPassed(line, options) {

    if (!isVersionDeclaration(line)) {
        return true;
    }

    // @todo finish me!
    const value = Number(line.split(':').pop(-1).trim());
    const version = Number(options.version);

    let passed = false;

    if (isVersionDeclarationSince(line) && (version > value)) {
        passed = true;
    }

    if (isVersionDeclarationUntil(line) && (version > value)) {
        passed = false;
    }

    return passed;
}

function isScopeDeclaration(line) {
    return line.trim().includes('scope:');
}

function isScopeDeclarationPassed(line, options) {
    return isScopeDeclaration(line) && line.indexOf(options.scope) >= 0;
}

class Extractor {
    static extractEndpointsFromCode(code, options) {
        const comments = this.extractComments(code, options);

        return Object.keys(comments).map((commentKey) => {
            const comment = comments[commentKey];
            return this.extractEndpoint(comment.content, options);
        }).filter((endpoint) => {
            return endpoint.method && endpoint.route;
        });
    }

    static extractComments(code, options) {
        return extractComments(code, options);
    }

    static extractEndpoint(comment, options) {
        const lines = comment.split('\n');
        const yamlLines = [];
        let route = null;
        let scopeMatched = false;
        let versionMatched = false;

        lines.some((line) => {
            if (route) {
                // @todo: refactor to reduce complexity (e.g. remove if)
                // scope
                if (options && options.scope) {
                    if (isScopeDeclarationPassed(line, options)) {
                        scopeMatched = true;
                        return false;
                    }
                } else {
                    scopeMatched = true;
                }

                // version
                if (options && options.version) {
                    if (isVersionDeclarationPassed(line, options)) {
                        versionMatched = true;
                        return false;
                    }
                } else {
                    versionMatched = true;
                }

                // drop line
                if (isScopeDeclaration(line)) {
                    return false;
                }

                // drop line
                if (isVersionDeclaration(line)) {
                    return false;
                }

                return !pushLine(yamlLines, line); // end when lines stop being pushed
            }

            route = route || line.match(this.ROUTE_REGEX);
            return false;
        });

        if (!scopeMatched) {
            route = null;
        }

        if (!versionMatched) {
            route = null;
        }

        return buildEndpoint(route, yamlLines);
    }
}

Extractor.ROUTE_REGEX = /@(?:oas|api)\s+\[(\w+)\]\s+(.*?)(?:\s+(.*))?$/m;

module.exports = Extractor;
