import { timesheeteachday } from './timesheeteachday';
import { TimesheetMasterNotes } from './timesheetnotes';
import { TimesheetDocuments } from './timesheetuploaddocs';
export class timesheet {
    Timesheet_id: number;
    userId: string;
    WeekStartDate: Date;
    WeekEndingDate: Date;
    StdHours: number;
    OTHours: number;
    TotalHours: number;
    Status: string;
    ApprovalEmpId: string;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate: Date;
    TimesheetEachDayField: timesheeteachday[];
    timesheetuploaddocs: TimesheetDocuments[];
    timesheetnotesData: TimesheetMasterNotes[];
    SubEmployeeName: string;
    DocCount: number;
    NotesCount: number;
    Description: string;
    UserType: string;
    EventCreatorType: string;
    DeleteReasons?: string;
    UserFirstName?: string;
    UserLastName?: string;
    Description_Plain?: string;
    constructor() {
        this.Timesheet_id = 0;
        this.userId=null;
        this.WeekStartDate=new Date();
        this.WeekEndingDate=new Date();
        this.StdHours = 0;
        this.OTHours = 0;
        this.TotalHours = 0;
        this.Status=null;
        this.ApprovalEmpId=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedBy=null;
        this.UpdatedDate=new Date();
        this.TimesheetEachDayField=[];
        this.timesheetuploaddocs=[];
        this.timesheetnotesData=[];
        this.SubEmployeeName=null;
        this.DocCount = 0;
        this.NotesCount = 0;
        this.Description=null;
        this.UserType=null;
        this.EventCreatorType=null;
        this.DeleteReasons =null;
        this.UserFirstName =null;
        this.UserLastName =null;
        this.Description_Plain =null;
    }
}