import { AfterViewInit, Component, Input, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
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
import { SelectionModel } from '@angular/cdk/collections';
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
import { iconsFA } from 'src/static-data/icons-fa';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { Router } from '@angular/router';
import { PlacementsList } from '../core/models/placementslist';
import { AddPlacementComponent } from './add-placement/add-placement.component';
import { PlacementOnboardingComponent } from './placement-onboarding/placement-onboarding.component';
import { PlacementService } from '../core/http/placement.service';
import icInput from '@iconify/icons-ic/input';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icFormattedList from '@iconify/icons-ic/twotone-format-list-bulleted';
import {ViewOnboardingPlacementComponent} from './view-onboarding-placement/view-onboarding-placement.component';
import { PlacementActivityLog } from '../core/models/placementactivitylogs';
import icClose from '@iconify/icons-ic/twotone-close';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
//import { PlacementFilters } from 'src/app-ats/talent-central/core/models/confirmations';
import { PlacementFilters } from '../core/models/placementfilters';
import { PlcConfirmDialogComponent } from './plc-confirm-dialog/plc-confirm-dialog.component';
import { EditPlacementComponent } from './edit-placement/edit-placement.component';

@UntilDestroy()

@Component({
  selector: 'cv-placements',
  templateUrl: './placements.component.html',
  styleUrls: ['./placements.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, TimeZoneService,PlacementService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class PlacementsComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<PlacementsList[]> = new ReplaySubject<PlacementsList[]>(1);
  data$: Observable<PlacementsList[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<PlacementsList>();
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
  icInput=icInput;
  icFormattedList=icFormattedList;
  icClose=icClose;
  iclayers=icLayers;
  filteredIcons: string;
  confirmationList:PlacementsList[]=[];
  status_textClass:any='text-amber-contrast';
  status_bgClass:any='bg-amber';
  ActivityLogs:PlacementActivityLog[];
  selectedPlacementId:number;
  @ViewChild('activitylog',{static: true}) activitylog: MatSidenav;
  confirmresult: string = '';
  DialogResponse:ConfirmDialogModelResponse;
  pfilters: PlacementFilters = new PlacementFilters();
  selectedStatus:string = "All";
  
  @Input()
  columns: TableColumn<PlacementsList>[] = [
    { label: 'ID', property: 'ComapnyPlacementID', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'CATEGORY', property: 'PlacementCategory', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'DATE', property: 'PlacementDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'CAND FIRST NAME', property: 'FirstName', type: 'text', visible: true, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'CAND LAST NAME', property: 'LastName', type: 'text', visible: true, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'Client / Vendor', property: 'EndClient', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'TYPE', property: 'PlacementType', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'START DATE', property: 'StartDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'END DATE', property: 'EndDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'STATUS', property: 'StatusName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
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
    private placementService:PlacementService
  ) {
    this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
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
      this.GetPlacements();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  GetPlacements() {
    this.placementService.getPlacements(this.loginUser.Company.Id, this.loginUser.UserId).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.confirmationList = response.Data;
        this.confirmationList.forEach(element => {
          element.StartDate = TimeZoneService.getLocalDateTime_Date(element.StartDate, false);
          if(element.EndDate)
            element.EndDate = TimeZoneService.getLocalDateTime_Date(element.EndDate, false);
          element.PlacementDate=TimeZoneService.getLocalDateTime_Date(element.PlacementDate, true);
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
  
  ViewOnBoardingPlacement(placement:PlacementsList){
    this.dialog.open(ViewOnboardingPlacementComponent, { width: '80%', panelClass: "dialog-class",data:{Id:placement.PlacementID} }).afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        if(confirmation==='Onboard'){
           this.updateConfirmation(placement);
        }else if(confirmation==='EditOnboard'){
           this.updatePlacementOnboarding(placement);
        }else if(confirmation==='Delete'){
          this.ConfirmDelete(placement);
        }else if(confirmation==='Rejected'){
          this.ConfirmReject(placement);
        }
        else if(confirmation==='EditPlacement'){
          this.EditPlacement(placement);
        }
      }
    });
  }
  AddConfirmation() {
    this.dialog.open(AddPlacementComponent, { width: '80%', panelClass: "dialog-class",disableClose:true,data:{Id:0,Mode:"New"} }).afterClosed().subscribe((confirmation) => {
      if (confirmation) {
       this.GetPlacements();
      }
    });
  }
  EditPlacement(placement:PlacementsList){
    this.dialog.open(EditPlacementComponent, { width: '80%', panelClass: "dialog-class",disableClose:true,data:{Id:placement.PlacementID,Mode:"Edit"} }).afterClosed().subscribe((confirmation) => {
      if (confirmation) {
       this.GetPlacements();
      }
    });
  }
  updateConfirmation(placement:PlacementsList) {
    this.dialog.open(PlacementOnboardingComponent, { width: '80%',disableClose:true, panelClass: "dialog-class",data:{Id:placement.PlacementID,Mode:"New"} }).afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        //this._alertService.success('placement onboarded successfully');
        this.GetPlacements();
      }
    });
    
  }
  updatePlacementOnboarding(placement:PlacementsList){
    this.dialog.open(PlacementOnboardingComponent, { width: '80%',disableClose:true, panelClass: "dialog-class",data:{Id:placement.PlacementID,Mode:"Edit"} }).afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        //this._alertService.success('placement onboarded successfully');
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
        case 'PlacementDate': return new Date(item.PlacementDate);
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
        case 'PlacementDate': return new Date(item.PlacementDate);
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

  OnActiviyLogclose(){
    this.activitylog?.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  ViewLogs(placement:PlacementsList){
    this.ActivityLogs=[];
    this.selectedPlacementId = placement.PlacementID;
    this.placementService.getPlacementActivityLog(this.selectedPlacementId,this.loginUser.Company.Id)
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
  ConfirmReject(placement:PlacementsList){
    const message = 'Placement record for '+placement.FirstName +' '+placement.LastName+' at '+placement.EndClient+' will be Rejected?'

    const dialogData = new ConfirmDialogModel("Placement Rejection", message);

    const dialogRef = this.dialog.open(PlcConfirmDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.confirmresult = dialogResult;
      this.DialogResponse = dialogResult;
      if(this.DialogResponse.Dialogaction==true){
         this.confirmRejectPlacement(placement,this.DialogResponse.Notes);
      }
    });
  }

  confirmRejectPlacement(placement:PlacementsList,DeleteNotes:string) {
    if (placement.PlacementID > 0) {
      this.pfilters = new PlacementFilters();
      this.pfilters.placementId = placement.PlacementID;
        this.pfilters.companyId = this.loginUser.Company.Id;
        this.pfilters.updatedby = this.loginUser.UserId;
        this.pfilters.Notes = DeleteNotes;
        this.placementService.RejectPlacement(this.pfilters).subscribe(response => {
          if(response.IsError==false){
            this._alertService.success(response.SuccessMessage);
            this.GetPlacements();
          }
          else
          {
            this._alertService.error(response.ErrorMessage);
          }
        },
        error => {
          this._alertService.error(error);
        })
      }
    }


  ConfirmDelete(placement:PlacementsList): void {
    const message = 'Placement record for '+placement.FirstName +' '+placement.LastName+' at '+placement.EndClient+' will be deleted?'

    const dialogData = new ConfirmDialogModel("Placement Deletion", message);

    const dialogRef = this.dialog.open(PlcConfirmDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if(this.DialogResponse.Dialogaction==true){
         this.confirmdeletePlacement(placement,this.DialogResponse.Notes);
      }
    });
  }

  confirmdeletePlacement(placement:PlacementsList,DeleteNotes:string) {
    if (placement.PlacementID > 0) {
      this.pfilters = new PlacementFilters();
      this.pfilters.placementId = placement.PlacementID;
        this.pfilters.companyId = this.loginUser.Company.Id;
        this.pfilters.updatedby = this.loginUser.UserId;
        this.pfilters.Notes = DeleteNotes;
        this.placementService.deletePlacement(this.pfilters).subscribe(response => {
          if(response.IsError==false){
            this._alertService.success(response.SuccessMessage);
            this.GetPlacements();
          }
          else{
            this._alertService.error(response.ErrorMessage);
          }
        },
        error => {
          this._alertService.error(error);
        })
      }
    }

    filterStatus(status:number){
       if(status==1){
         this.selectedStatus="Pending Review";
         this.dataSource.data = this.confirmationList.filter(i=>i.Status==1);
       }
       else if(status==2){
        this.selectedStatus="Active";
        this.dataSource.data = this.confirmationList.filter(i=>i.Status==2);
       }
       else if(status==3){
        this.selectedStatus="Declined";
        this.dataSource.data = this.confirmationList.filter(i=>i.Status==3);
       }
       else if(status==4){
        this.selectedStatus="Ended";
        this.dataSource.data = this.confirmationList.filter(i=>i.Status==4);
       }
       else if(status==0){
        this.selectedStatus="All";
        this.dataSource.data = this.confirmationList;
       }
       
       if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }

  
}
