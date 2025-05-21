import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icStar from '@iconify/icons-ic/twotone-star';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icEmail from '@iconify/icons-ic/twotone-mail';
import icPerson from '@iconify/icons-ic/twotone-person';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import icDetails from '@iconify/icons-ic/twotone-details';
import { FormBuilder } from '@angular/forms';
import icEnhanced_Encryption  from '@iconify/icons-ic/enhanced-encryption'
import icAdd_Moderator  from '@iconify/icons-ic/twotone-add-moderator'
import { AlertService, AuthenticationService, CountryCodeService } from 'src/@shared/services';
import { CountriesList, Country, LoginUser } from 'src/@shared/models';
import icInfo from '@iconify/icons-ic/twotone-info';
import { DocvaultFileUpload, DocvaultUserDocuments } from '../../core/models';
import { DocumentService } from '../../core/http/document.service';
import icfileupload from '@iconify/icons-ic/file-upload';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';



@Component({
  selector: 'cv-documents-add',
  templateUrl: './documents-add.component.html',
  styleUrls: ['./documents-add.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms,
    scaleFadeIn400ms
  ],
})
export class DocumentsAddComponent implements OnInit {

  

  icStar = icStar;
  icStarBorder = icStarBorder;
  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icBusiness = icBusiness;
  icPerson = icPerson;
  icEmail = icEmail;
  icPhone = icPhone;
  icInfo = icInfo;
  icEnhanced_Encryption = icEnhanced_Encryption;
  icAdd_Moderator = icAdd_Moderator;
  icDetails = icDetails;
  icfileupload = icfileupload;
 
  loginUser: LoginUser;
  docvaultFileUpload:DocvaultFileUpload[];
  saveUserdocuments: DocvaultUserDocuments[] = [];
  isCategoryRequired:boolean=true;

  constructor(
              private dialogRef: MatDialogRef<DocumentsAddComponent>,
              private fb: FormBuilder,
              private _authService: AuthenticationService,
              private _documentService: DocumentService,
              private _alertService: AlertService) {
            
               }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    this.docvaultFileUpload = [];
  }

  onUploadFile(event:any){
    let files = event.target.files;
    let uploadedFiles = Array.from(event.target.files);
    //uploadedFiles.pro
    let existedNames = []
    if(this.docvaultFileUpload.length > 0){
   for(let i = 0;i < files.length;i++){
    let existedName = this.docvaultFileUpload.find(item => item.FileName.toLowerCase() === files[i].name.toLowerCase());
    if(existedName){
      existedNames.push(existedName.FileName);
      uploadedFiles.splice(i,1);
      files = uploadedFiles;
    }
   }

      if(existedNames.length > 0 && files && files.length === 0){
        this._alertService.error(existedNames.join(',')+'file(s) have already uploaded')
      }
        
    }
    if(files && files.length > 0){
      this._documentService.DocvaultFileUpload(files,this.loginUser.Company.Id).subscribe(response => {
        if (this.docvaultFileUpload.length > 0) {
          this.docvaultFileUpload= this.docvaultFileUpload.concat(response);
          }
        else {
        this.docvaultFileUpload=response;
        }
        if(existedNames.length > 0)
          this._alertService.success(existedNames.join(',')+' file(s) uploaded already, remaining documents Added Successfully');
        else
          this._alertService.success('Document added successfully');
       
      },error=> {
      
        this._alertService.error(error);
      });
    }

    }

  onDeleteUploadDocs(file:DocvaultFileUpload){
    let index = this.docvaultFileUpload.indexOf(file);
    if(index > -1){
      this.docvaultFileUpload.splice(index,1);
    }
  }
  saveDocuments(){debugger;
    if(this.docvaultFileUpload && this.docvaultFileUpload.length === 0){
      this._alertService.error('Please, upload atleast one file to save');
      return;
    }

    var catsRequired = this.docvaultFileUpload.filter(x => x.Category == null);
    if(catsRequired!=null && catsRequired.length > 0){
      this.isCategoryRequired=true;
    }
    else
    this.isCategoryRequired=false;

    // this.docvaultFileUpload.forEach(file =>{
    //   if(file.Category==null)debugger;
    //   this.isCategoryRequired=true;
    //   this._alertService.error('Please select file category to save');
    //   return ;
    // })
    
    if(!this.isCategoryRequired){
    this.docvaultFileUpload.forEach(file => {
      let myDocument:DocvaultUserDocuments = new DocvaultUserDocuments();
      myDocument.CompanyId = this.loginUser.Company.Id
      myDocument.UserType = this.loginUser.Role==="employer" ? 3: 2
      myDocument.DocumentId = 0
      myDocument.CreatedBy = this.loginUser.UserId
      myDocument.File_path_key = file.FilePathKey
      myDocument.File_path_type = file.FileExtention
      myDocument.Filelocation = file.FileLocation
      myDocument.OrgFileName = file.FileName
      myDocument.Category = file.Category
      this.saveUserdocuments.push(myDocument);
    })
    this._documentService.saveDocuments(this.saveUserdocuments,this.loginUser.UserId)
        .subscribe(response => {
          if(response && response.length === 0)
          this._alertService.success('Documents are saved successfully');
          else if(response && response.length > 0){
            let message = response.join(',');
            this._alertService.error(message+'Documents are already uploaded by this user');
          }
         
          this.dialogRef.close();
         
        },error =>{
          this._alertService.error(error);
        
        })
      }
      else{
        this._alertService.error('Please fill the category to upload documents');
      }
      
  }
}
