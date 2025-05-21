import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import { iconsFA } from 'src/static-data/icons-fa';
import { JobCandidateService } from '../core/http/jobcandidate.service';
import { BenchCandidate } from '../core/model/benchcandidate';
import { BenchCandidateSearch } from '../core/model/benchsearchcandidate';
import iclocationon from '@iconify/icons-ic/location-on';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icSearch from '@iconify/icons-ic/twotone-search';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icAdd from '@iconify/icons-ic/twotone-add';
import icComment from '@iconify/icons-ic/twotone-comment';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { ShareApplicantComponent } from '../JC-Common/share-applicant/share-applicant.component';
import icShare from '@iconify/icons-ic/twotone-share';
import { AddCandidateComponent } from './add-candidate/add-candidate.component';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { EmitterService } from 'src/@cv/services/emitter.service';
import icInsert_Drive_File from '@iconify/icons-ic/insert-drive-file';
//import { ViewResumeComponent } from 'src/app-ats/talent-central/bench-candidates/view-resume/view-resume.component';
import { EditCandidateComponent } from './edit-candidate/edit-candidate.component';
import { CandidateAssignComponent } from './candidate-assign/candidate-assign.component';
import icratereview from '@iconify/icons-ic/twotone-rate-review';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { NgxPermissionsService } from 'ngx-permissions';
import { debounceTime } from 'rxjs/operators';
import { CandidateNotesComponent } from 'src/@shared/components/notes-components/candidate-notes/candidate-notes.component';

