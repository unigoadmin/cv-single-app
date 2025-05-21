 export interface TimesheetTemp
  {  
      DateName: string;
      Date: string;
      TimesheetTaskField: string[]; 
      inforISOT: boolean;
      hoursSTd: number;
      hoursOT: number;
      totalhours: number;
      timeEachDayId: number;
  }