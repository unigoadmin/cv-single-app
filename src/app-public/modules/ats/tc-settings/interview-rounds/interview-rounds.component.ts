import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { LoginUser } from 'src/@shared/models';
import { IconService } from 'src/@shared/services/icon.service';
import { Observable, ReplaySubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { iconsFA } from 'src/static-data/icons-fa';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { AccountTypes } from 'src/static-data/accounttypes';
import { GlobalSettingsService } from 'src/@shared/http/globalsettings.service'; 
import { InterviewRounds } from '../../core/models/interviewrounds';

@UntilDestroy()
@Component({
  selector: 'cv-interview-rounds',
  templateUrl: './interview-rounds.component.html',
  styleUrls: ['./interview-rounds.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers:[AccountTypes]
})
export class InterviewRoundsComponent implements OnInit,OnChanges {

  loginUser: LoginUser;
  subject$: ReplaySubject<InterviewRounds[]> = new ReplaySubject<InterviewRounds[]>(1);
  data$: Observable<InterviewRounds[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<InterviewRounds>();
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
 
  searchCtrl = new FormControl();
  filteredIcons: string;
  DialogResponse: ConfirmDialogModelResponse;
  interviewRoundsList: InterviewRounds[] = [];
  currentStatus: InterviewRounds = new InterviewRounds();
  IsSubLoading: boolean = false;
  dialogRef: any;
  @ViewChild('interviewroundModal') rsDialog = {} as TemplateRef<any>;
  InterviewRoundForm: FormGroup;
  StatusColorCodes = [];
  @Input()
  columns: TableColumn<InterviewRounds>[] = [
    { label: 'Id', property: 'InterviewRoundId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Interview Round Name', property: 'Name', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Color Code', property: 'ColorCode', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Created Date', property: 'CreatedDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private service: GlobalSettingsService,
    private staticDataTypes: AccountTypes,
    public iconService: IconService
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();

    this.InterviewRoundForm = this._formBuilder.group({
      'InterviewRoundName': ['', [Validators.required]],
      'ColorCode': ['', [Validators.required]],
    });
    this.StatusColorCodes = this.staticDataTypes.StatusColorList;
  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetInterviewRounds();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetInterviewRounds();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  GetInterviewRounds() {debugger;
    this.service.GetInterviewRoundsList(this.loginUser.Company.Id).subscribe(response => {
      if (!response.IsError) {
        this.interviewRoundsList = response.Data;
        this.dataSource.data = this.interviewRoundsList;
      }
      this.setDataSourceAttributes();
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });
  }
  AddNewStatus() {
    this.currentStatus = new InterviewRounds();
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this.GetInterviewRounds();
      }
    });
  }
  EditStatus(tag: InterviewRounds) {debugger;
    this.currentStatus = tag;
    this.currentStatus.InterviewRoundName = tag.Name;
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this.GetInterviewRounds();
      }
    });
  }
  

  DeleteSubmissionStatus(tag: InterviewRounds) {
    const message = 'Interview Round <b><span class="displayEmail">' + tag.Name + ' </span></b> has been deleted?'
    const dialogData = new ConfirmDialogModel("Interview Round", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmDeleted(tag);
      }
    });
  }

  ConfirmDeleted(tag: InterviewRounds) {
    if (tag.InterviewRoundId !=null) {
      tag.UpdatedBy = this.loginUser.UserId;
      tag.InterviewRoundName = tag.Name;
      this.service.DeleteInterviewRound(tag).subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success(response.SuccessMessage);
          this.GetInterviewRounds();
        }
      },
        error => {
          this._alertService.error(error);
        })
    }
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  sortData(sort: MatSort) {
    this.sort = sort;
  }
  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }
  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  SaveInterviewRound() {debugger;
    this.IsSubLoading = true;
    if (this.currentStatus.InterviewRoundName == null || this.currentStatus.InterviewRoundName.trim() == '') {
      this._alertService.error("Please Enter Account type.");
      this.IsSubLoading = false;
      return;
    }
    if (this.currentStatus.InterviewRoundId!=null)
      this.currentStatus.UpdatedBy = this.loginUser.UserId;
    else{
      this.currentStatus.CreatedBy = this.loginUser.UserId;
      this.currentStatus.IsActive = true;
    }
     
    this.currentStatus.CompanyId = this.loginUser.Company.Id;

    this.service.ManageInterviewRoundName(this.currentStatus)
      .subscribe(
        response => {
          if (response.IsError == true) {
            this._alertService.error(response.ErrorMessage);
          }
          else {
            this._alertService.success(response.SuccessMessage);
            this.IsSubLoading = false;
            this.dialogRef.close(true);
          }
        },
        error => {
          this.IsSubLoading = false;
          this._alertService.error(error);
        }
      );
  }

  onColorChange(event: any) {
    let selectedStatus = this.StatusColorCodes.find(x => x.label == event.value);
    if (selectedStatus) {
      this.currentStatus.bgclass = selectedStatus.bgclass;
    }
  }

}
