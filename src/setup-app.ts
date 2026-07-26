import express, { Express } from 'express';
import { routersPaths } from './common/paths/paths';
import { videosRouter } from './videos/api/videos.router';
import { testingRouter } from './testing/routers/testing.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(routersPaths.videos, videosRouter);
  app.use(routersPaths.testing, testingRouter);

  return app;
};
