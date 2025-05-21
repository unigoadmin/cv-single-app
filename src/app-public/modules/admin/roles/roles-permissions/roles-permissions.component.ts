import { Component, Inject, Injectable, OnInit } from '@angular/core';
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
import icChevron_Right from '@iconify/icons-ic/twotone-chevron-right';
import icExpand_More from '@iconify/icons-ic/twotone-expand-more';
import { FormBuilder } from '@angular/forms';
import { ModuleRolePermissions, Roles } from '../../core/models';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { RoleService } from '../../core/http/role.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { TodoItemFlatNode, TodoItemNode, TreeviewDataService } from '../../core/treeview-data.service';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';
 

@Component({
  selector: 'cv-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss'],
  providers:[TreeviewDataService],
  animations: [
    fadeInUp400ms,
    stagger40ms,
    scaleFadeIn400ms
  ],

})
export class RolesPermissionsComponent implements OnInit {

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
  icChevron_Right = icChevron_Right;
  icExpand_More = icExpand_More;

  loginUser: LoginUser;

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

  constructor(@Inject(MAT_DIALOG_DATA,)public role: Roles,
              private dialogRef: MatDialogRef<RolesPermissionsComponent>,
              private fb: FormBuilder,
              private _alertService: AlertService,
              private _authService: AuthenticationService,
              private _roleService:RoleService,
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

  getParentItem(node: TodoItemFlatNode):any {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    if(parent)
     return parent.item;
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
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
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

  getSelected = () => this.checklistSelection.selected.map(f => f.id);

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getRolePermissions(this.role);
    }
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
      var screensData = [];debugger;
      role.Screens.forEach(screen => {
        var actions = [];
        screen.Actions.forEach(action => {
          var subactiondata = [];
          if(action.SubActions.length>0){
            action.SubActions.forEach(sub =>{
              const subactionjson={
                ItemId:sub.SubActionId,
                ItemName:sub.ActionName,
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
            children:subactiondata
          }
          actions.push(actionjson);
          //actions[action.ActionName]=subactiondata;

        });
        const screenjson={
          ItemId:screen.ScreenId,
          ItemName:screen.ScreenName,
          children:actions
        }
        screensData.push(screenjson);
        //screensData[screen.ScreenName] = actions;

      })
      this._treeviewDataService.initialize(screensData);

      role.Screens.forEach(screen => {
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
   });
  }
  
  savePermissions() {

    let moduleRolePermissions:ModuleRolePermissions = <ModuleRolePermissions>{};
    let screens=[];
    let actions=[];
    let selectedNodes = this.getSelected();

    moduleRolePermissions.CompanyId = this.loginUser.Company.Id;
    moduleRolePermissions.ModuleId = this.role.ModuleId;
    moduleRolePermissions.RoleId=this.role.RoleId;
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
    
    moduleRolePermissions.Screens=screens;
    moduleRolePermissions.Actions=actions;

    this._roleService.saveRolePermissions(moduleRolePermissions)
    .subscribe(screens => {
      this.dialogRef.close({data:screens});
      this._alertService.success("Role permissions updated successfully");
    }, error => {
      this._alertService.error(error);
    });
   
  }
}