@UntilDestroy()
@Component({
  selector: 'cv-candidates-list',
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.scss'],
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
export class CandidatesListComponent implements OnInit {

  subject$: ReplaySubject<BenchCandidate[]> = new ReplaySubject<BenchCandidate[]>(1);
  data$: Observable<BenchCandidate[]> = this.subject$.asObservable();
  candidates: BenchCandidate[];
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  icInsert_Drive_File = icInsert_Drive_File;
  editPermission: any;
  @Input()
  columns: TableColumn<BenchCandidate>[] = [
    { label: 'Source', property: 'Source', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Job Title', property: 'Title', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Location', property: 'Location', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Phone', property: 'PrimaryPhoneNumber', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Email', property: 'Email', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Icons', property: 'contact', type: 'button', visible: false },
    { label: 'Resume', property: 'Resume', type: 'button', visible: true },
    { label: 'Exp (Yrs)', property: 'ExperienceYears', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Work Permit', property: 'WorkStatus', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Employment Type', property: 'EmploymentType', type: 'button', visible: false },
    { label: 'Recruiter', property: 'Recruiter', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Last Updated', property: 'LastUpdated', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'StatusName', type: 'button', visible: true },
    { label: 'Notes', property: 'Notes', type: 'button', visible: true  },
    { label: 'WorkActions', property: 'actions', type: 'button', visible: true },

  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<BenchCandidate>();
  selection = new SelectionModel<BenchCandidate>(true, []);
  searchCtrl = new FormControl();
  icArrowDropDown=icArrowDropDown;
  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  iclocationon = iclocationon;
  icPersonAdd = icPersonAdd;
  icDoneAll = icDoneAll;
  icEye = icEye;
  icShare = icShare;
  icComment = icComment;
  public candidateName: string;
  public selectedCandidateId: number;
  public selectedCandidate: BenchCandidate;
  public IsSubmissionsList: boolean = false;
  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';
  isLoadpage: boolean = false;
  filteredIcons: string;
  icratereview=icratereview;
  searchLoaded:boolean=false;
  SearchValue:string=null;
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
  DialogResponse: ConfirmDialogModelResponse;
  public candidateFilters: BenchCandidateSearch = new BenchCandidateSearch();
  constructor(private dialog: MatDialog,
    private _service: JobCandidateService,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private permissionsService: NgxPermissionsService,
    private _eventemitterservice: EventEmitterService) {
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  _cannotesemitter = EmitterService.get("CanNotescnt");
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      EmitterService.get("JobCentral").emit("JobCentral");
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.LoadCandidates();
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

    this.editPermission = this.permissionsService.getPermission('ACTION_EDIT_JC_CANDIDATES');
  }

  onFilterChange(value: string) {debugger;
    if (!this.dataSource) {
      return;
    }
    if (value && value.length > 2) {  
      const trimmedValue = value.trim().toLowerCase();
      this.searchLoaded=true;
      this.SearchValue=trimmedValue;
      this.LoadCandidates();
    } else if (value.length === 0 && this.searchLoaded==true) {
      this.SearchValue=null;
      this.LoadCandidates();
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
    const numRows = this.dataSource.paginator != undefined ? this.dataSource.paginator.pageSize : this.pageSize;//this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.connect().value.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  LoadCandidates() {
    this.isLoadpage = true;
    this.candidateFilters.CompanyId = this.loginUser.Company.Id;
    this.candidateFilters.EmployeeId = this.loginUser.UserId;
    this.candidateFilters.Module = 2;
    this.candidateFilters.SearchByText = this.SearchValue;
    this._service.getCandidates(this.candidateFilters).subscribe(result => {
      if (result.IsError == false && result.Data != null) {
        this.candidates = result.Data;
        this.candidates.forEach(element => {
          element.LastUpdated = TimeZoneService.getRangeBaseTimeDisplay(element.UpdatedDate, true);
        });

        this.dataSource.data = this.candidates;
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

  

  CreateCandidate() {
    this.dialog.open(AddCandidateComponent, {
      data: { applicantId: 0, candidateId: 0, jobID: 0, source: 'jobcentral' }, maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        this.LoadCandidates();
      }
    });
  }


  ViewCandidate(candidate: BenchCandidate) {
    if(this.editPermission){
      this.dialog.open(EditCandidateComponent, {
        data: { candidateId: candidate.CandidateID }, maxWidth:'95vw', width:'95vw',height:'90vh', disableClose: true
      }).afterClosed().subscribe(response => {
  
        if (response) {
          this.LoadCandidates();
        }
      });
    }
    
  }

  ShareCandidate(candidate: BenchCandidate) {
    if(this.editPermission){
    this.dialog.open(ShareApplicantComponent, {
      data: { resourceId: candidate.CandidateID, resourceType: 'Candidate' }, width: '60%',  disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }
  }

  AssignRecruiter(candidate: BenchCandidate){
    if(this.editPermission){
    this.dialog.open(CandidateAssignComponent, {
      data: { candidateId: candidate.CandidateID, resourceType: 'Recruiter' }, width: '60%', height: '52vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.LoadCandidates();
      }
    });
  }
  }

  AssignManager(candidate: BenchCandidate){
    if(this.editPermission){
    this.dialog.open(CandidateAssignComponent, {
      data: { candidateId: candidate.CandidateID, resourceType: 'Manager' }, width: '60%', height: '52vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.LoadCandidates();
      }
    });
  }
  }

  DeleteCandidate(candidate: BenchCandidate) {
    if(this.editPermission){
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
  }

  OnCofirmCandidateDelete(candidate: BenchCandidate) {
    const candidateVM = {
      CandidateId: candidate.CandidateID,
      CompanyId: this.loginUser.Company.Id,
      UpdatedBy: this.loginUser.UserId
    }
    this._service.DeleteCandidate(candidateVM).subscribe(result => {
      if (result.IsError == false) {
        this._alertService.success(result.SuccessMessage);
        this.LoadCandidates();
      }
      else {
        this._alertService.error(result.ErrorMessage);
      }

    }, error => {
      this._alertService.error(error);
      this.isLoadpage = false;
    });

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }

  }

  ViewNotes(candidate: BenchCandidate) {
    this.dialog.open(CandidateNotesComponent, {
      data: { applicantId: 0, candidateId: candidate.CandidateID, inputsrc: 'candidates',Notesmode:'Dialog' }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  ViewResume(row: BenchCandidate) {
    // if (row.ResumePathKey) {
    //   this.dialog.open(ViewResumeComponent, {
    //     data: row, width: '60%'
    //   }).afterClosed().subscribe(response => {

    //     if (response) {

    //     }
    //   });
    // }
    // else {
    //   this._alertService.error("Resume is  not available for this candidate.");
    // }
  }

  downloadResume(candidate: BenchCandidate) {
    // if (candidate.ResumePathKey) {
    //   this.dialog.open(ViewResumeComponent,{data:candidate,width:'60%'});
    // }
    // else
    // {
    //   this._alertService.error("Resume is  not available for this candidate.");
    // }

  }

}
