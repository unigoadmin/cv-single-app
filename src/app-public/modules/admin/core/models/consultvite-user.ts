import { Company } from './company'
import { CompanyModules } from './company-modules';
import { UserSecurity } from './user-security';
export interface ConsultviteUser {
    ID: number;
    UserId:string;
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNo: string;
    Password: string;
    Address1: string;
    Address2    : string;
    City: string;
    State: string;
    Zip:number;
    SkillSet: string;
    ProfilePic: string;
    IsActive:boolean;
    CreatedDate: Date;
    UpdatedDate: Date;
    LastLoggedIn: Date;
    UserType: number;
    CompanyId: number;
    FullName:string;
    Company:Company;
    PhoneCountryExt:string;
    Modules: CompanyModules[];
    CreatedBy:string,
    UpdatedBy:string,
    PhoneExt: string,
    Security:UserSecurity;  
    CountryCode:string; 
}