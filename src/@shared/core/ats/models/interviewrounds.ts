export class InterviewRounds{
    InterviewRoundId :string;
    InterviewRoundName :string;
    IsActive? :boolean;
    CreatedBy :string;
    CreatedDate? :Date;
    UpdatedBy :string;
    UpdatedDate? :Date;
    CompanyId :number;
    DBStatus:string;
    Statuslabels:[];
    ColorCode:string;
    bgclass:string;
    Name:string;
    constructor(){
        this.InterviewRoundId=null;
        this.InterviewRoundName=null;
        this.IsActive=false;
        this.CreatedBy=null;
        this.CreatedDate=null;
        this.UpdatedBy=null;
        this.UpdatedDate=null;
        this.CompanyId=0;
        this.DBStatus=null;
        this.Statuslabels=null;
        this.ColorCode=null;
        this.bgclass=null;
        this.Name=null;
    }
}