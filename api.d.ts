declare module ToDo {

  // definition of the To-Do item
  interface Item {
    id: number;
    content: string;
  }

  // definition of the available uservice methods
  interface ToDoService {
    putItem(content:string)
    getItems(searchtext:string): Promise<Item[]>
  }
}
