var mu = require('markscript-uservices');
function methodToString(method) {
    switch (method) {
        case 1:
            return 'PUT';
        case 0:
        default:
            return 'POST';
    }
}
exports.methodToString = methodToString;
//# sourceMappingURL=model.js.map