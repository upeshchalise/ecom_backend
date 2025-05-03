import { AwilixContainer, InjectionMode, asClass, asFunction, asValue, createContainer } from 'awilix';
import { Router } from './Router';
import { Server } from './Server';
import { MasterRouter } from './routes/routes';


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
        })
        .register({
          masterRouter: asFunction(MasterRouter).singleton()
        })
      }

      
      public invoke(): AwilixContainer {
        return this.container;
      }
}