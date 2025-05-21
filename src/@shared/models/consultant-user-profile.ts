export interface ConsultantUserProfile {
    ID: number;
    UserId: string;
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    CountryCode: string;
    Password: string;
    Address1: string;
    Address2: string;
    City: string;
    State: string;
    ZipCode: any;
    SkillSet: string;
    ProfilePic: string;
    IsActive: boolean;
    UpdatedDate: Date;
    LastLoggedIn: Date;
    CompanyId:number;
    CreatedDate:Date;
    PhoneCountryExt:string;
    Resume_Title :string;
	Resume_Path_Bucket:string;
	Resume_Path_Key:string;
    Resume_Path_Type:string;
    TempKey:string;
    UploadedFileName:string;
    ViewResumeInnerPath:string;
    IsEmailConfirmed:boolean;
    TimeZoneId:number;
    PhoneCountryCode:string;
    
}