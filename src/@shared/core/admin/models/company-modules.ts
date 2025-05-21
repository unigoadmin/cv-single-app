import { ModuleRoles } from './module-roles';
export interface CompanyModules {
    ModuleId:string;
    ModuleName:string;
    ModuleDescription:string;
    ModuleIcon:string;
    Status:boolean;
    SelectedRoleId:string;
    Roles: ModuleRoles[];
    SelectedRoleDescription:string;
    IsDefault:boolean;
    SelectedRoleName:string;
    IsEnabled:boolean;
}