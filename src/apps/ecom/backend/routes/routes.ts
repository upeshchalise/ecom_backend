import { Request, Response, NextFunction, Router } from "express";
import { HealthCheckRouter } from './health-check.routes'
import { UsersRouter } from "./users.routes";
import { CommonRouter } from "./common.routes";
import { AdminRouter } from "./admin.routes";
import { ProductRouter } from "./product.routes"
import * as controllers from '../controllers';
import { IAuthorizer } from "../../../../contexts/shared/domain/interface/IAuthorizer";

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
    getProductsByCategoryController: controllers.GetProductsByCategoryController,
    adminAuthorizer: IAuthorizer<Request, Response, NextFunction>,
    userAuthorizer: IAuthorizer<Request, Response, NextFunction>

): Router => {
    const apiRouter = Router();
    HealthCheckRouter(
        healthCheckController,
        apiRouter
    ),
        UsersRouter(
            createUserController,
            getUserByIdController,
            userLoginController,
            updateUserController,
            apiRouter
        )
    CommonRouter(
        uploadImageController,
        apiRouter
    )
    AdminRouter(
        adminCreateCategoryController,
        adminCreateProductController,
        adminAuthorizer,
        userAuthorizer,
        apiRouter
    )
    ProductRouter(
        getAllProductsController,
        getProductByIdController,
        getAllCategoriesController,
        getProductsByCategoryController,
        apiRouter
    )
    return apiRouter;
}