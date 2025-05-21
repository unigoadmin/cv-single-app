export class WCApiResponse{
    ErrorMessage:string;
    SuccessMessage:string;
    Data:any;
    IsError:boolean;
    constructor(){
    this.ErrorMessage=null;
    this.SuccessMessage=null;
    this.Data=null;
    this.IsError=false;
    }
}