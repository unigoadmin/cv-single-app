export class TimesheetList {
    TimesheetID: number;
    CompTimesheetID: number;
    CompanyTimesheetID: string;
    EmployeeID: number;
    AssignmentId: number;
    AssignmentName: string;
    TimseheetPeriod: string;
    StdHours?: number;
    OTHours?: number;
    TotalHours?: number;
    status: number;
    AssignmentType:string;
    NotesCount:number;
    DocCount:number;
    ApprovedBy:string;
    UpdatedDate:Date;
    EmployeeName:string;
    Description:string;
    StartDate:string;
    EndDate:string;
    DatePeriod:string;
    StatusName:string;
    constructor() {
        this.TimesheetID = 0;
        this.CompTimesheetID = 0;
        this.CompanyTimesheetID = null;
        this.EmployeeID = 0;
        this.AssignmentId = 0;
        this.AssignmentName = null;
        this.TimseheetPeriod = null;
        this.StdHours = 0;
        this.OTHours = 0;
        this.TotalHours = 0;
        this.status = 0;
        this.AssignmentType=null;
        this.NotesCount=0;
        this.DocCount=0;
        this.ApprovedBy=null;
        this.UpdatedDate=null;
        this.EmployeeName=null;
        this.Description=null;
        this.StartDate=null;
        this.EndDate=null;
        this.DatePeriod=null;
        this.StatusName=null;
    }
}