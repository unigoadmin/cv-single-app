import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { iconsFA } from 'src/static-data/icons-fa';
import { LoginUser } from 'src/@shared/models';
import { WorkPermitModel } from 'src/@shared/models/workpermit.model';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IconService } from 'src/@shared/services/icon.service';
import { GlobalSettingsService } from 'src/@shared/http/globalsettings.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'cv-work-permits',
  templateUrl: './work-permits.component.html',
  styleUrls: ['./work-permits.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class WorkPermitsComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<WorkPermitModel[]> = new ReplaySubject<WorkPermitModel[]>(1);
  data$: Observable<WorkPermitModel[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<WorkPermitModel>();
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
  //DialogResponse: ConfirmDialogModelResponse;
  workPermitsList: WorkPermitModel[] = [];
  currentStatus: WorkPermitModel = new WorkPermitModel();
  IsSubLoading: boolean = false;
  dialogRef: any;
  @ViewChild('workPermitModal') rsDialog = {} as TemplateRef<any>;
  WorkPermitForm: FormGroup;
  StatusColorCodes = [];
  @Input()
  columns: TableColumn<WorkPermitModel>[] = [
    { label: 'Id', property: 'Id', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Work Permit', property: 'WorkPermit', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Description', property: 'Description', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
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
    public iconService: IconService
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();

    this.WorkPermitForm = this._formBuilder.group({
      'WPName': ['', [Validators.required]],
      'WPDesc': ['', [Validators.required]],
    });

  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetWorkPermitLists();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  GetWorkPermitLists() {
    this.service.GetWorkPermitList(this.loginUser.Company.Id).subscribe(response => {
      if (!response.IsError) {
        this.workPermitsList = response.Data;
        this.dataSource.data = this.workPermitsList;
      }
      this.setDataSourceAttributes();

      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });
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
  onFilterChange(value: string) {debugger;
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  AddNewWorkPermit() {
    this.currentStatus = new WorkPermitModel();
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this.GetWorkPermitLists();
      }
    });
  }

  EditWorkPermit(tag: WorkPermitModel) {
    this.currentStatus = tag;
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this.GetWorkPermitLists();
      }
    });
  }

  SaveWorkPermit(){debugger;

    this.IsSubLoading = true;
    if (this.currentStatus.WorkPermit == null || this.currentStatus.WorkPermit.trim() == '') {
      this._alertService.error("Please Enter WorkPermit.");
      this.IsSubLoading = false;
      return;
    }

    if (this.currentStatus.Id==null){
      this.currentStatus.Status = true;
    }
      
    this.currentStatus.CompanyId = this.loginUser.Company.Id;

    this.service.SaveWorkPermit(this.currentStatus)
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

}
