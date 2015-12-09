declare module ToDo {

  // definition of the To-Do item
  interface Item {
    date: Date;
    content: string;
  }

  // definition of the available uservice methods
  interface ToDoService {
    // writes the item to the DB,
    // returns the doc uri
    putItem(content:string): Promise<string>

    // gets the items from the database for the given search text
    // returns an array of items
    getItems(searchtext:string): Promise<Item[]>
  }
}
