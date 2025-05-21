import { ChangeDetectorRef, Component, Input,Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import { RequisitionSubmissionList } from '../../core/model/reqsubmissionslist';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { RequisitionService } from '../../core/http/requisitions.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { AccountTypes } from 'src/static-data/accounttypes';
import { MatSelectChange } from '@angular/material/select';
import { IconService } from 'src/@shared/services/icon.service';  
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'cv-req-submissions-list',
  templateUrl: './submissions-list.component.html',
  styleUrls: ['./submissions-list.component.scss'],
  providers:[TimeZoneService,AccountTypes],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class ReqSubmissionsListComponent implements OnInit {
  @Input('RequisitionId') RequisitionId = 0;
  @Input('ViewHeader') ViewHeader:Boolean=false;
  loginUser: LoginUser;
  searchCtrl = new FormControl();
  SelectedRequisitionId:number;DisplayHeader:Boolean;
  SelectedApplicantId:number;
  Submissonslist: RequisitionSubmissionList[] = [];
  SubmssionStausList: any[];
  SelectedSubmission:RequisitionSubmissionList = new RequisitionSubmissionList();
  IsTableView:boolean=true;
  IsDetailView:boolean=false;
  @Input()
  columns: TableColumn<RequisitionSubmissionList>[] = [
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Submission Rate', property: 'BillRate', type: 'text', visible: true },
    { label: 'Status', property: 'SubmissionStatus', type: 'button', visible: true },
    { label: 'Submitted', property: 'SubmittedDate', type: 'text', visible: true },
  ]
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<RequisitionSubmissionList>();
  @ViewChild(MatSort) sort: MatSort;
  paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource(this.Submissonslist);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: { requsitionId: number,ViewHeader:boolean },
    private cdRef: ChangeDetectorRef,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private service: RequisitionService,
    public iconService: IconService,
    private accountTypes: AccountTypes) {
      this.dataSource = new MatTableDataSource();
      this.SubmssionStausList = this.accountTypes.RequisitionSubmissionStatusList;
     }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.SelectedRequisitionId = this.RequisitionId || (this.dialogData ? this.dialogData.requsitionId : 0);
      this.DisplayHeader = this.ViewHeader || (this.dialogData ? this.dialogData.ViewHeader : false);
      if(this.SelectedRequisitionId > 0){
        this.GetRequisitionSubmissions();
      }
    }

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  GetRequisitionSubmissions() {
    this.Submissonslist = [];
    this.dataSource = null;
    this.service.GetRequisitionSubmissionsList(this.loginUser.Company.Id,this.SelectedRequisitionId).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {debugger;
        this.Submissonslist = result.Data;
        this.Submissonslist.forEach(element => {
          element.SubmittedDate = element.SubmittedDate!=null ? TimeZoneService.getRangeBaseTimeDisplay(element.SubmittedDate, true): null;
        })
        this.dataSource.data = this.Submissonslist;
        this.dataSource = new MatTableDataSource(this.Submissonslist);
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange,rowApplicant: RequisitionSubmissionList){debugger;
    var selectedStatus = change.value;
    this.SelectedSubmission.SubmissionStatusName = selectedStatus.label;
    this.SelectedSubmission.SubmissionStatus = selectedStatus.value;
    const Psubmission = {
      SubmissionId: rowApplicant.SubmissionId,
      companyId: this.loginUser.Company.Id,
      SubmissionStatus: selectedStatus.value,
      UpdatedBy: this.loginUser.UserId
    };
    this.service.UpdateSubmissionStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
            let applicantIndex = this.Submissonslist.findIndex(x => x.SubmissionId == rowApplicant.SubmissionId);
            if (applicantIndex != -1) {
              this.Submissonslist[applicantIndex].SubmissionStatus = selectedStatus.value;
              this.Submissonslist[applicantIndex].SubmissionStatusName = selectedStatus.label;
              this.Submissonslist[applicantIndex].bgclass = selectedStatus.bgdisplay;

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

  ViewApplicant(row:RequisitionSubmissionList){
    this.SelectedApplicantId = row.ResponseId;
    this.IsTableView=false;
    this.IsDetailView=true;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  OnBackToList(){
    this.IsTableView=true;
    this.IsDetailView=false;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

}
