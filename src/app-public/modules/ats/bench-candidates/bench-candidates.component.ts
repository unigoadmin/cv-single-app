import { AfterViewInit, Component, Input, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { merge, Observable, ReplaySubject } from 'rxjs';
import { BenchCandidate } from '../core/models/benchcandidate'; 
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface'; 
import { BenchPriorityLabels } from '../../../../static-data/aio-table-data';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSelectChange } from '@angular/material/select';
import { BenchCandidateService } from './bench-candidates.service';
import { BenchCandidateSearch } from '../core/models/benchcandidatesearch';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { QuickSubmitComponent } from './quick-submit/quick-submit.component';
import { CandidateService } from '../core/http/candidates.service';
import { MarketingDashboardService } from '../core/http/marketingdashboard.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { ViewResumeComponent } from './view-resume/view-resume.component';
import { SubUsers } from '../core/models/subusers';
import { debounceTime, distinct } from 'rxjs/operators';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';
import { iconsFA } from '../../../../static-data/icons-fa';
import { ActivityLogCandidate } from '../core/models/candidateActivityLog';
import { TcCandidateAssignComponent } from '../candidates/candidate-assign/candidate-assign.component';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { IconService } from 'src/@shared/services/icon.service';
import { TcCandidateDetailsComponent } from '../candidates/tc-candidate-details/tc-candidate-details.component';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDialogNotesComponent } from 'src/@shared/components/filter-components/confirm-dialog-notes/confirm-dialog-notes.component';
import { CandidateShareComponent } from '../candidates/candidate-share/candidate-share.component';
import { CandidateNotesComponent } from 'src/@shared/components/notes-components/candidate-notes/candidate-notes.component';


