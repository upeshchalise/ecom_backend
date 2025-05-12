import { AwilixContainer, InjectionMode, asClass, asFunction, asValue, createContainer } from 'awilix';
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


export class Container {
    private readonly container: AwilixContainer;

    constructor() {
        this.container = createContainer({
          injectionMode: InjectionMode.CLASSIC
        });
    
        this.register();
      }

      public register():void {
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
          userRepository: asClass(PrismaUserRepository).singleton(),
        })
        // products
        .register({
          adminCreateCategoryController : asClass(ApiControllers.AdminCreateCategoryController).singleton(),
          adminCreateCategoryService: asClass(AdminCreateCategoryService).singleton(),
          productRepository: asClass(PrismaProductRepository)
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