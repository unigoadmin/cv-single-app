export class TimesheetDocuments {
    TimesheetDocID: number;
    TimesheetID: number;
    s3location: string;
    DownloadableFileName: string;
    Download_Path_Key: string;
    Download_Path_Type: string;
    CreatedBy: number;
    CreatedDate: Date;
    UpdatedBy?: number;
    UpdatedDate?: Date;
    isDeleted:boolean;
    DocumentInnerPath:string;
    constructor(){
    this.TimesheetDocID=0;
    this.TimesheetID=0;
    this.s3location=null;
    this.DownloadableFileName=null;
    this.Download_Path_Key=null;
    this.Download_Path_Type=null;
    this.CreatedBy=0;
    this.CreatedDate=new Date();
    this.UpdatedBy=0;
    this.UpdatedDate=null;
    this.isDeleted=false;
    this.DocumentInnerPath=null;
    }
}