import { ChangeDetectorRef, Component, Input, OnInit, ViewChild,Injectable } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { FilterTableColumn, TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { Requisitions } from '../core/model/requisitions';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RequisitionService } from '../core/http/requisitions.service';
import { LoginUser } from 'src/@shared/models';
import { iconsFA } from 'src/static-data/icons-fa';
import { IconService } from 'src/@shared/services/icon.service';
import { MatDialog } from '@angular/material/dialog';
import { RequisitionNotesDialogComponent } from './requisition-notes-dialog/requisition-notes-dialog.component';
import { ExistingJobsComponent } from './existing-jobs/existing-jobs.component';
import { AddJobComponent } from '../jobs-dashboard/add-job/add-job.component';
import { EditRequisitionComponent } from './edit-requisition/edit-requisition.component';
import { SelectionModel } from '@angular/cdk/collections';
import { AccountTypes } from 'src/static-data/accounttypes';
import { MatSelectChange } from '@angular/material/select';
import { AddCandidateToJobComponent } from '../jobs-dashboard/add-candidate-to-job/add-candidate-to-job.component';
import { ReqSubmissionsListComponent } from './submissions-list/submissions-list.component';
import { RequistionExportModel } from 'src/@shared/models/requistionexportmodel';
import { ExcelService } from 'src/@cv/services/excel.service';
import { Observable, ReplaySubject } from 'rxjs';


