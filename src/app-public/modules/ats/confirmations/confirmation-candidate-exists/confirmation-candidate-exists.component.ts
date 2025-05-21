import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { CandidateMaster } from '../../core/models/candidatemaster';

@Component({
  selector: 'cv-confirmation-candidate-exists',
  templateUrl: './confirmation-candidate-exists.component.html',
  styleUrls: ['./confirmation-candidate-exists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class ConfirmationCandidateExistsComponent implements OnInit {

  loginUser: LoginUser;
  isPageload:boolean=false;
  icClose=icClose;
  existingCandidate:CandidateMaster = new CandidateMaster();
  constructor(
    @Inject(MAT_DIALOG_DATA) public def_candidate: CandidateMaster,
    private dialogRef: MatDialogRef<ConfirmationCandidateExistsComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.existingCandidate = this.def_candidate;
    }
  }

}
