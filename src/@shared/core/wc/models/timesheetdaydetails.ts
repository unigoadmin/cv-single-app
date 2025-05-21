import { TimesheetTaskDetails } from './timesheettask';
export class TimesheetDayDetails {
    TimesheetDayID: number;
    TimesheetID: number;
    StdHours?: number;
    OTHours?: number;
    TotalHours?: number;
    TimesheetDay?: Date;
    CreatedDate?: Date;
    UpdatedDate?: Date;
    DayName: string;
    IsDisable: boolean;
    TimesheetTaskDetails: TimesheetTaskDetails[];
    constructor() {
        this.TimesheetDayID = 0;
        this.TimesheetID = 0;
        this.StdHours = 0;
        this.OTHours = 0;
        this.TotalHours = 0;
        this.TimesheetDay = null;
        this.CreatedDate = new Date()
        this.UpdatedDate = null;
        this.DayName = null;
        this.IsDisable = true;
        this.TimesheetTaskDetails = [];
    }
}