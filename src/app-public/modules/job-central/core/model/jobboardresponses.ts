import { ApplicantReferences } from "./applicantrefences";

export class JobboardResponses {
    ResponseId: number;
    JobId = null;
    JobTitle = null;
    AttachedFileName = null;
    CreatedDate: Date;
    ActualDate: Date;
    CompanyId: number;
    AttachedFilePath = null;
    ActualFileName = null;
    ApplicantSource = null;
    FirstName = null;
    LastName = null;
    Email = null;
    ApplicantLocation = null;
    IsCandidateViewed: boolean;
    CandidateMasterId: number;
    WorkPermit = null;
    RecruiterId = null;
    Recruiter = null;
    RecruiterShortName = null;
    AssignTo = null;
    Assignee = null;
    AssigneeShortName = null;
    Phno = null;
    ApplicantStatus: number
    ApplicantStatusName: string;
    HashTags:string;
    City:string;
    State:string;
    TempKey:string;
    ViewResumeInnerPath:string;
    UploadedFileName:string;
    TempFileSource:string;
    ApplicantRefereces:ApplicantReferences[];
    PayRate:string;
    EmploymentType:string;
    LinkedIn:string;
    AvailabilityToJoin:string;
    DOB:string;
    SSN:string;
    AssignedBy:string;
    Notes:string;
    CreatedBy:string;
    UpdatedBy:string;
    AssignedDate:Date;
    AssignId:string;
    NotesCount:number;
    RecruiterList:Assigness[];
    AssigneeList:Assigness[];
    CommunicationSkillRating:string;
    TechnicalSkillRating:string;
    EmailHashtags:string;
    ArchiveId:number;
    ApplicantFrom:string;
    IsSelected:boolean;
    DuplicateApplicant:boolean;
    Skillset:string;
    bgClass:string;
    PublishedJobId:string;
    ViewedList:any[];
    constructor() {
        this.ResponseId = 0;
        this.JobId = null;
        this.JobTitle = null;
        this.AttachedFileName = null;
        this.CreatedDate = null;
        this.ActualDate = null;
        this.CompanyId = 0;
        this.AttachedFilePath = null;
        this.ActualFileName = null;
        this.ApplicantSource = null;
        this.FirstName = null;
        this.LastName = null;
        this.Email = null;
        this.ApplicantLocation = null;
        this.IsCandidateViewed = false;
        this.CandidateMasterId = 0
        this.WorkPermit = null;
        this.RecruiterId = null;
        this.Recruiter = null;
        this.RecruiterShortName = null;
        this.AssignTo = null;
        this.Assignee = null;
        this.AssigneeShortName = null;
        this.Phno = null;
        this.ApplicantStatus = 0
        this.ApplicantStatusName = null;
        this.HashTags=null;
        this.ApplicantRefereces=null;
        this.State=null;
        this.City=null;
        this.TempKey=null;
        this.ViewResumeInnerPath=null;
        this.UploadedFileName=null;
        this.TempFileSource=null;
        this.PayRate=null;
        this.EmploymentType=null;
        this.LinkedIn=null;
        this.AvailabilityToJoin=null;
        this.DOB=null;
        this.SSN=null;
        this.AssignedBy=null;
        this.Notes=null;
        this.CreatedBy=null;
        this.UpdatedBy=null;
        this.AssignedDate=null;
        this.AssignId=null;
        this.NotesCount=0;
        this.RecruiterList=[];
        this.AssigneeList=[];
        this.CommunicationSkillRating=null;
        this.TechnicalSkillRating=null;
        this.EmailHashtags=null;
        this.ArchiveId=0;
        this.ApplicantFrom=null;
        this.IsSelected=false;
        this.DuplicateApplicant=false;
        this.Skillset=null;
        this.bgClass=null;
        this.PublishedJobId=null;
        this.ViewedList=null;
    }
}

export class Assigness{
    FullName:string;
    ShortName:string;
    UserId:string;
    constructor(){
        this.FullName=null;
        this.ShortName=null;
        this.UserId=null;
    }
}

