import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { IconService } from 'src/@shared/services/icon.service';
import { JobSearch } from '../../core/model/jobsearch';
import { JobNotesDialogComponent } from '../../jobs-dashboard/job-notes-dialog/job-notes-dialog.component';
import { RequisitionService } from '../../core/http/requisitions.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { JobsWithRequisitionStatus } from '../../core/model/jobswithrequisition';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { Requisitions } from '../../core/model/requisitions';
import { JobsHotListService } from '../../core/http/jobs-hotlist.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { AddJobComponent } from '../../jobs-dashboard/add-job/add-job.component';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogModel } from 'src/@shared/models/confirmdialogmodel';

@UntilDestroy()
@Component({
  selector: 'cv-existing-jobs',
  templateUrl: './existing-jobs.component.html',
  styleUrls: ['./existing-jobs.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class ExistingJobsComponent implements OnInit {

  loginUser: LoginUser;
  JobsList: JobsWithRequisitionStatus[];
  JobStatus: number = 0;
  RequisitionId: number = 0;
  DisplayOnlyMappingJobs: boolean;
  model: string;
  MultipleRequisitions: Requisitions[];
  MappingList: any[] = [];
  toggledMappings: any[] = [];
  DialogResponse: any;
  @Input()
  columns: TableColumn<JobsWithRequisitionStatus>[] = [
    { label: 'JobId', property: 'UniqueJobId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Source', property: 'JobSource', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Status', property: 'StatusName', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Category', property: 'JobCategoryName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Job Type', property: 'JobTypeName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Location', property: 'Location', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicants', property: 'MappedApplicants', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Client / Vendor', property: 'Accounts', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'WorkStatus', property: 'WorkStatus', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Duration(Months)', property: 'DurationInMonths', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Rate', property: 'Rate', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Experinece', property: 'Experience', type: 'text', visible: false },
    { label: 'Notes', property: 'Notes', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Public Link', property: 'PublishedJobUrl', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'WorkActions', property: 'actions', type: 'button', visible: true },

  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<JobsWithRequisitionStatus>();
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
  JobFilters: JobSearch = new JobSearch();
  editPermission: any;
  constructor(@Inject(MAT_DIALOG_DATA) public inputdata: any,
    private dialogRef: MatDialogRef<JobsWithRequisitionStatus>,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private jobhotlistService: JobsHotListService,
    private requisitionService: RequisitionService,
    public iconService: IconService,
    private permissionsService: NgxPermissionsService) {
    this.JobStatus = this.inputdata.JobStatus;
    this.RequisitionId = this.inputdata.RequisitionId;
    this.DisplayOnlyMappingJobs = this.inputdata.IsMappingJobs;
    this.model = this.inputdata.model;
    this.MultipleRequisitions = this.inputdata.responses;
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.fetchData();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this.editPermission = this.permissionsService.getPermission('ACTION_JC_EDIT_JOB');
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  fetchData() {
    const JobsFilter = {
      CompanyId: this.loginUser.Company.Id,
      ResourceId: this.RequisitionId,
      DisplayMapingJobs: this.DisplayOnlyMappingJobs,
      MultipleMode: this.model === 'multiple'
    };

    const serviceCall = this.inputdata.src === 'hotlist' ?
      this.jobhotlistService.GetMappingJobsHotList(JobsFilter) :
      this.requisitionService.GetJobsWithRequisition(JobsFilter);

    serviceCall.subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.JobsList = result.Data;
        this.JobsList.forEach(x => {
          if (!x.Location) {
            x.Location = 'Not Defined';
          }
        });
        this.dataSource.data = this.JobsList;
      }
      if (!this.cdRef["destroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  ViewNotes(row: JobsWithRequisitionStatus) {
    this.dialog.open(JobNotesDialogComponent, {
      data: { jobId: row.JobID }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  UpdateRequistionMapping(event: MatSlideToggleChange, row: JobsWithRequisitionStatus) {
    const RequisitionMapping = {
      JobId: row.JobID,
      RequisitionId: this.inputdata.RequisitionId,
      MappingStatus: event.checked,
      CreatedBy: this.loginUser.UserId,
      UpdatedBy: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id
    }
    this.requisitionService.JobRequisitonMapping(RequisitionMapping)
      .subscribe(response => {
        debugger;
        if (!response.IsError) {
          this._alertService.success(response.SuccessMessage);
          row.IsJobMappedToReq = event.checked;
          EmitterService.get("UpdateRequisitionMapping").emit(true);
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);
        })
  }

  UpdateHotListMapping(event: MatSlideToggleChange, row: JobsWithRequisitionStatus, IsPublish: boolean) {debugger;
    const HotListMapping = {
      JobId: row.JobID,
      HotListId: this.inputdata.RequisitionId,
      MappingStatus: event.checked,
      CreatedBy: this.loginUser.UserId,
      UpdatedBy: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id,
      IsPublishJob:IsPublish
    }
    this.jobhotlistService.MapJob_HotList(HotListMapping)
      .subscribe(response => {
        if (!response.IsError) {
          this._alertService.success(response.SuccessMessage);
          row.IsJobMappedToReq = event.checked;;
          EmitterService.get("UpdateRequisitionMapping").emit(true);
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);
        })
  }

  // UpdateMultipleResponseMapping(event: MatSlideToggleChange,row: JobsWithRequisitionStatus){
  //   if(this.MultipleRequisitions.length > 0){debugger;
  //     this.MultipleRequisitions.forEach(element => {
  //       const ReqMapping = {
  //         JobId: row.JobID,
  //         RequisitionId:element.RequisitionId,
  //         MappingStatus: event.checked,
  //         CreatedBy: this.loginUser.UserId,
  //         UpdatedBy: this.loginUser.UserId,
  //         CompanyId: this.loginUser.Company.Id
  //       };
  //       this.MappingList.push(ReqMapping);
  //     });

  //     this.requisitionService.JobRequisitonMultipleMapping(this.MappingList)
  //     .subscribe(response => {
  //       if (!response.IsError) {
  //         this._alertService.success(response.SuccessMessage);
  //         row.IsJobMappedToReq = event.checked;
  //         EmitterService.get("UpdateRequisitionMapping").emit(true);
  //       }
  //       else {
  //         this._alertService.error(response.ErrorMessage);
  //       }
  //     },
  //       error => {
  //         this._alertService.error(error);
  //       })
  //      this.MappingList = [];
  //   }
  // }



  // emitToggleStatus(event: MatSlideToggleChange, row: JobsWithRequisitionStatus) {debugger;
  //   const index = this.toggledMappings.findIndex(mapping => mapping.JobId === row.JobID);
  //   let PublicJobId: string | null = null;
  //   if (this.inputdata.src === 'hotlist') {
  //     PublicJobId = row.PublishedJobId != null ? row.PublishedJobId : uuidv4();
  //   }
  //   else {
  //     PublicJobId = null;
  //   }

  //   if (index > -1) {
  //     this.toggledMappings[index] = {
  //       JobId: row.JobID,
  //       RequisitionId: this.RequisitionId,
  //       MappingStatus: event.checked,
  //       CreatedBy: this.loginUser.UserId,
  //       UpdatedBy: this.loginUser.UserId,
  //       CompanyId: this.loginUser.Company.Id,
  //       PublishedJobId: PublicJobId
  //     };
  //   } else {
  //     this.toggledMappings.push({
  //       JobId: row.JobID,
  //       RequisitionId: this.RequisitionId,
  //       MappingStatus: event.checked,
  //       CreatedBy: this.loginUser.UserId,
  //       UpdatedBy: this.loginUser.UserId,
  //       CompanyId: this.loginUser.Company.Id,
  //       PublishedJobId: PublicJobId
  //     });
  //   }

  // }

  emitToggleStatus(event: MatSlideToggleChange, row: JobsWithRequisitionStatus) {
    if (this.inputdata.src === 'hotlist') {
      if (!row.PublishedJobId) {
        const message = 'To map this job to the Hotlist, it must first be published. Would you like to proceed with publishing the job?'
        const dialogData = new ConfirmDialogModel("HotList", message);
        const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
          width: '60%',
          data: dialogData,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.DialogResponse = dialogResult;
          if (this.DialogResponse.Dialogaction == true) {
            this.UpdateHotListMapping(event, row, true);
          }
          else {
            this.UpdateHotListMapping(event, row, false);
          }
        });
      }
      else{
        this.UpdateHotListMapping(event, row, false);
      }
    }
    else {
      this.UpdateRequistionMapping(event, row);
    }
  }

  // SubmitHotListMappings() {
  //   this.jobhotlistService.MapJob_HotList(this.toggledMappings)
  //     .subscribe(response => {
  //       if (!response.IsError) {
  //         this._alertService.success(response.SuccessMessage);
  //         EmitterService.get("UpdateJobHotListMapping").emit(true);
  //       }
  //       else {
  //         this._alertService.error(response.ErrorMessage);
  //       }
  //     },
  //       error => {
  //         this._alertService.error(error);
  //       })
  // }

  // SubmitRequistionsMapping() {
  //   this.requisitionService.JobRequisitonMultipleMapping(this.toggledMappings)
  //     .subscribe(response => {
  //       if (!response.IsError) {
  //         this._alertService.success(response.SuccessMessage);
  //         EmitterService.get("UpdateRequisitionMapping").emit(true);
  //       }
  //       else {
  //         this._alertService.error(response.ErrorMessage);
  //       }
  //     },
  //       error => {
  //         this._alertService.error(error);
  //       })
  // }

  // submitMappings() {
  //   if (this.inputdata.src === 'hotlist') {
  //     this.SubmitHotListMappings();
  //   }
  //   else {
  //     this.SubmitRequistionsMapping();
  //   }

  // }


  OnClose() {
    if (this.model == 'multiple') {
      this.dialogRef.close(true);
    }
    else { this.dialogRef.close(); }
  }

  updateJob(row: JobsWithRequisitionStatus) {
    if (this.editPermission) {
      this.dialog.open(AddJobComponent, {
        maxWidth: '95vw', width: '95vw', disableClose: true, data: { mode: "Edit Job", Id: row.JobID }
      }).afterClosed().subscribe(response => {

        if (response) {

        }
      });
    }
  }

}
