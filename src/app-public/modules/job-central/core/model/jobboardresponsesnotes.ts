export class JobBoardResponsesNotes{
    ResponseNotesId: number;
    ResponseId: number;
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
    IsDelete:boolean;
    UpdatedBy:string;
    UpdatedDate:Date;
    NotesAction:string;
    constructor(){
        this.ResponseNotesId=0;
        this.ResponseId=0;
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
        this.IsDelete=false;
        this.UpdatedBy=null;
        this.UpdatedDate =new Date();
        this.NotesAction=null;
    }
}