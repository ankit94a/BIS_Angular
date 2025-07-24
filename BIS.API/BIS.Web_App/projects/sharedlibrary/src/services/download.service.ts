import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }


  async SaveExcel(worksheet, workbook, fileName, data, header, amountCell = null) {

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([header, ...data]); 
    
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
          ws['!rows'] = [...ws['!rows'] || [], { hpt: 20 }]; 
          ws['!ref'] = `A1:${String.fromCharCode(64 + header.length)}${data.length + 2}`; 
          XLSX.utils.sheet_add_aoa(ws, [lastRowArray], { origin: -1 }); 
      }

      const colWidths = header.map(() => ({ wpx: 100 }));
      ws['!cols'] = colWidths;
  
      for (let colIndex = 0; colIndex < header.length; colIndex++) {
          const cell = ws[XLSX.utils.encode_cell({ r: 0, c: colIndex })]; 
          if (cell) {
              cell.s = {
                  font: { bold: true, color: { rgb: 'white' } }, 
                  fill: { fgColor: { rgb: 'green' } },
                  alignment: { horizontal: 'center', vertical: 'center' }, 
                  border: {
                      top: { style: 'thin', color: { rgb: 'black' } },
                      left: { style: 'thin', color: { rgb: 'black' } },
                      bottom: { style: 'thin', color: { rgb: 'black' } },
                      right: { style: 'thin', color: { rgb: 'black' } },
                  },
              };
          }
      }
  
      const lastRowIdx = data.length + 1;
      for (let colIndex = 0; colIndex < header.length; colIndex++) {
          const cell = ws[XLSX.utils.encode_cell({ r: lastRowIdx, c: colIndex })]; 
          if (cell) {
              cell.s = {
                  font: { bold: true, color: { rgb: 'FFFF0000' } }, 
                  fill: { fgColor: { rgb: 'FFFFFF00' } }, 
                  alignment: { horizontal: 'center', vertical: 'center' }, 
                  border: {
                      top: { style: 'thin', color: { rgb: 'FF000000' } },
                      left: { style: 'thin', color: { rgb: 'FF000000' } },
                      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
                      right: { style: 'thin', color: { rgb: 'FF000000' } },
                  },
              };
          }
      }
 
      XLSX.utils.book_append_sheet(wb, ws, 'Master Data');

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
  }
  

}
