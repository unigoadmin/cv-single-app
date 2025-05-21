import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginUser } from 'src/@shared/models';
import icClose from '@iconify/icons-ic/twotone-close';
import { AlertService, AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { AccountList } from '../../core/models/accountlist';
import { VendorAccountService } from '../../core/http/vendoraccounts.service';
import { AccountTypeList } from '../../core/models/accounttypelist';
import { SubUsers } from 'src/@shared/models/common/subusers'; 
import { assign } from 'src/@shared/models/assign';
import { merge } from 'rxjs';
import { distinct } from 'rxjs/operators';

@Component({
  selector: 'cv-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
 
  @Input() AccountID:number;
  @Input() mode:string;
  ManageAccountForm: FormGroup;
  loginUser: LoginUser;
  icClose=icClose;
  accountitem:AccountList;
  AccTypeList:AccountTypeList[]=[];
  actionTitle:string;
  headerTitle:string;
  accountdetail:AccountList;
  public assignees: assign[] = [];
  public benchSubUsers: SubUsers[];
  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private accountService: VendorAccountService,
    private _eventemtterservice:EventEmitterService,
  ) {
    this.ManageAccountForm = this.fb.group({
      accountName: ['', Validators.required],
      accountType: [],
      accountOwner:[],
    });
    this.accountitem=new AccountList();
    this.accountdetail=new AccountList();
   }

   ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetAccountTypes();
      this.getBenchSubUsers();
      this.GetAccountDetails(this.loginUser.Company.Id,this.AccountID);
     
    }

  }

  GetAccountDetails(CompanyId:number,accountId:number){
    this.accountService.GetAccountDetails(CompanyId,accountId).subscribe(res=>{
      if(!res.IsError){
        this.accountdetail=res.Data;
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    })
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

  

  getBenchSubUsers() {
    this.assignees = [];
    this.accountService.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail,mapping:false });
            });
            
        },
        error => {
          this._alertService.error(error);
        });
  }

  updateAccount(){
    this.accountdetail.UpdatedBy = this.loginUser.UserId;
    this.accountService.SaveAccount(this.accountdetail)
    .subscribe(response => {
      if (response.IsError == false) {
        this._eventemtterservice.accountsResponsesEvent.emit();
        this._alertService.success(response.SuccessMessage);
      }
    },
      error => {
        this._alertService.error(error);
      }
    )
  }

  OnReset(){
    this.GetAccountDetails(this.loginUser.Company.Id,this.AccountID);
  }

}
