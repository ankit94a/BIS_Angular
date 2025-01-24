import { Component, Input, AfterViewInit, ViewChild, OnInit, OnChanges, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ColumnSettingsModel, TablePaginationSettingsConfig, TablePaginationSettingsModel } from './table-settings.model';
import { CommonModule, formatDate } from '@angular/common';
import { CustomViewComponent } from './custom-view.component';
import { SharedLibraryModule } from '../../shared-library.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './zipper-table.component.html',
  styleUrls: ['./zipper-table.component.scss'],
  imports:[CustomViewComponent,MatPaginatorModule,SharedLibraryModule , NgSelectModule,
      FormsModule,CommonModule],
  standalone:true,
  providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        
          {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { subscriptSizing: 'dynamic' },
          },
         
        
      ]
})
export class ZipperTableComponent extends TablePaginationSettingsConfig implements OnInit, OnChanges {


  selectedRowIndex = -1;

  @Input() isRefresh: boolean;

  /**
   * @description Column names for the table
   */
  /**
   * @description enable date input in Search Box
   */
  @Input() enableDate: boolean;
  /**
   * @description enable selection of rows
   */
  @Input() enableCheckbox: boolean;


  /**
   * @description Allowing/Dis-allowing multi-selection of rows
   */
  @Input() allowMultiSelect: boolean;
  /**
   * @description `sqColumnDefinition` is additional configuration settings provided to `sq-table`.Refer [sqColumnDefinition].
   */
  @Input() sqColumnDefinition: ColumnSettingsModel[];
  /**
   * @description Data which will be displayed in tabular format
   */
  @Input() rowData: object[];
  /**
   * @description variable to store selection data
   */
  selection = new SelectionModel<{}>();
  /**
   * @description Local variable to convert JSON data object to MatTableDataSource
   */
  dataSource: MatTableDataSource<{}>;
  /**
   * @description ViewChild to get the MatSort directive from DOM
   */
  @ViewChild(MatSort) sort: MatSort;
  /**
   * @description ViewChild to get the MatPaginator directive from DOM
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /**
   * @description Lifecycle hook that is called after a component's view has been fully initialized.
   */
  @Output() getSelectedRows = new EventEmitter();
  @Output() download = new EventEmitter<any>();
  @Output() upload = new EventEmitter<any>();
  @Output() edit = new EventEmitter();
  @Output() view = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() markAsDelivered = new EventEmitter();
  @Output() add = new EventEmitter();
  @Output() pageChanged = new EventEmitter();
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
    // to put where you want the sort to be programmatically triggered, for example inside ngOnInit
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

      this.cdr.detectChanges(); // Trigger change detection to apply changes
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const dataCount = this.dataSource.data.reduce((count: number, _) => count + 1, 0);
    return numSelected === dataCount;
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
    // Condition to add selection column to the table
    if (this.enableCheckbox) {
      this.columnNames.splice(0, 0, 'select');
      this.sqColumnDefinition.splice(0, 0, {
        'name': 'select',
        'hide': false,
        'displayName': '',
        // dropDownList: undefined
      });
    }
    this.selection = new SelectionModel<{}>(this.allowMultiSelect, []);
    this.dataSource = new MatTableDataSource(this.rowData);
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
    //Condition to add selection column to the table
    // if (this.enableCheckbox) {

    //   columnNames.splice(0, 0, 'select');
    //   this.sqColumnDefinition.splice(0, 0, {
    //     'name': 'select',
    //     'hide':false,
    //     'displayName': '#'
    //   });
    // }
    return columnNames;
  }


  /** Highlights the selected row on row click. */
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
    console.log(elements[0]);
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
          // push boolean values into array
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
