import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import { ApplicantInbox } from '../../core/model/applicantinbox';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginUser } from 'src/@shared/models';
import { Observable, ReplaySubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { JobCentralService } from '../../core/http/job-central.service';
import { CandidateResumeViewComponent } from '../../JC-Common/candidate-resume-view/candidate-resume-view.component';
import { iconsFA } from 'src/static-data/icons-fa';
import { ApplicantRecruiterMapping } from '../../core/model/applicantrecruitermapping';
import * as FileSaver from 'file-saver';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDialogNotesComponent } from 'src/@shared/components/filter-components/confirm-dialog-notes/confirm-dialog-notes.component';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { ApplicantStatusLabels } from 'src/static-data/aio-table-data';
import { MatSelectChange } from '@angular/material/select';
import { ResponseViewComponent } from '../response-view/response-view.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { debounceTime } from 'rxjs/operators';
import { IconService } from 'src/@shared/services/icon.service';  
import { ApplicantNotesComponent } from 'src/@shared/components/notes-components/applicant-notes/applicant-notes.component';

@UntilDestroy()
@Component({
  selector: 'cv-ignored-responses',
  templateUrl: './ignored-responses.component.html',
  styleUrls: ['./ignored-responses.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class IgnoredResponsesComponent implements OnInit {

  subject$: ReplaySubject<JobboardResponses[]> = new ReplaySubject<JobboardResponses[]>(1);
  data$: Observable<JobboardResponses[]> = this.subject$.asObservable();
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  filteredIcons: string;
  applicantsMapping: ApplicantRecruiterMapping[] = [];
  selectedAssignee: string = "All";
  SelectedAssingValue: string = null;
  DialogResponse: ConfirmDialogModelResponse;
  statusLabels = ApplicantStatusLabels;
  editPermission: any;
  searchLoaded:boolean=false;
  @Input()
  columns: TableColumn<JobboardResponses>[] = [
    // { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Source', property: 'ApplicantSource', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Id', property: 'JobId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true ,cssClasses: ['font-medium'] },
    { label: 'Applicant Email', property: 'Email', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Phone', property: 'Phno', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Location', property: 'ApplicantLocation', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Resume', property: 'Resume', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Work Permit', property: 'WorkPermit', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Employment Type', property: 'EmploymentType', type: 'button', visible: false },
    { label: 'Recruiter', property: 'Recruiter', type: 'button', visible: true },
    { label: 'Manager', property: 'Assignees', type: 'button', visible: false },
    { label: 'Viewed', property: 'ApplicantViews', type: 'button', visible: false },
    { label: 'Date Applied', property: 'CreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'ApplicantStatusName', type: 'button', visible: true },
    { label: 'Notes', property: 'Notes', type: 'button', visible: true },
    { label: 'Actions', property: 'Actions', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium', 'text-center'] },

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
    private _eventemitterservice: EventEmitterService,
    private permissionsService: NgxPermissionsService,
    public iconService: IconService) {
    this.dataSource = new MatTableDataSource();
  }

  _Ignorednotesemitter = EmitterService.get("IgnoredNotescnt");

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      EmitterService.get("JobCentral").emit("JobCentral");
      this.IgnoredResponses(null);
    }
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this._Ignorednotesemitter.subscribe(res => {
      let NotesItem = this.Rchilliinboxlist.find(x => x.ResponseId == res);
      if (NotesItem != null)
        NotesItem.NotesCount += 1;

      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })

    this._eventemitterservice.IgnoredResponsesEvent.subscribe(() => {
      this.IgnoredResponses(null);
    })

    this.editPermission = this.permissionsService.getPermission('ACTION_EDIT_APPLICANT');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  IgnoredResponses(SearchValue: string) {
    const appFilter = {
      companyId: this.loginUser.Company.Id,
      UserId: this.loginUser.UserId,
      AssigneeId: this.loginUser.UserId,
      Source: null,
      IsReviewFurther: false,
      SearchText:SearchValue,
    }
    this.jobCentralService.GetIgnoredResponses(appFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.Rchilliinboxlist = result.Data;
        this.Rchilliinboxlist.forEach(element => {
          element.AssignedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
        })
        if (this.SelectedAssingValue != null) {
          var filtereddata = this.Rchilliinboxlist.filter(x => x.AssignId == this.SelectedAssingValue);
          this.dataSource = new MatTableDataSource(filtereddata);
          this.dataSource.paginator = this.paginator;
        }
        else {
          this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
          this.dataSource.paginator = this.paginator;
        }
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
    if (value && value.length > 2) {  
      const trimmedValue = value.trim().toLowerCase();
      this.searchLoaded=true;
      this.IgnoredResponses(trimmedValue);
    } else if (value.length === 0 && this.searchLoaded==true) {
      this.IgnoredResponses(null);
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
    const numRows = this.dataSource.paginator != undefined ? this.dataSource.paginator.length : this.pageSize;
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

  ViewResume(row: ApplicantInbox) {
    if (row.DisplayFileName) {
      this.dialog.open(CandidateResumeViewComponent, {
        data: row, width: '60%'
      }).afterClosed().subscribe(response => {
        if (response) {
          this.UpdateViewedStatus(this.loginUser.Company.Id, row.CandidateInboxId);

        }
      });
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }

  }

  downloadResume(row: ApplicantInbox) {
    if (row.DisplayFileName) {
      this.jobCentralService.downloadApplicantResume(row.CompanyId, row.CandidateInboxId)
        .subscribe(response => {
          let filename = row.EmailAttachedFileName;
          FileSaver.saveAs(response, filename);
        },
          error => {
            this._alertService.error("Error while downloading the file.");
          })
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }

  UpdateViewedStatus(companyId: number, applicantId: number) {
    const viewdata = {
      ApplicantId: applicantId,
      CompanyId: companyId,
      UpdatedBy: this.loginUser.UserId,
      Notes: null,
      ActionType: 1,
      Action: "Viewed"
    }
    this.jobCentralService.UpdateApplicantViewed(viewdata).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      }
      else {
        this.IgnoredResponses(this.searchCtrl.value);
        // let applicantIndex = this.Rchilliinboxlist.findIndex(x => x.ResponseId == applicantId);
        // if (applicantIndex != -1) {
        //   this.Rchilliinboxlist[applicantIndex].IsCandidateViewed = true;
        // }
      }
    }, error => {
      this._alertService.error(error);
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

  BackToInbox(rowApplicant: JobboardResponses) {
    this.selection.clear();
    const message = 'Applicant ' + rowApplicant.FirstName + " " + rowApplicant.LastName + ' will be moved to Inbox? Please provide a reason.'
    const dialogData = new ConfirmDialogModel("Back To Inbox", message);
    const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmBackToInbox(rowApplicant, this.DialogResponse.Notes);
      }
    });
  }

  ConfirmBackToInbox(applicant: JobboardResponses, DeleteNotes: string) {
    if (applicant.ResponseId > 0) {
      const pfilters = {
        InboxId: applicant.ResponseId,
        applicantId: 0,
        companyId: this.loginUser.Company.Id,
        updatedby: this.loginUser.UserId,
        notes: DeleteNotes,
        RecruiterId: this.loginUser.UserId
      };
      this.jobCentralService.ApplicantBackToInbox(pfilters).subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success("Applicant Successfully Moved to Inbox");
          this.IgnoredResponses(this.searchCtrl.value);
        }
      },
        error => {
          this._alertService.error(error);
        })
    }
  }

  onLabelChange(change: MatSelectChange, row: JobboardResponses) {
    const index = this.Rchilliinboxlist.findIndex(c => c === row);
    var selectedStatus = change.value;
    this.Rchilliinboxlist[index].ApplicantStatusName = selectedStatus.text;
    this.Rchilliinboxlist[index].ApplicantStatus = selectedStatus.StatusId;
    const Psubmission = {
      ApplicantId: row.ResponseId,
      companyId: this.loginUser.Company.Id,
      ApplicantStatus: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId
    };
    this.jobCentralService.UpdateApplicantStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  ViewNotes(rowApplicant: JobboardResponses) {
    this.dialog.open(ApplicantNotesComponent, {
      data: { ResponseId: rowApplicant.ResponseId, candidateId: 0, inputsrc: 'Ignored',Notesmode:'Dialog' }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  ViewApplicant(row: JobboardResponses) {
    if (this.editPermission) {
      this.dialog.open(ResponseViewComponent, {
        data: { ResponseId: row.ResponseId, Source: 'Ignored' }, maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {
        /**
         * Customer is the updated customer (if the user pressed Save - otherwise it's null)
         */
        if (response) {
          this.UpdateViewedStatus(this.loginUser.Company.Id, row.ResponseId);
        }
      });
    }
  }



}
