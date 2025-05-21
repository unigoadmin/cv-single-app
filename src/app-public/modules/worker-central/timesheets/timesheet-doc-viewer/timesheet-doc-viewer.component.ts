import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'cv-timesheet-doc-viewer',
  templateUrl: './timesheet-doc-viewer.component.html',
  styleUrls: ['./timesheet-doc-viewer.component.scss']
})
export class TimesheetDocViewerComponent implements OnInit {
  icClose = icClose;
  constructor(
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<TimesheetDocViewerComponent>,
  ) { }

  ngOnInit(): void {
    this.Data
  }
}
