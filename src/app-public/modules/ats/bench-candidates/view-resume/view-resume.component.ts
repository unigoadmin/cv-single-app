import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService } from 'src/@shared/services';
import { BenchCandidate } from '../../core/models/benchcandidate';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'cv-view-resume',
  templateUrl: './view-resume.component.html',
  styleUrls: ['./view-resume.component.scss']
})
export class ViewResumeComponent implements OnInit {

  public SelectedCandidate: BenchCandidate;
  loginUser: LoginUser;
  icClose=icClose;

  constructor(@Inject(MAT_DIALOG_DATA) public def_candidate: any,
  private dialogRef: MatDialogRef<ViewResumeComponent>,
  private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.SelectedCandidate = this.def_candidate;
    }
  }

  contentLoaded() {
    document.getElementById("vr_progressBar").style.display = "none";
  }

}
