import { ModuleRolePermissions, RoleUsers } from ".";

export interface EmployerRoles{
    Id :number;
    RoleId :string;
    RoleName :string;
    RoleDescription :string;
    CreatedDate :Date;
    UpdatedDate :Date;
    Status :boolean;
    RoleOrder :number;
    UserType :number;
    CompanyId :number;
    ModuleId:string;
    ModuleName:string;
    RolePermissions:ModuleRolePermissions;
    RoleUsers:RoleUsers
}