import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, ReplaySubject, merge } from 'rxjs';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { BenchCandidate } from '../../core/models/benchcandidate';
import { BenchCandidateSearch } from '../../core/models/benchcandidatesearch';
import { BenchPriorityLabels } from 'src/static-data/aio-table-data';
import { CandidateService } from '../../core/http/candidates.service';
import { MatSelectChange } from '@angular/material/select';
import { iconsFA } from 'src/static-data/icons-fa';
import { ViewResumeComponent } from '../../bench-candidates/view-resume/view-resume.component';
import { SelectItem } from '../../core/models/selectitem';
import { AccountTypes } from 'src/static-data/accounttypes';
import { ActivityLogCandidate } from '../../core/models/candidateActivityLog';
import { MatSidenav } from '@angular/material/sidenav';
import { TcCandidateAssignComponent } from '../candidate-assign/candidate-assign.component';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { IconService } from 'src/@shared/services/icon.service';  
import { TcCandidateDetailsComponent } from '../tc-candidate-details/tc-candidate-details.component';
import { CandidateAssignBenchComponent } from '../candidate-assign-bench/candidate-assign-bench.component';
import { CandidateReviewComponent } from '../candidate-review/candidate-review.component';
import { CandidateShareComponent } from '../candidate-share/candidate-share.component';
import { ConfirmDialogModel } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { CandidateStatus } from 'src/@shared/models/candidatestatus.model';
import { assign } from 'src/@shared/models/assign';
import { SubUsers } from '../../core/models/subusers';
import { debounceTime, distinct } from 'rxjs/operators';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';
import { MarketingDashboardService } from '../../core/http/marketingdashboard.service';
import { CandidateNotesComponent } from 'src/@shared/components/notes-components/candidate-notes/candidate-notes.component';

