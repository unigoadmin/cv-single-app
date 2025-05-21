import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icStar from '@iconify/icons-ic/twotone-star';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icEmail from '@iconify/icons-ic/twotone-mail';
import icPerson from '@iconify/icons-ic/twotone-person';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import icSupervisor_Account from '@iconify/icons-ic/twotone-supervisor-account';
import icSecurity from '@iconify/icons-ic/twotone-security';
import icDetails from '@iconify/icons-ic/twotone-details';
import icChevron_Right from '@iconify/icons-ic/twotone-chevron-right';
import icExpand_More from '@iconify/icons-ic/twotone-expand-more';
import icPerson_Add from '@iconify/icons-ic/twotone-person-add';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icRemove_Red_Eye from '@iconify/icons-ic/twotone-remove-red-eye';
import icRemove_Circle_Outline from '@iconify/icons-ic/twotone-remove-circle-outline';
import { FormBuilder, FormControl } from '@angular/forms';
import { CompanyModules, ConsultviteUser, EmployerRoles, ModuleRolePermissions, Roles, RoleUsers } from '../../core/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { RoleService } from '../../core/http/role.service';
import { LoginUser } from 'src/@shared/models';
import { ModuleService } from '../../core/http/module.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TodoItemFlatNode, TodoItemNode, TreeviewDataService } from '../../core/treeview-data.service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SafeSubscriber } from 'rxjs/internal/Subscriber';

@UntilDestroy()
@Component({
  selector: 'cv-roles-view',
  templateUrl: './roles-view.component.html',
  styleUrls: ['./roles-view.component.scss'],
  providers: [TreeviewDataService],
  animations: [
    fadeInUp400ms,
    stagger40ms,
    scaleFadeIn400ms
  ],
})
export class RolesViewComponent implements OnInit {


  form = this.fb.group({
    RoleName: null,
    RoleDescription: null,
    ModuleId: null,

  });
  icStar = icStar;
  icStarBorder = icStarBorder;
  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icBusiness = icBusiness;
  icPerson = icPerson;
  icEmail = icEmail;
  icPhone = icPhone;
  icSupervisor_Account = icSupervisor_Account;
  icSecurity = icSecurity;
  icDetails = icDetails;
  icChevron_Right = icChevron_Right;
  icExpand_More = icExpand_More;
  icPerson_Add = icPerson_Add;
  icEdit = icEdit;
  icRemove_Red_Eye = icRemove_Red_Eye;
  icRemove_Circle_Outline = icRemove_Circle_Outline;

  loginUser: LoginUser;
  title: string;
  companyModules: CompanyModules[];
  companyId: number;
  employerRole: EmployerRoles;
  users: ConsultviteUser[] = [];
  selectedUser: ConsultviteUser = null;
  isEditMode: boolean = false;
  index: number;

