const extractComments = require('multilang-extract-comments');
const jsYaml = require('js-yaml');

const ValidatorScope = require('./validator-scope');
const ValidatorVersion = require('./validator-version');

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
        const scopeOptionEnabled = options && options.scope;
        const versionOptionEnabled = options && options.version;

        let route = null;
        let scopeMatched = true;
        let sinceVersionMatched = true;
        let untilVersionMatched = true;

        lines.some((line) => {
            if (route) {
                if (!scopeOptionEnabled && !versionOptionEnabled) {
                    return !pushLine(yamlLines, line);
                }

                if (scopeOptionEnabled && ValidatorScope.isValid(line)) {
                    scopeMatched = ValidatorScope.check(line, options.scope);
                    return false;
                }

                if (versionOptionEnabled) {
                    if (ValidatorVersion.isSince(line)) {
                        sinceVersionMatched = ValidatorVersion.check(line, options.version);
                    }
                    if (ValidatorVersion.isUntil(line)) {
                        untilVersionMatched = ValidatorVersion.check(line, options.version);
                    }
                }
                return false;
            }

            route = route || line.match(this.ROUTE_REGEX);
            return false;
        });

        if (!scopeMatched) {
            route = null;
        }

        if (!untilVersionMatched || !sinceVersionMatched) {
            route = null;
        }

        return buildEndpoint(route, yamlLines);
    }
}

Extractor.ROUTE_REGEX = /@(?:oas|api)\s+\[(\w+)\]\s+(.*?)(?:\s+(.*))?$/m;

module.exports = Extractor;
