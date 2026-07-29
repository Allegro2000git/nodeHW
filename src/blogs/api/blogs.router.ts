import { Router, Response, type Request } from 'express';
import { HttpStatuses } from '../../common/types/httpStatuses';
import type { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from '../../common/types/requests';
import { blogsQueryRepository } from '../repositories/blogs.query.repository';
import { blogsService } from '../domain/blogs.service';
import { inputValidation } from '../../common/validation/inputCheckErrorValidation';
import type { BlogInputModel, BlogViewModel } from '../types/blog.interface';
import { blogDescriptionValidation, blogNameValidation, blogWebsiteUrlValidation } from './middlewares/blog.validation';
import { baseAuthGuard } from '../../auth/api/guards/base.auth.guard';
import type { IdType } from '../../common/types/id';

export const blogsRouter = Router();

blogsRouter.get('', async (_req: Request, res: Response<BlogViewModel[]>) => {
  const blogs = await blogsQueryRepository.findAllBlogs();
  res.status(HttpStatuses.Success).send(blogs);
});

blogsRouter.get('/:id', async (req: RequestWithParams<IdType>, res: Response<BlogViewModel>) => {
  const blog = await blogsQueryRepository.findBlogById(req.params.id);
  if (!blog) {
    return res.sendStatus(HttpStatuses.NotFound);
  }
  res.status(HttpStatuses.Success).send(blog);
});

blogsRouter.post(
  '',
  baseAuthGuard,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  inputValidation,
  async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
    const createdBlogId = await blogsService.create(req.body);
    const createdBlog = await blogsQueryRepository.findBlogById(createdBlogId);
    if (!createdBlog) {
      return res.sendStatus(HttpStatuses.NotFound);
    }
    res.status(HttpStatuses.Created).send(createdBlog);
  }
);

blogsRouter.put(
  '/:id',
  baseAuthGuard,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  inputValidation,
  async (req: RequestWithParamsAndBody<IdType, BlogInputModel>, res: Response<null>) => {
    const result = await blogsService.update(req.params.id, req.body);
    if (!result) {
      return res.sendStatus(HttpStatuses.NotFound);
    }
    res.sendStatus(HttpStatuses.NoContent);
  }
);

blogsRouter.delete('/:id', baseAuthGuard, async (req: RequestWithParams<IdType>, res: Response<null>) => {
  const isDeleted = await blogsService.delete(req.params.id);
  if (!isDeleted) {
    return res.sendStatus(HttpStatuses.NotFound);
  }
  res.sendStatus(HttpStatuses.NoContent);
});
