import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginUser } from 'src/@shared/models';
import { AccountList, MergedAccountItems } from '../../core/models/accountlist';
import { AccountTypeList } from '../../core/models/accounttypelist';
import icClose from '@iconify/icons-ic/twotone-close';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { VendorAccountService } from '../../core/http/vendoraccounts.service';
import { SubUsers } from  'src/@shared/models/common/subusers';
import { assign } from 'src/@shared/models/assign';
import { merge } from 'rxjs';
import { distinct } from 'rxjs/operators';

@Component({
  selector: 'cv-merge-accounts',
  templateUrl: './merge-accounts.component.html',
  styleUrls: ['./merge-accounts.component.scss']
})
export class MergeAccountsComponent implements OnInit {
  
  MergeAccountForm: FormGroup;
  loginUser: LoginUser;
  icClose=icClose;
  accountitem:AccountList;
  mode:string;
  accountTypeName:string;
  AccTypeList:AccountTypeList[]=[];
  MergedAccountName:string;
  accountOwner:string;
  selectedOwners:any[]=[];
  public assignees: assign[] = [];
  public benchSubUsers: SubUsers[];
  constructor(@Inject(MAT_DIALOG_DATA) public def_Mergedaccount: MergedAccountItems,
    private dialogRef: MatDialogRef<MergeAccountsComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private accountService: VendorAccountService,
  ) {
    this.MergeAccountForm = this.fb.group({
      accountName: ['', Validators.required],
      accountType: [],
      accountTypeName:[],
      accountOwner:[]
    });
    this.accountitem=new AccountList();
   }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getBenchSubUsers();
      this.accountTypeName = this.def_Mergedaccount.AccountTypeName;
      this.def_Mergedaccount.SelectedAccounts.forEach(x=>{
        this.selectedOwners.push(x.OwnerId);
      })
    }

  }


  MergeAccount(){
   this.def_Mergedaccount.MergedAccountName = this.MergedAccountName;
   this.def_Mergedaccount.Mergedby = this.loginUser.UserId;
   this.def_Mergedaccount.CompanyId = this.loginUser.Company.Id;
   this.def_Mergedaccount.OwnerId = this.accountOwner;
   this.accountService.MergeAccounts(this.def_Mergedaccount)
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

  getBenchSubUsers() {
    this.assignees = [];
    this.accountService.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          var salesTeam = response.filter(item => item.IsActive == true);
          var filteredItems = salesTeam.filter(x=>this.selectedOwners.map(y=>y).includes(x.UserId));
          merge(filteredItems)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail,mapping:false });
            });
        },
        error => {
          this._alertService.error(error);
        });
  }



}

