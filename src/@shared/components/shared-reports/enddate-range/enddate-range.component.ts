import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'cv-enddate-range',
  templateUrl: './enddate-range.component.html',
  styleUrls: ['./enddate-range.component.scss']
})
export class EnddateRangeComponent implements OnChanges {

  @Input('label') label: any;
  @Input('disabled') isDisabled: boolean | true;
  @Input('fromdate') FromDate: Date | null;
  @Input('todate') ToDate: Date | null;
  @Output('enddaterangeChange') enddaterangeChange = new EventEmitter<any>();

  start: FormControl = new FormControl();
  end: FormControl = new FormControl();
  endperiodrange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only process if fromdate or todate actually changed
    if (changes['FromDate'] || changes['ToDate']) {
      // Safely handle null or invalid dates
      this.FromDate = this.isValidDate(this.FromDate) ? new Date(this.FromDate) : null;
      this.ToDate = this.isValidDate(this.ToDate) ? new Date(this.ToDate) : null;

      if (!this.cdRef["destroyed"]) {
        this.cdRef.detectChanges();
      }
    }
  }

  private isValidDate(date: any): boolean {
    return date && date instanceof Date && !isNaN(date as any);
  }

  GetSelectedEndDataRange() {
    let output = {
      FDate: null,
      TDate: null,
    };

    if (this.isValidDate(this.FromDate)) {
      output.FDate = moment(this.FromDate).format("YYYY-MM-DDTHH:mm:ss.ms");
    }

    if (this.isValidDate(this.ToDate)) {
      output.TDate = moment(this.ToDate).format("YYYY-MM-DDTHH:mm:ss.ms");
    }
    this.enddaterangeChange.emit(output);
  }

  ClearFilterDates() {
    this.FromDate = null;
    this.ToDate = null;
    this.GetSelectedEndDataRange();
  }

}
