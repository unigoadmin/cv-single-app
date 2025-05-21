export class TimeSheetFilter {
       EmployeeId: number;
       CompanyId: number;
       StartDate?: Date;
       EndDate?: Date;
       ManagerId: string;
       Status?: number
       AssignmentId:number;
       UserId:string;
       constructor() {
              this.EmployeeId = null;
              this.CompanyId = 0;
              this.StartDate = null;
              this.EndDate = null;
              this.ManagerId = null;
              this.Status = null;
              this.AssignmentId=null;
              this.UserId=null
       }
}