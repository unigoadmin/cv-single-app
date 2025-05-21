export class ApplicantRecruiterMapping{
    MappingId:number;
    ApplicantId:number;
    RecruiterId:string;
    MappingStatus:boolean;
    IsProcessed:boolean;
    CreatedDate:Date;
    ExpiryDate:Date;
    IsReviewFurther:boolean;
    ApplicantName:string;
    constructor(){
        this.MappingId=0;
        this.ApplicantId=0;
        this.RecruiterId=null;
        this.MappingStatus=false;
        this.IsProcessed=false;
        this.CreatedDate=null;
        this.ExpiryDate=null;
        this.IsReviewFurther=false;
        this.ApplicantName=null;
    }
}

export class RecruiterMappings{
    ID:number;
    ApplicantId:Number;
    RecruiterId:string;
    MappingStatus:boolean;
    ApplicantName:string;
    RecruiterName:string;
    RecruiterEmail:string;
    constructor(){
        this.ID=0;
        this.ApplicantId=0;
        this.RecruiterId=null;
        this.MappingStatus=false;
        this.ApplicantName=null;
        this.RecruiterName=null;
        this.RecruiterEmail=null;
    }
}

export class RecruiterObject{
    RecruiterId:string;
    RecruiterName:string;
    RecruiterEmail:string;
    MappingStatus:boolean;
    constructor(){
        this.RecruiterId=null;
        this.RecruiterName=null;
        this.RecruiterEmail=null;
        this.MappingStatus=false;
    }
}

export class ApplicantsMapping{
   ApplicantId:number;
   ApplicantName:string;
   Recruiters:RecruiterObject[];
}