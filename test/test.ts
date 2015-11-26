import {Runtime} from 'markscript-koa'

export function test(runtime: Runtime) {
  let todoService = <ToDo.ToDoService>runtime.getService('todo');

  return todoService.putItem("doctor's appointment").then(function(uri) {
    console.log('inserted a new to-do item.');
    console.log('uri of the new document='+uri);
    return
  })
}
