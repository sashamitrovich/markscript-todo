function chooseUri() {
    var uri = fn.concat('item-', xdmp.random(), '.json');
    xdmp.log('new uri=' + uri);
    if (fn.exists(cts.doc(uri))) {
        return chooseUri();
    }
    else {
        return uri;
    }
}
exports.chooseUri = chooseUri;
