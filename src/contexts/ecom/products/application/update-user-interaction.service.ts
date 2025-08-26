import { InteractionType } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class UpdateUserInteractionService {
    constructor(private readonly productRepository: IProductRepository) { }

    async invoke(userId: string, categoryIds: string[], interactionType: InteractionType): Promise<void> {
        if(!userId || !categoryIds || categoryIds.length === 0 || !interactionType) {
            throw new Error("Invalid input");
        }
        return this.productRepository.updateRecommendationTable(userId, categoryIds, interactionType);
    }
}