import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { GlobalSettingsService } from '../../core/http/globalsettings.service';
import { GlobalSettings } from '../../core/models/globalsettings';
import icAdd from '@iconify/icons-ic/twotone-add';
import icEdit from '@iconify/icons-ic/twotone-edit';
import { AddGsettingsComponent, CategoryItem } from '../add-gsettings/add-gsettings.component';
import {GlobalSettingsCategory} from 'src/static-data/global-settings-category';

@Component({
  selector: 'cv-settings-prefix',
  templateUrl: './settings-prefix.component.html',
  styleUrls: ['./settings-prefix.component.scss'],
  providers: [GlobalSettingsCategory],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class SettingsPrefixComponent implements OnInit {
  
  icAdd=icAdd;
  icEdit=icEdit;
  loginUser: LoginUser;
  companyId: number;
  companyGlobalSettings: GlobalSettings[];
  globalSettings: GlobalSettings = new GlobalSettings();
  categoryList: CategoryItem[] = [];
  MissingCatergoryList:CategoryItem[] =[];
  subject$: ReplaySubject<GlobalSettings[]> = new ReplaySubject<GlobalSettings[]>(1);
  data$: Observable<GlobalSettings[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<GlobalSettings>();
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  @Input()
  columns: TableColumn<GlobalSettings>[] = [
    { label: 'ID', property: 'Settings_Id', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'CompanyId', property: 'CompanyId', type: 'text', visible: false, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'Category', property: 'Category', type: 'text', visible: true, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'Prefix', property: 'Prefix', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Series', property: 'Series', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'CreatedDate', property: 'CreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  constructor(private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _service:GlobalSettingsService,
    private cdRef: ChangeDetectorRef,
    private categoryTypes: GlobalSettingsCategory,) {
      this.dataSource = new MatTableDataSource();
      this.categoryList = [];
      this.categoryList = this.categoryTypes.GlobalCategory;
     }

    toggleColumnVisibility(column, event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      column.visible = !column.visible;
    }
    trackByProperty<T>(index: number, column: TableColumn<T>) {
      return column.property;
    }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
        this.companyId = this.loginUser.Company.Id;
        this.GetGlobalSettings(this.companyId);
    }
  }

  GetGlobalSettings(companyId:number){
    //clear the list before mapping
    this.MissingCatergoryList = [];
    this._service.GetGlobalSettings(companyId).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.companyGlobalSettings = response.Data;
        this.companyGlobalSettings.forEach(ele=>{
          ele.CreatedDate=TimeZoneService.getLocalDateTime_Date(ele.CreatedDate, true);
        })
        this.categoryList.forEach(x=>{
          let data = this.companyGlobalSettings.find(ob => ob.Category ===x.value);
          if(typeof(data) == 'undefined' || data === null){
           this.MissingCatergoryList.push(x);
          }
        })
        this.dataSource.data = this.companyGlobalSettings;
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  saveGlobalSettings() {
    this.globalSettings.Settings_Id=0;
    this.globalSettings.CompanyId = this.loginUser.Company.Id;
    this.globalSettings.CreatedDate = new Date();
    this._service.SaveGlobalSettings(this.globalSettings).subscribe(response => {
      this.GetGlobalSettings(this.companyId);
      this._alertService.success("Settings added successfully");
    }, error => {
      this._alertService.error(error);
    })
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
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

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        default: return item[property];
      }
    };
  }

  addNewCategory(){
    const dialogRef = this.dialog.open(AddGsettingsComponent, {
      data:  {category:this.MissingCatergoryList,selectedCategory:null,mode:"Add"},
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(role => {
      this.GetGlobalSettings(this.companyId);
    });
  }

  editprefix(row:any){
    const dialogRef = this.dialog.open(AddGsettingsComponent, {
      data:  {category:this.MissingCatergoryList,selectedCategory:row,mode:"Edit"},
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(role => {
      this.GetGlobalSettings(this.companyId);
    });
  }

}

