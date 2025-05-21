import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginUser } from 'src/@shared/models';
import icClose from '@iconify/icons-ic/twotone-close';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { AccountList } from '../../core/models/accountlist';
import { VendorAccountService } from '../../core/http/vendoraccounts.service';
import { AccountTypeList } from '../../core/models/accounttypelist';


@Component({
  selector: 'cv-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {
 
  ManageAccountForm: FormGroup;
  loginUser: LoginUser;
  icClose=icClose;
  accountitem:AccountList;
  mode:string;
  AccTypeList:AccountTypeList[]=[];
  actionTitle:string;
  headerTitle:string;
  constructor(@Inject(MAT_DIALOG_DATA) public def_account: AccountList,
    private dialogRef: MatDialogRef<ManageAccountComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private accountService: VendorAccountService,
  ) {
    this.ManageAccountForm = this.fb.group({
      accountName: ['', Validators.required],
      accountType: [],
    });
    this.accountitem=new AccountList();
   }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetAccountTypes();
      if(this.def_account.AccountID > 0){
        this.mode="Edit";
        this.headerTitle="Edit Account";
        this.actionTitle="UPDATE";
        this.accountitem=this.def_account;
      }
      else{
        this.mode="New";
        this.headerTitle="New Account";
        this.actionTitle="SAVE";
      }
    }

  }

  GetAccountTypes(){
    this.accountService.GetAccountTypes().subscribe(res=>{
      if(!res.IsError){
        this.AccTypeList=res.Data;
        this.AccTypeList = this.AccTypeList.filter(x=>x.AccountTypeName !== "ALL");
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    })
  }

  SaveAccount(){
    if(this.mode=="New"){
      this.accountitem.CompanyId=this.loginUser.Company.Id;
      this.accountitem.OwnerId = this.loginUser.UserId;
      this.accountitem.Createdby = this.loginUser.UserId;
    }
    else{
      this.accountitem.UpdatedBy = this.loginUser.UserId;
      this.accountitem.CreatedDate =new Date(); // to skip model error
    }
    this.accountService.SaveAccount(this.accountitem)
    .subscribe(response => {
      if (response.IsError == false) {
        this._alertService.success(response.SuccessMessage);
        this.dialogRef.close(true);
      }
    },
      error => {
        this._alertService.error(error);
      }
    )
  }


}
