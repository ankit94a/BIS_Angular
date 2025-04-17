export class EnumBase {
  public get PermissionAction() {
    return PermissionAction;
  }
  public get PermissionItem() {
    return PermissionItem;
  }
  public get RoleType() {
    return RoleType;
  }
  public get NotificationType() {
    return NotificationType;
  }
}

export enum NotificationType {
  MasterData = 1,
  GenerateReport = 2,
  ApprovedReport = 3
}

export enum PermissionItem {
  Dashboard = 'Dashboard',
  User = 'User',
  Sample = 'Sample',
  Supplier = 'Supplier',
  Buyer = "Buyer",
  Category = 'Category',
  Facility = 'Facility',
  Inventory = 'Inventory',
  UserRole = 'UserRole',
  Catalogue = 'Catalogue',
  BuyerPo = 'BuyerPo',
  SupplierOrder = 'SupplierOrder',
  InventoryInward = 'InventoryInward',
  ChannelSku = 'ChannelSku',
  CustomerOrder = 'CustomerOrder',
  Dispatch = 'Dispatch',
  UserMapping = 'UserMapping',
  Report = 'Report',
  InventoryQC = 'InventoryQC',
  InventoryPackaging = 'InventoryPackaging',
  InventoryProcess = 'InventoryProcess',
  InventoryTransfer = 'InventoryTransfer',
  Attribute = 'Attribute'
}


export enum PermissionAction {
  Read = 'Read',
  Create = 'Create',
  Update = 'Update',
  ReadAll = 'ReadAll',
  Delete = 'Delete',

}

// export enum RoleType {
//   Staff1 = "Staff1",
//   G1Int = "G1Int",
//   Colgs = "Colgs",
//   ColInt = "ColInt",
//   Bgs = "Bgs",
//   Mggs = "Mggs",
//   Goc = "Goc",
//   Admin = "Admin",
//   SuperAdmin = "SuperAdmin"
// }
export enum RoleType {
  Staff1 = 1,
  G1Int,
  Colgs,
  ColInt,
  Bgs,
  Mggs,
  Goc,
  Admin,
  SuperAdmin,
  StaffEc,
  G1IntEc,
  ColIntEc,
  BgsEc,
  MggsEc,
  GocEc
}

export enum FilterType {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly"
}

export enum Status {
  Created = 1,
  Progress = 2,
  Approved = 3,
  Rejected = 4
}

export enum AllCorps{
  HQ_Eastern = 1,
  HQ_33Corps,
  HQ_3Corps,
  HQ_4Corps,
  HQ_17Corps
}
export enum AllDivision{
  HQ_17Mtn_Div = 1,
  HQ_20Mtn_Div,
  HQ_27Mtn_Div,
  HQ_111_SubArea,
  HQ_2Mtn_Div,
  HQ_56Inf_Div,
  HQ_57Mtn_Div,
  HQ_5Mtn_Div,
  HQ_71Inf_Div,
  HQ_21Mtn_Div,
  HQ_23Inf_Div,
  HQ_59Mtn_Div
}
