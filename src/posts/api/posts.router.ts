import { Router, Response, type Request } from 'express';
import { HttpStatuses } from '../../common/types/httpStatuses';
import type { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from '../../common/types/requests';
import { postsQueryRepository } from '../repositories/posts.query.repository';
import { postsService } from '../domain/posts.service';
import { inputValidation } from '../../common/validation/inputCheckErrorValidation';
import { baseAuthGuard } from '../../auth/api/guards/base.auth.guard';
import type { PostInputModel, PostViewModel } from '../types/post.interface';
import {
  postBlogIdValidation,
  postContentValidation,
  postShortDescriptionValidation,
  postTitleValidation,
} from './middlewares/post.validation';
import type { IdType } from '../../common/types/id';

export const postsRouter = Router();

postsRouter.get('', async (_req: Request, res: Response<PostViewModel[]>) => {
  const posts = await postsQueryRepository.findAllPosts();
  res.status(HttpStatuses.Success).send(posts);
});

postsRouter.get('/:id', async (req: RequestWithParams<IdType>, res: Response<PostViewModel>) => {
  const post = await postsQueryRepository.findPostById(req.params.id);
  if (!post) {
    return res.sendStatus(HttpStatuses.NotFound);
  }
  res.status(HttpStatuses.Success).send(post);
});

postsRouter.post(
  '',
  baseAuthGuard,
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  postBlogIdValidation,
  inputValidation,
  async (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {
    const createdPostId = await postsService.create(req.body);
    if (!createdPostId) {
      return res.sendStatus(HttpStatuses.NotFound);
    }

    const createdPost = await postsQueryRepository.findPostById(createdPostId);
    if (!createdPost) {
      return res.sendStatus(HttpStatuses.NotFound);
    }
    res.status(HttpStatuses.Created).send(createdPost);
  }
);

postsRouter.put(
  '/:id',
  baseAuthGuard,
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  postBlogIdValidation,
  inputValidation,
  async (req: RequestWithParamsAndBody<IdType, PostInputModel>, res: Response<null>) => {
    const result = await postsService.update(req.params.id, req.body);
    if (!result) {
      return res.sendStatus(HttpStatuses.NotFound);
    }
    res.sendStatus(HttpStatuses.NoContent);
  }
);

postsRouter.delete('/:id', baseAuthGuard, async (req: RequestWithParams<IdType>, res: Response<null>) => {
  const post = await postsService.delete(req.params.id);
  if (!post) {
    return res.sendStatus(HttpStatuses.NotFound);
  }
  res.sendStatus(HttpStatuses.NoContent);
});
