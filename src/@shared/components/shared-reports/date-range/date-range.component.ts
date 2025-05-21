import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'cv-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit, OnChanges {
  @Input('disabled') isDisabled: boolean | true;
  @Input('fromdate') FromDate: Date | null;
  @Input('todate') ToDate: Date | null;
  @Output('dateChange') datechange=new EventEmitter<any>();

  @Input('selectList') dropdownList: any;
  @Input('label') label: any;
  @Input('value') value: any | null;
  @Input('required') isrequired: boolean | false;
  @Output('selectedData') selValue = new EventEmitter<any>();

  start: FormControl = new FormControl();
  end: FormControl = new FormControl();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

  }
  ngOnChanges(...args: any[]) {
    this.FromDate=new Date(this.FromDate)
    this.ToDate=new Date(this.ToDate);
    console.log(this.FromDate + " " + this.ToDate)
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  ClearFilterDates() {

  }
  GetTimesheetData() {
    let output={
      FDate:null,
      TDate:null,
    }
    if (this.FromDate != null) {
      output.FDate = moment(this.FromDate).format("YYYY-MM-DDTHH:mm:ss.ms");
    }
    if (this.ToDate != null) {
      output.TDate = moment(this.ToDate).format("YYYY-MM-DDTHH:mm:ss.ms");
    }
    this.datechange.emit(output);
  }

  selectedValue(event) {
    this.selValue.emit(event.value);
  }
}
