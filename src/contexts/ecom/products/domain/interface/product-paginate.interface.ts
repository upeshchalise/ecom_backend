import { PaginateRequest } from "../../../../../contexts/shared/domain/interface/paginate";

export interface ProductPaginateRequest extends PaginateRequest {
    search?: string,
    categories?: string[]
}