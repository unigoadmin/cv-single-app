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
import { MasterSubmissionStatus } from '../../core/models/settingsmodels';
import { iconsFA } from 'src/static-data/icons-fa';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
@UntilDestroy()
@Component({
  selector: 'cv-submissions-status',
  templateUrl: './submissions-status.component.html',
  styleUrls: ['./submissions-status.component.scss'],
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
export class SubmissionsStatusComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<MasterSubmissionStatus[]> = new ReplaySubject<MasterSubmissionStatus[]>(1);
  data$: Observable<MasterSubmissionStatus[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<MasterSubmissionStatus>();
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
  DialogResponse: ConfirmDialogModelResponse;
  submissionStatusList: MasterSubmissionStatus[]=[];  
  @Input()
  columns: TableColumn<MasterSubmissionStatus>[] = [
    { label: 'Id', property: 'StatusId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Submission Status Name', property: 'StatusName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
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
      this.GetSubmissionStatus();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  GetSubmissionStatus() {
    this.service.GetMasterSubmissionStatusList(this.loginUser.Company.Id).subscribe(response => {
        if(!response.IsError){debugger;
          this.submissionStatusList = response.Data;
          this.dataSource.data = this.submissionStatusList;
        }
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      });
  }
  AddSubmissionStatus(){
    this.dialog.open(AddAtsSettingsComponent, { width: '40%', panelClass: "dialog-class",disableClose:true,data:{type:"SubmissionStatus",source:0} }).afterClosed().subscribe((emp) => {
      if (emp) {
        this.GetSubmissionStatus();
      }
    });
}
EditSubmissionStatus(tag:MasterSubmissionStatus){
  this.dialog.open(AddAtsSettingsComponent, { width: '40%', panelClass: "dialog-class",disableClose:true,data:{type:"SubmissionStatus",source:JSON.parse(JSON.stringify(tag))} }).afterClosed().subscribe((emp) => {
    if (emp) {
      this.GetSubmissionStatus();
    }
  });
}

DeleteSubmissionStatus(tag:MasterSubmissionStatus){
  const message = 'Submission Status <b><span class="displayEmail">' + tag.StatusName+  ' </span></b> has been deleted?'
  const dialogData = new ConfirmDialogModel("Submission Status", message);
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

ConfirmDeleted(tag:MasterSubmissionStatus){
  if (tag.StatusId > 0) {
    tag.UpdatedBy = this.loginUser.UserId;
    this.service.DeleteSubmissionStatus(tag).subscribe(response => {
      if (response.IsError == false) {
        this._alertService.success(response.SuccessMessage);
        this.GetSubmissionStatus();
      }
    },
      error => {
        this._alertService.error(error);
      })
  }
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
