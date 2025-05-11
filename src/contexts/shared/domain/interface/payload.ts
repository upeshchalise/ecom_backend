export enum TokenScope {
    REFRESH,
    USER_ACCESS= 'user:access',
    ADMIN_ACCESS = 'admin:access'
  }
  export interface Payload {
    user_id: string;
    scope: TokenScope[];
    role: string;
  }