export enum TokenScope {
    REFRESH,
    BUYER_ACCESS = 'buyer:access',
    SELLER_ACCESS = 'seller:access',
    ADMIN_ACCESS = 'admin:access'
  }
  export interface Payload {
    user_id: string;
    scope: TokenScope[];
    role: string;
  }