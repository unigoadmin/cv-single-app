export class TimesheetTaskDetails {
    TimesheetTaskID: number;
    TimesheetDayID: number;
    Task: string;
    TaskHours?: number;
    IsOverTime: boolean;
    CreatedDate: Date;
    UpdatedDate?: Date;
    constructor(){
    this.TimesheetTaskID=0;
    this.TimesheetDayID=0;
    this.Task=null;
    this.TaskHours=null;
    this.IsOverTime=false;
    this.CreatedDate=new Date();
    this.UpdatedDate=null;
    }
}