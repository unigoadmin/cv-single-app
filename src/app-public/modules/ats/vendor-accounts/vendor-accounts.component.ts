import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import { VendorAccountService } from '../core/http/vendoraccounts.service';
import { AccountList, MergedAccountItems } from '../core/models/accountlist';
import { iconsFA } from 'src/static-data/icons-fa';  
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AccountTypeList } from '../core/models/accounttypelist';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icComment from '@iconify/icons-ic/twotone-comment';
import { MergeAccountsComponent } from './merge-accounts/merge-accounts.component';
import { ConfirmDialogModel } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDialogNotesComponent } from 'src/@shared/components/filter-components/confirm-dialog-notes/confirm-dialog-notes.component';
import { AccountNotesDialogComponent } from './account-notes-dialog/account-notes-dialog.component';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { NgxPermissionsService } from 'ngx-permissions';

@UntilDestroy()
@Component({
  selector: 'cv-vendor-accounts',
  templateUrl: './vendor-accounts.component.html',
  styleUrls: ['./vendor-accounts.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [TimeZoneService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class VendorAccountsComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<AccountList[]> = new ReplaySubject<AccountList[]>(1);
  data$: Observable<AccountList[]> = this.subject$.asObservable();
  selection = new SelectionModel<AccountList>(true, []);
  dataSource = new MatTableDataSource<AccountList>();
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  icEdit = icEdit;
  DialogResponse: any;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  icSearch = icSearch;
  icAdd = icAdd;
  icComment=icComment;
  filteredIcons: string;
  icFilterList = icFilterList;
  searchCtrl = new FormControl();
  VendorAccountlist: AccountList[] = [];
  AccTypeList: AccountTypeList[] = []
  selectedAccountType: string = "All";
  selectedAccountTypeId: number = 0;
  newAccount: AccountList;
  MergedItems: MergedAccountItems;
  @Input()
  columns: TableColumn<AccountList>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    // { label: 'ID', property: 'CompanyAccountId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'NAME', property: 'AccountName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'ACCOUNT TYPE', property: 'AccountTypeName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'OWNER', property: 'OwnerName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'CREATED BY', property: 'CreatedBy', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'CREATED DATE', property: 'FormattedCreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Notes', property: 'actions', type: 'button', visible: true }
  ];
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private vendorAccountService: VendorAccountService,
    private _eventemitterservice:EventEmitterService,
    private permissionsService: NgxPermissionsService
  ) {
    this.dataSource = new MatTableDataSource();
    this.AccTypeList = [];
    this.newAccount = new AccountList();
    this.MergedItems = new MergedAccountItems();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  _actnotesemitter = EmitterService.get("AccountNotescnt");
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetAccountTypes();
      this.GetAccountsList();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this._actnotesemitter.subscribe(res => {
      let NotesItem = this.VendorAccountlist.find(x => x.AccountID == res);
      if(NotesItem!=null)
       NotesItem.NotesCount += 1;

       if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });

    this._eventemitterservice.accountsResponsesEvent.subscribe(()=>{
      this.GetAccountsList();
    })
  }

  GetAccountsList() {
    const accFilter = {
      companyId: this.loginUser.Company.Id,
      AccountTypeId: null,
      Owner: null,
      UserId:this.loginUser.UserId
    }
    this.vendorAccountService.GetAllAccounts(accFilter).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.VendorAccountlist = response.Data;
        this.VendorAccountlist.forEach(element => {
          element.FormattedCreatedDate = TimeZoneService.getLocalDateTime_Date(element.CreatedDate, true);
        });
        if (this.selectedAccountTypeId > 0){
          var result = this.VendorAccountlist.filter(x => x.AccountTypeId == this.selectedAccountTypeId);
          this.dataSource = new MatTableDataSource(result);
        }
        else{
          this.dataSource.data = this.VendorAccountlist;
        }
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  GetAccountTypes() {
    this.vendorAccountService.GetAccountTypes().subscribe(res => {
      if (!res.IsError) {
        this.AccTypeList = res.Data;
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    })
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ViewContactInfo(row: AccountList) {
    var editPermission = this.permissionsService.getPermission('ACTION_ACCOUNT_EDIT');
    if(editPermission){
      if(this.selection.hasValue){
        this.selection.clear();
      }
      this.dialog.open(AccountDetailComponent, {
        data: row.AccountID, width: '80%', height: '90vh', disableClose: true
      }).afterClosed().subscribe(response => {
  
        if (response) {
  
        }
      });
    }
    
  }

  AddAccount() {
    this.dialog.open(ManageAccountComponent, {
      data: this.newAccount, width: '40%', height: '46vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.GetAccountsList();
      }
    });
  }



  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'CreatedDate': return new Date(item.CreatedDate);
        default: return item[property];
      }
    };
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    //const numRows = this.dataSource.data.length;
    const numRows = this.dataSource.paginator != undefined ? this.dataSource.paginator.pageSize : this.pageSize;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.connect().value.forEach(row => this.selection.select(row));
    //this.dataSource.data.forEach(row => this.selection.select(row));
  }

  filterByAccounttype(selectedItem: AccountTypeList) {
    this.selection.clear();
    if (selectedItem.AccountTypeName == 'ALL') {
      this.selectedAccountType = selectedItem.AccountTypeName;
      this.selectedAccountTypeId = selectedItem.AccountTypeID;
      var result = this.VendorAccountlist;
      this.dataSource = new MatTableDataSource(result);
      this.paginator.pageIndex = 0;
      this.dataSource.paginator = this.paginator;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }
    else {
      this.selectedAccountType = selectedItem.AccountTypeName;
      this.selectedAccountTypeId = selectedItem.AccountTypeID;
      var result = this.VendorAccountlist.filter(x => x.AccountTypeId == selectedItem.AccountTypeID);
      this.dataSource = new MatTableDataSource(result);
      this.paginator.pageIndex = 0;
      this.dataSource.paginator = this.paginator;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }

  }

  MergeAccounts() {
    //check the selection has same accountType.
    var arrs = this.selection.selected.map(({ AccountTypeId }) => AccountTypeId);
    var IsValid = arrs.every((val, i, arr) => val === arr[0]);
    if (!IsValid) {
      this._alertService.error("Merge Accounts will not be applied for different account types");
    }
    else {
      this.OnConfirmMerge();
    }
  }

  MergeConfirmation(){
    const message = 'Do you want to merge the selected accounts ?'
    const dialogData = new ConfirmDialogModel("Merge Accounts", message);
    const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.OnConfirmMerge();
      }
    });
  }

  OnConfirmMerge(){
    this.MergedItems.AccountTypeId = this.selection.selected[0].AccountTypeId;
    this.MergedItems.AccountTypeName = this.selection.selected[0].AccountTypeName;
    this.MergedItems.SelectedAccounts = this.selection.selected;
    this.dialog.open(MergeAccountsComponent, {
      data: this.MergedItems, width: '40%', height: '56vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.searchCtrl.reset();
        this.selection.clear();
        this.GetAccountsList();
      }
    });
  }

  ViewNotes(row:AccountList){
    this.dialog.open(AccountNotesDialogComponent, {
      data:{accountId:row.AccountID}, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
        //this.GetAllCompanyInterviews(this.loginUser.Company.Id,this.loginUser.UserId);
      }
    });
  }

  onPaginateChange(event){
   if(this.selection.hasValue){
    this.selection.clear();
   }
  }
}


