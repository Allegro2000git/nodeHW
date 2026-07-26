import express from 'express';
import request from 'supertest';
import { setupApp } from '../../src/setup-app';
import { HttpStatuses } from '../../src/common/types/httpStatuses';
import { routersPaths } from '../../src/common/paths/paths';
import type { VideoViewModel } from '../../src/videos/types/video.interface';

describe('videos e2e-tests', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await request(app).delete(`${routersPaths.testing}/all-data`).expect(HttpStatuses.NoContent);
  });

  it('должен вернуть пустой массив видео при первом запросе', async () => {
    await request(app).get(routersPaths.videos).expect(HttpStatuses.Success, []);
  });

  it('не должен отдавать видео, если ID не существует', async () => {
    await request(app).get(`${routersPaths.videos}/non-existent-id-123`).expect(HttpStatuses.NotFound);
  });

  it('не должен создавать видео с невалидными данными', async () => {
    const badVideoData = {
      title: '',
      author: 'Valid Author',
      availableResolutions: ['P144'],
    };

    const response = await request(app).post(routersPaths.videos).send(badVideoData).expect(HttpStatuses.BadRequest);

    expect(response.body.errorsMessages).toBeDefined();
  });

  it('должен успешно пройти полный CRUD цикл', async () => {
    const newVideo = {
      title: 'Test Video',
      author: 'John Doe',
      availableResolutions: ['P720'],
    };

    const createResponse = await request(app).post(routersPaths.videos).send(newVideo).expect(HttpStatuses.Created);

    const createdVideo: VideoViewModel = createResponse.body;
    expect(createdVideo.id).toBeDefined();

    const getResponse = await request(app)
      .get(`${routersPaths.videos}/${createdVideo.id}`)
      .expect(HttpStatuses.Success);

    expect(getResponse.body).toEqual(createdVideo);

    const updateData = {
      title: 'Updated Title',
      author: 'John Doe',
      availableResolutions: ['P1080'],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: new Date().toISOString(),
    };

    await request(app).put(`${routersPaths.videos}/${createdVideo.id}`).send(updateData).expect(HttpStatuses.NoContent);
    await request(app).delete(`${routersPaths.videos}/${createdVideo.id}`).expect(HttpStatuses.NoContent);
    await request(app).get(`${routersPaths.videos}/${createdVideo.id}`).expect(HttpStatuses.NotFound);
  });
});
