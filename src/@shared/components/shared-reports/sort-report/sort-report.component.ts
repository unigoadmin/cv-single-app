import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cv-sort-report',
  templateUrl: './sort-report.component.html',
  styleUrls: ['./sort-report.component.scss']
})
export class SortReportComponent implements OnInit {
  @Input('selectList') dropdownList: any;
  @Input('label') label: any;
  @Input('value') value: any | null;
  @Input('required') isrequired: boolean | false;
  @Output('selectedData') selValue = new EventEmitter<any>();
  ordervalue:any;
  constructor() { }

  ngOnInit(): void {
  }
  selectedValue(event) {
    this.selValue.emit(event.value);
  }

}
