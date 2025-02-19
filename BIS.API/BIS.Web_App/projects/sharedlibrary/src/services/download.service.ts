import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }


  async SaveExcel(worksheet, workbook, fileName, data, header, amountCell = null) {
      // Create a workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([header, ...data]); // Create sheet from header and data
    
      // If amountCell is provided, calculate and add total
      if (amountCell != null) {
          const totalAmount = data.reduce((sum, item) => sum + item[amountCell], 0);
          let lastRowArray = [];
          const amountIndex = header.indexOf(amountCell);
          header.forEach((item, index) => {
              if (index === 0) {
                  lastRowArray.push('Total');
              } else if (item == amountCell) {
                  lastRowArray.push(totalAmount)
              } else {
                  lastRowArray.push('');
              }
          });
          ws['!rows'] = [...ws['!rows'] || [], { hpt: 20 }]; // Set row height for total row
          ws['!ref'] = `A1:${String.fromCharCode(64 + header.length)}${data.length + 2}`; // Update sheet range
          XLSX.utils.sheet_add_aoa(ws, [lastRowArray], { origin: -1 }); // Add last row for total
      }
  
      // Apply column width
      const colWidths = header.map(() => ({ wpx: 100 })); // Define column widths for each column
      ws['!cols'] = colWidths;
  
      // Apply basic cell styles for the header row (Apply style directly to cell)
      for (let colIndex = 0; colIndex < header.length; colIndex++) {
          const cell = ws[XLSX.utils.encode_cell({ r: 0, c: colIndex })]; // Get header cell
          if (cell) {
              // Apply styles to header
              cell.s = {
                  font: { bold: true, color: { rgb: 'white' } },  // White text
                  fill: { fgColor: { rgb: 'green' } }, // Green background
                  alignment: { horizontal: 'center', vertical: 'center' }, // Center alignment
                  border: {
                      top: { style: 'thin', color: { rgb: 'black' } },
                      left: { style: 'thin', color: { rgb: 'black' } },
                      bottom: { style: 'thin', color: { rgb: 'black' } },
                      right: { style: 'thin', color: { rgb: 'black' } },
                  },
              };
          }
      }
  
      // Apply final row style (Total row)
      const lastRowIdx = data.length + 1;
      for (let colIndex = 0; colIndex < header.length; colIndex++) {
          const cell = ws[XLSX.utils.encode_cell({ r: lastRowIdx, c: colIndex })]; // Get last row cell
          if (cell) {
              cell.s = {
                  font: { bold: true, color: { rgb: 'FFFF0000' } }, // Red text
                  fill: { fgColor: { rgb: 'FFFFFF00' } }, // Yellow background
                  alignment: { horizontal: 'center', vertical: 'center' }, // Center alignment
                  border: {
                      top: { style: 'thin', color: { rgb: 'FF000000' } },
                      left: { style: 'thin', color: { rgb: 'FF000000' } },
                      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
                      right: { style: 'thin', color: { rgb: 'FF000000' } },
                  },
              };
          }
      }
  
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Master Data');
  
      // Save the file using Blob
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
  }
  

}
