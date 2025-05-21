export class DocvaultUserDocumentsSharingSnapshot
{
    SnapshotId: number;
    DocumentId: number;
    ShareType: string;
    MembersCount: number;
    SharedBy: string;
    SharedUserType: number;
    SharedDate: Date;
    Show:boolean;
    constructor(){
        this.SnapshotId = 0
        this.DocumentId = 0
        this.ShareType = null
        this.MembersCount = 0
        this.SharedBy = null
        this.SharedUserType = 0
        this.SharedDate = null
        this.Show = false
    }
}