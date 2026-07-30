import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getNonExistentId } from './utils/test-helpers';
import { setupApp } from '../../src/setup-app';
import { db } from '../../src/db/db';
import { routersPaths } from '../../src/common/paths/paths';
import { ADMIN_LOGIN, ADMIN_PASS } from '../../src/auth/api/guards/base.auth.guard';
import { HttpStatuses } from '../../src/common/types/httpStatuses';
import { createPostInDb } from './utils/createPost';
import { testingDtosCreator } from './utils/testingDtosCreator';

describe('POSTS_TESTS_HOMETASK_03', () => {
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

  let localBlogId: string;
  let localBlogName: string;
  let postDto: any;

  // Перед каждым тестом постов создаем один гарантированный блог
  beforeEach(async () => {
    const blogRes = await request(app)
      .post(routersPaths.blogs)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .send({ name: 'Tech Owner', description: 'Desc', websiteUrl: 'https://owner.com' });

    localBlogId = blogRes.body.id;
    localBlogName = blogRes.body.name;
  });

  // авторизация проверка защиты эндпоинтов
  it('shouldn`t create post without authorization: STATUS 401', async () => {
    await request(app).post(routersPaths.posts).send({ title: 'Valid' }).expect(HttpStatuses.Unauthorized);
  });

  it('shouldn`t delete post without authorization: STATUS 401', async () => {
    await request(app).delete(`${routersPaths.posts}/some-id`).expect(HttpStatuses.Unauthorized);
  });

  it('should create post with correct data by sa and return it: STATUS 201', async () => {
    const newPost = await createPostInDb(app, localBlogId, { title: 'Clean Architecture' });

    expect(newPost).toEqual({
      id: expect.any(String),
      title: 'Clean Architecture',
      shortDescription: 'testing Post Short Description',
      content: 'some testing Post content was created for tests',
      blogId: localBlogId,
      blogName: localBlogName,
    });
  });

  it('shouldn`t create post with incorrect title (too long): STATUS 400', async () => {
    postDto = testingDtosCreator.createPostDto({
      blogId: localBlogId,
      title: 'A very long title that exceeds thirty characters limit',
    });

    const res = await request(app)
      .post(routersPaths.posts)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .send(postDto)
      .expect(HttpStatuses.BadRequest);

    expect(res.body.errorsMessages[0].field).toBe('title');
  });

  it('shouldn`t create post with non-existent blogId: STATUS 400', async () => {
    postDto = testingDtosCreator.createPostDto({ blogId: nonExistentId });

    const res = await request(app)
      .post(routersPaths.posts)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .send(postDto)
      .expect(HttpStatuses.BadRequest);

    expect(res.body.errorsMessages[0].field).toBe('blogId');
  });

  it('should update existing post with correct data: STATUS 204', async () => {
    const createdPost = await createPostInDb(app, localBlogId, { title: 'Old Title' });

    const updatedDto = testingDtosCreator.createPostDto({
      blogId: localBlogId,
      title: 'Brand New Title',
      content: 'Updated content text',
    });

    await request(app)
      .put(`${routersPaths.posts}/${createdPost.id}`)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .send(updatedDto)
      .expect(HttpStatuses.NoContent);

    const checkRes = await request(app).get(`${routersPaths.posts}/${createdPost.id}`).expect(HttpStatuses.Success);

    expect(checkRes.body.title).toBe('Brand New Title');
    expect(checkRes.body.content).toBe('Updated content text');
    expect(checkRes.body.blogName).toBe(localBlogName);
  });

  it('shouldn`t update post by id if specified post does not exist: STATUS 404', async () => {
    const validDto = testingDtosCreator.createPostDto({ blogId: localBlogId }); // в реальной бд такой сущности с id нет

    await request(app)
      .put(`${routersPaths.posts}/${nonExistentId}`)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .send(validDto)
      .expect(HttpStatuses.NotFound);
  });

  it('should delete post by id: STATUS 204', async () => {
    const createdPost = await createPostInDb(app, localBlogId);

    await request(app)
      .delete(`${routersPaths.posts}/${createdPost.id}`)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .expect(HttpStatuses.NoContent);
  });

  it('shouldn`t delete post by id if specified post does not exist: STATUS 404', async () => {
    await request(app)
      .delete(`${routersPaths.posts}/${nonExistentId}`)
      .auth(ADMIN_LOGIN, ADMIN_PASS)
      .expect(HttpStatuses.NotFound);
  });
});
