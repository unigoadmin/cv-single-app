import { Component, OnInit } from '@angular/core';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icSearch from '@iconify/icons-ic/twotone-search';
import icStar from '@iconify/icons-ic/twotone-star';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { MatDialog } from '@angular/material/dialog';
import { DocumentsAddComponent } from './documents-add/documents-add.component';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icAdd from '@iconify/icons-ic/twotone-add';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import { DocumentService } from '../core/http/document.service';
import icPerson from '@iconify/icons-ic/person';
import icPerson_Pin from '@iconify/icons-ic/person-pin';
import { DocvaultUserDocuments } from '../core/models';
import { DocumentsViewComponent } from './documents-view/documents-view.component';
import { DocumentsSharingModule } from './documents-sharing/documents-sharing.module';
import { DocumentsSharingComponent } from './documents-sharing/documents-sharing.component';
import * as FileSaver from 'file-saver';
import { DocumentsDeleteComponent } from './documents-delete/documents-delete.component';
import { iconsFA } from '../../../../static-data/icons-fa';

@Component({
  selector: 'cv-documents-table',
  templateUrl: './documents.component.html',
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class DocumentsComponent implements OnInit {

  icAdd = icAdd;
  searchCtrl = new FormControl();
  filteredIcons: string;
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  activeStatus = "";

  menuOpen = false;

  tableData: DocvaultUserDocuments[] = [];
  tableColumns: TableColumn<DocvaultUserDocuments>[] = [

    {
      label: 'NAME',
      property: 'OrgFileName',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'CATEGORY',
      property: 'Category',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'CREATED BY',
      property: 'CreatedByName',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: '',
      property: 'menu',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    },
  ];

  icStar = icStar;
  icSearch = icSearch;
  icContacts = icContacts;
  icMenu = icMenu;
  icPerson = icPerson;
  icPerson_Pin = icPerson_Pin;

  loginUser: LoginUser;
  documents: DocvaultUserDocuments[];
  selectedCategory: string = 'All Documents';
  selectedDocCategory: string = 'All Categories';

  constructor(private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _documentService: DocumentService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.getMyDocuments();
    }
  }

  getMyDocuments() {
    this._documentService.getMyDocuments(this.loginUser.UserId, this.loginUser.Company.Id)
      .subscribe(documents => {
        this.documents = documents;
        this.filterCategory(this.selectedCategory);
      }, error => {
        this._alertService.error(error);
      });
  }

  addDocument() {
    const dialogRef = this.dialog.open(DocumentsAddComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(response => {
      this.getMyDocuments();
    });
  }

  downloadDocument(document: DocvaultUserDocuments) {
    this._documentService.DownloadDocvaultDocs(document.File_path_key, document.File_path_type, this.loginUser.Company.Id)
      .subscribe(response => {
        FileSaver.saveAs(response, document.OrgFileName);
      }),
      error => {
        this._alertService.error("Error while downloading the file.");
      }
  }

  shareDocument(document: DocvaultUserDocuments) {
    const dialogRef = this.dialog.open(DocumentsSharingComponent, {
      data: document || null,
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(userObj => {

    });
  }

  deleteDocument(document: DocvaultUserDocuments) {
    const dialogRef = this.dialog.open(DocumentsDeleteComponent, {
      data: document || null,
      width: '450px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(docObj => {
      this.getMyDocuments();
    });
  }

  viewDocument(document: DocvaultUserDocuments) {
    this.dialog.open(DocumentsViewComponent, {
      data: document || null,
      width: '800px',
      disableClose: true
    });
  }


  filterCategory(category: string) {
    if (category == 'My') {
      if (this.selectedDocCategory == 'HR')
        this.tableData = this.documents.filter(i => i.IsSharedDocument == false && i.Category == 'HR');
      else if (this.selectedDocCategory == 'Training')
        this.tableData = this.documents.filter(i => i.IsSharedDocument == false && i.Category == 'Training');
      else
        this.tableData = this.documents.filter(i => i.IsSharedDocument == false);
      this.selectedCategory = "My Documents";
    }
    else if (category == 'Shared') {
      if (this.selectedDocCategory == 'HR')
        this.tableData = this.documents.filter(i => i.IsSharedDocument == true && i.Category == 'HR');
      else if (this.selectedDocCategory == 'Training')
        this.tableData = this.documents.filter(i => i.IsSharedDocument == true && i.Category == 'Training');
      else
        this.tableData = this.documents.filter(i => i.IsSharedDocument == true);
      this.selectedCategory = "Shared Documents";
    }
    else {
      if (this.selectedDocCategory == 'HR')
        this.tableData = this.documents.filter(i => i.Category == 'HR');
      else if (this.selectedDocCategory == 'Training')
        this.tableData = this.documents.filter(i => i.Category == 'Training');
      else
        this.tableData = this.documents;
      this.selectedCategory = "All Documents";
    }
  }

  filterDocCategory(docCategory: string) {
    if (docCategory == 'HR') {
      this.selectedDocCategory = "HR";
      if (this.selectedCategory == 'My Documents')
        this.tableData = this.documents.filter(i => i.Category == 'HR' && i.IsSharedDocument == false);
      else if (this.selectedCategory == 'Shared Documents')
        this.tableData = this.documents.filter(i => i.Category == 'HR' && i.IsSharedDocument == true);
      else
        this.tableData = this.documents.filter(i => i.Category == 'HR');
    }
    else if (docCategory == 'Training') {
      this.selectedDocCategory = "Training";
      if (this.selectedCategory == 'My Documents')
        this.tableData = this.documents.filter(i => i.Category == 'Training' && i.IsSharedDocument == false);
      else if (this.selectedCategory == 'Shared Documents')
        this.tableData = this.documents.filter(i => i.Category == 'Training' && i.IsSharedDocument == true);
      else
        this.tableData = this.documents.filter(i => i.Category == 'Training');

    }
    else {
      this.selectedDocCategory = "All Categories";
      if (this.selectedCategory == 'My Documents')
        this.tableData = this.documents.filter(i => i.IsSharedDocument == false);
      else if (this.selectedCategory == 'Shared Documents')
        this.tableData = this.documents.filter(i => i.IsSharedDocument == true);
      else
        this.tableData = this.documents;
    }
  }
}
