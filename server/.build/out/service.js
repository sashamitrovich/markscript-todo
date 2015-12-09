var markscript_uservices_1 = require('markscript-uservices');
var utils_1 = require('./utils');
var ToDoService = (function () {
    function ToDoService() {
    }
    ToDoService.prototype.putItem = function (content) {
        var item = {
            date: fn.currentDateTime(),
            content: content
        };
        var uri = utils_1.chooseUri();
        xdmp.documentInsert(uri, item);
        return markscript_uservices_1.resolve(uri);
    };
    ToDoService.prototype.getItems = function (searchtext) {
        return markscript_uservices_1.resolve(null);
    };
    return ToDoService;
})();
exports.ToDoService = ToDoService;
