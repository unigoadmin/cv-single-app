export class TimesheetPrintInfo {
    TimesheetID: number;
    TotalStdOTHours?: number;
    StdHours?: number;
    OTHours?: number;
    Description: string;
    Status: number;
    StartDate?: Date;
    EndDate?: Date;
    StatusName : string;
    NotesCount: number;
    CompanyTimesheetID: string;
    AssignmentID?: number;
    AssignmentName: string;
    EmployeeID?: number;
    WorkerFirstName: string;
    WorkerLastName: string;
    TimesheetActivity_Prints: TimesheetActivity_Print[];
    TimesheetNotes_Prints: TimesheetNotes_Print[];
    TimesheetDocuments_Prints: TimesheeDocuments_Print[];
    TimesheetDay_Prints: TimesheetDay_Print[];
    constructor() {
        this.TimesheetID = 0;
        this.TotalStdOTHours = 0;
        this.StdHours = 0;
        this.OTHours = 0;
        this.Description = null;
        this.Status = 0;
        this.StartDate = null;
        this.EndDate = null;
        this.StatusName = null;
        this.NotesCount = 0;
        this.CompanyTimesheetID = null;
        this.AssignmentID = null;
        this.AssignmentName = null;
        this.EmployeeID = 0;
        this.WorkerFirstName = null;
        this.WorkerLastName = null;
        this.TimesheetActivity_Prints = [];
        this.TimesheetNotes_Prints = [];
        this.TimesheetDocuments_Prints = [];
        this.TimesheetDay_Prints = [];
    }
}

export class TimesheetActivity_Print {
    Comment: string;
    ActivityDate: Date;
    CreatedBy: string;
}
export class TimesheetNotes_Print {
    Comment: string;
    NotesDate: Date;
    CreatedBy: string;
}
export class TimesheeDocuments_Print {
    TimesheetDocID: number;
    DownloadableFileName: string;
    Download_Path_Type: string;
}
export class TimesheetDay_Print {
    TimesheetDayID: number;
    TimesheetDay: Date;
    DayName: string;
    StdHours: number;
    OTHours: number;
    TotalHours: number;
    Description:string;
}