  myControl = new FormControl();
  filteredOptions: Observable<ConsultviteUser[]>;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  // newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(
    true /* multiple */
  );

  constructor(@Inject(MAT_DIALOG_DATA) public role: Roles,
    private dialogRef: MatDialogRef<RolesViewComponent>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _roleService: RoleService,
    private _moduleService: ModuleService,
    private _treeviewDataService: TreeviewDataService) {

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable

    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _treeviewDataService.dataChange.subscribe(data => {
      this.dataSource.data = data;
     console.log(data);
    });
  }


  getLevel = (node: TodoItemFlatNode) => node.level;
  hasLevel = (node: TodoItemFlatNode) => node.level === 2;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  hasChildAndLevel = (_: number, _nodeData: TodoItemFlatNode) =>
    _nodeData.expandable && _nodeData.level >= 2;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) =>
    _nodeData.item === "";

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.id = node.id;
    flatNode.description = node.description;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  ngAfterViewInit() {
    // if (this.treeControl.dataNodes.length < 100)
    // this.treeControl.expandAll();

    // for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
    //   if (this.treeControl.dataNodes[i].item == "Fruits") {
    //     this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
    //     this.treeControl.expand(this.treeControl.dataNodes[i]);
    //   }
    //   if (this.treeControl.dataNodes[i].item == "Groceries") {
    //     this.treeControl.expand(this.treeControl.dataNodes[i]);
    //   }
    // }

    // this.checklistSelection.select(1);
  }

  OnRadioBbuttonChange(event,node: TodoItemFlatNode){
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    if(parent){
      const descendants = this.treeControl.getDescendants(parent);
      this.checklistSelection.deselect(...descendants);
    }
   if(event.source._checked)
   this.checklistSelection.select(node);
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
    // return false;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
    // return false;
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    if(node.level!=1){
      const descendants = this.treeControl.getDescendants(node);
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);
  
      // Force update for the parent
      descendants.every(child => this.checklistSelection.isSelected(child));
      this.checkAllParentsSelection(node);
    }
   
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getParentItem(node: TodoItemFlatNode):any {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    if(parent)
     return parent.item;
  }

  getSelected = () => this.checklistSelection.selected.map(f => f.id);

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.companyId = this.loginUser.Company.Id;
      this.employerRole = <EmployerRoles>{};

      if (this.role.RoleId) {
        this.employerRole.RoleId = this.role.RoleId;
        this.employerRole.RoleName = this.role.RoleName;
        this.employerRole.RoleDescription = this.role.RoleDescription;
        this.employerRole.ModuleId = this.role.ModuleId;
        this.employerRole.CompanyId = this.role.CompanyId;
        this.employerRole.UserType = this.role.UserType;

        this.form.patchValue(this.employerRole);
      }
      this.getCompanyActiveModules(this.companyId);
      this.getRolePermissions(this.role);
      this.getUsers();
    }
    this.title = "View Role";


  }

  getCompanyActiveModules(companyId: number) {

    this._moduleService.getCompanyActiveModules(companyId)
      .subscribe(
        (companyModules) => {
          this.companyModules = companyModules;
          let module = this.companyModules.find(i => i.ModuleId == this.employerRole.ModuleId);
          this.employerRole.ModuleName = module.ModuleName;

        },
        error => {
          this._alertService.error(error);
        });
  }

  getRolePermissions(role: Roles) {
    this._roleService.getRolePermissions(role.RoleId, role.ModuleId, this.loginUser.Company.Id,role.UserType)
      .subscribe(
        screens => {debugger;

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
          var screensData = [];
          role.Screens.forEach(screen => {
            var actions = [];
            screen.Actions.forEach(action => {
              var subactiondata = [];
              if(action.SubActions.length>0){
                action.SubActions.forEach(sub =>{
                  const subactionjson={
                    ItemId:sub.SubActionId,
                    ItemName:sub.ActionName,
                    ItemDesc:sub.Description,
                    children:[]
                  }
                  subactiondata.push(subactionjson);
                  //subactiondata.push(sub.ActionName);
                })
              }
              else{
                subactiondata=[];
              }
              const actionjson={
                ItemId:action.ActionId,
                ItemName:action.ActionName,
                ItemDesc:action.Description,
                children:subactiondata
              }
              actions.push(actionjson);
              //actions[action.ActionName]=subactiondata;

            });
            const screenjson={
              ItemId:screen.ScreenId,
              ItemName:screen.ScreenName,
              ItemDesc:'',
              children:actions
            }
            screensData.push(screenjson);
            //screensData[screen.ScreenName] = actions;

          })
          this._treeviewDataService.initialize(screensData);

          role.Screens.forEach(screen => {debugger;
            var screenNode = this.treeControl.dataNodes.find(i => i.id == screen.ScreenId);
            if (screen.IsActive)
              this.checklistSelection.toggle(screenNode);
            screen.Actions.forEach(action => {
              var actionNode = this.treeControl.dataNodes.find(i => i.id == action.ActionId);
              if (action.IsActive)
                this.checklistSelection.toggle(actionNode);
               action.SubActions.forEach(sub=>{
                var subActionNode = this.treeControl.dataNodes.find(i => i.id == sub.SubActionId);
                if(subActionNode!=null && sub.IsActive){
                  subActionNode.checked=true;
                  this.checklistSelection.toggle(subActionNode);
                }
               }) 
            });
          })
          let selectedNodes = this.getSelected();
          console.log(selectedNodes);

        });
  }

  getUsers() {
    forkJoin([
      this._roleService.getRoleUnAssignedUsers(this.role.ModuleId, this.loginUser.Company.Id,this.role.UserType),
      this._roleService.getRoleUsers(this.role.RoleId, this.role.ModuleId, this.loginUser.Company.Id,this.role.UserType)])
      .subscribe(result => {

        this.users = result[0];
        this.role.Users = result[1];

        this.users = this.users.filter(i => !this.role.Users.some(j => j.UserId == i.UserId));
        this.filterUsers();
      },
        error => {
          this._alertService.error(error);
        });
  }


  // getRoleUsers(role: Roles){
  //   this._roleService.getRoleUsers(role.RoleId,role.ModuleId,this.loginUser.Company.Id)
  //   .subscribe(
  //     users=>{

  //     role.Users = users;
  //  });
  // }
  displayFn(user: ConsultviteUser): string {
    return user && user.FullName ? user.FullName : '';
  }

  private _filter(value: string): ConsultviteUser[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(option => option.FullName.toLowerCase().indexOf(filterValue) === 0);
  }

  filterUsers() {
    this.users.sort((a, b) => {
      var valueA = a.FullName, valueB = b.FullName
      if (valueA < valueB)
        return -1
      if (valueA > valueB)
        return 1
      return 0
    });
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.users.slice())
      );
  }

  addUser() {
    if (this.selectedUser) {
      let user: ConsultviteUser = Object.assign({}, this.selectedUser);
      this.role.Users.push(user);
      this.users = this.users.filter(i => i.UserId != this.selectedUser.UserId);
      this.filterUsers();

    }
    this.selectedUser = null;
  }
  removeUser(user: ConsultviteUser) {
    if (user.UserType != 1 && user.UserType != 2) {
      const index = this.role.Users.indexOf(user);
      if (index >= 0) {
        this.role.Users.splice(index, 1);

        this.users.push(user);
        this.filterUsers();
      }
    }
  }
  saveRole() {
    const form = this.form.value;

    //Role Details
    this.employerRole.RoleName = form.RoleName;
    this.employerRole.RoleDescription = form.RoleDescription;
    this.employerRole.ModuleId = form.ModuleId;
    this.employerRole.CompanyId = this.loginUser.Company.Id;
    this.employerRole.Status = true;

    //Permissions
    let moduleRolePermissions: ModuleRolePermissions = <ModuleRolePermissions>{};
    let screens = [];
    let actions = [];
    let selectedNodes = this.getSelected();
    console.log(selectedNodes);
    moduleRolePermissions.CompanyId = this.loginUser.Company.Id;
    moduleRolePermissions.ModuleId = this.role.ModuleId;
    moduleRolePermissions.RoleId = this.role.RoleId;
    this.role.Screens.forEach(screen => {
      if (selectedNodes.includes(screen.ScreenId)) {
        screens.push(screen.ScreenCode)
        screen.Actions.forEach(action => {
          if (selectedNodes.includes(action.ActionId)) {
            actions.push(action.ActionCode);
          }
          action.SubActions.forEach(sub=>{
             if(selectedNodes.includes(sub.SubActionId)){
              actions.push(sub.ActionCode);
             }
          })
        });
      }
    });

    moduleRolePermissions.Screens = screens;
    moduleRolePermissions.Actions = actions;
    console.log(actions);
    this.employerRole.RolePermissions = moduleRolePermissions;


    //Role Users
    let roleUsers: RoleUsers = <RoleUsers>{};
    roleUsers.CompanyId = this.loginUser.Company.Id;
    roleUsers.ModuleId = this.role.ModuleId;
    roleUsers.RoleId = this.role.RoleId;
    roleUsers.UpdatorId = this.loginUser.UserId;
    roleUsers.Users = [];
    this.role.Users.forEach(user => {
      roleUsers.Users.push(user.UserId);
    });
    this.employerRole.RoleUsers = roleUsers;
    this._roleService.saveRole(this.employerRole)
      .subscribe(role => {
        role.ModuleId = this.employerRole.ModuleId;
        this.dialogRef.close({ data: role });
        this._alertService.success("Role updated successfully");
      }, error => {
        this._alertService.error(error);
      });
  }



}
