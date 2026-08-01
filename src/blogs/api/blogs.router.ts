import { Router, Response } from 'express';
import { HttpStatuses } from '../../common/types/httpStatuses';
import type {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from '../../common/types/requests';
import { blogsQueryRepository } from '../repositories/blogs.query.repository';
import { blogsService } from '../domain/blogs.service';
import { inputValidation } from '../../common/validation/inputCheckErrorValidation';
import type { BlogInputModel, BlogViewModel, CreatePostByBlogInputModel } from '../types/blog.interface';
import { blogDescriptionValidation, blogNameValidation, blogWebsiteUrlValidation } from './middlewares/blog.validation';
import { baseAuthGuard } from '../../auth/api/guards/base.auth.guard';
import type { IdType } from '../../common/types/id';
import type { IPagination } from '../../common/types/paginationAndSorting';
import { queryFieldsUtil } from '../../common/utils/sortQueryFields.util';
import type { BlogQueryParamsInput, PostQueryParamsInput } from '../../common/types/sortQueryFields.type';
import type { PostViewModel } from '../../posts/types/post.interface';
import { postsQueryRepository } from '../../posts/repositories/posts.query.repository';
import {
  postContentValidation,
  postShortDescriptionValidation,
  postTitleValidation,
} from '../../posts/api/middlewares/post.validation';

export const blogsRouter = Router();

blogsRouter.get('', async (req: RequestWithQuery<BlogQueryParamsInput>, res: Response<IPagination<BlogViewModel>>) => {
  const sanitizedQuery = queryFieldsUtil.parseBlogQuery(req.query);
  const blogs = await blogsQueryRepository.findAllBlogs(sanitizedQuery);
  res.status(HttpStatuses.Success).send(blogs);
});

blogsRouter.get('/:id', async (req: RequestWithParams<IdType>, res: Response<BlogViewModel>) => {
  const blog = await blogsQueryRepository.findBlogById(req.params.id);
  if (!blog) {
    return res.sendStatus(HttpStatuses.NotFound);
  }
  res.status(HttpStatuses.Success).send(blog);
});

blogsRouter.get(
  '/:blogId/posts',
  async (
    req: RequestWithParamsAndQuery<{ blogId: string }, PostQueryParamsInput>,
    res: Response<IPagination<PostViewModel>>
  ) => {
    const blog = await blogsQueryRepository.findBlogById(req.params.blogId);
    if (!blog) {
      return res.sendStatus(HttpStatuses.NotFound);
    }
    const sanitizedQuery = queryFieldsUtil.parsePostQuery(req.query);
    const posts = await postsQueryRepository.findAllPosts(sanitizedQuery, req.params.blogId);

    res.status(HttpStatuses.Success).send(posts);
  }
);

blogsRouter.post(
  '/:blogId/posts',
  baseAuthGuard,
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  inputValidation,
  async (
    req: RequestWithParamsAndBody<{ blogId: string }, CreatePostByBlogInputModel>,
    res: Response<PostViewModel>
  ) => {
    const createdPostId = await blogsService.createPostForBlog(req.params.blogId, req.body);
    if (!createdPostId) {
      return res.sendStatus(HttpStatuses.NotFound);
    }

    const createdNewPost = await postsQueryRepository.findPostById(createdPostId);
    if (!createdNewPost) {
      return res.sendStatus(HttpStatuses.NotFound);
    }
    res.status(HttpStatuses.Created).send(createdNewPost);
  }
);

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
