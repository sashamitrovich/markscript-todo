function chooseUri() {
    var uri = fn.concat('item-', xdmp.random(), '.json');
    if (fn.exists(cts.doc(uri))) {
        return chooseUri();
    }
    else {
        return uri;
    }
}
exports.chooseUri = chooseUri;
