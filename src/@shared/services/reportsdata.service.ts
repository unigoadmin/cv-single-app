import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReportDataService {
  private reportData: any;

  setReportData(data: any): void {
    this.reportData = data;
  }

  getReportData(): any {
    return this.reportData;
  }

  clearReportData(): void {
    this.reportData = null;
  }
}
