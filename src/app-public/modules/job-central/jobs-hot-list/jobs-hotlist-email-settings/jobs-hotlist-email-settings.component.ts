import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import { IconService } from 'src/@shared/services/icon.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { assign } from 'src/@shared/models/assign';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { JobCentralService } from '../../core/http/job-central.service';
import { merge, Observable } from 'rxjs';
import { distinct, map } from 'rxjs/operators';
import { COMMA, ENTER, } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { JobsHotListService } from '../../core/http/jobs-hotlist.service';
import { JobsWithRequisitionStatus } from '../../core/model/jobswithrequisition';
import { MatStepper } from '@angular/material/stepper';
import { ShareJobList } from '../../core/model/sharejoblist';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'cv-jobs-hotlist-email-settings',
  templateUrl: './jobs-hotlist-email-settings.component.html',
  styleUrls: ['./jobs-hotlist-email-settings.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class JobsHotlistEmailSettingsComponent implements OnInit {

  accountFormGroup: FormGroup;
  recepientsFormGroup: FormGroup;
  confirmFormGroup: FormGroup;

  ShareInfo: ShareJobList = new ShareJobList();
  customrecepients: string;
  Emailrecepients: string[] = [];
  filteredAssignees: Observable<any[]>;
  AssigneeCtrl = new FormControl();
  loginUser: LoginUser;
  assignees: assign[] = [];
  benchSubUsers: SubUsers[];
  SelectedAssigness: assign[] = [];
  addOnBlur: boolean = false;
  removable: boolean = true;
  assigneesremovable: boolean = true;
  assigneesselectable: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @ViewChild('AssigneeInput') AssigneeInput: ElementRef;
  @ViewChild('stepper') stepper: MatStepper;

  emailTemplate: string;
  isPreview:boolean=false;

  modules = {
    formula: false,
    toolbar: [      
    ['bold', 'italic', 'underline', 'strike'],
    ['code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }]
    ]
  };

  todo = [
    { id: 1, Label: 'JobId', Property: 'UniqueJobId' },
    { id: 2, Label: 'JobTitle', Property: 'JobTitle' },
    { id: 3, Label: 'Job Category', Property: 'JobCategoryName' },
    { id: 4, Label: 'Job Type', Property: 'JobTypeName' },
    { id: 5, Label: 'Location', Property: 'Location' },
    { id: 6, Label: 'WorkStatus', Property: 'WorkStatus' },
    { id: 7, Label: 'Duration', Property: 'DurationInMonths' },
    { id: 8, Label: 'Rate', Property: 'Rate' },
    { id: 9, Label: 'Experinece', Property: 'Experience' },
    { id: 10, Label: 'JobLink', Property: 'PublishedJobUrl' }
  ];

  selectedColumns = [];
  IsShowTable: boolean = false;

  //*table related*//
  JobsList: JobsWithRequisitionStatus[];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  @ViewChild(MatSort) sort: MatSort;
  paginator: MatPaginator;
  dataSource: any;
  columns: TableColumn<any>[]
  DataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(@Inject(MAT_DIALOG_DATA) public inputdata: any,
    private dialogRef: MatDialogRef<JobsHotlistEmailSettingsComponent>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public iconService: IconService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private jobCentralService: JobCentralService,
    private _jobhotlistService: JobsHotListService,
    private http: HttpClient,
    private domSanitizer: DomSanitizer
  ) {

    this.DataSource = new MatTableDataSource();
    this.accountFormGroup = this.fb.group({
      subject: [null, Validators.required],
      notes: [null, Validators.required],
    }, { validators: this.doneListNotEmptyValidator.bind(this) });

    this.recepientsFormGroup = this.fb.group({
      AssigneeCtrl: this.AssigneeCtrl,
      EmailRecp: [this.customrecepients]
    }, { validators: this.recepientValidator.bind(this) });

    this.confirmFormGroup = this.fb.group({

    });

  }

  // Custom validator to check if the "done" list is not empty
  doneListNotEmptyValidator(formGroup: FormGroup): ValidationErrors | null {
    return this.selectedColumns.length > 0 ? null : { doneListEmpty: true };
  }

  recepientValidator(formGroup: FormGroup): ValidationErrors | null {
    const assigneeCtrl = formGroup.get('AssigneeCtrl')?.value;
    const emailRecp = formGroup.get('EmailRecp')?.value;

    // Split the emails using comma or line breaks
    const emails = emailRecp ? emailRecp.split(/[\s,]+/) : [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern
    const invalidEmails = emails.filter(email => !emailRegex.test(email.trim()));

    if (this.SelectedAssigness.length > 0 || (emailRecp && emailRecp.trim() !== '')) {
      if (invalidEmails.length > 0) {
        return { invalidEmails: true }; // Return error if invalid emails are found
      }
      return null;
    }
    return { noRecepients: true };
  }

  ngOnInit() {

    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getBenchSubUsers();
      this.fetchData();
    }
    this.filteredAssignees = this.AssigneeCtrl.valueChanges.pipe(
      map((item: string | null) => item ? this._Assignfilter(item) : this.assignees.slice()));
  }

  private _Assignfilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.assignees.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }

  getBenchSubUsers() {
    this.assignees = [];
    this.jobCentralService.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail, mapping: false });
            });
        },
        error => {
          this._alertService.error(error);
        });
  }

  Assigneeselected(event: MatAutocompleteSelectedEvent): void {
    const newassing = new assign();
    newassing.name = event.option.viewValue;
    newassing.value = event.option.value;
    newassing.email = this.assignees.find(x => x.value == event.option.value).email;
    let exitem = this.SelectedAssigness.find(x => x.value == newassing.value);
    if (!exitem) {
      this.SelectedAssigness.push(newassing);
    }
    this.AssigneeInput.nativeElement.value = '';
    this.AssigneeCtrl.setValue(null);
  }

  assigneesremove(assigneeitem: any): void {
    const index = this.SelectedAssigness.indexOf(assigneeitem);
    if (index >= 0) {
      this.SelectedAssigness.splice(index, 1);
    }
  }

  submit() {
    debugger;
    this.ShareInfo.CompanyId = this.loginUser.Company.Id;
    this.ShareInfo.SharedBy = this.loginUser.UserId;
    this.ShareInfo.SharedByUserName = this.loginUser.FullName;
    this.ShareInfo.HotListId = this.inputdata.HotListId;
    this.ShareInfo.JobIds = this.JobsList.map(job => job.JobID).join(',');
    console.log(this.ShareInfo);
    this._jobhotlistService.ShareHotList(this.ShareInfo)
      .subscribe(
        response => {
          if (response.IsError == true) {
            this._alertService.error(response.ErrorMessage);
          }
          else {
            this._alertService.success(response.SuccessMessage);
            this.dialogRef.close(true);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    this.accountFormGroup.updateValueAndValidity();
  }


  PrepareAssigness() {
    this.Emailrecepients = [];

    if (this.SelectedAssigness && this.SelectedAssigness.length > 0) {
      this.SelectedAssigness.forEach(x => {
        this.Emailrecepients.push(x.email);
      })
    }

    if (this.customrecepients != null) {
      var recps = this.customrecepients.replace(/\r?\n/g, ",");
      var tmpList: string[] = [];
      tmpList = recps.split(",");
      if (tmpList.length > 0) {
        tmpList.forEach(x => {
          this.Emailrecepients.push(x);
        })
      }
    }

    this.ShareInfo.EmailRecepients = this.Emailrecepients;
    this.stepper.next();
  }

  fetchData() {
    const JobsFilter = {
      CompanyId: this.loginUser.Company.Id,
      ResourceId: this.inputdata.HotListId,
      DisplayMapingJobs: true,
      MultipleMode: false
    };

    const serviceCall = this._jobhotlistService.GetMappingJobsHotList(JobsFilter)

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
      }
      if (!this.cd["destroyed"]) {
        this.cd.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }


  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnChanges(...args: any[]) {

    this.DataSource = this.dataSource;
    this.DataSource.paginator = this.paginator;
    this.DataSource.sort = this.sort;
  }
  setDataSourceAttributes() {
    this.DataSource.paginator = this.paginator;
    this.DataSource.sort = this.sort;
  }
  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  sortData(sort: MatSort) {
    debugger;
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'SubmittedDate': return new Date(item.SubmittedDate);
        default: return item[property];
      }
    };
  }

  Submit_step1() {
    this.prepareDataTable();
  }

  Submit_step2() {
    this.PrepareHtmlBody();
    this.PrepareAssigness();
    this.FetchContent();
    //this.loadEmailTemplate();
  }

  FetchContent() {
    this.ShareInfo.CompanyId = this.loginUser.Company.Id;
    this.ShareInfo.SharedBy = this.loginUser.UserId;
    this.ShareInfo.SharedByUserName = this.loginUser.FullName;
    console.log(this.ShareInfo);
    this._jobhotlistService.FetchHtmlContent(this.ShareInfo)
      .subscribe(
        response => {
          if (response.IsError == true) {
            this._alertService.error(response.ErrorMessage);
          }
          else {
            this.emailTemplate = response.Data;
            this.isPreview=true;
            if (!this.cd["destroyed"]) {
              this.cd.detectChanges();
            }
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }


  prepareDataTable() {
    this.columns = [];
    this.dataSource = [];
    if (this.selectedColumns.length > 0) {
      this.selectedColumns.forEach(x => {
        const list = 'text-secondary,font-medium'.split(',');
        this.columns.push({ label: x.Label, property: x.Property, type: 'text', cssClasses: list, visible: true })
      });

      this.dataSource = this.JobsList;
      this.IsShowTable = true;
      this.stepper.next();
    }
    if (!this.cd["destroyed"]) {
      this.cd.detectChanges();
    }
  }

  PrepareHtmlBody() {
    let html = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    html += '<thead><tr>';

    // Set a minimum width for the headers
    this.columns.forEach(column => {
      html += `<th style="min-width: 100px; padding: 8px; text-align: left;">${column.label}</th>`;
    });

    html += '</tr></thead><tbody>';

    // Set a minimum width for the data cells
    this.dataSource.forEach(row => {
      html += '<tr>';
      this.columns.forEach(item => {
        if (item.property === 'PublishedJobUrl') {
          if (row[item.property]) {
            html += `<td style="min-width: 100px; padding: 8px;"><a href="${row[item.property]}" target="_blank">Apply</a></td>`;
          } else {
            html += '<td style="min-width: 100px; padding: 8px;">Not Specified</td>';
          }
        } else {
          html += `<td style="min-width: 100px; padding: 8px;">${row[item.property]}</td>`;
        }
      });
      html += '</tr>';
    });

    html += '</tbody></table>';

    this.ShareInfo.TableData = html;
  }


  get processedEmailTemplate(): SafeHtml  {
    return this.domSanitizer.bypassSecurityTrustHtml(this.emailTemplate); 
  }

 

 


}

