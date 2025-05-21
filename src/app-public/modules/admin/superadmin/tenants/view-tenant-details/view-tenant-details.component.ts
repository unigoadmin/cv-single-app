import { ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger60ms } from 'src/@cv/animations/stagger.animation';
import { IconService } from 'src/@shared/services/icon.service';
import { OnBoardingCompanies } from '../../../core/models/onboard-comapines';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { InternalUserProfile, LoginUser } from 'src/@shared/models';
import { SuperAdminService } from '../../../core/http/superadmin.service';
import { CompanyModules } from '../../../core/models';
import { IdentityService } from 'src/app-public/modules/initial/core/http/identity.service';
import { SignUp } from 'src/app-public/modules/initial/core/models';
import { forkJoin } from 'rxjs';
import { AccountService } from 'src/@shared/http';

@Component({
  selector: 'cv-view-tenant-details',
  templateUrl: './view-tenant-details.component.html',
  styleUrls: ['./view-tenant-details.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class ViewTenantDetailsComponent implements OnInit {

  loginUser: LoginUser;
  companyDetails: OnBoardingCompanies = new OnBoardingCompanies();
  companyModules: CompanyModules[];
  singup: SignUp = new SignUp();
  defaultLogo: string = "assets/img/demo/consultvite_logo.png";
  mode: string;
  currentUser: InternalUserProfile;
  phone: string[];
  profilePic: string = null;
  timeZoneName: string = null;
  OnbardingNotes: string;
  DeleteNotes: String;
  onboardingStatus: string;
  @ViewChild('OnboardModal') rsDialog = {} as TemplateRef<any>;
  @ViewChild('DeleteModal') dsDialog = {} as TemplateRef<any>;
  @ViewChild('ResendModal') resendActivationDialog = {} as TemplateRef<any>;
  constructor(@Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<ViewTenantDetailsComponent>,
    public iconService: IconService,
    private _accountService: AccountService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _service: SuperAdminService,
    private _identityService: IdentityService,
    private _adminService: SuperAdminService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.mode = this.Data.Mode;
      this.getCompanyDetails();
    }
  }

  getCompanyDetails() {
    this._service.getCompanyDetails(this.Data.CompanyID).subscribe(response => {
      this.companyDetails = response.Data;
      this.getCompanyModules();
      this.getInternalUserRolesByUserId(this.companyDetails.SuperAdminId)
    }, error => {
      this._alertService.error(error);
    })
  }

  getCompanyModules() {
    this._service.getCompanyModules(this.Data.CompanyID).subscribe(response => {
      this.companyModules = response.Data;
    }, error => {
      this._alertService.error(error);
    })
  }

  getInternalUserRolesByUserId(UserId: string) {
    forkJoin([
      this._accountService.getInternalUserProfile(UserId)])
      .subscribe(
        (responce) => {

          let internalUser = responce[0];
          if (internalUser.PrimaryPhoneNo && internalUser.PrimaryPhoneNo.split('-').length > 1) {
            this.phone = internalUser.PrimaryPhoneNo.split('-');
            if (this.phone.length > 1) {
              this.phone.shift()
              internalUser.PrimaryPhoneNo = this.phone.join('-');
            }
          }

          if (internalUser.SecondaryPhoneNo && internalUser.SecondaryPhoneNo.split('-').length > 1) {
            this.phone = internalUser.SecondaryPhoneNo.split('-');
            if (this.phone.length > 1) {
              this.phone.shift()
              internalUser.SecondaryPhoneNo = this.phone.join('-');
            }
          }

          this.currentUser = internalUser

          if (this.currentUser.ProfilePic)
            this.profilePic = this.currentUser.ProfilePic;

          //this.form.patchValue(this.currentUser);

        },
        error => {
          this._alertService.error(error);
        });
  }

  OnboardCompany() {
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        //this._alertService.success('Keyword saved successfully');
      }
    });
  }

  ActivateCompany() {

    this.dialogRef = this.dialog.open(this.resendActivationDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        //this._alertService.success('Keyword saved successfully');
      }
    });
  }

  DeleteCompany() {
    this.dialogRef = this.dialog.open(this.dsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        //this._alertService.success('Keyword saved successfully');
      }
    });
  }

  ClosePopup() {
    this.dialogRef.close(false);
  }

  UpdateOnbaordStatus() {
    const companyDetails = {
      CompanyId: this.companyDetails.CompanyID,
      onbaord_status: this.onboardingStatus,
      OnbardingNotes: this.OnbardingNotes,
      UpdatedBy: this.loginUser.UserId,
      Action:'Onboard'
    };
    this._adminService.updateCompanyStatus(companyDetails)
      .subscribe(
        response => {
          if (response.IsError === false) {
            this._alertService.success(response.SuccessMessage);
            this.dialogRef.close();
          } else {
            this._alertService.error(response.ErrorMessage);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  OnCompanyDelete() {
    const companyDetails = {
      CompanyId: this.companyDetails.CompanyID,
      IsDelete: true,
      DeleteNotes: this.DeleteNotes,
      UpdatedBy: this.loginUser.UserId,
      Action:'Delete'
    };

    this._adminService.updateCompanyStatus(companyDetails)
      .subscribe(
        response => {
          if (response.IsError === false) {
            this._alertService.success(response.SuccessMessage);
            this.dialogRef.close();
          } else {
            this._alertService.error(response.ErrorMessage);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  SendActivationLink() {
      this.singup.FirstName = this.currentUser.FirstName,
      this.singup.LastName = this.currentUser.LastName,
      this.singup.Email = this.currentUser.PrimaryEmail,
      this.singup.PhoneNumber = this.currentUser.PrimaryPhoneNo,
      this.singup.Role = 1

    this._identityService.SendCompanyActivationLink(this.singup)
      .subscribe(
        response => {
          this._alertService.success("Activation link sent successfully");
          this.dialogRef.close();
        },
        error => {
          this._alertService.success("Error in while resending Activation link");
        });
  }

}
