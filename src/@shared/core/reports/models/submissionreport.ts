export class SubmissionReport {
    SubmissionID: number;
    CompSubmissionID: number;
    CompanySubmissionID: string;
    JobId: number;
    SubmittedBy: string;
    POCName: string;
    SubmittedDate: Date;
    CandidateId: number;
    EndClient: string;
    Vendor: string;
    Consultant: string;
    SubmissionType: number;
    SubmissionTypeName: string;
    SubmissionStatus: number;
    SubmissionStatusName: string;
    constructor() {
        this.SubmissionID=0;
        this.CompSubmissionID=0;
        this.CompanySubmissionID=null;
        this.JobId=0;
        this.SubmittedBy=null;
        this.POCName=null;
        this.SubmittedDate=new Date();
        this.CandidateId=0;
        this.EndClient=null;
        this.Vendor=null;
        this.Consultant=null;
        this.SubmissionType=0;
        this.SubmissionTypeName=null;
        this.SubmissionStatus=0;
        this.SubmissionStatusName=null;
    }
}