import { TimesheetTaskDetails } from './timesheettask';
export class timesheeteachday {
    TimesheetDayID: number;
    TimesheetID: number;
    StdHours: number;
    OTHours: number;
    TotalHours:number;
    Date: Date;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate: Date;   
    TimesheetTaskField: TimesheetTaskDetails[];
    dayId:number;
    constructor(){
    this.TimesheetDayID=0;
    this.TimesheetID=0;
    this.StdHours=0;
    this.OTHours=0;
    this.TotalHours=0;
    this.Date=new Date();
    this.CreatedBy=null;
    this.CreatedDate=new Date();
    this.UpdatedBy=null;
    this.UpdatedDate=new Date();   
    this.TimesheetTaskField= [];
    this.dayId=0;
    }
}