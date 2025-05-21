import { Component, Inject, OnInit } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import icClose from '@iconify/icons-ic/twotone-close';
import icPerson from '@iconify/icons-ic/twotone-person';
import { FormBuilder } from '@angular/forms';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { CustomMessageService } from '../../core/http/custommessage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomMessageFields } from '../../core/models/custommessages';

@Component({
  selector: 'cv-update-custom-message',
  templateUrl: './update-custom-message.component.html',
  styleUrls: ['./update-custom-message.component.scss']
})
export class UpdateCustomMessageComponent implements OnInit {
  
  loginUser: LoginUser;
  icClose = icClose;
  icPerson = icPerson;
  currentMessage: CustomMessageFields = new CustomMessageFields();
  mode:string;
  form = this.fb.group({
    Description: null,
    ResourceValue: null
  });
  
  constructor(
    @Inject(MAT_DIALOG_DATA) private Data: any,
    private dialogRef: MatDialogRef<UpdateCustomMessageComponent>,
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private _service:CustomMessageService,
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.currentMessage = this.Data;
      console.log(this.currentMessage);
    }
  }

  SaveChanges() {
    this.currentMessage.CompanyId=this.loginUser.Company.Id;
    this.currentMessage.CreatedBy=this.loginUser.UserId;
    this.currentMessage.CreatedDate = new Date();
    this._service.UpdateCustomMessage(this.currentMessage).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      }
      else{
        this._alertService.success("Custom Message updated successfully");
        this.dialogRef.close(true);
      }
    }, error => {
      this._alertService.error(error);
    })
  }

}
