import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root',
})

export class ExcelService {
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

  reqsuition_exportToExcel(data: any[], prefix: string): void {
    debugger;
    if (data.length === 0) {
      console.error('Data array is empty. Cannot generate headers.');
      return;
    }
    // Extract headers dynamically from the first object in the data array
    const headers = Object.keys(data[0]);

    // Create a worksheet with headers
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: headers });

    // Generate filename with date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace(/:/g, '-'); // Format as YYYY-MM-DDTHH-mm-ss
    const fileName = `${prefix}_${formattedDate}`;

    // Save the workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

}