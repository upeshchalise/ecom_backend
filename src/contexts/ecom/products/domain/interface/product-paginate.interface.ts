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

export interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    quantity?: number;
    categories?: string[];
}