export class TimeSheetSearch {
    Timesheet_id: number;
    UserId: string;
    ApprovalUserId: string;
    ApprovalUserName?:string;
    WeekStartDate: Date;
    WeekEndingDate: Date;
    Status: string;
    UserName?:string;
    constructor(){
    this.Timesheet_id=0;
    this.UserId=null;
    this.ApprovalUserId=null;
    this.ApprovalUserName=null;
    this.WeekStartDate=new Date();
    this.WeekEndingDate=new Date();
    this.Status=null;
    this.UserName=null;
    }
}