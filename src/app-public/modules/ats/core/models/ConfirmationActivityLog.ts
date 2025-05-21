export class ConfirmationActivityLog{
    ConfirmationLogID:number;
    ConfirmationID:number;
    Action:string;
    CreatedBy:string;
    CreatedDate:Date;

    constructor(){
        this.ConfirmationLogID=0;
        this.ConfirmationID=0;
        this.Action=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
    }


}