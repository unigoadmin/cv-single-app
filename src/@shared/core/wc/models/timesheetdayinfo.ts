import { EmployeeMaster } from '../models/employeemaster';
import { TimesheetAssignment } from '../models/timesheetassignment';
import { TimesheetDayDetails } from '../models/timesheetdaydetails';
import { TimesheetDocuments } from './timesheetuploaddocs';
export class TimesheetDayInfo{
    TimesheetID:number;
    Assignment:TimesheetAssignment;
    timesheetDays:TimesheetDayDetails[];
    StdHours?:number;
    OTHours?:number;
    TotalStdOTHours?:number;
    Description:string;
    Status:number;
    StartDate:string;
    EndDate:string;
    TimesheetDocuments:TimesheetDocuments[];
    StatusName:string;
    CompanyId:number;
    NotesCount:number;
    CompanyTimesheetID:number;
    ManagerId:string;
    ActionBy:string;
    constructor(){
    this.TimesheetID=0;
    this.Assignment= new TimesheetAssignment();
    this.timesheetDays=[];
    this.StdHours=0;
    this.OTHours=0;
    this.TotalStdOTHours=0;
    this.Description=null;
    this.TimesheetDocuments=[];
    this.StartDate=null;
    this.EndDate=null;
    this.StatusName=null;
    this.CompanyId=0;
    this.NotesCount=0;
    this.CompanyTimesheetID=null;
    this.ManagerId=null;
    this.ActionBy=null;
    }
}