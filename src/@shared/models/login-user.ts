import { LoginUserModules } from './login-user-modules';
import { LoginUserCompany } from './login-user-company';
import { RolePermissions } from './role-permissions';
export interface LoginUser {
    UserId: string;
    FirstName: string;
    LastName: string;
    FullName:string;
    Email: string;
    Role: string;
    ProfilePic: string;
    EmployeeID:number;
    Company:LoginUserCompany;
    ModulesList:LoginUserModules[];
    RolePermissions:RolePermissions;
    IsSubmissionsRequired:boolean;
    EmployerType?:number;
}
