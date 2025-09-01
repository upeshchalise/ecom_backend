import { HTTP401Error } from "../../../../contexts/shared/domain/errors/http.exception";
import { IProductRepository } from "../domain/repository/product.repository";
import { MESSAGE_CODES } from "../../../../contexts/shared/infrastructure/utils/message-code";

export class GetRecommendedProductServices {
    constructor(private readonly productRepository:IProductRepository){}
    public async invoke(userId: string): Promise<any> {
        if(!userId) {
            throw new HTTP401Error(MESSAGE_CODES.NOT_AUTHORIZED)
        }
        return this.productRepository.getRecommendedProducts(userId)
    }
}