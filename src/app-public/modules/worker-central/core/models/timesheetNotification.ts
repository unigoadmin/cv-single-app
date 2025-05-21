export class TimesheetConfiguration{
    Id: number;
    CompanyId: number;
    PreviousWeekMissing: number;
    CurrentWeekMissing: number;
    ApprovalPending: number;
    DirectReports: number;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate: Date;
    SubmissionNotification: number;
    RejectionNotification: number;
    ApprovalNotification: number;
    ChatNotification:number;
    constructor(){
    this.Id=0;
    this.CompanyId=0;
    this.PreviousWeekMissing=0;
    this.CurrentWeekMissing=0;
    this.ApprovalPending=0;
    this.DirectReports=0;
    this.CreatedBy=null;
    this.CreatedDate=new Date();
    this.UpdatedBy=null;
    this.UpdatedDate=new Date();
    this.SubmissionNotification=0;
    this.RejectionNotification=0;
    this.ApprovalNotification=0;
    this.ChatNotification=0;
    }
}