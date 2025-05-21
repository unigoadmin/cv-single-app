import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import icViewHeadline from '@iconify/icons-ic/twotone-view-headline';
import { Icon } from '@visurel/iconify-angular';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import icHistory from '@iconify/icons-ic/twotone-history';
import icStar from '@iconify/icons-ic/twotone-star';
import icLabel from '@iconify/icons-ic/twotone-label';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import icPerson from '@iconify/icons-ic/person';
import icPerson_Pin from '@iconify/icons-ic/person-pin';
import isSupervisor_Account from '@iconify/icons-ic/supervisor-account'
import { RolesTableMenu } from '../../core/models';

@Component({
  selector: 'cv-roles-table-menu',
  templateUrl: './roles-table-menu.component.html',
  animations: [fadeInRight400ms, stagger40ms]
})
export class RolesTableMenuComponent implements OnInit {

  @Input() items: RolesTableMenu[] ;

  @Output() filterChange = new EventEmitter<string>();
  @Output() openAddNew = new EventEmitter<void>();

  activeCategory: RolesTableMenu['id'] = null;
  icPersonAdd = icPersonAdd;

  constructor() { }

  ngOnInit() {
    this.setFilter(this.items[1].id)
  }

  setFilter(category?: string) {
    this.activeCategory = category;
    return this.filterChange.emit(category);
  }

  isActive(category: RolesTableMenu['id']) {
    return this.activeCategory === category;
  }
}
