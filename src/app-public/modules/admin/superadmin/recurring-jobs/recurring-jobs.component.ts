import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IconService } from '@visurel/iconify-angular';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import { SuperAdminService } from '../../core/http/superadmin.service';
import { RecurringJobs } from '../../core/models/recurringjobs';

@Component({
  selector: 'cv-recurring-jobs',
  templateUrl: './recurring-jobs.component.html',
  styleUrls: ['./recurring-jobs.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms,
    stagger40ms
  ]
})
export class RecurringJobsComponent implements OnInit {

  dataSource = new MatTableDataSource<RecurringJobs>();
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];

  tableData: RecurringJobs[] = [];
  @Input()
  columns: TableColumn<RecurringJobs>[] = [
    { label: 'JOB NAME', property: 'Id', type: 'text', visible: true, cssClasses: ['font-medium', 'textcgs'] },
    { label: 'SCHEDULE', property: 'HumanReadableCron', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'LAST EXECUTION', property: 'LastExecution', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'LAST RUN STATUS', property: 'LastJobState', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'NEXT EXECUTION', property: 'NextExecution', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
  ];

  loginUser: LoginUser;
  jobsList: RecurringJobs[];
  selectedStatus: string = "All";

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _adminService: SuperAdminService,
    private cdRef: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    public iconService: IconService) {
    this.dataSource = new MatTableDataSource();
    this.jobsList = [];
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getRecurringJobs();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRecurringJobs() {
    debugger;
    this._adminService.getRecurringJobs().subscribe(response => {

      this.jobsList = response;
      console.log(this.jobsList);
      this.jobsList.forEach(element => {
        element.NextExecution = TimeZoneService.getLocalDateTime_Timestamp(element.NextExecution, true);
        element.LastExecution = TimeZoneService.getLocalDateTime_Timestamp(element.LastExecution, true);
      });
      this.dataSource.data = this.jobsList;
      this.setDataSourceAttributes();
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'CreatedDate': return new Date(item.NextExecution);
        default: return item[property];
      }
    };
  }

  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'CreatedDate': return new Date(item.NextExecution);
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



  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }





}
