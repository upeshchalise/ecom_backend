import { SalesAnalytics } from "../domain/interface/product-paginate.interface";
import { IProductRepository } from "../domain/repository/product.repository";

export class AdminGetSalesAnalysisService {
    constructor(
        private readonly productRepository: IProductRepository
    ) { }

    async invoke(endDate: string): Promise<SalesAnalytics> {
        return await this.productRepository.salesAnalysis(endDate)
    }
}