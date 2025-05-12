export interface IProductRepository {
    createCategory(name: string): Promise<void>
}