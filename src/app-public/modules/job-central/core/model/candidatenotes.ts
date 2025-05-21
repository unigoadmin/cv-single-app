export class CandidateNotes {
    CandidateNotesId: number;
    CandidateId: number;
    Comment: string;
    CreatedBy: string;
    CreatedDate: Date
    CreatedByName: string;
    ProfilePic: string;
    CompanyId: number;
    constructor() {
        this.CandidateNotesId = 0;
        this.CandidateId = 0;
        this.Comment = null;
        this.CreatedBy = null;
        this.CreatedDate = new Date()
        this.CreatedByName = null;
        this.ProfilePic = null;
        this.CompanyId = 0;
    }
}