var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core = require('markscript-core');
var Runtime = (function (_super) {
    __extends(Runtime, _super);
    function Runtime() {
        _super.apply(this, arguments);
    }
    Runtime.prototype.callGet = function (name, args) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getClient().resources.get({ name: name, params: args }).result(resolve, reject);
        });
    };
    Runtime.prototype.callPost = function (name, args, body) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getClient().resources.post({ name: name, params: args, documents: body }).result(resolve, reject);
        });
    };
    Runtime.prototype.callPut = function (name, args, body) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getClient().resources.put({ name: name, params: args, documents: body }).result(resolve, reject);
        });
    };
    Runtime.prototype.callDelete = function (name, args) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getClient().resources.remove({ name: name, params: args }).result(resolve, reject);
        });
    };
    return Runtime;
})(core.CoreRuntime);
exports.Runtime = Runtime;
//# sourceMappingURL=runtime.js.map