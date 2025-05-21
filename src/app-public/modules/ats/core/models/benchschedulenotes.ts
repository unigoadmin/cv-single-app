export class BenchScheduleNotes{
    Id: number;
    BenchSubmissionId: number;
    BenchScheduleId: number;
    Comment: string;
    CreatedBy: string;
    CreatedDate: Date;
    CreatorName: string;
    CreatorProfilepic: string;
    CommentsCount: number;
    constructor(){
        this.Id=0;
        this.BenchScheduleId=0;
        this.BenchSubmissionId=0;
        this.Comment=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.CreatorName=null;
        this.CreatorProfilepic=null;
        this.CommentsCount=0;
    }
}

