import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import { TableColumn } from  'src/@cv/interfaces/table-column.interface';
import { InterviewStatus } from '../../core/models/Interviewstatuslist';
import icEdit from '@iconify/icons-ic/twotone-edit';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { TCSettingsService } from '../../core/http/tcsettings.service';
import { LoginUser } from 'src/@shared/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, ReplaySubject } from 'rxjs';
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
import icClose from '@iconify/icons-ic/twotone-close';
import { MatDialog } from '@angular/material/dialog';
import { AddAtsSettingsComponent } from '../add-ats-settings/add-ats-settings.component';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { iconsFA } from 'src/static-data/icons-fa';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
@UntilDestroy()
@Component({
  selector: 'cv-interview-status',
  templateUrl: './interview-status.component.html',
  styleUrls: ['./interview-status.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, TCSettingsService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class InterviewStatusComponent implements OnInit {
  
  subject$: ReplaySubject<InterviewStatus[]> = new ReplaySubject<InterviewStatus[]>(1);
  data$: Observable<InterviewStatus[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<InterviewStatus>();
  loginUser: LoginUser;
  InterviewStatusList:InterviewStatus[];  
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
  icClose=icClose;
  searchCtrl = new FormControl();
  filteredIcons: string;
  DialogResponse: ConfirmDialogModelResponse;
  @Input()
  columns: TableColumn<InterviewStatus>[] =[
    { label: 'Id', property: 'Id', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Name', property: 'InterviewStatusName', type: 'text', visible: true, cssClasses:  ['text-secondary', 'font-medium'] },
    { label: 'Color Code', property: 'ColorCode', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Created Date', property: 'CreatedDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private settingsService: TCSettingsService,
    private cdRef: ChangeDetectorRef
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
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetInterviewStauses()
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.columns) {
    //   this.visibleColumns = this.columns.map(column => column.property);
    // }

    // if (changes.data) {
    //   this.dataSource.data = this.data;
    // }
  }

  GetInterviewStauses(){
    this.settingsService.GetInterviewStatus(this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.InterviewStatusList = response.Data;
        this.dataSource.data = this.InterviewStatusList;
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  AddInterviewStatus(){
    this.dialog.open(AddAtsSettingsComponent, { width: '40%', panelClass: "dialog-class",disableClose:true,data:{type:"Interview",source:0} }).afterClosed().subscribe((emp) => {
      if (emp) {
        this.GetInterviewStauses();
      }
    });
}
EditInterviewStatus(inter:InterviewStatus){
  this.dialog.open(AddAtsSettingsComponent, { width: '40%', panelClass: "dialog-class",disableClose:true,data:{type:"Interview",source:JSON.parse(JSON.stringify(inter))} }).afterClosed().subscribe((emp) => {
    if (emp) {
      this.GetInterviewStauses();
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

  DeleteInterviewStatus(tag:InterviewStatus){
    const message = 'Submission Status <b><span class="displayEmail">' + tag.InterviewStatusName+  ' </span></b> has been deleted?'
    const dialogData = new ConfirmDialogModel("Interview Status", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmDeleted(tag);
      }
    });
  }

  ConfirmDeleted(tag:InterviewStatus){
    if (tag.Id > 0) {
      tag.UpdatedBy = this.loginUser.UserId;
      this.settingsService.DeleteInterviewStatus(tag).subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success(response.SuccessMessage);
          this.GetInterviewStauses();
        }
      },
        error => {
          this._alertService.error(error);
        })
    }
  }



}
