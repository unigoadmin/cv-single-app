export interface FileUploadResponse {
    DisplayFileName: string;
    ActualFileName: string;
    UploadedFileName:string;
    ViewResumeInnerPath:string;
    TempKey:string;
    
}

export interface ApplicantFileUploadResponse{
    ActualFileName:string;
    AttachedFilePath:string;
    AttachedFileName:string;
}

export interface CandidateFileUploadResponse{
    DisplayFileName: string;
    ActualFileName: string;
    UploadedFileName:string;
    ViewResumeInnerPath:string;
    ResumePathKey:string;
    ResumePathType:string;
    ResumePathBucket:string;
    
}

