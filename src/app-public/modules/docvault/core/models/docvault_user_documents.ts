export class DocvaultUserDocuments {

    DocumentId: number;
    Filelocation: string;
    File_path_key: string;
    File_path_type: string;
    OrgFileName: string
    CreatedBy: string;
    CreatedDate: Date;
    UserType: number;
    IsDeleted: boolean;
    UpdatedDate: Date;
    CompanyId:number;
    CreatedByName:string;
    FileNameOnly:string;
    IsEdit:boolean;
    IsSharedDocument:boolean;
    Category:string;
    constructor() {

        this.DocumentId = 0
        this.Filelocation = null
        this.File_path_key = null
        this.File_path_type = null
        this.OrgFileName = null
        this.CreatedBy = null
        this.CreatedDate = new Date()
        this.UserType = 0
        this.IsDeleted = false;
        this.UpdatedDate = null
        this.CreatedByName = null
        this.FileNameOnly = null
        this.IsEdit = false
        this.IsSharedDocument = false;
        this.Category=null
    }
}