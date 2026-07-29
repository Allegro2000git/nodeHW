import express from 'express';
import { routersPaths } from './common/paths/paths';
import { videosRouter } from './videos/api/videos.router';
import { testingRouter } from './testing/routers/testing.router';
import { blogsRouter } from './blogs/api/blogs.router';
import { postsRouter } from './posts/api/posts.router';

export const setupApp = () => {
  const app = express();
  app.use(express.json());

  app.use(routersPaths.videos, videosRouter);
  app.use(routersPaths.blogs, blogsRouter);
  app.use(routersPaths.posts, postsRouter);
  app.use(routersPaths.testing, testingRouter);

  return app;
};
