export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date' | 'count';
  visible?: boolean;
  cssClasses?: string[];
  filterlabel?: string;
}


export interface FilterTableColumn<T> {
  filter:boolean;
  filterName:string;
  visible?: boolean;
  label?:string;
}
