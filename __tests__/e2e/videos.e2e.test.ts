import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { HttpStatuses } from '../../src/common/types/httpStatuses';
import { routersPaths } from '../../src/common/paths/paths';
import type { VideoViewModel } from '../../src/videos/types/video.interface';
import { setupApp } from '../../src/setup-app';
import { db } from '../../src/db/db';
import { testAuthHeader } from './utils/test-helpers';

describe('videos e2e-tests', () => {
  const app = setupApp();

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

  it('должен вернуть пустой массив видео при первом запросе', async () => {
    await request(app).get(routersPaths.videos).expect(HttpStatuses.Success, []);
  });

  it('не должен создавать видео с невалидными данными', async () => {
    const badVideoData = {
      title: '',
      author: 'Valid Author',
      availableResolutions: ['P144'],
    };

    const response = await request(app)
      .post(routersPaths.videos)
      .set(testAuthHeader)
      .send(badVideoData)
      .expect(HttpStatuses.BadRequest);

    expect(response.body.errorsMessages).toBeDefined();
  });

  it('должен успешно пройти полный CRUD цикл', async () => {
    const newVideo = {
      title: 'Test Video',
      author: 'John Doe',
      availableResolutions: ['P720'],
    };

    // 1. Создание (POST)
    const createResponse = await request(app)
      .post(routersPaths.videos)
      .set(testAuthHeader)
      .send(newVideo)
      .expect(HttpStatuses.Created);

    const createdVideo: VideoViewModel = createResponse.body;
    expect(createdVideo.id).toBeDefined();

    // 2. Получение по ID (GET - авторизация не нужна)
    const getResponse = await request(app)
      .get(`${routersPaths.videos}/${createdVideo.id}`)
      .expect(HttpStatuses.Success);

    expect(getResponse.body).toEqual(createdVideo);

    // 3. Обновление (PUT)
    const updateData = {
      title: 'Updated Title',
      author: 'John Doe',
      availableResolutions: ['P1080'],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: new Date().toISOString(),
    };

    await request(app)
      .put(`${routersPaths.videos}/${createdVideo.id}`)
      .set(testAuthHeader)
      .send(updateData)
      .expect(HttpStatuses.NoContent);

    // 4. Удаление (DELETE)
    await request(app)
      .delete(`${routersPaths.videos}/${createdVideo.id}`)
      .set(testAuthHeader)
      .expect(HttpStatuses.NoContent);

    // 5. Проверка удаления
    await request(app).get(`${routersPaths.videos}/${createdVideo.id}`).expect(HttpStatuses.NotFound);
  });
});
