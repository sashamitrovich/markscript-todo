export function chooseUri() : string {
  let uri = fn.concat('item-', xdmp.random(), '.json');
  if (fn.exists(cts.doc(uri))) {
    return chooseUri();
  }
  else {
    return uri;
  }
}
