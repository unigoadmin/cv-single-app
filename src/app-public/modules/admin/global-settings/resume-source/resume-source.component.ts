import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import iclocationon from '@iconify/icons-ic/location-on';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icFolder from '@iconify/icons-ic/twotone-folder';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import icMap from '@iconify/icons-ic/twotone-map';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import{ ResumeSource } from '../../core/models/globalsettings';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import icFormattedList from '@iconify/icons-ic/twotone-format-list-bulleted';
import icClose from '@iconify/icons-ic/twotone-close';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginUser } from 'src/@shared/models';
import { Observable, ReplaySubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalSettingsService } from '../../core/http/globalsettings.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { iconsFA } from 'src/static-data/icons-fa';
@UntilDestroy()

@Component({
  selector: 'cv-resume-source',
  templateUrl: './resume-source.component.html',
  styleUrls: ['./resume-source.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService,GlobalSettingsService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ResumeSourceComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<ResumeSource[]> = new ReplaySubject<ResumeSource[]>(1);
  data$: Observable<ResumeSource[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<ResumeSource>();
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
  icMoreHoriz = icMoreHoriz;
  icCloudDownload = icCloudDownload;
  icEdit=icEdit;
  icMap = icMap;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icFolder = icFolder;
  iclocationon = iclocationon;
  icPersonAdd = icPersonAdd;
  icDoneAll = icDoneAll;
  icEye = icEye;
  icFormattedList=icFormattedList;
  icClose=icClose;
  searchCtrl = new FormControl();
  filteredIcons: string;
  resumeSource: ResumeSource = new ResumeSource();
  IsResumeSrcLoading:boolean=false;
  resumeSourceForm: FormGroup;
  dialogRef: any;
  resumeSourceValue:any;
  @ViewChild('resumeSoureDialog') rsDialog = {} as TemplateRef<any>; 
  @Input()
  columns: TableColumn<ResumeSource>[] = [
    { label: 'Name', property: 'SourceName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private service:GlobalSettingsService,
    private _formBuilder: FormBuilder
  ) {  this.matIconRegistry.addSvgIcon(
    'linkedin',
    this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
  );
  this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
  this.dataSource = new MatTableDataSource();

  this.resumeSourceForm = this._formBuilder.group({
    'SourceName': ['', [Validators.required]]
  });
}
get visibleColumns() {
  return this.columns.filter(column => column.visible).map(column => column.property);
}
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.getResumeSourceByCompany(this.loginUser.Company.Id);
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  getResumeSourceByCompany(CompanyId: number) {
    this.service.GetResumeSourceByCompany(CompanyId)
      .subscribe(
      resumeSources => {
        this.dataSource.data = resumeSources.Data;
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      },
      error => {
        this._alertService.error(error);
      });
  }
  AddResumeSource(){
    this.resumeSource = new ResumeSource();

    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class",disableClose:true });


      this.dialogRef.afterClosed().subscribe(response => {
        if(response == true){
          this._alertService.success('Resume source saved successfully');
          this.getResumeSourceByCompany(this.loginUser.Company.Id);
        }
      });
  }
  EditResumeSource(source:ResumeSource){
    this.resumeSource = source;
    this.resumeSourceValue = this.resumeSource.SourceName;
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class",disableClose:true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this._alertService.success('Resume source updated successfully');
        this.getResumeSourceByCompany(this.loginUser.Company.Id);
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
  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  addResumeSource() {
    this.IsResumeSrcLoading=true;
    if (this.resumeSource && this.resumeSource.SourceId > 0) {
      this.resumeSource.SourceName = this.resumeSourceValue;
      this.resumeSource.UpdatedBy = this.loginUser.UserId;
      this.resumeSource.UpdatedDate = new Date();
    } else {
      this.resumeSource.SourceName = this.resumeSourceValue;
      this.resumeSource.CompanyId = this.loginUser.Company.Id;
      this.resumeSource.CreatedBy = this.loginUser.UserId;
    }
    this.service.AddResumeSource(this.resumeSource, this.loginUser.UserId)
      .subscribe(
        response => {
          this.IsResumeSrcLoading=false;
          this.resumeSourceForm.reset();
          this.dialogRef.close(true);
        },
        error => {
          this.IsResumeSrcLoading=false;
          this._alertService.error(error);
        });
  }

}
