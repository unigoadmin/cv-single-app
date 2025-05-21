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
import { FormBuilder } from '@angular/forms';
import { Company, CompanyModules, ConsultviteUser, ResetPassword } from 'src/@shared/core/admin/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { ChangePassword, LoginUser } from 'src/@shared/models';
import icInfo from '@iconify/icons-ic/twotone-info';
import { AccountService } from 'src/@shared/http';


@Component({
  selector: 'cv-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form = this.fb.group({
    OldPassword : null, 
    NewPassword: null,
    ConfirmPassword: null,
  });


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

  title:string;
  loginUser: LoginUser;
  changePassword:ChangePassword = <ChangePassword>{};


  constructor(@Inject(MAT_DIALOG_DATA) private data: ConsultviteUser,
              private dialogRef: MatDialogRef<ChangePasswordComponent>,
              private fb: FormBuilder,
              private _authService: AuthenticationService,
              private _accountService: AccountService,
              private _alertService: AlertService,) {
               
               }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.form.patchValue(this.changePassword);
      this.title =  "Change Password";
     
    }
  }

  savePassword() {
    const form = this.form.value;

    if (!this.changePassword) {
      this.changePassword = {
        ...form,
      };
    }

    this.changePassword.OldPassword = form.OldPassword;
    this.changePassword.NewPassword = form.NewPassword;
    this.changePassword.ConfirmPassword = form.ConfirmPassword;
    this.changePassword.UserId = this.loginUser.UserId;

    if(this.loginUser.Role == "employer" || this.loginUser.Role == "admin"){
      this.changeInternalUserPassword();
    }else if(this.loginUser.Role == "candidate" ){
    this.changeConsultantUserPassword();
    }
  }
  
  changeInternalUserPassword() {
    if(this.changePassword.ConfirmPassword != this.changePassword.NewPassword){
        this._alertService.error("New password and confirm password should be same");
        return;
    }
    else if(this.changePassword.NewPassword.length<6){
        this._alertService.error("New Password should be of atleast six characters");
        return;
    }
    this._accountService.changeInternalUserPassword(this.changePassword)
        .subscribe(
        response => {
            this.dialogRef.close(true);
            this._alertService.success("Password updated successfully");
            
        },
        error => {                   
            this._alertService.error(error);
        }
        );
  }

  changeConsultantUserPassword() {
    if(this.changePassword.ConfirmPassword != this.changePassword.NewPassword){
      this._alertService.error("New password and confirm password should be same");
      return;
    }
    else if(this.changePassword.NewPassword.length<6){
        this._alertService.error("New Password should be of atleast six characters");
        return;
    }
    this._accountService.changeConsultantUserPassword(this.changePassword)
        .subscribe(
        response => {
            this.dialogRef.close(true);
            this._alertService.success("Password updated successfully");
        },
        error => {
            this._alertService.error(error);
        }
        );
 }

}
