export class JobMapping{
     CandidateId :number;
     JobId :number;
     MappingStatus :boolean;
     CreatedBy :string;
     CreatedDate :Date;
     UpdatedBy :string;
     UpdatedDate :Date;
     CompanyId :number;
     Assigness :string[];
     constructor(){
        this.CandidateId =0;
        this.JobId =0;
        this.MappingStatus =false;
        this.CreatedBy=null;
        this.CreatedDate =new Date();
        this.UpdatedBy =null;
        this.UpdatedDate =null;
        this.CompanyId =0;
        this.Assigness =[];
     }
}