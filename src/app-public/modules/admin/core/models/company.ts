export class Company
{
    ID: number;
    Name: string;
    UniqueName: string;
    Website: string;
    Logo: string;
    Description: string;
    City: string;
    State: string;
    SkillSet: string;
    IsActive:boolean;
    CreatedDate: Date;
    UpdatedDate: Date;
    KeyWords: string[];
    TrailDays:number;
    OperationsCountry:string;
    Currency:string;
    Display_DateFormat:string;
    Display_TimeFormat:string;
    TimeZoneID:number;
    TimeZoneName:string;
    Address1:string;
    Address2:string;
    OperationsCountryName:string;
    Email:string;
    Phone:string;
    ZipCode:string;
    constructor(){
          this.ID=0,
          this.Name=null,
          this.Website=null,
          this.UniqueName=null,
          this.City=null,
          this.State=null,
          this.SkillSet=null,
          this.Logo=null,
          this.Description=null,
          this.IsActive=true,
          this.CreatedDate=null,
          this.UpdatedDate=null,
          this.KeyWords=null,
          this.TrailDays=null,
          this.OperationsCountry=null,
          this.Currency=null,
          this.Display_DateFormat=null,
          this.Display_TimeFormat=null,
          this.TimeZoneID=0;
          this.TimeZoneName=null;
          this.Address1=null;
          this.Address2=null;
          this.Email=null;
          this.Phone=null;
          this.ZipCode=null;
    }
}