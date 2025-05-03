import express from 'express';
import * as http from 'http';
import { AddressInfo } from 'net';
import { ServerLogger } from '../../../contexts/shared/infrastructure/winstonLogger';

export class Server {
    private readonly express: express.Application;
  private http: http.Server | any;

  constructor(
    private router: express.Router,
    private logger: ServerLogger,
  ) {
    this.express = express();
    this.express.use(this.logger.stream());
    this.express.use(this.router);
  }


  public start = async (): Promise<void> => {
    return await new Promise<void>(resolve => {
      this.http = this.express.listen(4000, () => {
        const { port } = this.http.address() as AddressInfo;
        this.logger.info(`🚀 Application runnings at http://localhost:${port}`);
        resolve();
      });
    });
  };

  get httpServer() {
    return this.http;
  }

  public stop = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (this.http) {
        this.http.close((error: any) => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      }

      return resolve();
    });
  };

  public invoke = (): express.Application => this.express;
}