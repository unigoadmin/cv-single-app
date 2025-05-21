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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HashTags } from '../../core/models/globalsettings';
import { enumHashTagCategories } from '../../core/models/enumHashTagCategories';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { iconsFA } from 'src/static-data/icons-fa';
import { ValidationService } from 'src/@cv/services/validation.service';
@UntilDestroy()
@Component({
  selector: 'cv-hash-tags',
  templateUrl: './hash-tags.component.html',
  styleUrls: ['./hash-tags.component.scss'],
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
export class HashTagsComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<HashTags[]> = new ReplaySubject<HashTags[]>(1);
  data$: Observable<HashTags[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<HashTags>();
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  DialogResponse: ConfirmDialogModelResponse;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  HashTagCategories: enumHashTagCategories;
  enumHashTagCategories: typeof enumHashTagCategories = enumHashTagCategories;
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
  IsHashTagLoading: boolean = false;
  searchCtrl = new FormControl();
  hashTag: HashTags = new HashTags();
  filteredIcons: string;
  hashtagform: FormGroup;
  dialogRef: any;
  hashtagValue: any;
  @ViewChild('hashtagsModal') rsDialog = {} as TemplateRef<any>;
  @Input()
  columns: TableColumn<HashTags>[] = [
    { label: 'HashTag Name', property: 'HashTagText', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Category', property: 'CategoryName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  public hashTags: HashTags[] = [];
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private _formBuilder: FormBuilder,
    private service: GlobalSettingsService,
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();

    this.hashtagform = this._formBuilder.group({
      'HashTagText': ['', [Validators.required, ValidationService.commaValidator]],
      'Category': ['']
    });
  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetHashgat();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  GetHashgat() {
    this.service.GetHashTag(this.loginUser.Company.Id.toString(), 'ATS').subscribe(response => {
      if (response.Data) {
        this.hashTags = response.Data;
        this.hashTags.forEach(ele => {
          ele.CategoryName = enumHashTagCategories[ele.Category];
        })
        this.dataSource.data = this.hashTags;
      }

      this.setDataSourceAttributes();
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });
  }
  AddHashtag() {
    this.hashTag = new HashTags();
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this._alertService.success('Hashtag saved successfully');
        this.GetHashgat();
      }
    });
  }
  EditHashtag(tag: HashTags) {
    this.hashTag = tag;
    this.hashtagValue = tag.HashTagText;
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this._alertService.success('Hashtag Updated successfully');
        this.GetHashgat();
      }
    });
  }
  DeleteHashtag(tag: HashTags) {
    const message = 'HashTag <b><span class="displayEmail">' + tag.HashTagText + ' </span></b> will be deleted?'
    const dialogData = new ConfirmDialogModel("Delete HashTag", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmDeleteHashTag(tag);
      }
    });
  }
  ConfirmDeleteHashTag(tag: HashTags) {
    if (tag && tag.HashTagId > 0) {
      const phastags = {
        HashTagId: tag.HashTagId,
        HashTagText: tag.HashTagText,
      };
      this.service.deleteHashTag(phastags).subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success("HashTag deleted sucessfully.");
          this.GetHashgat();
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

  Save() {
    this.IsHashTagLoading = true;
    if (this.hashTag && this.hashTag.HashTagId > 0) {
      this.hashTag.HashTagText = this.hashtagValue;
      this.hashTag.UpdatedDate = new Date();
    } else {
      this.hashTag.HashTagText = this.hashtagValue;
      this.hashTag.CreatedBy = this.loginUser.UserId;
    }
    this.hashTag.HashTagSource = this.loginUser.Company.Id.toString();
    this.hashTag.ModuleType = 'ATS';
    this.service.addHashTag(this.hashTag).subscribe(hashtag => {
      this.IsHashTagLoading = false;
      this.hashtagform.reset();
      this.dialogRef.close(true);
    }, error => { this.IsHashTagLoading = false; this._alertService.success(error); });
  }

  ChangeHashTag(HashTag: any) {
    this.hashTag.Category = HashTag.value;
  }

}
