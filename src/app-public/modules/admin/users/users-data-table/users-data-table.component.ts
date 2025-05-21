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
import { ConsultviteUser } from '../../core/models';
import icRound_Check_Circle_Outline from '@iconify/icons-ic/round-check-circle-outline';
import icRemove_Circle_Outline from '@iconify/icons-ic/remove-circle-outline';
import icRestore from '@iconify/icons-ic/twotone-restore';
import icRemove_Red_Eye from '@iconify/icons-ic/remove-red-eye';
import { UntilDestroy } from '@ngneat/until-destroy';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'cv-users-data-table',
  templateUrl: './users-data-table.component.html',
  styleUrls: ['./users-data-table.component.scss'],
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
export class UsersDataTableComponent<T> implements OnInit, OnChanges, AfterViewInit {

  @Input() data: T[];
  @Input() columns: TableColumn<T>[];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 20, 50];
  @Input() searchStr: string;

  @Output() toggleStatus = new EventEmitter<ConsultviteUser>();
  @Output() editUser = new EventEmitter<ConsultviteUser>();
  @Output() viewUser = new EventEmitter<ConsultviteUser>();
  @Output() resetPassword = new EventEmitter<ConsultviteUser>();

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
  loginUser: LoginUser;
  constructor(private _authService: AuthenticationService,
    private _eventEmitterService:EventEmitterService) {
   }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();

    this._eventEmitterService.userUpdateEvent.subscribe((user:ConsultviteUser)=>{
      let data = <any[]>this.dataSource.data;
      let index = data.findIndex(i=>i.UserId==user.UserId)
      data.splice(index,1,user);
      this.dataSource.data = data;
    })
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
  
  emitToggleStatus(event: MatSlideToggleChange, user: ConsultviteUser) {
    user.IsActive = event.checked
    this.toggleStatus.emit(user);
  }

  emitViewUser(user: ConsultviteUser) {
    this.viewUser.emit(user);
  }

  emitEditUser(user: ConsultviteUser) {
    this.editUser.emit(user);
  }
  emitResetPassword(user: ConsultviteUser) {
    this.resetPassword.emit(user);
  }
}