@UntilDestroy()
@Component({
  selector: 'cv-candidates-data-table',
  templateUrl: './candidates-data-table.component.html',
  styleUrls: ['./candidates-data-table.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms,
    scaleFadeIn400ms
  ],
  providers: [TimeZoneService, AccountTypes,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class CandidatesDataTableComponent implements OnInit {

  @Input('IsMarketing') IsMarketing:boolean;
  @Input('IsUnderTechScreen') IsUnderTechScreen:boolean;
  @Input('InputSrc') InputSrc:string;
  subject$: ReplaySubject<BenchCandidate[]> = new ReplaySubject<BenchCandidate[]>(1);
  data$: Observable<BenchCandidate[]> = this.subject$.asObservable();
  candidates: BenchCandidate[];
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  ActivityLogs: ActivityLogCandidate[];
  currentPage = 0;
  totalRows = 0;
  assignees: assign[] =[];
  benchSubUsers: SubUsers[];
  CandidateStausList: CandidateStatus[];
  selectedAssignee:string ="All";
  SelectedAssingValue:string=null;
  localDFW: boolean = false;
  searchLoaded:boolean=false;
  @ViewChild('activitylog', { static: true }) activitylog: MatSidenav;
  @Input()
  columns: TableColumn<BenchCandidate>[] = [
    // { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: false },
    { label: 'Source', property: 'Source', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Job Title', property: 'Title', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, cssClasses: ['font-medium',] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true, cssClasses: ['font-medium',] },
    { label: 'Location', property: 'Location', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Phone', property: 'PrimaryPhoneNumber', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Email', property: 'CandidateEmail', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Icons', property: 'contact', type: 'button', visible: false },
    { label: 'Resume', property: 'Resume', type: 'button', visible: true },
    { label: 'Exp (Yrs)', property: 'ExperienceYears', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Work Permit', property: 'WorkStatus', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Employment Type', property: 'EmploymentType', type: 'button', visible: false },
    { label: 'Recruiter', property: 'Assignees', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Manager', property: 'Managers', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Last Updated', property: 'LastUpdated', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'StatusName', type: 'button', visible: true },
    { label: 'Notes', property: 'Notes', type: 'button', visible: true },
    { label: 'ActivityLogs', property: 'ActivityLogs', type: 'button', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true },

  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<BenchCandidate>();
  selection = new SelectionModel<BenchCandidate>(true, []);
  searchCtrl = new FormControl();
  labels = BenchPriorityLabels;
  candidateName: string;
  selectedCandidateId: number;
  IsCandidateDetail: boolean = false;
  selectedCandidate: BenchCandidate;
  IsSubmissionsList: boolean = false;
  status_textClass: any = 'text-amber-contrast';
  status_bgClass: any = 'bg-amber';
  isLoadpage: boolean = false;
  filteredIcons: string;
  searchStatus:number;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  editPermission: any;
  DialogResponse: any;
  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource(this.candidates);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }


  public candidateFilters: BenchCandidateSearch = new BenchCandidateSearch();
  CandidateStatus: SelectItem[] = [];
  constructor(private dialog: MatDialog,
    private _service: CandidateService,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private accountTypes: AccountTypes,
    public iconService: IconService,
    private _mrktService: MarketingDashboardService,
    private permissionsService: NgxPermissionsService) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();

    this.CandidateStatus = this.accountTypes.CandidateStatus;
    this.ActivityLogs = [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setDataSourceAttributes();
  }

  _cannotesemitter = EmitterService.get("tsCanNotescnt");
  ngOnInit(): void {debugger;
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getCandiateStatusLabels();
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.LoadInitialCandidates(null);
      this.getBenchSubUsers();
    }

    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));


    this._cannotesemitter.subscribe(res => {
      let NotesItem = this.candidates.find(x => x.CandidateID == res);
      if (NotesItem != null)
        NotesItem.NotesCount += 1;

      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })
    this.editPermission = this.permissionsService.getPermission('ACTION_TC_CANDIDATES_EDIT');
  }

  getCandiateStatusLabels() {
    this._service.fetchCandidateStatus(this.loginUser.Company.Id)
      .subscribe(response => {
        this.CandidateStausList = response.Data;
      });
  }

  getBenchSubUsers() {
    this.assignees = [];
    this.assignees.push({name:'ALL',value:null,email:null,mapping:false});
    this._service.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId,email:null,mapping:false });
            });
        },
        error => {
          this._alertService.error(error);
        });
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    if (value && value.length > 2) {  
      this.searchLoaded=true;
      const trimmedValue = value.trim().toLowerCase();
      this.LoadInitialCandidates(trimmedValue);
    } else if (value.length === 0 && this.searchLoaded==true) {
      this.LoadInitialCandidates(null);
      this.searchLoaded=false;
    }
  }


  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

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

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  LoadInitialCandidates(SearchValue: string) {
    this.selection.clear();
    this.isLoadpage = true;
    this.isLoadpage = true;
    this.candidates = [];
    this.candidateFilters.CompanyId = this.loginUser.Company.Id;
    this.candidateFilters.EmployeeId = this.loginUser.UserId;
    this.candidateFilters.SearchByAssigned = this.SelectedAssingValue;
    this.candidateFilters.SearchByText = SearchValue;
    this.candidateFilters.SearchByStatus = this.searchStatus;
    this.candidateFilters.IsMarketing = this.IsMarketing;
    this.candidateFilters.IsUnderTechScreen = this.IsUnderTechScreen;
    this.candidateFilters.IslocalDFW = this.localDFW,
    this.candidateFilters.PageIndex = this.currentPage,
    this.candidateFilters.PageSize = this.pageSize
    this._service.SearchCandidates(this.candidateFilters).subscribe(result => {
      if (result.IsError == false && result.Data != null) {
        this.totalRows = result.TotalRecords;
        this.candidates = result.Data;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        this.candidates.forEach(element => {
          element.LastUpdated = TimeZoneService.getRangeBaseTimeDisplay(element.UpdatedDate, true);
        });

        this.dataSource.data = this.candidates;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadpage = false;
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
      else {
        this.isLoadpage = false;
        this.candidates = [];
        this.dataSource.data = this.candidates;
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }

    }, error => {
      this._alertService.error(error);
      this.isLoadpage = false;
    });
  }

  onLabelChange(change: MatSelectChange, row: BenchCandidate) {
    const index = this.candidates.findIndex(c => c === row);
    var selectedStatus = change.value;
    const Pcandidate = {
      CandidateId: row.CandidateID,
      CompanyId: this.loginUser.Company.Id,
      CandidateStatus: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId,
      CandidateAction:'CandidateStatus'

    };
    this._service.UpdateCandidateStatus(Pcandidate)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
            let applicantIndex = this.candidates.findIndex(x => x.CandidateID == row.CandidateID);
            if (applicantIndex != -1) {
              this.candidates[applicantIndex].Status = selectedStatus.StatusId;
              this.candidates[applicantIndex].StatusName = selectedStatus.StatusName;
              this.candidates[applicantIndex].bgClass = selectedStatus.bgclass;

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

  ViewResume(row: BenchCandidate) {
    if (row.ResumePathKey) {
      this.dialog.open(ViewResumeComponent, {
        data: row, width: '60%'
      }).afterClosed().subscribe(response => {

        if (response) {

        }
      });
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }

  downloadResume(candidate: BenchCandidate) {
    if (candidate.ResumePathKey) {
      this.dialog.open(ViewResumeComponent, { data: candidate, width: '60%' });
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }

  }

  ViewNotes(candidate: BenchCandidate) {
    this.dialog.open(CandidateNotesComponent, {
      data: { applicantId: 0, candidateId: candidate.CandidateID, inputsrc: 'tscandidates', Notesmode:'Dialog' }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  ViewLogs(candidate: BenchCandidate) {
    this.ActivityLogs = [];
    this.selectedCandidateId = candidate.CandidateID;
    this._service.GetCandidateActivityLog(candidate.CandidateID, this.loginUser.Company.Id)
      .subscribe(response => {
        if (response.IsError == false) {
          this.ActivityLogs = response.Data;
          this.ActivityLogs.forEach(
            log => {
              log.CreatedDate = TimeZoneService.getLocalDateTime(log.CreatedDate, true);
            }
          )
          this.activitylog.open();
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);
        });
  }

  OnActiviyLogclose() {
    this.activitylog.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  CreateCandidate(){
    this.dialog.open(TcCandidateDetailsComponent, {
      data: { candidateId:0,mode:'New',IsBench:false,src:'tccandidate' }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.LoadInitialCandidates(this.searchCtrl.value);
      }
    });
  }

  ViewCandidate(candidate: BenchCandidate) {
    var editPermission = this.permissionsService.getPermission('ACTION_TC_CANDIDATES_EDIT');
    if (editPermission) {
      this.dialog.open(TcCandidateDetailsComponent, {
        data: { candidateId: candidate.CandidateID,mode:'Edit',src:'tccandidate',IsBench:candidate.BenchCandidate,InputSrc:this.InputSrc}, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          this.LoadInitialCandidates(this.searchCtrl.value);
        }
      });
    }

  }

  AssignSalesRep(candidate: BenchCandidate) {
    this.dialog.open(CandidateAssignBenchComponent, {
      data: { headerText: 'Move to Bench', candidateId: candidate.CandidateID, inputsrc: 'candidates',ctrlLabel:'Select Sales Rep(s)' }, width: '60%', height: '60vh'
    }).afterClosed().subscribe(response => {
      if (response) {
        this.LoadInitialCandidates(this.searchCtrl.value);
      }
    });
  }

  AssignRecruiter(candidate: BenchCandidate) {
    this.dialog.open(TcCandidateAssignComponent, {
      data: { headerText: 'Assign Recruiter', candidateId: candidate.CandidateID, inputsrc: 'candidates',ctrlLabel:'Select Recruiter' }, width: '60%', height: '60vh'
    }).afterClosed().subscribe(response => {
      if (response) {
        this.LoadInitialCandidates(this.searchCtrl.value);
      }
    });
  }

  DeleteCandidate(candidate: BenchCandidate){
    const message = 'Candidate  <b><span class="displayEmail"> ' + candidate.FirstName + ' ' + candidate.LastName + ' </span></b> will be deleted from database ?'
    const dialogData = new ConfirmDialogModel("Delete Candidate", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.OnCofirmCandidateDelete(candidate);
      }
    });
  }

  OnCofirmCandidateDelete(candidate: BenchCandidate) {
    const candidateVM = {
      CandidateId: candidate.CandidateID,
      CompanyId: this.loginUser.Company.Id,
      UpdatedBy: this.loginUser.UserId
    }
    this._mrktService.DeleteCandidate(candidateVM).subscribe(result => {
      if (result.IsError == false) {
        this._alertService.success(result.SuccessMessage);
      }
      else {
        this._alertService.error(result.ErrorMessage);
      }

    }, error => {
      this._alertService.error(error);
    });

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }

  }

  OnCloseCandidateDetail(event) {
    this.IsCandidateDetail = false;
    this.LoadInitialCandidates(this.searchCtrl.value);
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  
  pageChanged(event: PageEvent) {
    this.selection.clear();
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.LoadInitialCandidates(this.searchCtrl.value);
  }

  SendForReview(candidate: BenchCandidate){
    this.dialog.open(CandidateReviewComponent, {
      data: { headerText: 'Send For Review', candidateId: candidate.CandidateID, inputsrc: 'candidates' }, maxWidth: '85vw', width: '85vw', height: '80vh'
    }).afterClosed().subscribe(response => {
      if (response) {
        this.LoadInitialCandidates(this.searchCtrl.value);
      }
    });
  }

  ShareCandidate(candidate: BenchCandidate){
    this.dialog.open(CandidateShareComponent, {
      data: { headerText: 'Send For Review', candidateId: candidate.CandidateID, inputsrc: 'candidates' }, width: '60%', height: '60vh'
    }).afterClosed().subscribe(response => {
      if (response) {
        this.LoadInitialCandidates(this.searchCtrl.value);
      }
    });
  }

  AssignForTechScreen(candidate: BenchCandidate){
    if(this.editPermission){
      const message = 'Candidate <b><span class="displayEmail"> ' + candidate.FirstName + ' ' + candidate.LastName + ' </span></b> status will be changed to Under Tech Screen ?'
      const dialogData = new ConfirmDialogModel("Tech Screen", message);
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '60%', height: '60vh',
        data: dialogData,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.DialogResponse = dialogResult;
        if (this.DialogResponse.Dialogaction == true) {
          const Psubmission = {
            CandidateID: candidate.CandidateID,
            CompanyId: this.loginUser.Company.Id,
            UpdatedBy: this.loginUser.UserId,
            CandidateStatus: 4, //Tech-screen
            IsUnderTechScreen:true,
            CandidateAction:'TechScreen'
          };
          this.UpdateCandidateStatus(Psubmission);
        }
      });
    }
  }

  AssignForMarketing(candidate: BenchCandidate){
    if(this.editPermission){
      const message = 'Candidate <b><span class="displayEmail"> ' + candidate.FirstName + ' ' + candidate.LastName + ' </span></b> status will be changed to Marketing ?'
      const dialogData = new ConfirmDialogModel("Marketing", message);
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '60%', height: '60vh',
        data: dialogData,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.DialogResponse = dialogResult;
        if (this.DialogResponse.Dialogaction == true) {
          const Psubmission = {
            CandidateID: candidate.CandidateID,
            CompanyId: this.loginUser.Company.Id,
            UpdatedBy: this.loginUser.UserId,
            IsMarketing:true,
            CandidateStatus: 5, //Marketing
            CandidateAction:'Markting'
          };
          this.UpdateCandidateStatus(Psubmission);
        }
      });
    }
  }

  UpdateCandidateStatus(ResponseStaus:any) {debugger;
    this._service.UpdateCandidateStatus(ResponseStaus)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
            this.LoadInitialCandidates(this.searchCtrl.value);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  filterByAssignee(selectedItem:assign){
    this.selection.clear();
    this.selectedAssignee=selectedItem.name;
    this.SelectedAssingValue = selectedItem.value;
    this.LoadInitialCandidates(this.searchCtrl.value);
  }

  LocalDFWStatus(event) {
    this.selection.clear();
    this.localDFW = event.checked;
    this.LoadInitialCandidates(this.searchCtrl.value);
  }

}
