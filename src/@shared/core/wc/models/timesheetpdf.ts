import { TimesheetList } from '../models/timesheetlist';
import {TimesheetDayInfo} from '../models/timesheetdayinfo';
import {TimesheetTaskDetails} from '../models/timesheettask';
export class TimesheetPdf{
    UserId: string;
    CompanyName:string;
    CompanyLogo:string;
    timesheet:TimesheetList[];
}

export class TimesheetManagerViewPDF{
    UserId: string;
    CompanyName:string;
    CompanyLogo:string;
    TimesheetView:TimesheetDayInfo;
    TimesheetTaksDetails:TimesheetTaskDetails[];
}