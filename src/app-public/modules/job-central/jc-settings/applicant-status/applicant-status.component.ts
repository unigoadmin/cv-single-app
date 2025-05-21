import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { JobCentralService } from '../../core/http/job-central.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationStatus } from '../../core/model/applicantstatus';
import { iconsFA } from 'src/static-data/icons-fa'; 
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { AccountTypes } from 'src/static-data/accounttypes';
@UntilDestroy()

@Component({
  selector: 'cv-applicant-status',
  templateUrl: './applicant-status.component.html',
  styleUrls: ['./applicant-status.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AccountTypes, AuthenticationService, JobCentralService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ApplicantStatusComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<ApplicationStatus[]> = new ReplaySubject<ApplicationStatus[]>(1);
  data$: Observable<ApplicationStatus[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<ApplicationStatus>();
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
  icEdit = icEdit;
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
  icFormattedList = icFormattedList;
  icClose = icClose;
  searchCtrl = new FormControl();
  filteredIcons: string;
  DialogResponse: ConfirmDialogModelResponse;
  submissionStatusList: ApplicationStatus[] = [];
  currentStatus: ApplicationStatus = new ApplicationStatus();
  IsSubLoading: boolean = false;
  dialogRef: any;
  @ViewChild('applicantStatusModal') rsDialog = {} as TemplateRef<any>;
  ApplicantStatusForm: FormGroup;
  StatusColorCodes = [];
  @Input()
  columns: TableColumn<ApplicationStatus>[] = [
    { label: 'Id', property: 'StatusId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Status Name', property: 'StatusName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
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
    private _formBuilder: FormBuilder,
    private service: JobCentralService,
    private staticDataTypes: AccountTypes,
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();

    this.ApplicantStatusForm = this._formBuilder.group({
      'StatusName': ['', [Validators.required]],
      'Submissioncolorcode': ['', [Validators.required]],
    });
    this.StatusColorCodes = this.staticDataTypes.StatusColorList;
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
    debugger;
    this.service.GetApplicantStatusList(this.loginUser.Company.Id).subscribe(response => {
      if (!response.IsError) {
        debugger;
        this.submissionStatusList = response.Data;
        this.dataSource.data = this.submissionStatusList;
      }
      this.setDataSourceAttributes();
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });
  }
  AddNewStatus() {
    this.currentStatus = new ApplicationStatus();
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this.GetSubmissionStatus();
      }
    });
  }
  EditStatus(tag: ApplicationStatus) {
    this.currentStatus = tag;
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this.GetSubmissionStatus();
      }
    });
  }
  //   AddSubmissionStatus(){
  //     this.dialog.open(AddAtsSettingsComponent, { width: '40%', panelClass: "dialog-class",disableClose:true,data:{type:"SubmissionStatus",source:0} }).afterClosed().subscribe((emp) => {
  //       if (emp) {
  //         this.GetSubmissionStatus();
  //       }
  //     });
  // }
  // EditSubmissionStatus(tag:ApplicationStatus){
  //   this.dialog.open(AddAtsSettingsComponent, { width: '40%', panelClass: "dialog-class",disableClose:true,data:{type:"SubmissionStatus",source:JSON.parse(JSON.stringify(tag))} }).afterClosed().subscribe((emp) => {
  //     if (emp) {
  //       this.GetSubmissionStatus();
  //     }
  //   });
  // }

  DeleteSubmissionStatus(tag: ApplicationStatus) {
    const message = 'Applicant Status <b><span class="displayEmail">' + tag.StatusName + ' </span></b> has been deleted?'
    const dialogData = new ConfirmDialogModel("Applicant Status", message);
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

  ConfirmDeleted(tag: ApplicationStatus) {
    if (tag.StatusId > 0) {
      tag.UpdatedBy = this.loginUser.UserId;
      this.service.DeleteApplicantStatus(tag).subscribe(response => {
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

  SaveSubmissionStatus() {
    this.IsSubLoading = true;
    if (this.currentStatus.StatusName == null || this.currentStatus.StatusName.trim() == '') {
      this._alertService.error("Please Enter Account type.");
      this.IsSubLoading = false;
      return;
    }
    if (this.currentStatus.StatusId > 0)
      this.currentStatus.UpdatedBy = this.loginUser.UserId;
    else{
      this.currentStatus.CreatedBy = this.loginUser.UserId;
      this.currentStatus.IsActive = true;
    }
     
    this.currentStatus.CompanyId = this.loginUser.Company.Id;

    this.service.ManageApplicantStatus(this.currentStatus)
      .subscribe(
        response => {
          if (response.IsError == true) {
            this._alertService.error(response.ErrorMessage);
          }
          else {
            this._alertService.success(response.SuccessMessage);
            this.IsSubLoading = false;
            this.dialogRef.close(true);
          }
        },
        error => {
          this.IsSubLoading = false;
          this._alertService.error(error);
        }
      );
  }

  onSubmissionColorChange(event: any) {
    let selectedStatus = this.StatusColorCodes.find(x => x.label == event.value);
    if (selectedStatus) {
      this.currentStatus.bgclass = selectedStatus.bgclass;
    }
  }

}
