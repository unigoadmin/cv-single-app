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
import icfileupload from '@iconify/icons-ic/file-upload';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'cv-documents-view',
  templateUrl: './documents-view.component.html',
  styleUrls: ['./documents-view.component.scss']
})
export class DocumentsViewComponent implements OnInit {

  icClose = icClose;
  
  loginUser: LoginUser;
  document:DocvaultUserDocuments;
  Filelocation:any;

  constructor(@Inject(MAT_DIALOG_DATA)private   data: DocvaultUserDocuments,
              private _authService: AuthenticationService,
              private _alertService: AlertService,
              private _sanitizer: DomSanitizer) {
                this.document = data;
               }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if(this.loginUser){
      if(this.document.Filelocation){
        this.Filelocation = this._sanitizer.bypassSecurityTrustResourceUrl(this.document.Filelocation);
        }
    }
  }
}
