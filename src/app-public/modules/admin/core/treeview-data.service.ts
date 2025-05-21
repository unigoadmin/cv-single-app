import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


/**
 * Node for to-do item
 */
 export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
    id:string;
    type?: number;
    groupname?:string;
    selected?: boolean;
    description?:string;
  }
  
  /** Flat to-do item node with expandable and level information */
  export class TodoItemFlatNode {
    item: string;
    id:string;
    level: number;
    type: number;
    groupname:string;
    checked:boolean;
    expandable: boolean;
    description?:string;
  }

  export class PermissionsNode{
    name: string;
    id?: number;
    selected?: boolean;
    indeterminate?: boolean;
    children?: PermissionsNode[];
    type?:number;
    groupname?:string;
  }
  
/**
 * The Json object for to-do list data.
 */


//  const TREE_DATA = {
//     Groceries: {
//       "Almond Meal flour": null,
//       "Organic eggs": null,
//       "Protein Powder": null,
//       Fruits: {
//         Apple: null,
//         Berries: ["Blueberry", "Raspberry"],
//         Orange: null
//       }
//     },
//     Reminders: [
//       "Cook dinner",
//       "Read the Material Design spec",
//       "Upgrade Application to Angular"
//     ]
//   };
/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
 @Injectable()
 export class TreeviewDataService {
   dataChange = new BehaviorSubject<TodoItemNode[]>([]);
 
   get data(): TodoItemNode[] {
     return this.dataChange.value;
   }
 
   constructor() {
     //this.initialize(TREE_DATA);
   }
 
   initialize(treeviewData) {debugger;
     // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
     //     file node as children.
     const data = this.buildFileTree(treeviewData, 0);
 
     // Notify the change.
     this.dataChange.next(data);
   }
 
   /**
    * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
    * The return value is the list of `TodoItemNode`.
    */
   buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
     return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
       const value = obj[key];
       const node = new TodoItemNode();
       //node.item = key;
       node.item=value.ItemName;
       node.id = value.ItemId;
       node.description = value.ItemDesc;
 
       if (value != null) {
         if (typeof value === "object" && value.children.length > 0) {
           node.children = this.buildFileTree(value.children, level + 1);
         } else {
           node.item = value.ItemName;
           node.id = value.ItemId;
           node.description = value.ItemDesc;
         }
       }
 
       return accumulator.concat(node);
     }, []);
   }


  //  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {debugger;
  //   return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
  //     const value = obj[key];
  //     const node = new TodoItemNode();
  //     //node.item = key;
  //     node.item=value.ScreenName;
  //     node.id = value.ScreenId;

  //     if (value != null) {
  //       if (typeof value === "object") {
  //         node.children = this.buildFileTree(value, level + 1);
  //       } else {
  //         node.item = value;
  //       }
  //     }

  //     return accumulator.concat(node);
  //   }, []);
  // }
 }