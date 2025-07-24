
export class TablePaginationSettingsConfig {
    tablePaginationSettings?: TablePaginationSettingsModel;
    constructor() {
        this.tablePaginationSettings = <TablePaginationSettingsModel>{};
        this.tablePaginationSettings.enablePagination = true;
        this.tablePaginationSettings.pageSize = 50;
        this.tablePaginationSettings.pageSizeOptions = [50, 100, 250];
        this.tablePaginationSettings.showFirstLastButtons = true;
        this.tablePaginationSettings.enableDownload = false;
        this.tablePaginationSettings.enableUpload = false;
        this.tablePaginationSettings.enableDelete = false;
        this.tablePaginationSettings.enableAction = false;
        this.tablePaginationSettings.enableView = false;
        this.tablePaginationSettings.enableEdit = false;
        this.tablePaginationSettings.enableColumn = false;
    }


}
export interface TablePaginationSettingsModel {
    enablePagination: boolean;
    pageSize: number;
    pageSizeOptions: number[];
    showFirstLastButtons: boolean;
    enableDownload: boolean;
    enableUpload: boolean;
    enableDelete: boolean;
    enableAction: boolean;
    enableView: boolean;
    enableEdit: boolean;
    enableColumn: boolean;
    enablemarkAsDelivered: boolean;
    enableAdd: boolean;
    enableApproved:boolean;
}

export  class ColumnSettingsModel {
    icon?: string;
    name: string;
    displayName: string;
    disableSorting?: boolean;
    hide?: boolean=false;
    valueType?:string;
   isSearchable?:boolean=true;
   type?:string;
   sortDirection?:string;
   isSearchEnabled?:boolean=false
}

