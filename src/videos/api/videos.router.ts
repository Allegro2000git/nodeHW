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

export const videosRouter = Router();

videosRouter.get('/', (_req: Request, res: Response<VideoViewModel[]>) => {
  const videos = videosQueryRepository.findAllVideos();
  res.status(HttpStatuses.Success).send(videos);
});

videosRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response<VideoViewModel>) => {
  const video = videosQueryRepository.findVideoById(req.params.id);

  if (!video) {
    return res.sendStatus(HttpStatuses.NotFound);
  }
  res.status(HttpStatuses.Success).send(video);
});

videosRouter.post(
  '/',
  titleValidation,
  authorValidation,
  availableResolutionsValidation,
  inputValidation,
  (req: RequestWithBody<CreateVideoInputModel>, res: Response<VideoViewModel>) => {
    const createdVideo = videosService.create(req.body);
    res.status(HttpStatuses.Created).send(createdVideo);
  }
);

videosRouter.put(
  '/:id',
  titleValidation,
  authorValidation,
  availableResolutionsValidation,
  canBeDownloadedValidation,
  minAgeRestrictionValidation,
  publicationDateValidation,
  inputValidation,
  (req: RequestWithParamsAndBody<{ id: string }, UpdateVideoInputModel>, res: Response) => {
    const result = videosService.update(req.params.id, req.body);
    if (!result) {
      return res.sendStatus(HttpStatuses.NotFound);
    }
    res.sendStatus(HttpStatuses.NoContent);
  }
);

videosRouter.delete('/:id', (req: RequestWithParams<{ id: string }>, res) => {
  const user = videosService.delete(req.params.id);
  if (!user) {
    return res.sendStatus(HttpStatuses.NotFound);
  }

  res.sendStatus(HttpStatuses.NoContent);
});
