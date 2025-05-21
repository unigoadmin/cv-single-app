export class TimesheetMasterNotes {
    TimesheetNoteID: number;
    TimesheetID: number;
    ManagerID: string;
    EmployeeID:number;
    Comment: string;
    status: string;
    CreatedDate: Date;
    EmployeeName: string;
    ManagerName:string;
    EmployerProfilePic: string;
    EventCreatorType:string;
    NotesCount:number;
    CommentBy:string;
    EmployerType:string;
    CompanyId:number;
    constructor(){
    this.TimesheetNoteID=0;
    this.TimesheetID=0;
    this.ManagerID=null;
    this.EmployeeID=0;
    this.Comment=null;
    this.status=null;
    this.CreatedDate=new Date();
    this.EmployeeName=null;
    this.ManagerName=null;
    this.EmployerProfilePic=null;
    this.EventCreatorType=null;
    this.NotesCount=0;
    this.CommentBy=null;
    this.EmployerType=null;
    this.CompanyId=0;
    }
}