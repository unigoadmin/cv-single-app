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
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icAdd from '@iconify/icons-ic/twotone-add';
import { AlertService, AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { ModuleService } from  '../core/http/module.service';
import { LoginUser } from 'src/@shared/models';
import { CompanyModules, ModuleRolePermissions, Roles, RolesTableMenu } from '../core/models';
import icLabel from '@iconify/icons-ic/twotone-label';
import { RoleService } from '../core/http/role.service';
import { RolesPermissionsComponent } from './roles-permissions/roles-permissions.component';
import { RolesViewComponent } from './roles-view/roles-view.component';
import { RolesUsersComponent } from './roles-users/roles-users.component';
import icPerm_Data_Setting  from '@iconify/icons-ic/perm-data-setting';

@Component({
  selector: 'cv-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  
})
export class RolesComponent implements OnInit  {
  icPerm_Data_Setting=icPerm_Data_Setting;
  icAdd = icAdd;
  searchCtrl = new FormControl();

  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  menuOpen = false;

  tableData: Roles[] = [];
  tableColumns: TableColumn<Roles>[] = [
    // {
    //   label: 'MODULE',
    //   property: 'modulename',
    //   type: 'text',
    //   cssClasses: ['text-secondary']
    // },
    
    {
      label: 'ROLE NAME',
      property: 'RoleName',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'DESCRIPTION',
      property: 'RoleDescription',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'PERMISSIONS',
      property: 'Screens',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    },
    {
      label: 'USERS',
      property: 'NoofUsers',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
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
  menuIcons:string[] = [
    'text-black','text-green','text-red','text-amber','text-teal','text-purple',
    'text-cyan','text-orange','text-pink','text-gray','text-deep-purple','text-deep-orange'
  ]
  menuData: RolesTableMenu[] = []
  
  companyId: number;
  loginUser: LoginUser;
  companyModules: CompanyModules[];
  moduleRoles: Roles[] = [];
  selectedModuleId:string;
  selectedModuleName:string;
  constructor(private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _moduleService:ModuleService,
    private _roleService:RoleService,
    private _eventEmitterService:EventEmitterService) { 
     
    }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
        this.companyId = this.loginUser.Company.Id;
        this.getCompanyActiveModules(this.companyId);
    }
  }

  viewRole(role: Roles) {
    this.dialog.open(RolesViewComponent, {
      data: role || null,
      width: '900px',
      disableClose: true
    });
  }


  addRole() {
    let role = <Roles>{};
    role.ModuleId = this.selectedModuleId;
    const dialogRef = this.dialog.open(RolesEditComponent, {
      data: role || null,
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(role => {
      if(this.selectedModuleId == role.data.ModuleId){
        this.getRolesandScreens(this.selectedModuleId);
      }
    });
  }

  editRole(role?: Roles) {
    const dialogRef =  this.dialog.open(RolesEditComponent, {
      data: role || null,
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(roleobj => {
      if(this.selectedModuleId == roleobj.data.ModuleId){
        let role = <Roles> roleobj.data;
        let index = this.moduleRoles.findIndex(i=>i.RoleId==role.RoleId)
        this.moduleRoles.splice(index,1,role);
        this.tableData = this.moduleRoles;
        this._eventEmitterService.roleUpdateEvent.emit(role);
      }
    });
  }

  openRolePermissions(role?: Roles) {
    this.dialog.open(RolesPermissionsComponent, {
      data: role || null,
      width:'800px'
    });
  }

  openRoleUsers(role?: Roles) {
    this.dialog.open(RolesUsersComponent, {
      data: role || null,
      width:'800px'
    });
  }

  setData(moduleId: string) {
    this.selectedModuleId = moduleId;
    this.getRolesandScreens(moduleId);
   
    this.menuOpen = false;
  }

  openMenu() {
    this.menuOpen = true;
  }

  getCompanyActiveModules(companyId:number) {

    this._moduleService.getCompanyActiveModules(companyId)
      .subscribe(
      (companyModules) => {
          this.companyModules = companyModules;
          // this.companyModules.sort((a, b) => {
          //   var valueA = a.ModuleName, valueB = b.ModuleName
          //   if (valueA < valueB)
          //     return -1
          //   if (valueA > valueB)
          //     return 1
          //   return 0
          // });

          let index =0;
          // this.menuData.push( {
          //   type: 'subheading',
          //   label: 'Modules'
          // });
          this.companyModules.forEach(module=>{

            let roleTableMenu:RolesTableMenu = <RolesTableMenu>{};
            roleTableMenu.id = module.ModuleId;
            roleTableMenu.label = module.ModuleName;
            roleTableMenu.type = 'link';
            roleTableMenu.icon = icLabel,
            roleTableMenu.classes = {
                  icon: this.menuIcons[index]
                }

            this.menuData.push(roleTableMenu);
            index++;
          })
          //this.setData(this.companyModules[0].ModuleId)
          this.filterCategory(this.companyModules[0].ModuleId);
        
      },
      error => {
          this._alertService.error(error);
      });
  }

 getRolesandScreens(moduleId) {
  this._roleService.getModuleRoles(this.loginUser.Company.Id, moduleId)
    .subscribe(roles => {

      this.moduleRoles = roles;
      this.moduleRoles.forEach(role=>{
        role.ModuleId = moduleId;
      });
      this.tableData = this.moduleRoles;
 
    }, error => {
      this._alertService.error(error);
    });
}
  filterCategory(moduleId:string){
    this.selectedModuleId = moduleId;
    this.selectedModuleName =  this.companyModules.find(i=>i.ModuleId == moduleId).ModuleName;
    this.getRolesandScreens(moduleId);
  }
}
