import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';
import { MatDialog } from '@angular/material/dialog';
import { MyActiveApplicantsComponent } from  'src/app-public/modules/job-central/jobboard-responses/my-active-applicants/my-active-applicants.component';
@Component({
  selector: 'cv-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss'],
  animations: [fadeInUp400ms, stagger40ms, scaleFadeIn400ms],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard',
      } as MatFormFieldDefaultOptions,
    },
  ],
})
export class ReportTableComponent implements OnInit, OnChanges {
  @Input() columns: TableColumn<any>[] = [];

  @Input('datasource') set _dataSource(value: any) {
    if (value instanceof MatTableDataSource) {
      this.DataSource.data = value.data; // Extract the raw array from the existing MatTableDataSource
      
    } else if (Array.isArray(value)) {
      this.DataSource.data = value; // Assign the data directly if it's an array
    } else {
      this.DataSource.data = []; // Fallback to an empty array if data is invalid
      
    }
    
    this.setDataSourceAttributes(); // Reapply paginator and sort
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  DataSource = new MatTableDataSource<any>();

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.setDataSourceAttributes();
  }

  ngOnChanges(): void {
    this.setDataSourceAttributes();
  }

  get visibleColumns() {
    return this.columns.filter((column) => column.visible).map((column) => column.property);
  }

  setDataSourceAttributes(): void {
    if (this.paginator && this.sort) {
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.sort;
    }
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  sortData(sort: MatSort): void {
    this.sort = sort;
    this.DataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'SubmittedDate':
          return new Date(item.SubmittedDate);
        default:
          return item[property] || 'Z'; // Default to 'Z' for undefined values
      }
    };
  }

  onStatusClick(responseIds: string): void {
    
    this.dialog
      .open(MyActiveApplicantsComponent, {
        data: { respIds: responseIds, InputSrc: 'Reports' },
        maxWidth: '95vw',
        width: '95vw',
        height: '90vh',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          // Handle response if needed
        }
      });
  }
}
