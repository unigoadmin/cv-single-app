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
import { FormBuilder,FormControl, Validators,FormGroup } from '@angular/forms';
import{ keywords } from '../../core/models/globalsettings';
import { iconsFA } from 'src/static-data/icons-fa';

@Component({
  selector: 'cv-key-words',
  templateUrl: './key-words.component.html',
  styleUrls: ['./key-words.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, GlobalSettingsService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class KeyWordsComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<keywords[]> = new ReplaySubject<keywords[]>(1);
  data$: Observable<keywords[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<keywords>();
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
  icEdit = icEdit;
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
  icFormattedList = icFormattedList;
  icClose = icClose;
  searchCtrl = new FormControl();
  filteredIcons: string;
  keywordForm: FormGroup;
  keyword: keywords = new keywords();
  dialogRef: any;
  keywordValue:any;
  @ViewChild('KeywordsModal') rsDialog = {} as TemplateRef<any>; 
  @Input()
  columns: TableColumn<keywords>[] = [
    { label: 'Keyword Name', property: 'KeywordsText', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Category', property: 'Category', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  public hashTags: keywords[] = [];
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private service: GlobalSettingsService,
    private _formBuilder: FormBuilder
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();

    this.keywordForm = this._formBuilder.group({
      'keyword': ['', [Validators.required]],
      'Category':['',[Validators.required]]
    });
  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetKeywordsByCompany();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  GetKeywordsByCompany() {
    this.service.GetKeywordsByCompany(this.loginUser.Company.Id).subscribe(response => {
      if (response.Data) {
        this.dataSource.data = response.Data;
      }
      this.setDataSourceAttributes();
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });
  }
  AddKeywords() {
    this.keyword = new keywords();

    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class",disableClose:true });

      this.dialogRef.afterClosed().subscribe(response => {
        if(response == true){
          this._alertService.success('Keyword saved successfully');
          this.GetKeywordsByCompany();
        }
      });

  }
  EditKeywords(tag: keywords) {
    this.keyword = tag;
    this.keywordValue = tag.KeywordsText;
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class",disableClose:true });

      this.dialogRef.afterClosed().subscribe(response => {
        if(response == true){
          this._alertService.success('Keyword Updated successfully');
          this.GetKeywordsByCompany();
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

  saveKeywords() {
    if (!this.keywordValue.trim()) {
      this._alertService.error('Please atleast one character to save');
      return;
    }
    this.keyword.KeywordsText = this.keywordValue;
    this.keyword.KeywordsSource = this.loginUser.Company.Id.toString();
    this.service.SaveKeywords(this.keyword)
      .subscribe(response => {
        this.keywordForm.reset();
        this.dialogRef.close(true);
      }, error => {
        this._alertService.error(error);
      });

  }

  ClosePopup(){
    this.dialogRef.close(false);
  }

  ChangeKeyword(event: any) {
    this.keyword.Category = event.value;
  }



}
