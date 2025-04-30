import express from 'express';
import * as http from 'http';
import { AddressInfo } from 'net';

export class Server {
    private readonly express: express.Application;
  private http: http.Server | any;

  constructor(
    private router: express.Router,
    // private logger: ServerLogger,
    // private requestLogger: RequestLogger,
  ) {
    this.express = express();
    // this.express.use(this.logger.stream());
    // this.express.use(this.requestLogger.logs);

    this.express.use(this.router);
  }


  public start = async (): Promise<void> => {
    return await new Promise<void>(resolve => {
      this.http = this.express.listen(4000, () => {
        const { port } = this.http.address() as AddressInfo;
        // this.logger.info(`🚀 Application runnings at http://localhost:${port} in ${this.config.NODE_ENV} mode`);
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