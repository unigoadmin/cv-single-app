import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { FormBuilder, FormControl } from '@angular/forms';
import icInsertComment from '@iconify/icons-ic/twotone-insert-comment';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icClose from '@iconify/icons-ic/twotone-close';
import { VendorAccountService } from '../../core/http/vendoraccounts.service';
import { AccountMasterNotes } from '../../core/models/accountnotes';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EmitterService } from 'src/@cv/services/emitter.service';

@UntilDestroy()
@Component({
  selector: 'cv-account-notes',
  templateUrl: './account-notes.component.html',
  styleUrls: ['./account-notes.component.scss']
})
export class AccountNotesComponent implements OnInit {

  @Input() AccountID: number = 0;
  icInsertComment = icInsertComment;
  icEdit = icEdit;
  icClose = icClose;
  commentCtrl = new FormControl();
  loginUser: LoginUser;
  NotesList: AccountMasterNotes[];
  currentSchedueNotes: AccountMasterNotes;
  form: any;
  IsLoading:boolean=false;
  constructor(private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _vendorAccountService: VendorAccountService,
    private fb: FormBuilder) {
    this.NotesList = [];
    this.currentSchedueNotes = new AccountMasterNotes();
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetAccountNotes(this.AccountID, this.loginUser.Company.Id);
    }
  }

  GetAccountNotes(accountId: number, companyId: number) {
    this._vendorAccountService.GetAccountMasterNotes(companyId,accountId)
      .subscribe(response => {
        if (response.IsError == false) {
          this.NotesList = response.Data;
          this.NotesList.forEach(element => {
            element.CreatedDate = TimeZoneService.getLocalDateTimeShort(element.CreatedDate, true);
          });
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);
        });
  }

  addComment() {
    this.IsLoading=true;
    if (!this.commentCtrl.value) {
      this.IsLoading=false;
      return;
    }

    this.currentSchedueNotes.AccountId = this.AccountID;
    this.currentSchedueNotes.Comment = this.commentCtrl.value;
    this.currentSchedueNotes.CreatedBy = this.loginUser.UserId;
    this.currentSchedueNotes.CompanyId = this.loginUser.Company.Id;
    this._vendorAccountService.SaveAccountMasterNotes(this.currentSchedueNotes)
      .subscribe(response => {
        this.GetAccountNotes(this.AccountID,this.loginUser.Company.Id);
        this._alertService.success("Notes has been added Successfully");
        this.currentSchedueNotes = new AccountMasterNotes();
        this.commentCtrl.setValue(null);
        EmitterService.get("AccountNotescnt").emit(this.AccountID);
        this.IsLoading=false;
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      },
        error => {
          this.IsLoading=false;
          this._alertService.error(error);
        });
  }

}
