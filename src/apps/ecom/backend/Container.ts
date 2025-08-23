import { AwilixContainer, InjectionMode, asClass, asFunction, createContainer } from 'awilix';
import { Router } from './Router';
import { Server } from './Server';
import { MasterRouter } from './routes/routes';
import { createPrismaClient } from '../../../contexts/shared/infrastructure/persistence/prisma';
import { ServerLogger } from '../../../contexts/shared/infrastructure/winstonLogger';
import * as ApiControllers from './controllers';
import { ErrorMiddleware } from '../../../contexts/shared/infrastructure/middleware/error-middleware';
import { PrismaUserRepository } from '../../../contexts/ecom/users/infrastructure/prisma-user.repository';
import { CreateUserService } from '../../../contexts/ecom/users/application/create-user.services';
import { GetUserByEmailService } from '../../../contexts/ecom/users/application/get-user-by-email.services';
import { GetUserByIdService } from '../../../contexts/ecom/users/application/get-user-by-id.services';
import { JWTAdminAuthorizer } from '../../../contexts/shared/infrastructure/authorizer/admin-authorizer';
import { JWTUserAuthorizer } from '../../../contexts/shared/infrastructure/authorizer/user-authorizer';
import { PrismaProductRepository } from '../../../contexts/ecom/products/infrastructure/prisma-product.repository';
import { AdminCreateCategoryService } from '../../../contexts/ecom/products/application/admin-create-category.services';
import { AdminCreateProductServices } from '../../../contexts/ecom/products/application/admin-create-product.services';
import { GetCategoryById } from '../../../contexts/ecom/products/application/get-category-by-id.services';
import { GetAllProductsService } from '../../../contexts/ecom/products/application/get-all-products.services';
import { GetProductByIdServices } from '../../../contexts/ecom/products/application/get-product-by-id.services';
import { GetAllCategoriesServices } from '../../../contexts/ecom/products/application/get-all-categories.services';
import { GetProductsByCategoryServices } from '../../../contexts/ecom/products/application/get-products-by-category.services';
import { UpdateUserServices } from '../../../contexts/ecom/users/application/update-user.services';
import { GetCategoryByName } from '../../../contexts/ecom/products/application/get-category-by-name.services';
import { AdminGetAllCategoriesService } from '../../../contexts/ecom/products/application/admin-get-all-categories.services';
import { AdminGetAllProductsByCategoryIdService } from '../../../contexts/ecom/products/application/admin-get-all-products-by-category-id.services';
import { AdminGetAllUsersService } from '../../../contexts/ecom/users/application/admin-get-all-users.services';


export class Container {
  private readonly container: AwilixContainer;

  constructor() {
    this.container = createContainer({
      injectionMode: InjectionMode.CLASSIC
    });

    this.register();
  }

  public register(): void {
    this.container.register({
      server: asClass(Server).singleton(),
      router: asFunction(Router).singleton(),
      logger: asClass(ServerLogger).singleton(),
      db: asFunction(createPrismaClient).singleton(),

    })
      .register({
        errorMiddleware: asClass(ErrorMiddleware).singleton(),
        masterRouter: asFunction(MasterRouter).singleton()
      })
      .register({
        healthCheckController: asClass(ApiControllers.HealthCheckController).singleton(),
        uploadImageController: asClass(ApiControllers.UploadImageController).singleton(),
      })
      // user
      .register({
        createUserService: asClass(CreateUserService).singleton(),
        createUserController: asClass(ApiControllers.CreateUserController).singleton(),
        getUserByEmailService: asClass(GetUserByEmailService).singleton(),
        getUserByIdService: asClass(GetUserByIdService).singleton(),
        getUserByIdController: asClass(ApiControllers.GetUserByIdController).singleton(),
        userLoginController: asClass(ApiControllers.UserLoginController).singleton(),
        updateUserServices: asClass(UpdateUserServices).singleton(),
        updateUserController: asClass(ApiControllers.UpdateUserController).singleton(),
        adminGetAllUsersService: asClass(AdminGetAllUsersService).singleton(),
        adminGetAllUsersController: asClass(ApiControllers.AdminGetAllUsersController).singleton(),
        userRepository: asClass(PrismaUserRepository).singleton(),
      })
      // products
      .register({
        adminCreateCategoryController: asClass(ApiControllers.AdminCreateCategoryController).singleton(),
        adminCreateCategoryService: asClass(AdminCreateCategoryService).singleton(),
        adminCreateProductController: asClass(ApiControllers.AdminCreateProductController).singleton(),
        adminCreateProductServices: asClass(AdminCreateProductServices).singleton(),
        getCategoryById: asClass(GetCategoryById).singleton(),
        getAllProductsService: asClass(GetAllProductsService).singleton(),
        getAllProductsController: asClass(ApiControllers.GetAllProductsController).singleton(),
        getProductByIdServices: asClass(GetProductByIdServices).singleton(),
        getProductByIdController: asClass(ApiControllers.GetProductByIdController).singleton(),
        getAllCategoriesServices: asClass(GetAllCategoriesServices).singleton(),
        getAllCategoriesController: asClass(ApiControllers.GetAllCategoriesController).singleton(),
        adminGetAllCategoriesService: asClass(AdminGetAllCategoriesService).singleton(),
        adminGetAllCategories: asClass(ApiControllers.AdminGetAllCategories).singleton(),
        getProductsByCategoryServices: asClass(GetProductsByCategoryServices).singleton(),
        getProductsByCategoryController: asClass(ApiControllers.GetProductsByCategoryController).singleton(),
        adminGetAllProductsByCategoryIdService: asClass(AdminGetAllProductsByCategoryIdService).singleton(),
        adminGetProductsByCategoryIdController: asClass(ApiControllers.AdminGetProductsByCategoryIdController).singleton(),
        getCategoryByName:asClass(GetCategoryByName).singleton(),
        productRepository: asClass(PrismaProductRepository)
      })

      .register({
        paymentController: asClass(ApiControllers.PaymentController).singleton(),
        esewaVerifyController: asClass(ApiControllers.EsewaVerifyController).singleton(),
      })
      .register({
        adminAuthorizer: asClass(JWTAdminAuthorizer).singleton(),
        userAuthorizer: asClass(JWTUserAuthorizer).singleton()

      })
  }


  public invoke(): AwilixContainer {
    return this.container;
  }
}