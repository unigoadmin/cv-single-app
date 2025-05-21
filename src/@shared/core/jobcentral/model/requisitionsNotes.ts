export class RequisitionNotes{
    RequisitionNotesId: number;
    RequisitionId: number;
    Comment: string;
    CreatedBy: string;
    CreatedDate: Date;
    CreatedByName: string;
    ProfilePic: string;
    CompanyId: number;
    IsFile:boolean;
    FileName:string;
    FilePathKey:string;
    FileWebPath:string;
    constructor(){
        this.RequisitionNotesId=0;
        this.RequisitionId=0;
        this.Comment=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.CreatedByName=null;
        this.ProfilePic=null;
        this.CompanyId=0;
        this.IsFile=false;
        this.FileName=null;
        this.FilePathKey=null;
        this.FileWebPath=null;
    }
}