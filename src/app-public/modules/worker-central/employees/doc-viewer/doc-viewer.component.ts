import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'cv-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit {
  icClose = icClose;
  constructor(
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<DocViewerComponent>,
  ) { }

  ngOnInit(): void {
    debugger
    this.Data
  }

}
