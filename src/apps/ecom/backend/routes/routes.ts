import { Request, Response, NextFunction, Router } from "express";
import { HealthCheckRouter } from './health-check.routes'
import { UsersRouter } from "./users.routes";
import { CommonRouter } from "./common.routes";
import { AdminRouter } from "./admin.routes";
import { ProductRouter } from "./product.routes"
import * as controllers from '../controllers';
import { IAuthorizer } from "../../../../contexts/shared/domain/interface/IAuthorizer";
import { PaymentRouter } from "./payment.routes";

export const MasterRouter = (
    // healthCheck
    healthCheckController: controllers.HealthCheckController,
    createUserController: controllers.CreateUserController,
    uploadImageController: controllers.UploadImageController,
    userLoginController: controllers.UserLoginController,
    getUserByIdController: controllers.GetUserByIdController,
    updateUserController: controllers.UpdateUserController,
    adminCreateCategoryController: controllers.AdminCreateCategoryController,
    adminCreateProductController: controllers.AdminCreateProductController,
    getAllProductsController: controllers.GetAllProductsController,
    getProductByIdController: controllers.GetProductByIdController,
    getAllCategoriesController: controllers.GetAllCategoriesController,
    adminGetAllCategories: controllers.AdminGetAllCategories,
    getProductsByCategoryController: controllers.GetProductsByCategoryController,
    adminGetProductsByCategoryIdController: controllers.AdminGetProductsByCategoryIdController,
    paymentController: controllers.PaymentController,
    adminGetAllUsersController: controllers.AdminGetAllUsersController,
    esewaVerifyController: controllers.EsewaVerifyController,
    adminGetSalesAnalyticsController: controllers.AdminGetSalesAnalyticsController,
    updateUserInteractionController: controllers.UpdateUserInteractionController,
    getRecommendedProductController: controllers.GetRecommendedProductController,
    deleteProductController: controllers.DeleteProductController,
    updateProductController: controllers.UpdateProductController,
    adminAuthorizer: IAuthorizer<Request, Response, NextFunction>,
    userAuthorizer: IAuthorizer<Request, Response, NextFunction>

): Router => {
    const apiRouter = Router();
    HealthCheckRouter(
        healthCheckController,
        apiRouter
    )
    UsersRouter(
        createUserController,
        getUserByIdController,
        userLoginController,
        updateUserController,
        userAuthorizer,
        apiRouter
    )
    CommonRouter(
        uploadImageController,
        apiRouter
    )
    AdminRouter(
        adminCreateCategoryController,
        adminCreateProductController,
        adminGetAllCategories,
        adminGetProductsByCategoryIdController,
        adminGetAllUsersController,
        adminGetSalesAnalyticsController,
        adminAuthorizer,
        userAuthorizer,
        apiRouter
    )
    ProductRouter(
        getAllProductsController,
        getProductByIdController,
        getAllCategoriesController,
        getProductsByCategoryController,
        updateUserInteractionController,
        getRecommendedProductController,
        deleteProductController,
        updateProductController,
        userAuthorizer,
        apiRouter
    )
    PaymentRouter(
        paymentController,
        esewaVerifyController,
        userAuthorizer,
        apiRouter
    )
    return apiRouter;
}