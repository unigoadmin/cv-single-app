export interface TalentCentralNotifications {
  NotificationType: string;
  NotificationLabel:string;
  SendNotification: boolean;
  }

  export interface TalentCentralSettings {
    TcSettings_id: number;
    CompanyId: number;
    NotificationSettings: string;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate?: Date;
    NotficationsItems: TalentCentralNotifications[];
  }