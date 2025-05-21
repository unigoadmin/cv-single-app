export class CandidateRecruiterMapping{
    Id:number;
    BenchCandidateId:number;
    AssignId:string;
    MappingStatus:boolean;
    CreatedDate:Date;
    UpdatedDate:Date;
    constructor(){
        this.Id=0;
        this.BenchCandidateId=0;
        this.AssignId=null;
        this.MappingStatus=false;
        this.CreatedDate=new Date();
        this.UpdatedDate=null;
    }
}