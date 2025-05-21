import { ActivityLogSubmission } from "./submissionactivitylog";

export class SubmissionsVM{
    SubmissionID :number;
    SubmissionType :number;
    SubmissionTypeName :string;
    JobID :number;
    CandidateID :number;
    CompJobID :number;
    CompanyJobID :string;
    JobTitle :string;
    City :string;
    State :string;
    Submittedby :string;
    SubmittedByName :string;
    SubmittedDate :Date;
    status :number;
    StatusName :string;
    SubmittedRate :number;
    BillingType :string;
    SchedulesCount :number;
    EndClient :string;
    InterviewStatus :string;
    UpdatedName:string;
    UpdatedDate:Date;
    IsUpdated:number;
    ActivityLogs:ActivityLogSubmission[];
    Location:string;
    constructor(){
       this.SubmissionID =0;
       this.SubmissionType =0;
       this.SubmissionTypeName =null;
       this.JobID =0;
       this.CandidateID =0;
       this.CompJobID =0;
       this.CompanyJobID =null;
       this.JobTitle =null;
       this.City =null;
       this.State =null;
       this.Submittedby =null;
       this.SubmittedByName =null;
       this.SubmittedDate =new Date();
       this.status =0;
       this.StatusName =null;
       this.SubmittedRate =0;
       this.BillingType =null;
       this.SchedulesCount =0;
       this.EndClient =null;
       this.InterviewStatus =null;
       this.ActivityLogs=[];
       this.UpdatedName=null;
       this.UpdatedDate=new Date();
       this.IsUpdated=0;
       this.Location=null;
    }
}
