import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { CustomMessageService } from '../../core/http/custommessage.service';
import { CustomMessageFields } from  '../../core/models/custommessages';
import icAdd from '@iconify/icons-ic/twotone-add';
import icEdit from '@iconify/icons-ic/twotone-edit';
import { GlobalSettingsCategory } from 'src/static-data/global-settings-category';
import { CustomCategoryItem } from '../../core/models/categoryItem';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { ModuleService } from '../../core/http/module.service';
import { CompanyModules, RolesTableMenu } from '../../core/models';
import { FormControl } from '@angular/forms';
import icSearch from '@iconify/icons-ic/twotone-search';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UpdateCustomMessageComponent } from '../update-custom-message/update-custom-message.component';

@UntilDestroy()
@Component({
  selector: 'cv-custom-messages',
  templateUrl: './custom-messages.component.html',
  styleUrls: ['./custom-messages.component.scss'],
  providers: [GlobalSettingsCategory],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class CustomMessagesComponent implements OnInit {

  icAdd=icAdd;
  icEdit=icEdit;
  icSearch = icSearch;
  loginUser: LoginUser;
  companyId: number;
  categoryList: CustomCategoryItem[] = [];
  companyCustomMessages: CustomMessageFields[];
  currentMessage: CustomMessageFields = new CustomMessageFields();
  subject$: ReplaySubject<CustomMessageFields[]> = new ReplaySubject<CustomMessageFields[]>(1);
  data$: Observable<CustomMessageFields[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<CustomMessageFields>();
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  selectedCategoryId:number;
  selectedModule:string;
  selectedCategory:string;
  selectedModuleId:string;
  companyModules: CompanyModules[];
  menuData: RolesTableMenu[] = [];
  searchCtrl = new FormControl();
  
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  @Input()
  columns: TableColumn<CustomMessageFields>[] = [
    { label: 'ID', property: 'CustomMessageId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Description', property: 'Description', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Message', property: 'ResourceValue', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'LastUpdated', property: 'CreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  constructor(private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _service:CustomMessageService,
    private _moduleService:ModuleService,
    private cdRef: ChangeDetectorRef,
    private categoryTypes: GlobalSettingsCategory,) {
      this.dataSource = new MatTableDataSource();
      this.categoryList = [];
      this.categoryList = this.categoryTypes.CustomMessageCategory;
     }

     toggleColumnVisibility(column, event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      column.visible = !column.visible;
    }
    trackByProperty<T>(index: number, column: TableColumn<T>) {
      return column.property;
    }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
        this.companyId = this.loginUser.Company.Id;
        this.getCompanyActiveModules(this.companyId);
        this.selectedCategoryId=1;
        this.selectedCategory="Alerts";
        //this.GetCompanyMessage(this.companyId,this.selectedCategoryId,this.selectedModuleId);
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  GetCompanyMessage(companyId:number,categoryId:number,ModuleId:string){
    this._service.GetCompanyCustomMessages(companyId,categoryId,ModuleId).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.companyCustomMessages = response.Data;
        this.companyCustomMessages.forEach(ele=>{
          if(ele.CreatedDate!=null)
              ele.CreatedDate=TimeZoneService.getLocalDateTime_Date(ele.CreatedDate, true);
        })
        
        this.dataSource.data = this.companyCustomMessages;
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
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

  editmessage(row:CustomMessageFields){debugger;
    const dialogRef = this.dialog.open(UpdateCustomMessageComponent, {
      data:  row,
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(role => {
      this.filterModule(this.selectedModuleId,this.selectedCategoryId);
    });
  }

  getCompanyActiveModules(companyId:number) {
    this._moduleService.getCompanyActiveModules(companyId)
      .subscribe(
      (companyModules) => {
          this.companyModules = companyModules;
          this.selectedModuleId=this.companyModules[0].ModuleId;
          this.selectedModule=this.companyModules[0].ModuleName;
          this.filterModule(this.companyModules[0].ModuleId,this.selectedCategoryId);
      },
      error => {
          this._alertService.error(error);
      });
  }

  filterModule(moduleId:string,categoryId:number){
    this.selectedModuleId = moduleId;
    this.selectedModule =  this.companyModules.find(i=>i.ModuleId == moduleId).ModuleName;
    this.selectedCategoryId = categoryId;
    this.selectedCategory = this.categoryList.find(i=>i.value == categoryId).label;
    this.GetCompanyMessage(this.companyId,this.selectedCategoryId,this.selectedModuleId);
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