@UntilDestroy()
@Component({
  selector: 'cv-bench-candidates',
  templateUrl: './bench-candidates.component.html',
  styleUrls: ['./bench-candidates.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms,
    scaleFadeIn400ms
  ],
  providers: [BenchCandidateService, TimeZoneService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class BenchCandidatesComponent implements OnInit, AfterViewInit {

  subject$: ReplaySubject<BenchCandidate[]> = new ReplaySubject<BenchCandidate[]>(1);
  data$: Observable<BenchCandidate[]> = this.subject$.asObservable();
  candidates: BenchCandidate[];
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  filteredIcons: string;
  DialogResponse: ConfirmDialogModelResponse;
  searchLoaded: boolean = false;
  isLoadpage: boolean = false;
  @Input()
  columns: TableColumn<BenchCandidate>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, cssClasses: ['font-medium',] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true, cssClasses: ['font-medium',] },
    { label: 'Title', property: 'Title', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Phone', property: 'PrimaryPhoneNumber', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Email', property: 'CandidateEmail', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Icons', property: 'contact', type: 'button', visible: true },
    { label: 'Location', property: 'Location', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Exp (Yrs)', property: 'ExperienceYears', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Work Permit', property: 'WorkStatus', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Submissions ', property: 'SubmissionsCount', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Sales Rep(s)', property: 'Assignees', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Bench Priority', property: 'labels', type: 'button', visible: true },
    { label: 'CreatedDate', property: 'BenchCreatedDate', type: 'text', visible: false },
    { label: 'Notes', property: 'Notes', type: 'button', visible: true },
    { label: 'ActivityLogs', property: 'ActivityLogs', type: 'button', visible: true },
    { label: 'Actions', property: 'Actions', type: 'button', visible: true },

  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<BenchCandidate>();
  selection = new SelectionModel<BenchCandidate>(true, []);
  searchCtrl = new FormControl();

  labels = BenchPriorityLabels;
  currentPage = 0;
  totalRows = 0;
  public candidateName: string;
  public selectedCandidateId: number;
  public IsCandidateDetail: boolean = false;
  public selectedCandidate: BenchCandidate;
  public IsSubmissionsList: boolean = false;
  public selectedAssignee: string = "All";
  public SelectedAssingValue: string = null;
  public assignees: assign[] = [];
  public benchSubUsers: SubUsers[];
  assignicons: any[] = [];
  ActivityLogs: ActivityLogCandidate[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('activitylog', { static: true }) activitylog: MatSidenav;
  
  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource(this.candidates);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  @ViewChild('quickpanel', { static: true }) quickpanel: MatSidenav;

  public candidateFilters: BenchCandidateSearch = new BenchCandidateSearch();

  constructor(private dialog: MatDialog,
    private _service: BenchCandidateService,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _canservice: CandidateService,
    private _mktService: MarketingDashboardService,
    private permissionsService: NgxPermissionsService,
    public iconService: IconService,
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();
    //this.PrioirtyCandidate=new BenchCandidate();
    this.ActivityLogs = [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setDataSourceAttributes();
  }


  getData(SearchValue: string) {
    this.selection.clear();
    this.isLoadpage = true;
    this.candidates = [];
    this.dataSource = new MatTableDataSource();
    this.candidateFilters.CompanyId = this.loginUser.Company.Id;
    this.candidateFilters.EmployeeId = this.loginUser.UserId;
    this.candidateFilters.SearchByAssigned = this.SelectedAssingValue;
    this.candidateFilters.SearchByText = SearchValue;
    this.candidateFilters.PageIndex = this.currentPage,
    this.candidateFilters.PageSize = this.pageSize;
    this._service.GetAllBenchCandidates(this.candidateFilters).subscribe(result => {
      if (result.IsError == false && result.Data != null) {
        this.totalRows = result.TotalRecords;
        this.candidates = result.Data;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        this.candidates.forEach(element => {
          element.BenchCreatedDate = TimeZoneService.getLocalDateTime_Date(element.BenchCreatedDate, true);
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
  _cannotesemitter = EmitterService.get("BenchCanNotescnt");
  ngOnInit() {debugger;
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.getData(null);
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
  }

  createBenchCandidate() {
    this.selection.clear();
    this.dialog.open(TcCandidateDetailsComponent, {
      data: { candidateId: 0, mode: 'New', IsBench: true,src:'tcbench' }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.getData(this.searchCtrl.value);
      }
    });
  }

  updateCustomer(candidate: BenchCandidate) {
    var editPermission = this.permissionsService.getPermission('ACTION_BENCH_CANDIDATES_MODIFY');
    if (editPermission) {
      this.dialog.open(TcCandidateDetailsComponent, {
        data: { candidateId: candidate.CandidateID, mode: 'Edit', IsBench: true,src:'tcbench' }, maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          this.getData(this.searchCtrl.value);
        }
      });

      this.selectedCandidateId = candidate.CandidateID;
      //clear if any selection items.
      this.selection.clear();
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }

  }


  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    if (value && value.length > 2) {
      this.searchLoaded = true;
      const trimmedValue = value.trim().toLowerCase();
      this.getData(trimmedValue);
    } else if (value.length === 0 && this.searchLoaded == true) {
      this.getData(null);
      this.searchLoaded = false;
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

  onLabelChange(change: MatSelectChange, row: BenchCandidate) {
    const index = this.candidates.findIndex(c => c === row);
    //this.customers[index].labels = change.value;
    this.candidates[index].labels = [];
    this.candidates[index].labels.push(change.value);
    this.subject$.next(this.candidates);
    const Pcandidate = {
      CandidateID: row.CandidateID,
      CompanyId: this.loginUser.Company.Id,
      BenchPriority: change.value.text,
      UpdatedBy: this.loginUser.UserId
    };
    this._service.UpdateCandidatePriority(Pcandidate)
      .subscribe(
        response => {
          this._alertService.success("Candidate Priority has been updated");
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  ViewSubmissions(candidate: BenchCandidate) {
    this.IsCandidateDetail = false;
    this.selectedCandidateId = candidate.CandidateID;
    this.candidateName = candidate.FirstName + " " + candidate.LastName;
    this.quickpanel.open();
  }

  CloseQuickpopup(event) {
    this.IsSubmissionsList = false;
    this.quickpanel.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  OnCloseCandidateDetail(event) {
    this.IsCandidateDetail = false;
    this.selection.clear();
    this.getData(this.searchCtrl.value);
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  OnRadioChange(event) {
    //console.log(event);
  }

  SubmitJob(candidate: BenchCandidate){
    this.dialog.open(QuickSubmitComponent, {
      data: { candidateId: candidate.CandidateID, submissionId: 0, srcmode: 'new' }, width: '80%', panelClass: "dialog-class", disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        this.selection.clear();
        this.getData(this.searchCtrl.value);
      }
    });
  }

  OnOpenQuickSubmit() {
    this.dialog.open(QuickSubmitComponent, {
      data: { candidateId: this.selection.selected[0].CandidateID, submissionId: 0, srcmode: 'new' }, width: '80%', panelClass: "dialog-class", disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        this.selection.clear();
        this.getData(this.searchCtrl.value);
      }
    });
  }

  OnConfirmRemoveBenchMultiple(Notes:string) {
    if (this.selection.hasValue) {
      const BenchCandidates = {
        CandidateId: 0,
        Benchpriority: null,
        Assigness: null,
        UpdatedBy: this.loginUser.UserId,
        CompanyId: this.loginUser.Company.Id,
        Candidates: this.selection.selected.map(({ CandidateID }) => CandidateID),
        Notes:Notes,
        StatusId:11
      }
      this._canservice.RemoveFromBenchMultiple(BenchCandidates).subscribe(result => {
        if (result.IsError == false) {
          this._alertService.success(result.SuccessMessage);
          this.selection.clear();
          this.getData(this.searchCtrl.value);
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        }
        else {
          this._alertService.error(result.ErrorMessage);
        }

      });
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

  getBenchSubUsers() {
    this.assignees = [];
    this.assignees.push({ name: 'ALL', value: null });
    this._service.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          debugger;
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId });
            });
        },
        error => {
          this._alertService.error(error);
        });
  }

  filterByAssignee(selectedItem: assign) {
    this.selection.clear();
    this.selectedAssignee = selectedItem.name;
    this.SelectedAssingValue = selectedItem.value;
    this.getData(this.searchCtrl.value);
  }

  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'labels': return (item.BenchPriorityOrder);
        default: return item[property];
      }
    };
  }

  ViewNotes(candidate: BenchCandidate) {
    this.dialog.open(CandidateNotesComponent, {
      data: { applicantId: 0, candidateId: candidate.CandidateID, inputsrc: 'benchcandidates',Notesmode:'Dialog' }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  ViewLogs(candidate: BenchCandidate) {
    this.ActivityLogs = [];
    this.selectedCandidateId = candidate.CandidateID;
    this._canservice.GetCandidateActivityLog(candidate.CandidateID, this.loginUser.Company.Id)
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

  AssignSalesRep(candidate: BenchCandidate) {
    if (this.selection.hasValue) {
      this.selection.clear();
    }
    this.dialog.open(TcCandidateAssignComponent, {
      data: { headerText: 'Assign to Sales Rep(s)', candidateId: candidate.CandidateID, inputsrc: 'bench', ctrlLabel: 'Select Sales Rep(s)' }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
        this.getData(this.searchCtrl.value);
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    });
  }

  
  MultipleRemoveBenchConfirmation() {
    if (this.selection.hasValue) {
      const message = 'Selected ' + this.selection.selected.length + ' Candidate(s)  will be deleted from bench ?'
      const dialogData = new ConfirmDialogModel("Remove Bench", message);
      const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
        width: '60%',
        data: dialogData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        this.DialogResponse = dialogResult;
        if (this.DialogResponse.Dialogaction == true) {
          this.OnConfirmRemoveBenchMultiple(this.DialogResponse.Notes);
        }
      });
    }
  }

  RemoveBenchConfirmation(candidate: BenchCandidate) {
    const message = 'Candidate  <b><span class="displayEmail"> ' + candidate.FirstName + ' ' + candidate.LastName + ' </span></b> will be deleted from bench ?'
    const dialogData = new ConfirmDialogModel("Remove Bench", message);
    const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.OnConfirmRemoveFromBench(candidate,this.DialogResponse.Notes);
      }
    });
  }

  OnConfirmRemoveFromBench(candidate: BenchCandidate,Notes:string) {
    debugger;
    if (this.selection.hasValue) {
      this.selection.clear();
    }
    const BenchCandidates = {
      CandidateId: candidate.CandidateID,
      Benchpriority: null,
      Assigness: null,
      UpdatedBy: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id,
      Notes:Notes,
      StatusId:11
    }
    this._canservice.RemoveFromBench(BenchCandidates).subscribe(result => {
      if (result.IsError == false) {
        this._alertService.success(result.SuccessMessage);
        this.selection.clear();
        this.getData(this.searchCtrl.value);
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
      else {
        this._alertService.error(result.ErrorMessage);
      }

    });
  }

  pageChanged(event: PageEvent) {
    this.selection.clear();
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getData(this.searchCtrl.value);
  }

  ShareCandidate(candidate: BenchCandidate){
    this.dialog.open(CandidateShareComponent, {
      data: { headerText: 'Send For Review', candidateId: candidate.CandidateID, inputsrc: 'candidates' }, width: '60%', height: '60vh'
    }).afterClosed().subscribe(response => {
      if (response) {
        this.getData(this.searchCtrl.value);
      }
    });
  }


}

export class assign {
  value: string;
  name: string;
  constructor() {
    this.value = null;
    this.name = null;
  }
}
