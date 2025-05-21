export class JobNotes {
    JobNotesId: number;
    JobId: number;
    Comment: string;
    CreatedBy: string;
    CreatedDate: Date;
    CompanyId: number;
    ProfilePic:string;
    CreatedByName:string;
    constructor() {
        this.JobNotesId=0;
        this.JobId=0;
        this.Comment=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.CompanyId=0;
        this.ProfilePic=null;
        this.CreatedByName=null;
        
    }
}