export interface PaginateRequest {
    page?: number;
    limit?: number
}

export interface PaginateResponse<T> {
    meta: {
        limit: number;
        total_records: number;
        total_pages: number;
        current_page: number;
        is_first_page: boolean;
        is_last_page: boolean;
    };
    data: T
}