import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import icSearch from '@iconify/icons-ic/twotone-search';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icAdd from '@iconify/icons-ic/twotone-add';
import icRemove_Circle_Outline from '@iconify/icons-ic/remove-circle-outline';
import delete_forever from '@iconify/icons-ic/twotone-delete';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginUser } from 'src/@shared/models';
import { Observable, ReplaySubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { JobCentralService } from   '../../core/http/job-central.service';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CandidateResumeViewComponent } from '../../JC-Common/candidate-resume-view/candidate-resume-view.component';
import icPerson from '@iconify/icons-ic/twotone-person';
import { ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import { iconsFA } from 'src/static-data/icons-fa';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { ApplicantAssignComponent } from '../../JC-Common/applicant-assign/applicant-assign.component';
import { ApplicantRecruiterMapping } from '../../core/model/applicantrecruitermapping';
import * as FileSaver from 'file-saver';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icShare from '@iconify/icons-ic/twotone-share';
import icRestore from '@iconify/icons-ic/twotone-restore';
import icratereview from '@iconify/icons-ic/twotone-rate-review';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icCancel from '@iconify/icons-ic/twotone-cancel';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import iclocationon from '@iconify/icons-ic/location-on';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icInsert_Drive_File from '@iconify/icons-ic/insert-drive-file';
import IcRefresh from '@iconify/icons-ic/refresh';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { NgxPermissionsService } from 'ngx-permissions';
import { ArchiveViewComponent } from '../archive-view/archive-view.component';
import { AssignMyselfComponent } from '../../JC-Common/assign-myself/assign-myself.component';
import { ArchiveAssignComponent } from '../archive-assign/archive-assign.component';
import { ArchiveShareComponent } from '../archive-share/archive-share.component';
import { debounceTime } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'cv-archived-responses',
  templateUrl: './archived-responses.component.html',
  styleUrls: ['./archived-responses.component.scss'],
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
export class ArchivedResponsesComponent implements OnInit {

  subject$: ReplaySubject<JobboardResponses[]> = new ReplaySubject<JobboardResponses[]>(1);
  data$: Observable<JobboardResponses[]> = this.subject$.asObservable();
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  icEye = icEye;
  icSearch = icSearch;
  icFilterList = icFilterList;
  icAdd = icAdd;
  delete_forever = delete_forever;
  icPerson = icPerson;
  icPersonAdd = icPersonAdd;
  confirmresult: string = '';
  DialogResponse: ConfirmDialogModelResponse;
  filteredIcons: string;
  icArrowDropDown = icArrowDropDown;
  icRemove_Circle_Outline=icRemove_Circle_Outline;
  icDownload=icDownload;
  icShare=icShare;
  applicantsMapping: ApplicantRecruiterMapping[] = [];
  icRestore = icRestore;
  icratereview = icratereview;
  icDelete=icDelete;
  icVisibility=icVisibility;
  icVisibilityOff=icVisibilityOff;
  iclocationon=iclocationon;
  icPhone=icPhone;
  icMail=icMail;
  icInsert_Drive_File=icInsert_Drive_File;
  IcRefresh=IcRefresh;
  LastLoadedDateTime:any;
  icCancel=icCancel;
  currentPage = 0;
  totalRows = 0;
  selectedRepresentative:string="All";
  SelectedRepValues: any = null;
  SelectedResponseFilter:any;
  localDFW:Boolean=false;
  editPermission: any;
  searchLoaded:boolean=false;
  @Input() InboxSource: number;
  @Input()
  columns: TableColumn<JobboardResponses>[] = [
    { label: 'Id', property: 'ApplicantId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Source', property: 'ApplicantSource', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Id', property: 'JobId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Email', property: 'Email', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Phone', property: 'Phno', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Work Autorization', property: 'WorkPermit', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Location', property: 'ApplicantLocation', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Icons', property: 'AttachedFileName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Resume', property: 'Resume', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Date Applied', property: 'CreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'Actions', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },

  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<JobboardResponses>();
  selection = new SelectionModel<JobboardResponses>(true, []);
  searchCtrl = new FormControl();
  @ViewChild(MatSort) sort: MatSort;

  paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  
  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  Rchilliinboxlist: JobboardResponses[] = [];
  constructor(private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private jobCentralService: JobCentralService,
    private permissionsService: NgxPermissionsService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.SelectedResponseFilter=0;
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      EmitterService.get("JobCentral").emit("JobCentral");
      this.GetRchilliCandidateInbox(null,this.SelectedResponseFilter);
    }
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
    this.editPermission = this.permissionsService.getPermission('ACTION_EDIT_ARCHIEVE_APPLICANTS');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  GetRchilliCandidateInbox(SearchValue:string,ApplicantFilter:number) {
    this.Rchilliinboxlist=[];
    this.dataSource=null;
    const appFilter = {
      companyId: this.loginUser.Company.Id,
      UserId: this.loginUser.UserId,
      Source: null,
      IsReviewFurther:false,
      InboxSource:this.InboxSource,
      PageIndex:this.currentPage,
      PageSize:this.pageSize,
      SearchText:SearchValue,
      ApplicantType:ApplicantFilter,
      RepresentType:this.SelectedRepValues,
      LocaltoDFW:this.localDFW,
    }
    this.jobCentralService.getArchvedResponses(appFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.totalRows = result.TotalRecords;
        this.Rchilliinboxlist = result.Data;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        this.LastLoadedDateTime = new Date();
        this.Rchilliinboxlist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
        })
        this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
        this.dataSource.paginator = this.paginator;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    if (value && value.length > 2) {  // No need to check for null or empty string separately
      const trimmedValue = value.trim().toLowerCase();
      this.searchLoaded=true;
      this.GetRchilliCandidateInbox(trimmedValue, this.SelectedResponseFilter);
    } else if (value.length === 0 && this.searchLoaded==true) {
      // If value is null, empty, or less than 3 characters, clear the filter
      this.GetRchilliCandidateInbox(null, this.SelectedResponseFilter);
      this.searchLoaded=false;
    }
  }
  
  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.paginator != undefined ? this.dataSource.paginator.pageSize : this.pageSize;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.connect().value.forEach(row => this.selection.select(row));
      //this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

 
  ViewResume(row: JobboardResponses) {
    if (row.AttachedFilePath) {
      this.dialog.open(CandidateResumeViewComponent, {
        data: row, width: '60%'
      }).afterClosed().subscribe(response => {
        if (response) {
          this.UpdateViewedStatus(this.loginUser.Company.Id, row.ResponseId);
          let applicantIndex = this.Rchilliinboxlist.findIndex(x => x.ResponseId == row.ResponseId);
          if (applicantIndex != -1) {
            this.Rchilliinboxlist[applicantIndex].IsCandidateViewed = true;
          }
        }
      });
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }

  }

  downloadResume(row: JobboardResponses) {
    if (row.AttachedFilePath) {
      this.jobCentralService.DownloadInboxResume(row.CompanyId, row.ResponseId)
        .subscribe(response => {
          let filename = row.AttachedFileName;
          FileSaver.saveAs(response, filename);
        }),
        error => {
          this._alertService.error("Error while downloading the file.");
        }
    }
    else
    {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }

  ViewApplicant(row: JobboardResponses) {
    if (this.editPermission) {
      this.dialog.open(ArchiveViewComponent, {
        data: { ResponseId: row.ArchiveId, Source: 'Archived' }, maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {
        if (response) {
          //this item is not available in main table.
          //this.UpdateViewedStatus(this.loginUser.Company.Id, row.ResponseId);
        }
      });
    }
  }

  

  UpdateViewedStatus(companyId: number, applicantId: number) {
    const viewdata={
      ApplicantId:applicantId,
      CompanyId:companyId,
      UpdatedBy:this.loginUser.UserId,
      Notes:null,
      ActionType:1,
      Action:"Viewed"
    }
    this.jobCentralService.UpdateApplicantViewed(viewdata).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      }
      else{
        let applicantIndex = this.Rchilliinboxlist.findIndex(x => x.ResponseId == applicantId);
        if (applicantIndex != -1) {
          this.Rchilliinboxlist[applicantIndex].IsCandidateViewed = true;
        }
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  
  OnAssignApplicants() {
    this.dialog.open(ApplicantAssignComponent, {
      data: this.selection.selected, width: '60%', height: '55vh', disableClose: true
    }).afterClosed().subscribe(response => {
      
      if (response) {
        this.selection.clear();
        this.GetRchilliCandidateInbox(this.searchCtrl.value,this.SelectedResponseFilter);
      }
    });
  }

  OnAssignMySelf() {
    if (this.selection.selected.length > 0) {
      this.selection.selected.forEach(element => {
        var applicant = new ApplicantRecruiterMapping();
        applicant.RecruiterId = this.loginUser.UserId;
        applicant.ApplicantId = element.ResponseId;
        applicant.MappingStatus = true;
        applicant.IsProcessed = false;
        applicant.MappingId = 0;
        applicant.ExpiryDate = null;
        applicant.CreatedDate = null;
        applicant.IsReviewFurther=false;
        this.applicantsMapping.push(applicant);
      });
      const applicants = {
        companyId: this.loginUser.Company.Id,
        applicantRecruiters: this.applicantsMapping,
        UpdateBy:this.loginUser.UserId
      }
      this.jobCentralService.AssignApplicants(applicants).subscribe(response => {
        if (!response.IsError) {
          this._alertService.success(response.SuccessMessage);
          this.GetRchilliCandidateInbox(this.searchCtrl.value,this.SelectedResponseFilter);
          this.selection.clear();
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      }, error => {
        this._alertService.error(error);
      })
    }
    else {
      this._alertService.error("Please select Recruiter");
    }

  }

  AssignApplcant(rowApplicant: JobboardResponses) {
    let rowdata=[];
    rowdata.push(rowApplicant);
    this.dialog.open(ArchiveAssignComponent, {
      data: { responses: rowdata, model: 'single', responseId: rowApplicant.ArchiveId },
      width: '60%', height: '55vh', disableClose: true
    }).afterClosed().subscribe(response => {
      
      if (response) {
        this.DeleteArcheiveApplicant(rowApplicant.CompanyId,rowApplicant.ArchiveId);
      }
    });
  }

 

  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'CreatedDate': return new Date(item.ActualDate);
         default: return item[property];
      }
    };
  }

 
  RefreshTableData(){
    this.GetRchilliCandidateInbox(this.searchCtrl.value,this.SelectedResponseFilter);
  }

  pageChanged(event: PageEvent){
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.GetRchilliCandidateInbox(this.searchCtrl.value,this.SelectedResponseFilter);
  }

  OnResponseToogle(eventValue:any){
    this.SelectedResponseFilter = eventValue;
    this.GetRchilliCandidateInbox(this.searchCtrl.value,this.SelectedResponseFilter);
  }

  ReviewApplcant(rowApplicant: JobboardResponses) {
    if (this.editPermission) {
      this.dialog.open(AssignMyselfComponent, {
        data: {resourceId:rowApplicant.ArchiveId,resourceType: 'Archeive'}, maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          this.DeleteArcheiveApplicant(rowApplicant.CompanyId,rowApplicant.ArchiveId);
        }
      });
    }
  }

  ShareApplcant(rowApplicant: JobboardResponses) {
    if (this.editPermission) {
      this.dialog.open(ArchiveShareComponent, {
        data: { resourceId: rowApplicant.ArchiveId, resourceType: 'Applicant' }, width: '60%', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          this.DeleteArcheiveApplicant(rowApplicant.CompanyId,rowApplicant.ArchiveId);
        }
      });
    }
  }

  DeleteArcheiveApplicant(CompanyId:number,ArcheiveId:number){
    this.jobCentralService.DeleteArchieveApplicant(CompanyId,ArcheiveId).subscribe(response => {
      if (!response.IsError) {
        this.RefreshTableData();
      }
      else {
        this._alertService.error(response.ErrorMessage);
      }
    }, error => {
      this._alertService.error(error);
    })
  }


}
