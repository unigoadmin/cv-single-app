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
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { JobCentralService } from '../../core/http/job-central.service';
import { IconService } from 'src/@shared/services/icon.service';
import { RequisitionService } from '../../core/http/requisitions.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { Requisitions } from '../../core/model/requisitions';
import { RequisitionNotesDialogComponent } from '../../requisitions-responses/requisition-notes-dialog/requisition-notes-dialog.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';

@UntilDestroy()
@Component({
  selector: 'cv-existing-requisitions',
  templateUrl: './existing-requisitions.component.html',
  styleUrls: ['./existing-requisitions.component.scss'],
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
export class ExistingRequisitionsComponent implements OnInit {
  
  loginUser: LoginUser;
  Requisitionslist: Requisitions[] = [];
  JobId: number = 0;
  mode:string="";
  OnlyView:boolean=false;
  @Input()
  columns: TableColumn<Requisitions>[] = [
    { label: 'Posting Id', property: 'PostingId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Buyer', property: 'Buyer', type: 'text', visible: false },
    { label: 'Positions', property: 'Positions', type: 'text', visible: true },
    { label: 'Site', property: 'Site', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Coordinator', property: 'Coordinator', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Posting Owner', property: 'PostingOwner', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Posted', property: 'CreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Submitted', property: 'SubmittedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Last Updated', property: 'UpdatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'StatusName', type: 'button', visible: true },
    { label: 'Notes', property: 'Notes', type: 'button', visible: true },
    { label: 'WorkActions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<Requisitions>();
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
  constructor(@Inject(MAT_DIALOG_DATA) public inputdata: any,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    public iconService: IconService,
    private jobCentralService: JobCentralService,
    private requisitonService: RequisitionService,) {
      this.JobId = this.inputdata.JobId;
      this.mode = this.inputdata.mode;
     }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      if(this.mode=="ByJob"){
        this.OnlyView = true;
        this.getRequisitionsByJob();
      }
      else{
        this.getExistingRequisitions();
      }
      
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
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

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  getExistingRequisitions() {
    const JobsFilter = {
      CompanyId: this.loginUser.Company.Id,
      JobId: this.JobId
    }
    this.jobCentralService.GetRequisitionsWithJob(JobsFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.Requisitionslist = result.Data;
        this.Requisitionslist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
          element.UpdatedDate = element.UpdatedDate!=null ? TimeZoneService.getRangeBaseTimeDisplay(element.UpdatedDate, true): null;
          element.SubmittedDate = element.SubmittedDate!=null ? TimeZoneService.getRangeBaseTimeDisplay(element.SubmittedDate, true): null;
        })
        this.dataSource.data = this.Requisitionslist;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });

  }

  getRequisitionsByJob() {
    const JobsFilter = {
      CompanyId: this.loginUser.Company.Id,
      JobId: this.JobId
    }
    this.jobCentralService.GetRequisitionsByJob(JobsFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.Requisitionslist = result.Data;
        this.Requisitionslist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
          element.UpdatedDate = element.UpdatedDate!=null ? TimeZoneService.getRangeBaseTimeDisplay(element.UpdatedDate, true): null;
          element.SubmittedDate = element.SubmittedDate!=null ? TimeZoneService.getRangeBaseTimeDisplay(element.SubmittedDate, true): null;
        })
        this.dataSource.data = this.Requisitionslist;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });

  }

  ViewNotes(row:Requisitions){
    this.dialog.open(RequisitionNotesDialogComponent, {
      data: { applicantId: row.RequisitionId}, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  emitToggleStatus(event: MatSlideToggleChange, row: any) {
    this.UpdateSingleResponseMapping(row,event);
  }

  UpdateSingleResponseMapping(row: any, event: MatSlideToggleChange) {debugger;
    const RequisitionMapping = {
      JobId: this.inputdata.JobId,
      RequisitionId: row.RequisitionId, //this.inputdata.RequisitionId,
      MappingStatus: event.checked,
      CreatedBy: this.loginUser.UserId,
      UpdatedBy: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id
    }
    this.requisitonService.JobRequisitonMapping(RequisitionMapping)
      .subscribe(response => {
        if (!response.IsError) {
          this._alertService.success(response.SuccessMessage);
          row.IsJobMappedToReq = event.checked;
          EmitterService.get("UpdateJobToReqMapping").emit(true);
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);
        })
  }

}
