import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { JobCentralService } from '../../core/http/job-central.service';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icClose from '@iconify/icons-ic/twotone-close';
import icInsert_Drive_File from '@iconify/icons-ic/insert-drive-file';
import iclocationon from '@iconify/icons-ic/location-on';
import { CandidateResumeViewComponent } from '../../JC-Common/candidate-resume-view/candidate-resume-view.component';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ResponseViewComponent } from '../response-view/response-view.component';
import icComment from '@iconify/icons-ic/twotone-comment';
import { ApplicantNotesComponent } from 'src/@shared/components/notes-components/applicant-notes/applicant-notes.component';
@Component({
  selector: 'cv-duplicate-responses',
  templateUrl: './duplicate-responses.component.html',
  styleUrls: ['./duplicate-responses.component.scss'],
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
export class DuplicateResponsesComponent implements OnInit {
  
  loginUser: LoginUser;
  Responseslist: JobboardResponses[] = [];
  dataSource = new MatTableDataSource<JobboardResponses>();
  icClose=icClose;
  icFilterList=icFilterList;
  icInsert_Drive_File=icInsert_Drive_File;
  iclocationon=iclocationon;
  icComment=icComment;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  @ViewChild(MatSort) sort: MatSort;
  paginator: MatPaginator;
  editPermission: any;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if(mp != undefined){
      this.paginator = mp;
      this.setDataSourceAttributes();
    }
    
  }

  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource( this.Responseslist);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdRef.detectChanges();
  }
  @Input()
  columns: TableColumn<JobboardResponses>[] = [
    { label: 'Source', property: 'ApplicantSource', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Id', property: 'JobId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true },
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
    { label: 'Notes', property: 'Notes', type: 'button', visible: true }

  ];
  constructor(@Inject(MAT_DIALOG_DATA) public defInput: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DuplicateResponsesComponent>,
    private _authService: AuthenticationService,
    private jobCentralService: JobCentralService,
    private cdRef: ChangeDetectorRef,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser){
      this.GetDuplicateResponses(this.defInput.ResponseId,this.defInput.Email,this.defInput.FirstName,this.defInput.LastName);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  GetDuplicateResponses(ResponseId:number,Email:string,FirstName:string,LastName:string) {
    this.Responseslist = [];
    this.dataSource = null;
    const appFilter = {
      ReponseId:ResponseId,
      Email:Email,
      FirstName:FirstName,
      LastName:LastName,
      companyId: this.loginUser.Company.Id
    }
    this.jobCentralService.GetDuplicateResponses(appFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.Responseslist = result.Data;
        this.Responseslist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
        })
        this.dataSource = new MatTableDataSource(this.Responseslist);
        
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  viewClose() {
    this.dialogRef.close(0);
  }

  ViewResume(row: JobboardResponses) {
    if (row.ActualFileName) {
      this.dialog.open(CandidateResumeViewComponent, {
        data: row, width: '60%'
      }).afterClosed().subscribe(response => {
        if (response == 0) {

        }
      });
    }
    else {
      this._alertService.error("Resume is  not available for this applicant.");
    }

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

  ViewApplicant(row: JobboardResponses) {
    if (this.editPermission) {
      this.dialog.open(ResponseViewComponent, {
        data: { ResponseId: row.ResponseId, Source: 'Ignored' }, maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {
        /**
         * Customer is the updated customer (if the user pressed Save - otherwise it's null)
         */
        if (response) {
          
        }
      });
    }
  }

  ViewNotes(rowApplicant: JobboardResponses) {
    this.dialog.open(ApplicantNotesComponent, {
      data: { ResponseId: rowApplicant.ResponseId, candidateId: 0, inputsrc: 'Ignored',Notesmode:'Dialog' }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

 

}
