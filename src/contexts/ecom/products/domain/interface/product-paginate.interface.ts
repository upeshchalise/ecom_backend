import { PaginateRequest } from "../../../../../contexts/shared/domain/interface/paginate";

export interface ProductPaginateRequest extends PaginateRequest {
    categories?: string[]
}
export interface SalesAnalytics {
    total_sales: number;
    users: number;
    count: number
}

export interface CategoryIds {
    categories: { id: string; }[]; 
}