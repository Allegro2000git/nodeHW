import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupApp } from '../../src/setup-app';
import { getNonExistentId } from './utils/test-helpers';
import { db } from '../../src/db/db';
import { routersPaths } from '../../src/common/paths/paths';
import { HttpStatuses } from '../../src/common/types/httpStatuses';
import { testingDtosCreator } from './utils/testingDtosCreator';
import { ADMIN_LOGIN, ADMIN_PASS } from '../../src/auth/api/guards/base.auth.guard';
import { createBlogInDb } from './utils/createBlog';

describe('blogs e2e-tests', () => {
  const app = setupApp();
  const nonExistentId = getNonExistentId();

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await db.run(mongoServer.getUri());
  });

  beforeEach(async () => {
    await db.drop();
  });

  afterAll(async () => {
    await db.stop();
  });

  // авторизация проверка защиты эндпоинтов
  it('shouldn`t create blog without authorization: STATUS 401', async () => {
    await request(app).post(routersPaths.blogs).send({ name: 'Valid' }).expect(HttpStatuses.Unauthorized);
  });

  it('shouldn`t delete blog without authorization: STATUS 401', async () => {
    await request(app).delete(`${routersPaths.blogs}/${nonExistentId}`).expect(HttpStatuses.Unauthorized);
  });

  it('should create blog with correct data by sa and return it: STATUS 201', async () => {
    const blogDto = testingDtosCreator.createBlogDto({ name: 'Code Kitchen' });

    const newBlog = await request(app)
      .post(routersPaths.blogs)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .send(blogDto)
      .expect(HttpStatuses.Created);

    expect(newBlog.body).toEqual({
      id: expect.any(String),
      name: 'Code Kitchen',
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('should return list of blogs: STATUS 200', async () => {
    await createBlogInDb(app, { name: 'Blog 1' });
    await createBlogInDb(app, { name: 'Blog 2' });

    const res = await request(app).get(routersPaths.blogs).expect(HttpStatuses.Success);

    expect(res.body.length).toBe(2);
    expect(res.body[0].createdAt).toBeDefined();
  });

  it('shouldn`t create blog with incorrect name (too long): STATUS 400', async () => {
    const badBlogDto = testingDtosCreator.createBlogDto({ name: 'Name Longer Than Fifteen Characters' });

    const res = await request(app)
      .post(routersPaths.blogs)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .send(badBlogDto)
      .expect(HttpStatuses.BadRequest);

    expect(res.body.errorsMessages[0].field).toBe('name');
  });

  it('should update existing blog with correct data: STATUS 204', async () => {
    const createdBlog = await createBlogInDb(app, { name: 'Old Blog Name' });
    const updateBlogDto = testingDtosCreator.createBlogDto({ name: 'New Blog Name' });

    await request(app)
      .put(`${routersPaths.blogs}/${createdBlog.id}`)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .send(updateBlogDto)
      .expect(HttpStatuses.NoContent);

    const checkRes = await request(app).get(`${routersPaths.blogs}/${createdBlog.id}`);
    expect(checkRes.body.name).toBe('New Blog Name');
    expect(checkRes.body.createdAt).toBe(createdBlog.createdAt);
  });

  it('should delete blog by id: STATUS 204', async () => {
    const createdBlog = await createBlogInDb(app);

    await request(app)
      .delete(`${routersPaths.blogs}/${createdBlog.id}`)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .expect(HttpStatuses.NoContent);

    await request(app).get(`${routersPaths.blogs}/${createdBlog.id}`).expect(HttpStatuses.NotFound);
  });
});
