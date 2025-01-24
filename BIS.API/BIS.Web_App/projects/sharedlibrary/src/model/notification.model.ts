import { BaseEntity } from "./base.model";
import { NotificationType, RoleType } from "./enum";

export class NotificationModel extends BaseEntity{
   senderEntityId: number;
   receiverEntityId: number;
   receiverEntityType: RoleType;
   notificationType: NotificationType;
   content: string;
   title:string;
   senderEntityType: RoleType
   isActionRequired: boolean;
   isReaded: boolean;
   dataId:number;
}