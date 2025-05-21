import { AfterViewInit, Component, Input, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { merge, Observable, of, ReplaySubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface'; 
import { BenchPriorityLabels } from 'src/static-data/aio-table-data';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import iclocationon from '@iconify/icons-ic/location-on';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation'; 
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSelectChange } from '@angular/material/select';
import icMap from '@iconify/icons-ic/twotone-map';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { SubmissionService } from '../core/http/submissions.service';
import { Router } from '@angular/router';
import { AddConfirmationComponent } from './add-confirmation/add-confirmation.component';
import { ConfirmationService } from '../core/http/confirmations.service';
import { ConfirmationList } from '../core/models/confirmationlist';
import { ConvertToPlacementComponent } from './convert-to-placement/convert-to-placement.component';
import { iconsFA } from 'src/static-data/icons-fa';
import icConfirmation from '@iconify/icons-ic/confirmation-number';
import { MaterSubmissionStatus } from '../core/models/matersubmissionstatus';
import { assign } from 'src/@shared/models/assign';
import { SubUsers } from 'src/@shared/models/common/subusers'; 
import { BenchCandidateService } from '../bench-candidates/bench-candidates.service';
import { distinct } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { ConfirmationActivityLog } from '../core/models/ConfirmationActivityLog';
import { MatSidenav } from '@angular/material/sidenav';
import icFormattedList from '@iconify/icons-ic/twotone-format-list-bulleted';
import icClose from '@iconify/icons-ic/twotone-close';

@UntilDestroy()
@Component({
  selector: 'cv-confirmations',
  templateUrl: './confirmations.component.html',
  styleUrls: ['./confirmations.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, TimeZoneService, SubmissionService, ConfirmationService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ConfirmationsComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<ConfirmationList[]> = new ReplaySubject<ConfirmationList[]>(1);
  data$: Observable<ConfirmationList[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<ConfirmationList>();
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
  icClose=icClose;
  searchCtrl = new FormControl();
  labels = BenchPriorityLabels;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  iclocationon = iclocationon;
  icPersonAdd = icPersonAdd;
  icDoneAll = icDoneAll;
  icEye = icEye;
  confirmationList:ConfirmationList[]=[];
  status_textClass:any='text-amber-contrast';
  status_bgClass:any='bg-amber';
  filteredIcons: string;
  icConfirmation=icConfirmation;
  ConfirmationStatusList: MaterSubmissionStatus[];
  assignees: assign[] =[];
  benchSubUsers: SubUsers[];
  selectedAssignee:string ="All";
  SelectedAssingValue:string=null;
  selectedConfirmationId:any;
  icFormattedList=icFormattedList;
  ActivityLogs:ConfirmationActivityLog[];
  @ViewChild('activitylog',{static: true}) activitylog: MatSidenav;
  @Input()
  columns: TableColumn<ConfirmationList>[] = [
    { label: 'ID', property: 'ComapnyConfirmationID', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'CATEGORY', property: 'ConfirmationCategory', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'DATE', property: 'ConfirmationDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'CAND FIRST NAME', property: 'FirstName', type: 'text', visible: true, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'CAND LAST NAME', property: 'LastName', type: 'text', visible: true, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'CLIENT / VENDOR', property: 'EndClient', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'TYPE', property: 'ConfirmationType', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'EXPECTED START', property: 'StartDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'EXPECTED END', property: 'EndDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'POC', property:'ShortPOC', type:'button', visible:true, cssClasses: ['text-secondary', 'font-medium']},
    { label: 'STATUS', property: 'StatusName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'ACTIONS', property: 'actions', type: 'button', visible: true }

  ];
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private confirmationService: ConfirmationService,
    private _service: BenchCandidateService,
    private permissionsService: NgxPermissionsService
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();
  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.getBenchSubUsers();
      this.getConfirmationStatusList(this.loginUser.Company.Id);
      this.GetPlacements();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  GetPlacements() {
    const confirmationVM = {
      CompanyId:this.loginUser.Company.Id,
      UserId:this.loginUser.UserId,
      POC:this.SelectedAssingValue
    }
    this.confirmationService.GetConfirmations(confirmationVM).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.confirmationList = response.Data;
        this.confirmationList.forEach(element => {
          element.ConfirmationDate = TimeZoneService.getLocalDateTime_Date(element.ConfirmationDate, true);
          element.StartDate = TimeZoneService.getLocalDateTime_Date(element.StartDate, false);
          element.EndDate = element.EndDate!=null? TimeZoneService.getLocalDateTime_Date(element.EndDate, false) :null;
        });
        this.dataSource.data = this.confirmationList;
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  
  AddConfirmation() {
    this.dialog.open(AddConfirmationComponent,
       {data:{SubmissionId:0,src:'Addconfirmation',ConfirmationId:0}, width: '80%', panelClass: "dialog-class",disableClose:true }).afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.GetPlacements();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    });
  }
  updateConfirmation(confirmation:ConfirmationList) {
    var editPermission = this.permissionsService.getPermission('ACTION_CONFIRMATIONS_MODIFY');
    if(editPermission){
      this.dialog.open(AddConfirmationComponent, 
        { width: '80%', panelClass: "dialog-class",disableClose:true,data:{SubmissionId:0,src:'editconfirmation',ConfirmationId:confirmation.ConfirmationID} }).afterClosed().subscribe((result) => {
        if (result) {
          if(result && result==='Convert'){
           this.ConfirmationToPlacement(confirmation);
          }else{
            this.GetPlacements();
          }
        }
      });
    }
  }
  ConfirmationToPlacement(confirmation:ConfirmationList) {

    this.dialog.open(ConvertToPlacementComponent  , { width: '60%', panelClass: "dialog-class",disableClose:true,data:{confirmId:confirmation.ConfirmationID} }).afterClosed().subscribe((confirmation) => {

      if (confirmation) {
        this.GetPlacements();
      }
    });
    
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'ConfirmationDate': return new Date(item.ConfirmationDate);
        case 'StartDate' : return new Date(item.StartDate);
        case 'EndDate' : return new Date(item.EndDate);
        default: return item[property];
      }
    };
  }
  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'ConfirmationDate': return new Date(item.ConfirmationDate);
        case 'StartDate' : return new Date(item.StartDate);
        case 'EndDate' : return new Date(item.EndDate);
        default: return item[property];
      }
    };
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

  getConfirmationStatusList(CompanyId: number) {
    this.confirmationService.GetConfirmaionStatusList(CompanyId)
      .subscribe(response => {debugger;
        if(response.IsError==false)
        this.ConfirmationStatusList = response.Data;
      },
        error => {
          this._alertService.error(error); 
        }
      );
  }

  onLabelChange(change: MatSelectChange, submission: ConfirmationList) {
    const index = this.confirmationList.findIndex(c => c === submission);
    var selectedStatus = change.value;
    this.confirmationList[index].StatusName = selectedStatus.StatusName;
    this.confirmationList[index].Status = selectedStatus.StatusId;
    const Psubmission = {
      ConfirmationID: submission.ConfirmationID,
      CompanyId: this.loginUser.Company.Id,
      Status: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId
    };
    this.confirmationService.UpdateConfirmationStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  getBenchSubUsers() {
    this.assignees = [];
    this.assignees.push({name:'ALL',value:null,email:null,mapping:false});
    this._service.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId,email:y.PrimaryEmail,mapping:true });
            });
        },
        error => {
          this._alertService.error(error);
        });
  }

  filterByAssignee(selectedItem:assign){
    this.selectedAssignee=selectedItem.name;
    this.SelectedAssingValue = selectedItem.value;
    this.GetPlacements();
  }

  ViewLogs(placement:ConfirmationList){
    this.ActivityLogs=[];
    this.selectedConfirmationId = placement.ConfirmationID;
    this.confirmationService.GetConfirmationActivityLog(this.selectedConfirmationId,this.loginUser.Company.Id)
    .subscribe(response =>{
      if(response.IsError==false){
        this.ActivityLogs = response.Data;
        this.ActivityLogs.forEach(
          log =>{
            log.CreatedDate = TimeZoneService.getLocalDateTime(log.CreatedDate, true);
          }
        )
        this.activitylog.open();
      }
      else{
        this._alertService.error(response.ErrorMessage);
      }
    },
    error => {
      this._alertService.error(error);
    });
  }

  OnActiviyLogclose(){
    this.activitylog?.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
}

