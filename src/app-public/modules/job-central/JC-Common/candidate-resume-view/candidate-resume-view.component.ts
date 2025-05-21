import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'cv-candidate-resume-view',
  templateUrl: './candidate-resume-view.component.html',
  styleUrls: ['./candidate-resume-view.component.scss']
})
export class CandidateResumeViewComponent implements OnInit {

  public SelectedCandidate: any;
  loginUser: LoginUser;
  icClose=icClose;

  constructor(@Inject(MAT_DIALOG_DATA) public def_candidate: any,
  private dialogRef: MatDialogRef<CandidateResumeViewComponent>,
  private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.SelectedCandidate = this.def_candidate;
    }
  }

  contentLoaded() {
    document.getElementById("progressBar").style.display = "none";
}

viewClose(){
  this.dialogRef.close(0);
}

}
