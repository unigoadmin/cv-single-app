export class EmployeeActivityLog{
    EmployeeLogID:number;
    EmployeeID:number;
    Action:string;
    CreatedBy:string;
    CreatedDate:Date;

    constructor(){
        this.EmployeeLogID=0;
        this.EmployeeID=0;
        this.Action=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
    }


}