
export interface RolePermissions {
  Id: number;
  ModuleId: string;
  RoleId: string;
  CreateJob: number;
  EditJob: number;
  ViewJobs: number;
  AddCandidate: number;
  EditCandidate: number;
  ViewCandidates: number;
  CreateJobWorkflow: number;
  EditJobWorflow: number;
  ResumeJobMapping: number;
  MoveStageworkflow: number;
  DisplayinInterviewersList: number;
  ScheduledInterview: number;
  CancelInterview: number;
  FeedBack: number;
  Comments: number;
  jobshare: number;
  AddBenchCandidate: number;
}