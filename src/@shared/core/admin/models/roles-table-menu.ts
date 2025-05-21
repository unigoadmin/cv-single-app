import { Icon } from "@visurel/iconify-angular";

export interface RolesTableMenu {
    type: 'link'  | 'subheading';
    id?:string ;
    icon?: Icon;
    label: string;
    classes?: {
      icon?: string;
    };
  }
  