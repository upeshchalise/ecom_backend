import { AwilixContainer, InjectionMode, asClass, asFunction, asValue, createContainer } from 'awilix';
import { Router } from './Router';
import { Server } from './Server';
import { MasterRouter } from './routes/routes';
import { createPrismaClient } from '../../../contexts/shared/infrastructure/persistence/prisma';
import { ServerLogger } from '../../../contexts/shared/infrastructure/winstonLogger';
import * as ApiControllers from './controllers';
import { ErrorMiddleware } from '../../../contexts/shared/infrastructure/middleware/error-middleware';


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
        })
      }

      
      public invoke(): AwilixContainer {
        return this.container;
      }
}