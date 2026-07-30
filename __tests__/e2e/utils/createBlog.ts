import type { Express } from 'express';
import { type BlogDto, testingDtosCreator } from './testingDtosCreator';
import request from 'supertest';
import { routersPaths } from '../../../src/common/paths/paths';
import { ADMIN_LOGIN, ADMIN_PASS } from '../../../src/auth/api/guards/base.auth.guard';
import { HttpStatuses } from '../../../src/common/types/httpStatuses';

export const createBlogInDb = async (app: Express, customDto?: Partial<BlogDto>) => {
  const dto = testingDtosCreator.createBlogDto(customDto || {});

  const resp = await request(app)
    .post(routersPaths.blogs)
    .auth(ADMIN_LOGIN, ADMIN_PASS)
    .send(dto)
    .expect(HttpStatuses.Created);

  return resp.body;
};