@UntilDestroy()
@Component({
  selector: 'cv-requisitions-responses',
  templateUrl: './requisitions-responses.component.html',
  styleUrls: ['./requisitions-responses.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [TimeZoneService,AccountTypes,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class RequisitionsResponsesComponent implements OnInit {

  subject$: ReplaySubject<Requisitions[]> = new ReplaySubject<Requisitions[]>(1);
  data$: Observable<Requisitions[]> = this.subject$.asObservable();
  loginUser: LoginUser;
  filteredIcons: string;
  currentPage = 0;
  totalRows = 0;
  IsRequistionTable:boolean=true;
  IsApplicantsView:boolean=false;
  selectedRequistionId:number=0;
  ApplicantStausList: any[];
  customStatusModel: number = 0;
  customCoordinatorModel:string="ALL";
  customPostingOwnerModel:string="ALL";
  ExportXLSXData: any[];
  SearchValue:any=null;
  searchLoaded:boolean=false;
  coordinatorsList:any[];
  postingOwnersList:any[];
  currentRequisition: Requisitions = new Requisitions();
  _jobeditemitter = EmitterService.get("editRequisiton");
  @Input()
  columns: TableColumn<Requisitions>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Posting Id', property: 'PostingId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Buyer', property: 'Buyer', type: 'text', visible: false },
    { label: 'Positions', property: 'Positions', type: 'text', visible: true },
    { label: 'Site', property: 'Site', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Coordinator', property: 'Coordinator', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Posting Owner', property: 'PostingOwner', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Start Date', property: 'StartDate', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'End Date', property: 'EndDate', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Posted', property: 'CreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Max Submissions', property: 'MaxSubmissions', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Bill Rate', property: 'BillRate', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Skills', property: 'PrimarySkills', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Submitted', property: 'SubmittedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Last Updated', property: 'UpdatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Jobs', property: 'MappedJobs', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicants', property: 'ApplicantsCount', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Submissions', property: 'SubmissionsCount', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'StatusName', type: 'button', visible: true },
    { label: 'Notes', property: 'Notes', type: 'button', visible: true },
    { label: 'Actions', property: 'Actions', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];
  filtercolumns: FilterTableColumn<Requisitions>[] = [
    { filter: false, filterName: 'checkbox-filter', visible: true, label: 'Checkbox' },
    { filter: false, filterName: 'PostingId-filter', visible: true,label: 'Posting Id' },
    { filter: false, filterName: 'JobTitle-filter', visible: true,label: 'Job Title' },
    { filter: false, filterName: 'Buyer-filter', visible: false ,label: 'Buyer'},
    { filter: false, filterName: 'Positions-filter', visible: true,label: 'Positions' },
    { filter: false, filterName: 'Site-filter', visible: false,label: 'Site' },
    { filter: true, filterName: 'Coordinator-filter', visible: true,label: 'Coordinator' },
    { filter: true, filterName: 'PostingOwner-filter', visible: true,label: 'Posting Owner' },
    { filter: false, filterName: 'MaxSubm-filter', visible: false,label: 'Max Submissions' },
    { filter: false, filterName: 'BillRate-filter', visible: false,label: 'Bill Rate' },
    { filter: false, filterName: 'StartDate-filter', visible: false,label: 'Start Date' },
    { filter: false, filterName: 'EndDate-filter', visible: false,label: 'End Date' },
    { filter: false, filterName: 'CreatedDate-filter', visible: true , label: 'Posted'},
    { filter: false, filterName: 'Skills-filter', visible: false,label: 'Skills' },
    { filter: false, filterName: 'SubmittedDate-filter', visible: true, label: 'Submitted' },
    { filter: false, filterName: 'UpdatedDate-filter', visible: true,label: 'Last Updated' },
    { filter: false, filterName: 'MappedJobs-filter', visible: true,label: 'Jobs' },
    { filter: false, filterName: 'ApplicantsCount-filter', visible: true,label: 'Applicants' },
    { filter: false, filterName: 'SubmissionsCount-filter', visible: true,label: 'Submissions' },
    { filter: true, filterName: 'StatusName-filter', visible: true,label: 'Status' },
    { filter: false, filterName: 'Notes-filter', visible: true,label: 'Notes' },
    { filter: false, filterName: 'Actions-filter', visible: true,label: 'Actions' },
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<Requisitions>();
  selection = new SelectionModel<Requisitions>(true, []);
  searchCtrl = new FormControl();
  @ViewChild(MatSort) sort: MatSort;

  paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource(this.Requisitionslist);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  Requisitionslist: Requisitions[] = [];
  RequistionExportList: RequistionExportModel[]= [];
  constructor(
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private service: RequisitionService,
    public iconService: IconService,
    private accountTypes: AccountTypes,
    private excelService:ExcelService
  ) { 
    this.dataSource = new MatTableDataSource();
    this.ApplicantStausList = this.accountTypes.RequisitionStatusList;
  }

  _updateemitter = EmitterService.get("UpdateRequisitionMapping");

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      EmitterService.get("JobCentral").emit("JobCentral");
      this.GetRequisitionsData();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this._updateemitter.subscribe(res => {debugger;
      this.GetRequisitionsData();
    })

    this._jobeditemitter.subscribe(res => {
      this.GetRequisitionsData();
    })

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  get filteredColumns() {
    return this.filtercolumns.filter(column => column.visible).map(column => column.filterName);
  }

  GetCoordinator(){
    this.service.GetCordinatorsPostingOwner(this.loginUser.Company.Id).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.coordinatorsList = result.Data.Item1;
        this.postingOwnersList = result.Data.Item2;
        console.log(result.Data);
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  GetRequisitionsData() {
    const appFilter = {
      companyId: this.loginUser.Company.Id,
      coordinator: (this.customCoordinatorModel != 'ALL' && this.customCoordinatorModel != undefined)? this.customCoordinatorModel : null,
      postngowner: (this.customPostingOwnerModel != 'ALL' && this.customPostingOwnerModel != undefined)? this.customPostingOwnerModel : null,
      ApplicantStatus:this.customStatusModel != 0 ? this.customStatusModel : null,
      SearchText:this.SearchValue,
    }
    this.Requisitionslist = [];
    this.dataSource = null;
    this.service.GetRequisitions(appFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.Requisitionslist = result.Data;
        this.Requisitionslist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
          element.UpdatedDate = element.UpdatedDate!=null ? TimeZoneService.getRangeBaseTimeDisplay(element.UpdatedDate, true): null;
          element.SubmittedDate = element.SubmittedDate!=null ? TimeZoneService.getRangeBaseTimeDisplay(element.SubmittedDate, true): null;
        })
        this.dataSource = new MatTableDataSource(this.Requisitionslist);
        this.GetCoordinator();
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  // onFilterChange(value: string): void {
  //   if (!this.dataSource) {
  //     return;
  //   }
  //   if (value && value.length > 2) {  
  //     this.searchLoaded=true;
  //     const trimmedValue = value.trim().toLowerCase();
  //     this.GetRchilliCandidateInbox(trimmedValue, this.SelectedResponseFilter);
  //   } else if (value.length === 0 && this.searchLoaded==true) {
  //     this.GetRchilliCandidateInbox(null, this.SelectedResponseFilter);
  //     this.searchLoaded=false;
  //   }
  // }

  onFilterChange(value: string) {debugger;
    if (!this.dataSource) {
      return;
    }
    if (value && value.length > 2) {  
      const trimmedValue = value.trim().toLowerCase();
      this.searchLoaded=true;
      this.SearchValue=trimmedValue;
      this.GetRequisitionsData();
    } else if (value.length === 0 && this.searchLoaded==true) {
      this.SearchValue=null;
      this.GetRequisitionsData();
      this.searchLoaded=false;
    }
    // if (value && value.length > 2){
    //   value = value.trim();
    //   value = value.toLowerCase();
    //   this.SearchValue=value;
    //   console.log(this.dataSource.data);
    //   //this.dataSource.filter = value;
    //   // Trigger a manual update of the table
    //  //this.dataSource._updateChangeSubscription(); // This line triggers the update
    //   //console.log(this.dataSource.filteredData);
    // }
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  toggleColumnChange(column,event){debugger;
   const filter_index = this.filtercolumns.findIndex(x=>x.label==column.label);
   if(filter_index!=-1){
    this.filtercolumns[filter_index].visible = !column.visible;
   }

  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  trackByfilterProperty<T>(index: number, column: FilterTableColumn<T>) {
    return column.filterName;
  }

  ViewRecord(row:Requisitions){
    this.dialog.open(EditRequisitionComponent, {
      data: { RequisitionId: row.RequisitionId,mode: "Edit Requisition"}, maxWidth: '95vw', width: '95vw', height: '90vh',disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
      }
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

  MapNewJob(row:Requisitions){
    this.dialog.open(AddJobComponent, {
      data: { RequisitionId: row.RequisitionId,model:'single',mode: "Add Job", Id: 0}, maxWidth: '95vw', width: '95vw', height: '90vh',disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        this.GetRequisitionsData();
      }
    });
  }

  MapExistingJob(row:Requisitions){
    this.dialog.open(ExistingJobsComponent, {
      data: {JobStatus:3,RequisitionId:row.RequisitionId,IsMappingJobs:false,model: 'single' }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        
      }
    });
  }

  ViewJobs(row:Requisitions){
    this.dialog.open(ExistingJobsComponent, {
      data: {JobStatus:3,RequisitionId:row.RequisitionId,IsMappingJobs:true,model: 'onlyjobs' }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        
      }
    });
  }

  ViewApplicants(row:Requisitions){
    this.IsRequistionTable = false;
    this.IsApplicantsView = true;
    this.selectedRequistionId = row.RequisitionId;
  }

  onBackClick() {debugger;
    this.IsRequistionTable = true;
    this.IsApplicantsView = false;
    this.selectedRequistionId = 0;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  MultiSelect_MapNewJob(){
    this.dialog.open(AddJobComponent, {
      data: { responses: this.selection.selected,model: 'multiple',RequisitionId: 0,mode: "Add Job", Id: 0}, maxWidth: '95vw', width: '95vw', height: '90vh',disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  MultiSelect_MapExistingJob(){
    this.dialog.open(ExistingJobsComponent, {
      data: {responses: this.selection.selected, model: 'multiple',JobStatus:3,RequisitionId:0,IsMappingJobs:false }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {debugger;
      if (response) {
        this.selection.clear();
      }
    });
  }

  CustomTableFilters(){
    this.GetRequisitionsData();
  }

  OnCordinatorchange(event) {
    if (event.target.value.length > 2) {
      this.CustomTableFilters();
    }
    else if (event.target.value.length == 0) {
      this.customCoordinatorModel = null;
      this.CustomTableFilters();
    }

  }

  OnPostingOnwerchange(event) {
    if (event.target.value.length > 2) {
      this.CustomTableFilters();
    }
    else if (event.target.value.length == 0) {
      this.customPostingOwnerModel = null;
      this.CustomTableFilters();
    }

  }

  onLabelChange(change: MatSelectChange,rowApplicant: Requisitions){debugger;
    var selectedStatus = change.value;
    this.currentRequisition.StatusName = selectedStatus.label;
    this.currentRequisition.Status = selectedStatus.value;
    const Psubmission = {
      RequisitionId: rowApplicant.RequisitionId,
      companyId: this.loginUser.Company.Id,
      ApplicantStatus: selectedStatus.value,
      UpdatedBy: this.loginUser.UserId
    };
    this.service.UpdateRequistionStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
            let applicantIndex = this.Requisitionslist.findIndex(x => x.RequisitionId == rowApplicant.RequisitionId);
            if (applicantIndex != -1) {
              this.Requisitionslist[applicantIndex].Status = selectedStatus.value;
              this.Requisitionslist[applicantIndex].StatusName = selectedStatus.label;
              this.Requisitionslist[applicantIndex].bgClass = selectedStatus.bgdisplay;

              if (!this.cdRef["distroyed"]) {
                this.cdRef.detectChanges();
              }
            }
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  SubmitExisting(row:Requisitions){
    this.dialog.open(AddCandidateToJobComponent, { maxWidth: '95vw', width: '95vw', height: '90vh', data: { jobID: 0, RequisitionId:row.RequisitionId } })
    .afterClosed().subscribe(result => {
      if (result) {
        let JobIndex = this.Requisitionslist.findIndex(x => x.RequisitionId == row.RequisitionId);
        if (JobIndex != -1) {
          this.Requisitionslist[JobIndex].SubmissionsCount = this.Requisitionslist[JobIndex].SubmissionsCount + 1;
        }
      }
    })
  }

  ViewSubmissions(row:Requisitions){
    this.dialog.open(ReqSubmissionsListComponent, {
      data: { requsitionId: row.RequisitionId,ViewHeader:true}, maxWidth: '95vw', width: '95vw', height: '90vh'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  createRequisition(){
    this.dialog.open(EditRequisitionComponent, {
      data: { RequisitionId: 0,mode: "Add Requisition"}, maxWidth: '95vw', width: '95vw', height: '90vh',disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }


  ExportToExcel() {
    this.ExportXLSXData = [];
    this.service.GetRequsitionsExport(this.loginUser.Company.Id).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        debugger;
        this.RequistionExportList = result.Data;
        this.RequistionExportList.forEach(element => {
          element.CreatedDate = TimeZoneService.getLocalDateTime_Date(element.CreatedDate, true);
          element.UpdatedDate = TimeZoneService.getLocalDateTime_Date(element.UpdatedDate, true);
          element.SubmittedDate = element.SubmittedDate!=null ? TimeZoneService.getLocalDateTime_Date(element.SubmittedDate, true): null;
        })
        this.excelService.reqsuition_exportToExcel(this.RequistionExportList, 'requistions_exported');
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }


}
