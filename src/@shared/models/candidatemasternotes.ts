export class CandidateMasterNotes{
    CandidateNotesId: number;
    CandidateId: number;
    ApplicantId: number;
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
    UpdatedBy:string;
    constructor(){
        this.CandidateNotesId=0;
        this.CandidateId=0;
        this.ApplicantId=0;
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
        this.UpdatedBy=null;
    }
}