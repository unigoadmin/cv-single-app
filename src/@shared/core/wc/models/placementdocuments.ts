export class PlacementDocuments{
    PlacementDocumentID :number;
    PlacementID :number;
    DocumentType :number;
    s3location :string;
    Download_Path_Key :string;
    Download_Path_Type :string;
    DownloadableFileName :string;
    isDeleted :boolean;
    CompanyID :number;
    CreatedBy :string;
    CreatedDate :Date;
    Updatedby :string;
    UpdatedDate :Date;
    DocumentInnerPath:string;
    constructor(){
    this.PlacementDocumentID =0;
    this.PlacementID =0;
    this.DocumentType =0;
    this.s3location =null;
    this.Download_Path_Key =null;
    this.Download_Path_Type =null;
    this.DownloadableFileName =null;
    this.isDeleted =false;
    this.CompanyID =0;
    this.CreatedBy =null;
    this.CreatedDate =new Date();
    this.Updatedby =null;
    this.UpdatedDate =new Date();
    this.DocumentInnerPath=null;
    }
}