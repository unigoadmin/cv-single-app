import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import icSearch from '@iconify/icons-ic/twotone-search';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable, ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { PlacementService } from '../../core/http/placement.service';
import { CandidateMaster } from '../../core/models/candidatemaster';
import { CandidateSearch } from '../../core/models/candidateSearch';
import iclocationon from '@iconify/icons-ic/location-on';
import icClose from '@iconify/icons-ic/twotone-close';


@UntilDestroy()
@Component({
  selector: 'cv-search-candidate',
  templateUrl: './search-candidate.component.html',
  styleUrls: ['./search-candidate.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [ TimeZoneService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class SearchCandidateComponent implements OnInit {
  
  subject$: ReplaySubject<CandidateMaster[]> = new ReplaySubject<CandidateMaster[]>(1);
  data$: Observable<CandidateMaster[]> = this.subject$.asObservable();
  candidates: CandidateMaster[];
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  iclocationon=iclocationon;
  icClose=icClose;
  @Input()
  columns: TableColumn<CandidateMaster>[] = [
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, cssClasses: ['font-medium', ] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true, cssClasses: ['font-medium', ] },
    { label: 'Title', property: 'Title', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', ] },
    { label: 'Phone', property: 'PrimaryPhoneNumber', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Email', property: 'CandidateEmail', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Location', property: 'Location', type: 'button', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Exp (Yrs)', property: 'ExperienceYears', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Work Permit', property: 'WorkStatus', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Work Permit Expiry', property: 'tmp_WorkStatusExpiry', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status',property: 'Status', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium', 'textcgs']},

  ];
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<CandidateMaster>();
  selection = new SelectionModel<CandidateMaster>(true, []);
  searchCtrl = new FormControl();
  icSearch = icSearch;
  isLoadpage:boolean=false;
  public candidateFilters: CandidateSearch = new CandidateSearch();
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
  constructor(private dialog: MatDialog,
    private dialogRef: MatDialogRef<SearchCandidateComponent>,
    private _service: PlacementService,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef) { }

    get visibleColumns() {
      return this.columns.filter(column => column.visible).map(column => column.property);
    }

    trackByProperty<T>(index: number, column: TableColumn<T>) {
      return column.property;
    }

    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    ngOnInit(): void {
      this.loginUser = this._authService.getLoginUser();
      if (this.loginUser) {
      }
      
    }

  SearchCandidates() {
    this.selection.clear();
    if (this.searchCtrl.value!=null && this.searchCtrl.value!="") {
      this.isLoadpage = true;
      this.candidateFilters.CompanyId = this.loginUser.Company.Id;
      this.candidateFilters.EmployeeId = this.loginUser.UserId;
      this.candidateFilters.SearchByText = this.searchCtrl.value;
      this._service.SearchCandidates(this.candidateFilters).subscribe(result => {
        if (result.IsError == false && result.Data != null) {
          this.candidates = result.Data;
          this.candidates.forEach(element => {
            element.tmp_WorkStatusExpiry = TimeZoneService.getLocalDateTime_Date(element.WorkStatusExpiry, false);
            element.UpdatedDate = TimeZoneService.getRelativeTime(element.UpdatedDate, true);
          });

          this.dataSource.data = this.candidates;
          this.isLoadpage=false;
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        }
        else {
          this.isLoadpage=false;
          this.candidates = [];
          this.dataSource.data = this.candidates;
          this._alertService.error(result.ErrorMessage);
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        }

      }, error => {
        this._alertService.error(error);
        this.isLoadpage = false;
      });
    }
    else {
      this.candidates = [];
      this.dataSource.data = this.candidates;
      this._alertService.error("Please enter search keyword");
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }

  }

  SelectCandidate(row:CandidateMaster){
    this.dialogRef.close(row);
  }

}
