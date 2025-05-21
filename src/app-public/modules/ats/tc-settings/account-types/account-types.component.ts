import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import iclocationon from '@iconify/icons-ic/location-on';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icFolder from '@iconify/icons-ic/twotone-folder';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import icMap from '@iconify/icons-ic/twotone-map';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import icFormattedList from '@iconify/icons-ic/twotone-format-list-bulleted';
import icClose from '@iconify/icons-ic/twotone-close';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginUser } from 'src/@shared/models';
import { Observable, ReplaySubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TCSettingsService } from '../../core/http/tcsettings.service';
import { FormControl } from '@angular/forms';
import { AddAtsSettingsComponent } from '../add-ats-settings/add-ats-settings.component';
import { BenchAccountTypes } from '../../core/models/settingsmodels';
import { iconsFA } from 'src/static-data/icons-fa';

@UntilDestroy()
@Component({
  selector: 'cv-account-types',
  templateUrl: './account-types.component.html',
  styleUrls: ['./account-types.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService,TCSettingsService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class AccountTypesComponent implements OnInit {
  loginUser: LoginUser;
  subject$: ReplaySubject<BenchAccountTypes[]> = new ReplaySubject<BenchAccountTypes[]>(1);
  data$: Observable<BenchAccountTypes[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<BenchAccountTypes>();
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  icMoreHoriz = icMoreHoriz;
  icCloudDownload = icCloudDownload;
  icEdit=icEdit;
  icMap = icMap;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icFolder = icFolder;
  iclocationon = iclocationon;
  icPersonAdd = icPersonAdd;
  icDoneAll = icDoneAll;
  icEye = icEye;
  icFormattedList=icFormattedList;
  icClose=icClose;
  searchCtrl = new FormControl();
  filteredIcons: string;
  @Input()
  columns: TableColumn<BenchAccountTypes>[] = [
    { label: 'Account Type Name', property: 'AccountTypeName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  public hashTags: BenchAccountTypes[]=[];  
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private service:TCSettingsService,
  ) { 
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();
  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetAccountTypes();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  GetAccountTypes() {
    this.service.GetBenchAccountTypes(this.loginUser.Company.Id).subscribe(response => {
        if(response.Data){
          this.dataSource.data = response.Data;
        }
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      });
  }
  AddAccountType(){
    this.dialog.open(AddAtsSettingsComponent, { width: '40%', panelClass: "dialog-class",disableClose:true,data:{type:"AccountType",source:0} }).afterClosed().subscribe((emp) => {
      if (emp) {
        this._alertService.success('Account Type saved successfully');
        this.GetAccountTypes();
      }
    });
}
EditAccountType(tag:BenchAccountTypes){
  this.dialog.open(AddAtsSettingsComponent, { width: '40%', panelClass: "dialog-class",disableClose:true,data:{type:"AccountType",source:JSON.parse(JSON.stringify(tag))} }).afterClosed().subscribe((emp) => {
    if (emp) {
      this._alertService.success('Account Type updated successfully');
      this.GetAccountTypes();
    }
  });
}
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  sortData(sort: MatSort) {
    this.sort = sort;
  }
  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }
  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }
}
