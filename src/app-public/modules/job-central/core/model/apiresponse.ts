export class ApiResponse{
    ErrorMessage:string;
    SuccessMessage:string;
    Data:any;
    IsError:boolean;
    TotalRecords:number;
    DownloadFile:Blob
    constructor(){
    this.ErrorMessage=null;
    this.SuccessMessage=null;
    this.Data=null;
    this.IsError=false;
    this.TotalRecords=0;
    this.DownloadFile=null;
    }
}