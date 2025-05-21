import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'cv-applicant-attachment-view',
  templateUrl: './applicant-attachment-view.component.html',
  styleUrls: ['./applicant-attachment-view.component.scss']
})
export class ApplicantAttachmentViewComponent implements OnInit {

  public attchmentPath: any;
  loginUser: LoginUser;
  icClose = icClose;

  constructor(@Inject(MAT_DIALOG_DATA) public def_attachment: any,
    private dialogRef: MatDialogRef<ApplicantAttachmentViewComponent>,
    private _authService: AuthenticationService) { }

  ngOnInit(): void {debugger;
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.attchmentPath = this.def_attachment;
    }
  }

  contentLoaded() {
    document.getElementById("progressBar").style.display = "none";
  }

  viewClose() {
    this.dialogRef.close(0);
  }

}



