import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { VendorAccountService } from '../../core/http/vendoraccounts.service';
import { AccountContactList } from '../../core/models/accountcontactslist';
import { iconsFA } from 'src/static-data/icons-fa';
import icSearch from '@iconify/icons-ic/twotone-search';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icCancel from '@iconify/icons-ic/twotone-cancel';
import icSave from '@iconify/icons-ic/twotone-save';
import icClose from '@iconify/icons-ic/close';
import { ValidationService } from 'src/@cv/services/validation.service';

@UntilDestroy()
@Component({
  selector: 'cv-account-contact-info',
  templateUrl: './account-contact-info.component.html',
  styleUrls: ['./account-contact-info.component.scss'],
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
export class AccountContactInfoComponent implements OnInit {

  @Input() AccountID: number;
  @Input() mode: string;
  subject$: ReplaySubject<AccountContactList[]> = new ReplaySubject<AccountContactList[]>(1);
  data$: Observable<AccountContactList[]> = this.subject$.asObservable();
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  filteredIcons: string;
  icSearch = icSearch;
  icFilterList = icFilterList;
  icEdit = icEdit;
  icCancel = icCancel;
  icSave = icSave;
  accContactList: AccountContactList[] = [];
  editContact: AccountContactList;
  oldContact: AccountContactList;
  editdisabled: boolean;
  valid: any = {};
  icClose = icClose;
  editContactform: FormGroup;
  eFirstName:string;
  eLastName:string;
  eEmail:string;
  ePhonenumber:string;
  @Input()
  columns: TableColumn<AccountContactList>[] = [

    { label: 'Id', property: 'ContactId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Email', property: 'Email', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Phone', property: 'Phonenumber', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Contact Type', property: 'ContactType', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<AccountContactList>();
  selection = new SelectionModel<AccountContactList>(true, []);
  searchCtrl = new FormControl();
  @ViewChild(MatSort) sort: MatSort;
  paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  Contactlist: AccountContactList[] = [];
  dialogRef: any;
  @ViewChild('editaccountContact') rsDialog = {} as TemplateRef<any>;
  constructor(
    private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private vendorAccountService: VendorAccountService) {
    this.dataSource = new MatTableDataSource();
    this.editContact = new AccountContactList();
    this.valid = {};

    this.editContactform = this._formBuilder.group({
      'FirstName': ['', [Validators.required]],
      'LastName': ['', [Validators.required]],
      'Email': ['', [Validators.required,ValidationService.emailValidator]],
      'Phonenumber': ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.MyActiveApplicants();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnChanges() {
    if (this.mode == 'View') {
      const Id = this.columns.findIndex(x => x.label == 'Actions');
      this.columns[Id].visible = false;
    }
    else {
      const Id = this.columns.findIndex(x => x.label == 'Actions');
      this.columns[Id].visible = true;
    }
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        default: return item[property];
      }
    };
  }


  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  MyActiveApplicants() {
    this.vendorAccountService.GetAccountContacts(this.loginUser.Company.Id, this.AccountID).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.accContactList = result.Data;
        this.dataSource = new MatTableDataSource(this.accContactList);
        this.dataSource.paginator = this.paginator;

      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  EditContact(row: AccountContactList) {
    this.editContact = row;
    this.eFirstName = row.FirstName;
    this.eLastName = row.LastName;
    this.eEmail = row.Email;
    this.ePhonenumber = row.Phonenumber;
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(() => {
    });
  }

  CloseEditContact() {
    this.dialogRef.close(this.rsDialog);
  }

  UpdateContact() {
    this.editContact.FirstName = this.eFirstName;
    this.editContact.LastName= this.eLastName;
    this.editContact.Email=this.eEmail;
    this.editContact.Phonenumber=this.ePhonenumber;
    this.vendorAccountService.UpdateContact(this.editContact)
      .subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success(response.SuccessMessage);
          this.editContact = new AccountContactList();
          this.dialogRef.close(this.rsDialog);
        }
      },
        error => {
          this._alertService.error(error);
        }
      )
  }

  onInputKeyPress(event): void {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.code !== 'Backspace' && event.code !== 'Tab' &&
      event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }

  onPhoneNumberChange() {
    this.editContact.Phonenumber = this.PhoneValid(this.editContact.Phonenumber);
  }
  private PhoneValid(phone) {
    //normalize string and remove all unnecessary characters
    if (phone) {
      phone = phone.replace(/[^\d]/g, "");
      //check if number length equals to 10
      if (phone.length == 10) {
        //reformat and return phone number
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  // updateEdit(id: number){
  //   this.editdisabled = true;
  //   var result = this.VaidateSubmit(id);
  //   if(result==false){ //validation sucess
  //     this.vendorAccountService.UpdateContact(this.editContact)
  //     .subscribe(response => {
  //       if (response.IsError == false) {
  //         this._alertService.success(response.SuccessMessage);
  //         this.editContact = new AccountContactList();
  //         this.editdisabled = false;  
  //       }
  //     },
  //       error => {
  //         this._alertService.error(error);
  //       }
  //     )
  //   }
  //   else{
  //     this.editdisabled = false;
  //     this._alertService.error("Please fill the mandatory fields");
  //   }

  // }


  // cancelEdit(){
  //   this.editContact = new AccountContactList();
  // }


}
