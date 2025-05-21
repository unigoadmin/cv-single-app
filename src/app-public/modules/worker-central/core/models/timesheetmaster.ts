export class TimestheetMaster {
    TimesheetID: number;
    CompTimesheetID: number;
    Status: number;
    EmployeeID: number;
    AssignmentID?: number;
    Description: string;
    StartDate: number;
    EndDate: number;
    StdHours: number;
    OTHours: number;
    TotalHours: number;
    ApprovedBy: string;
    CreatedDate: number;
    UpdatedDate?: Date;
    CompanyID: number;
    constructor() {
        this.TimesheetID=0;
        this.CompTimesheetID=0
        this.Status=0;
        this.EmployeeID=0;
        this.AssignmentID =null;
        this.Description =null;
        this.StartDate=0;
        this.EndDate=0;
        this.StdHours=0;
        this.OTHours=0;
        this.TotalHours=0;
        this.ApprovedBy =null;
        this.CreatedDate=0
        this.UpdatedDate =null;
        this.CompanyID=0;
    }
}