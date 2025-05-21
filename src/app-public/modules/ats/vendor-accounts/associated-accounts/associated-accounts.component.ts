import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { AssociatedAccounts } from '../../core/models/associatedaccounts';

@UntilDestroy()
@Component({
  selector: 'cv-associated-accounts',
  templateUrl: './associated-accounts.component.html',
  styleUrls: ['./associated-accounts.component.scss'],
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
export class AssociatedAccountsComponent implements OnInit {

  @Input() AccountID:number
  subject$: ReplaySubject<AssociatedAccounts[]> = new ReplaySubject<AssociatedAccounts[]>(1);
  data$: Observable<AssociatedAccounts[]> = this.subject$.asObservable();
  mobileQuery: MediaQueryList;
  loginUser: LoginUser; 
  filteredIcons: string;
  icSearch=icSearch;
  icFilterList = icFilterList;
  associatedAccountsList:AssociatedAccounts[]=[];
  @Input()
  columns: TableColumn<AssociatedAccounts>[] = [
   
    { label: 'Account Name', property: 'AccountLayer', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Account Type', property: 'AccountType', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    
  ];
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<AssociatedAccounts>();
  selection = new SelectionModel<AssociatedAccounts>(true, []);
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

  constructor(
    private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private vendorAccountService: VendorAccountService) 
    { 
      this.dataSource = new MatTableDataSource();
    }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetAssociatedAccounts();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
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

  GetAssociatedAccounts() {
    this.vendorAccountService.GetAssociatedAccounts(this.loginUser.Company.Id,this.AccountID).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.associatedAccountsList = result.Data;
        this.dataSource = new MatTableDataSource(this.associatedAccountsList);
        this.dataSource.paginator = this.paginator;
        
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

}
