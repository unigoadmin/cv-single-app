import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import { TableColumn } from '../../../@cv/interfaces/table-column.interface';


@Component({
  selector: 'cv-form-permissons-table',
  templateUrl: './form-permissons-table.component.html',
  styleUrls: ['./form-permissons-table.component.scss']
})
export class FormPermissonsTableComponent<T> implements OnInit, OnChanges, AfterViewInit {
  
  @Input() data: T[];
  @Input() columns: TableColumn<T>[];
  @Input() pageSize = 10;
  @Output() out_UpdatedPermissons = new EventEmitter<any>();

  visibleColumns: Array<keyof T | string>;
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  icMoreHoriz = icMoreHoriz;
  icCloudDownload = icCloudDownload;
  constructor(private cdRef: ChangeDetectorRef) { }
 

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.visibleColumns = this.columns.map(column => column.property);
    }

    if (changes.data) {
      this.dataSource.data = this.data;
      
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  emitToggleStatus<T>(event: any, Property: any, item: T, data: T[]): void {debugger;
    const selectedItem = data.find(x => x['FieldKey'] === item['FieldKey']);
    if (selectedItem) {
      // Do something with selectedItem
      for (const key of Object.keys(item)) {
        if (key !== 'FieldKey' && key !== 'FieldName') {
          selectedItem[key] = false;
        }
      }
      //finally update the selected Value.
      selectedItem[Property] = event.checked;
      this.out_UpdatedPermissons.emit(selectedItem);
    }
    
  }
  

}
