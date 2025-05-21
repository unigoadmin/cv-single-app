export class AssignmentActivityLog{
    AssignmentLogID:number;
    AssignmentID:number;
    Action:string;
    CreatedBy:string;
    CreatedDate:Date;

    constructor(){
        this.AssignmentLogID=0;
        this.AssignmentID=0;
        this.Action=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
    }


}