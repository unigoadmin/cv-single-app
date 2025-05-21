export class timesheetSettings
{
    TimesheetConfigID: number;
    CompanyId: number;
    DescriptionValidation:number;    
    TaskDescriptionValidation?:number;
    MinWeeklyDescription?:number;
    MaxWeeklyDescription?:number;
    StandardHoursMax?:number;
    CreatedBy: string;
    CreatedDate?: Date;
    UpdatedBy: string;
    UpdatedDate?: Date;
    DocumentValidation?:number;
    FromSuperAdminEmail?:boolean;
    TimesheetType:number;
    WeekStartDay:number;
    TimesheetStartDate:Date;
    constructor(){
    this.TimesheetConfigID=0;
    this.CompanyId=0;
    this.DescriptionValidation=0;   
    this.TaskDescriptionValidation=0;
    this.MinWeeklyDescription=0;
    this.MaxWeeklyDescription=0;
    this.StandardHoursMax=0;
    this.CreatedBy=null;
    this.CreatedDate=new Date();
    this.UpdatedBy=null;
    this.UpdatedDate=new Date();
    this.DocumentValidation=0;
    this.FromSuperAdminEmail=false;
    this.TimesheetType=0;
    this.WeekStartDay=1;
    this.TimesheetStartDate=null;

    }
}