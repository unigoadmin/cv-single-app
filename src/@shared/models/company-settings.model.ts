export interface CompanySessionSettings {
    IdleTimeout?: number;
    SessionTimeout?: number;
    KeepAliveInterval?: number;
}

export interface CompanySettingsResponse {
    Data: CompanySessionSettings;
}