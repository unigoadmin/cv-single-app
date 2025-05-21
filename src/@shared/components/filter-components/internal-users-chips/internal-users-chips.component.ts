import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, merge } from 'rxjs';
import { distinct, map } from 'rxjs/operators';
import { LoginUser } from 'src/@shared/models';
import { assign } from 'src/@shared/models/assign';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { CommonService } from 'src/@shared/http/common.service';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'cv-internal-users-chips',
  templateUrl: './internal-users-chips.component.html',
  styleUrls: ['./internal-users-chips.component.scss']
})
export class InternalUsersChipsComponent implements OnInit {
  
  @Input('resetUsersChip') resetUsersChip: boolean;
  @Input('existingAssigness') existingAssigness = [];
  @Input('module') ModuleId: string;
  @Input('IsMultiple') IsMultiple: boolean = false;
  @Input('ctrlName') ctrlName :string;
  addOnBlur: boolean = false;
  removable: boolean = true;
  assigneesselectable: boolean = true;
  assigneesremovable: boolean = true;
  loginUser: LoginUser;
  assignees: assign[] = [];
  benchSubUsers: SubUsers[];
  SelectedAssigness: assign[] = [];
  filteredAssignees: Observable<any[]>;
  AssigneeCtrl = new FormControl();
  icClose=icClose;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @ViewChild('AssigneeInput') AssigneeInput: ElementRef;

  @Output() out_selectedAssigness = new EventEmitter<any>();

  constructor(
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private _commonService: CommonService
  ) {
    this.filteredAssignees = this.AssigneeCtrl.valueChanges.pipe(
      map((item: string | null) => item ? this._Assignfilter(item) : this.assignees.slice()));
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(...args: any[]) {
    this.loginUser = this._authService.getLoginUser();
    if(this.loginUser){
      this.GetUsers();
      if(this.resetUsersChip){
       this.resetData();
      }
    }
    
  }


  MapExistingAssignes(){
    if(this.existingAssigness.length > 0){
      this.existingAssigness.forEach(element => {
        let Assigitem = this.benchSubUsers.find(x => x.UserId == element);
        let exitem = this.SelectedAssigness.find(x => x.value == Assigitem.UserId);
        if (!exitem){
          this.SelectedAssigness.push({ name: Assigitem.FullName, value: Assigitem.UserId, email: Assigitem.PrimaryEmail, mapping: true })
        }
      })
      this.out_selectedAssigness.emit(this.SelectedAssigness);
    }
  }

  GetUsers() {
    this.assignees = [];
    this._commonService.getInternalUsersByModuleId(this.loginUser.Company.Id,this.ModuleId)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail, mapping: false });
            });
            this.MapExistingAssignes();
        },
        error => {
          this._alertService.error(error);
        });
  }

  private _Assignfilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.assignees.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }

  assigneesremove(assigneeitem: any): void {debugger;
    let exitem = this.SelectedAssigness.find(x => x.value == assigneeitem.value);
    if (exitem) {
       exitem.mapping=false;
    }
    // const index = this.SelectedAssigness.indexOf(assigneeitem);
    // if (index >= 0) {
    //   this.SelectedAssigness[index].mapping=false;
    //   //this.SelectedAssigness.splice(index, 1);
    // }
    this.out_selectedAssigness.emit(this.SelectedAssigness);
  }

  Assigneeselected(event: MatAutocompleteSelectedEvent): void {
    const newassing = new assign();
    newassing.name = event.option.viewValue;
    newassing.value = event.option.value;
    newassing.email = this.assignees.find(x => x.value == event.option.value).email;
    newassing.mapping=true;
    let exitem = this.SelectedAssigness.find(x => x.value == newassing.value);
    if (!exitem) {
      this.SelectedAssigness.push(newassing);
      this.out_selectedAssigness.emit(this.SelectedAssigness);
    }
    this.AssigneeInput.nativeElement.value = '';
    this.AssigneeCtrl.setValue(null);
  }

  resetData() {
    // Implement the logic to reset data in the child component
    this.SelectedAssigness = []; // or reset to initial value
    
  }

 

}
