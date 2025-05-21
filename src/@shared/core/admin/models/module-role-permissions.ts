import { Roles } from './roles';
import { Screens } from './screens';

export class ModuleRolePermissions{
    Id:number;
    CompanyId:number;
    RoleId:string;
    Screens:string[];
    Actions:string[];
    JsonText:string;
    RolesVM: Roles[];
    ScreensVM: Screens[];
    ModuleId:string;


    
    constructor(){
        this.Id = 0,
        this.CompanyId = 0,
        this.RoleId = null,
        this.Screens = [],
        this.Actions = [],
        this.JsonText = null,
        this.RolesVM = [],
        this.ScreensVM = [],
        this.ModuleId=null
    }
}