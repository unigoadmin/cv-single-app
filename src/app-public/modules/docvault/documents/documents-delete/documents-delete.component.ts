import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icStar from '@iconify/icons-ic/twotone-star';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { AlertService, AuthenticationService, CountryCodeService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { DocvaultFileUpload, DocvaultUserDocuments } from '../../core/models';
import { DocumentService } from '../../core/http/document.service';
import icfileupload from '@iconify/icons-ic/file-upload';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'cv-documents-delete',
  templateUrl: './documents-delete.component.html',
  styleUrls: ['./documents-delete.component.scss']
})
export class DocumentsDeleteComponent implements OnInit {

  icClose = icClose;
  
  loginUser: LoginUser;
  document:DocvaultUserDocuments;
  Filelocation:any;

  constructor(@Inject(MAT_DIALOG_DATA)private   data: DocvaultUserDocuments,
              private dialogRef: MatDialogRef<DocumentsDeleteComponent>,
              private _authService: AuthenticationService,
              private _alertService: AlertService,
              private _sanitizer: DomSanitizer,
              private _documentService: DocumentService) {
                this.document = Object.assign({}, data);
               }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
  }
  deleteDocument(){
    this.document.IsDeleted = true;
    this._documentService.updateDocument(this.document)
        .subscribe(response => {
          this._alertService.success('Document is deleted successfully');
          this.dialogRef.close();
        },error =>{
          this._alertService.error(error);
        });
  }
}
