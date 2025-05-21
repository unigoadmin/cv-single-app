import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import icStar from '@iconify/icons-ic/twotone-star';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDeleteForever from '@iconify/icons-ic/twotone-delete-forever';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger20ms } from 'src/@cv/animations/stagger.animation';  
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';

import icRound_Check_Circle_Outline from '@iconify/icons-ic/round-check-circle-outline';
import icRemove_Circle_Outline from '@iconify/icons-ic/remove-circle-outline';
import icRestore from '@iconify/icons-ic/twotone-restore';
import icRemove_Red_Eye from '@iconify/icons-ic/remove-red-eye';
import { UntilDestroy } from '@ngneat/until-destroy';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DocvaultUserDocuments } from '../../core/models';
import icCloud_Download from '@iconify/icons-ic/twotone-cloud-download';
import icShare from '@iconify/icons-ic/twotone-share';


@Component({
  selector: 'cv-documents-data-table',
  templateUrl: './documents-data-table.component.html',
  styleUrls: ['./documents-data-table.component.scss'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ],
  animations: [
    stagger20ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})
export class DocumentsDataTableComponent<T> implements OnInit, OnChanges, AfterViewInit {

  @Input() data: T[];
  @Input() columns: TableColumn<T>[];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 20, 50];
  @Input() searchStr: string;

   @Output() shareDocument = new EventEmitter<DocvaultUserDocuments>();
   @Output() viewDocument = new EventEmitter<DocvaultUserDocuments>();
   @Output() downloadDocument = new EventEmitter<DocvaultUserDocuments>();
   @Output() deleteDocument = new EventEmitter<DocvaultUserDocuments>();

  visibleColumns: Array<keyof T | string>;
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  icMoreVert = icMoreVert;
  icStar = icStar;
  icStarBorder = icStarBorder;
  icDeleteForever = icDeleteForever;
  icEdit = icEdit;
  icRound_Check_Circle_Outline = icRound_Check_Circle_Outline;
  icRemove_Circle_Outline=icRemove_Circle_Outline;
  icRestore = icRestore;
  icRemove_Red_Eye = icRemove_Red_Eye;
  icCloud_Download=icCloud_Download;
  icShare = icShare;
  loginUser: LoginUser;

  constructor(private _authService: AuthenticationService,
    private _eventEmitterService:EventEmitterService) {
   }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.visibleColumns = this.columns.map(column => column.property);
    }

    if (changes.data) {
      this.dataSource.data = this.data;
    }

    if (changes.searchStr) {
      this.dataSource.filter = (this.searchStr || '').trim().toLowerCase();
    }
  }

 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  emitViewDocument(document: DocvaultUserDocuments) {
    this.viewDocument.emit(document);
  }

  emitShareDocument(document: DocvaultUserDocuments) {
    this.shareDocument.emit(document);
  }
  emitDownloadDocument(document: DocvaultUserDocuments) {
    this.downloadDocument.emit(document);
  }
  emitDeleteDocument(document: DocvaultUserDocuments) {
    this.deleteDocument.emit(document);
  }
}
