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
import icSupervisor_Account from '@iconify/icons-ic/twotone-supervisor-account';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger20ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';
import icSecurity from '@iconify/icons-ic/twotone-security';
import { MatDialog } from '@angular/material/dialog';
import { RolesPermissionsComponent } from '../roles-permissions/roles-permissions.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import icKeyboard_Arrow_Down from '@iconify/icons-ic/keyboard-arrow-down';
import icKeyboard_Arrow_Up from '@iconify/icons-ic/keyboard-arrow-up';
import { Roles } from '../../core/models';
import { AlertService, AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { RoleService } from '../../core/http/role.service';
import { LoginUser } from 'src/@shared/models';
import icRemove_Red_Eye from '@iconify/icons-ic/remove-red-eye';

@Component({
  selector: 'cv-roles-data-table',
  templateUrl: './roles-data-table.component.html',
  styleUrls: ['./roles-data-table.component.scss'],
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
    scaleFadeIn400ms,
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class RolesDataTableComponent<T> implements OnInit, OnChanges, AfterViewInit {

  @Input() data: T[];
  @Input() columns: TableColumn<T>[];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 20, 50];
  @Input() searchStr: string;

  @Output() viewRole = new EventEmitter<Roles>();
  @Output() editRole = new EventEmitter<Roles>();
  @Output() openRolePermissions = new EventEmitter<Roles>();
  @Output() openRoleUsers = new EventEmitter<Roles>();

  visibleColumns: Array<keyof T | string>;
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  icMoreVert = icMoreVert;
  icStar = icStar;
  icStarBorder = icStarBorder;
  icDeleteForever = icDeleteForever;
  icEdit = icEdit;
  icSecurity = icSecurity;
  icKeyboard_Arrow_Down = icKeyboard_Arrow_Down;
  icKeyboard_Arrow_Up = icKeyboard_Arrow_Up;
  icRemove_Red_Eye = icRemove_Red_Eye;
  icSupervisor_Account = icSupervisor_Account;

  loginUser: LoginUser;

  expandedElement: Roles | null;
  constructor(private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _roleService:RoleService,
    private _eventEmitterService:EventEmitterService) { }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();

    this._eventEmitterService.roleUpdateEvent.subscribe((role:Roles)=>{
      let data = <any[]>this.dataSource.data;
      let index = data.findIndex(i=>i.RoleId==role.RoleId)
      data.splice(index,1,role);
      this.dataSource.data  = data;
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
  showPermissions( role: Roles){
    if(!role.Screens || role.Screens.length==0){
      this.getRolePermissions(role)
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRolePermissions(role: Roles){
    this._roleService.getRolePermissions(role.RoleId,role.ModuleId,this.loginUser.Company.Id,role.UserType)
    .subscribe(
      screens=>{
    
      role.Screens = screens;
     
      // role.Screens.sort((a, b) => {
      //   var valueA = a.ScreenName, valueB = b.ScreenName
      //   if (valueA < valueB)
      //     return -1
      //   if (valueA > valueB)
      //     return 1
      //   return 0
      // });
      // role.Screens.forEach(action => {
      //   action.Actions.sort((a, b) => {
      //     var valueA = a.ActionName, valueB = b.ActionName
      //     if (valueA < valueB)
      //       return -1
      //     if (valueA > valueB)
      //       return 1
      //     return 0
      //   });
      // });
    });
  }

  emitViewRole(role: Roles) {
    this.viewRole.emit(role);
  }

  emitEditRole(role: Roles) {
    this.editRole.emit(role);
  }

  emitOpenRolePermissions(event: Event,role: Roles) {
    if(!role.IsDisabled){
      event.stopPropagation();
      this.openRolePermissions.emit(role);
    }
  }

  emitOpenRoleUsers(event: Event,role: Roles) {
    event.stopPropagation();
    this.openRoleUsers.emit(role);
  }
}
