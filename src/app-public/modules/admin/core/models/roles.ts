import { ConsultviteUser } from './consultvite-user';
import { Screens } from './screens';
export interface Roles{
    Id:number;
    RoleId: string;
    RoleName:string;
    RoleDescription:string;
    CreatedDate:Date;
    UpdatedDate:Date;
    Status:boolean;
    RoleOrder:number;
    UserType:number;
    CompanyId:number;
    ModuleId: string;
    Screens: Screens[];
    NoofUsers?:number;
    Users: ConsultviteUser[];
    IsDisabled:boolean;
}
