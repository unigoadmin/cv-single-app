// export class CandidateRecruiterMapping{
//     MappingId:number;
//     ApplicantId:number;
//     RecruiterId:string;
//     MappingStatus:boolean;
//     IsProcessed:boolean;
//     CreatedDate:Date;
//     ExpiryDate:Date;
//     IsReviewFurther:boolean;
//     ApplicantName:string;
//     constructor(){
//         this.MappingId=0;
//         this.ApplicantId=0;
//         this.RecruiterId=null;
//         this.MappingStatus=false;
//         this.IsProcessed=false;
//         this.CreatedDate=null;
//         this.ExpiryDate=null;
//         this.IsReviewFurther=false;
//         this.ApplicantName=null;
//     }
// }

export class CandidateRecruiterMappings{
    ID:number;
    CandidateId:Number;
    RecruiterId:string;
    MappingStatus:boolean;
    ApplicantName:string;
    RecruiterName:string;
    RecruiterEmail:string;
    constructor(){
        this.ID=0;
        this.CandidateId=0;
        this.RecruiterId=null;
        this.MappingStatus=false;
        this.ApplicantName=null;
        this.RecruiterName=null;
        this.RecruiterEmail=null;
    }
}