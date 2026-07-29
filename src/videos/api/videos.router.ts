import { Router, Response, type Request } from 'express';
import type { CreateVideoInputModel, UpdateVideoInputModel, VideoViewModel } from '../types/video.interface';
import { HttpStatuses } from '../../common/types/httpStatuses';
import type { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from '../../common/types/requests';
import { videosQueryRepository } from '../repositories/videos.query.repository';
import { videosService } from '../domain/videos.service';
import {
  authorValidation,
  titleValidation,
  availableResolutionsValidation,
  publicationDateValidation,
  canBeDownloadedValidation,
  minAgeRestrictionValidation,
} from './middlewares/video.validation';
import { inputValidation } from '../../common/validation/inputCheckErrorValidation';
import { baseAuthGuard } from '../../auth/api/guards/base.auth.guard';
import type { IdType } from '../../common/types/id';

export const videosRouter = Router();

videosRouter.get('', async (_req: Request, res: Response<VideoViewModel[]>) => {
  const videos = await videosQueryRepository.findAllVideos();
  res.status(HttpStatuses.Success).send(videos);
});

videosRouter.get('/:id', async (req: RequestWithParams<IdType>, res: Response<VideoViewModel>) => {
  const video = await videosQueryRepository.findVideoById(req.params.id);

  if (!video) {
    return res.sendStatus(HttpStatuses.NotFound);
  }
  res.status(HttpStatuses.Success).send(video);
});

videosRouter.post(
  '',
  baseAuthGuard,
  titleValidation,
  authorValidation,
  availableResolutionsValidation,
  inputValidation,
  async (req: RequestWithBody<CreateVideoInputModel>, res: Response<VideoViewModel>) => {
    const createdVideoId = await videosService.create(req.body);
    const createdVideo = await videosQueryRepository.findVideoById(createdVideoId);

    if (!createdVideo) {
      return res.sendStatus(HttpStatuses.NotFound);
    }
    res.status(HttpStatuses.Created).send(createdVideo);
  }
);

videosRouter.put(
  '/:id',
  baseAuthGuard,
  titleValidation,
  authorValidation,
  availableResolutionsValidation,
  canBeDownloadedValidation,
  minAgeRestrictionValidation,
  publicationDateValidation,
  inputValidation,
  async (req: RequestWithParamsAndBody<IdType, UpdateVideoInputModel>, res: Response<null>) => {
    const result = videosService.update(req.params.id, req.body);
    if (!result) {
      return res.sendStatus(HttpStatuses.NotFound);
    }
    res.sendStatus(HttpStatuses.NoContent);
  }
);

videosRouter.delete('/:id', baseAuthGuard, async (req: RequestWithParams<IdType>, res: Response<null>) => {
  const video = await videosService.delete(req.params.id);
  if (!video) {
    return res.sendStatus(HttpStatuses.NotFound);
  }

  res.sendStatus(HttpStatuses.NoContent);
});
