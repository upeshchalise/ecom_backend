import { AwilixContainer, InjectionMode, asClass, asFunction, asValue, createContainer } from 'awilix';
import { Router } from './Router';
import { Server } from './Server';


export class Container {
    private readonly container: AwilixContainer;

    constructor() {
        this.container = createContainer({
          injectionMode: InjectionMode.CLASSIC
        });
    
        this.register();
      }

      public register() {}
}