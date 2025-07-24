import { Component, Input, ViewChild, OnInit, OnChanges, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ColumnSettingsModel, TablePaginationSettingsConfig, TablePaginationSettingsModel } from './table-settings.model';
import { CommonModule, formatDate } from '@angular/common';
import { SharedLibraryModule } from '../../shared-library.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './zipper-table.component.html',
  styleUrls: ['./zipper-table.component.scss'],
  imports:[MatPaginatorModule,SharedLibraryModule , NgSelectModule,FormsModule,CommonModule],
  standalone:true,
})
export class ZipperTableComponent extends TablePaginationSettingsConfig implements OnInit, OnChanges {

  @Input() isRowBackgroundColor:boolean = false;
  selectedRowIndex = -1;

  @Input() isRefresh: boolean;

  @Input() enableDate: boolean;

  @Input() enableCheckbox: boolean;

  @Input() allowMultiSelect: boolean;

  @Input() sqColumnDefinition: ColumnSettingsModel[];
 
  @Input() rowData: object[];
 
  selection = new SelectionModel<{}>();

  dataSource: MatTableDataSource<{}>;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() roleType;
  @Output() getSelectedRows = new EventEmitter();
  @Output() download = new EventEmitter<any>();
  @Output() upload = new EventEmitter<any>();
  @Output() edit = new EventEmitter();
  @Output() isApproved = new EventEmitter();
  @Output() view = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() markAsDelivered = new EventEmitter();
  @Output() add = new EventEmitter();
  @Output() pageChanged = new EventEmitter();
  @Output() getFileId = new EventEmitter();
  searchValue: String;
  selected: any;
  filterDictionary = new Map<string, string>();
  @Input() override tablePaginationSettings?: TablePaginationSettingsModel;
  columnNames: string[] = [];
  filterName: string;

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) {
    super();

  }
  ngAfterViewInit() {
   this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setDynamicColumnWidths();


  }
  setDynamicColumnWidths() {
    setTimeout(() => {
      const headerCells = document.querySelectorAll('.mat-header-cell');
      const dataCells = document.querySelectorAll('.mat-cell');

      headerCells.forEach((headerCell: HTMLElement, index) => {
        const maxWidth = Array.from(dataCells)
          .filter((dataCell: HTMLElement, dataIndex) => dataIndex % this.sqColumnDefinition.length === index)
          .reduce((acc: number, curr: HTMLElement) => {
            return Math.max(acc, curr.clientWidth);
          }, 0);
        headerCell.style.width = `${maxWidth}px`;
      });

      this.cdr.detectChanges(); 
    });
  }

  ngOnChanges() {
    if (this.isRefresh) {
      this.dataSource._updateChangeSubscription();
    }
    else {
      this.dataSource = new MatTableDataSource(this.rowData);
      this.dataSource.filterPredicate = this.customFilter();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
  sendRow(element){
    this.getFileId.emit(element);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const dataCount = this.dataSource.data.reduce((count: number, _) => count + 1, 0);
    return numSelected === dataCount;
  }
  getUserData(element){
    this.getSelectedRows.emit(element);
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    this.getSelectedRows.emit(this.selection.selected);

  }
  rowSelect() {
    this.getSelectedRows.emit(this.selection.selected);
  }

  refreshView() {


    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }


  ngOnInit() {
    this.roleType
    this.selection = new SelectionModel<{}>(this.allowMultiSelect, []);
    this.dataSource = new MatTableDataSource(this.rowData);
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return searchTerms.every(([key, value]) => {
        if (key && value) {
          if (data[key]) {
            return data[key].toString().toLowerCase().includes(value.toLowerCase());
          }
          return false;
        }
        return true;
      });
    };
  }

  getVisibleColumns() {
    let columnNames = [];
    for (const column of this.sqColumnDefinition) {
      if (!column.hide)
        columnNames.push(column.name);
    }
    if (this.tablePaginationSettings.enableAction) {
      columnNames.push("action");
    }
    return columnNames;
  }

  highlight(row: any) {
    this.selectedRowIndex = row.position;
  }

  downloadFile(index, element) {
    this.download.emit({ index, element });
  }

  uploadFile(element) {
    this.upload.emit({ element });
  }

  editObj(element) {
    this.edit.emit(element);
  }
  isApprovedFun(element,action) {
    element.action = action;
    this.isApproved.emit(element);
  }
  viewObj(element) {
    this.view.emit(element);
  }

  deleteObj(index, item) {
    this.delete.emit({ index, item });
  }
  markAsDeliveredObj(element) {
    this.markAsDelivered.emit(element);
  }

  addObj(element) {
    this.add.emit(element);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  async applyInsyncFilter(value: any, colName: any, type: any) {
    this.dataSource.data
    this.rowData
     if (type == "date") {
      var filterDate = formatDate(value, 'dd-MMM-yy', "en-US");
      filterDate = filterDate.replace(/-/g, '');
      filterDate = filterDate.replace(/(^|\D)0(\d)/g, '$1$2');
      filterDate = filterDate.replace(/(\d{1,2})([A-Za-z]{3})(\d{2})/, '$1 $2 $3');
      this.filterDictionary.set(colName, filterDate);
    }
    else {
      this.filterDictionary.set(colName, value.value);
    }
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  resetFilters() {
    this.dataSource.filter = "";
    const dom: HTMLElement = this.elementRef.nativeElement;
    const elements = dom.querySelectorAll('.column-header-content');
    elements[0].setAttribute("value", "");
  }

  isSearchEnabled(column: ColumnSettingsModel) {
    return !(column.isSearchable == false);
  }

  customFilter() {
    let filterFunction = function (record: any, filter: string): boolean {
      const matchFilter = [];
      var map = new Map(JSON.parse(filter));

      for (let [key, value] of map) {
        const keyTyped = key as keyof typeof Object;
        if (value != "") {
          const customFilterAS = record[keyTyped] != null ? record[keyTyped].toLowerCase().includes(value.toString().toLowerCase()) : false;
          matchFilter.push(customFilterAS);
        } else {
          matchFilter.push(true);
        }
      }
      return matchFilter.every(Boolean);
    }
    return filterFunction
  }

  toggleColumn(event, column) {
    column.hide = !event.checked;
  }
  getChangedPageValue($event, searchKeyword = null) {
    this.pageChanged.emit({ $event, searchKeyword });
  }
  getValues(element, column) {
    if (typeof column?.valuePrepareFunction === 'function') {
      return column.valuePrepareFunction(element);
    }
    else {
      return element[column.name];
    }
  }

}
