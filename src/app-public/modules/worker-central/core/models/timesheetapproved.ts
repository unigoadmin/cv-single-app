export class TimeseetApproved{
    TimesheetID:number;
    ApprovedBy:string;
    UpdatedDate:Date;
    Status:number;
    CompanyId:number;
    constructor(){
        this.TimesheetID=0;
        this.ApprovedBy=null;
        this.UpdatedDate=null;
        this.Status=0;
        this.CompanyId=0;
    }
}