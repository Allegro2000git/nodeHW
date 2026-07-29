import { type PostDto, testingDtosCreator } from './testingDtosCreator';
import request from 'supertest';
import { type Express } from 'express';
import { routersPaths } from '../../../src/common/paths/paths';
import { ADMIN_LOGIN, ADMIN_PASS } from '../../../src/auth/api/guards/base.auth.guard';
import { HttpStatuses } from '../../../src/common/types/httpStatuses';

export const createPost = async (app: Express, blogId: string, postDto?: Partial<PostDto>) => {
  const dto = postDto
    ? testingDtosCreator.createPostDto({ blogId, ...postDto })
    : testingDtosCreator.createPostDto({ blogId });

  const resp = await request(app)
    .post(routersPaths.posts)
    .auth(ADMIN_LOGIN, ADMIN_PASS)
    .send({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    })
    .expect(HttpStatuses.Created);

  return resp.body;
};
