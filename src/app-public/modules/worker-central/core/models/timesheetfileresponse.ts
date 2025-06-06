export class TimesheetFileResponse{
         TimesheetDocumentID :number;
         TimesheetID :number;
         DocumentType :number;
         s3location :string;
         Download_Path_Key :string;
         Download_Path_Type :string;
         DownloadableFileName :string;
         isDeleted :boolean;
         CompanyID :number;
         CreatedBy :string;
         CreatedDate :Date;
         constructor(){
            this.TimesheetDocumentID =0;
            this.TimesheetID =0;
            this.DocumentType =0;
            this.s3location =null;
            this.Download_Path_Key =null;
            this.Download_Path_Type =null;
            this.DownloadableFileName =null;
            this.isDeleted =false;
            this.CompanyID =0;
            this.CreatedBy =null;
            this.CreatedDate = new Date();
         }
}