import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'cv-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss']
})
export class SelectDropdownComponent implements OnInit {
  @Input('selectList') dropdownList: any;
  @Input('label') label: any;
  @Input('value') value: any | null;
  @Input('required') isrequired: boolean | false;
  @Output('selectedData') selValue = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }
  selectedValue(event) {
    this.selValue.emit(event.value);
  }
}
