import express, { Router as ExpressRouter } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../../swaggerApi.json';

export const Router = (masterRouter: ExpressRouter, errorMiddleware: any): ExpressRouter => {
  const router = ExpressRouter();
  router.use(cors());
  router.use(helmet());

  router
    .use(bodyParser.json())
    .use(
      bodyParser.urlencoded({
        extended: false
      })
    )
    .use(compression())

  router.use("/api", masterRouter);

  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  router.use(errorMiddleware.routeNotFoundErrorHandler);
  router.use(errorMiddleware.clientErrorHandler);
  router.use(errorMiddleware.InternalServerError);
  return router;
}