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
import { Company, CompanyModules, ConsultviteUser, ResetPassword } from '../../core/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { UserService } from '../../core/http/user.service';
import icInfo from '@iconify/icons-ic/twotone-info';


@Component({
  selector: 'cv-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form = this.fb.group({
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
  usermodules: CompanyModules[];
  moduleRoles: CompanyModules[];
  resetPassword:ResetPassword = <ResetPassword>{};


  constructor(@Inject(MAT_DIALOG_DATA) private data: ConsultviteUser,
              private dialogRef: MatDialogRef<ResetPasswordComponent>,
              private fb: FormBuilder,
              private _authService: AuthenticationService,
              private _userService: UserService,
              private _alertService: AlertService,) {
               
               }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.data) {
      this.form.patchValue(this.resetPassword);

      if(this.data.UserType == 0){
        this.resetPassword.UserType = "consultant";
        this.title =  "Reset Password";
      }
      else{
        this.resetPassword.UserType = "internal";
         this.title =  "Reset Password";
      }
    }
    
  }

  savePassword() {
    const form = this.form.value;

    if (!this.resetPassword) {
      this.resetPassword = {
        ...form,
      };
    }

    this.resetPassword.NewPassword = form.NewPassword;
    this.resetPassword.ConfirmPassword = form.ConfirmPassword;
   
    this.resetPassword.UserId = this.data.UserId;

    this.resetUserPassword(this.resetPassword );
    
  }

  resetUserPassword(resetPassword: ResetPassword): void {
    this._userService.resetUserPassword(resetPassword)
        .subscribe(
        response => {
            this.dialogRef.close();
            this._alertService.success("Password updated successfully");
        },
        error => {
            this._alertService.error(error);
        }
        );
      }

}
