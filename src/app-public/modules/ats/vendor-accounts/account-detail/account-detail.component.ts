import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icEdit from '@iconify/icons-ic/twotone-edit';

@Component({
  selector: 'cv-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  icMoreVert=icMoreVert;
  loginUser: any;
  icClose=icClose;
  icEdit=icEdit;
  mode:string;
  index: number = 0
 
  constructor( @Inject(MAT_DIALOG_DATA) public AccountId: any,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.mode='Edit';
    }
  }

  editClick() {
    this.mode="Edit";
    this.index=0;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

}
