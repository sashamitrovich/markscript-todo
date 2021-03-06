import {mlService, mlMethod, resolve, resolveIterator, METHOD} from 'markscript-uservices'
import {chooseUri} from './utils'


export class ToDoService implements ToDo.ToDoService {

  
  putItem(content: string) : Promise<string> {


    let item : ToDo.Item = {
      date: fn.currentDateTime(),
      content: content
    }
    let uri = chooseUri();
    xdmp.documentInsert(uri,item);
    return resolve(uri);
  }

  getItems(searchtext:string): Promise<ToDo.Item[]> {

    return resolve(null);
  }
}
