import { type CreateVideoInputModel, type UpdateVideoInputModel, type VideoViewModel } from '../types/video.interface';
import { videosRepository } from '../repositories/videos.repository';

export const videosService = {
  create(dto: CreateVideoInputModel): VideoViewModel {
    const createdAt = new Date();
    // прибавление 1 дня (24 часа) в миллисекундах
    const publicationDate = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    const videoCreatedData: Omit<VideoViewModel, 'id'> = {
      title: dto.title,
      author: dto.author,
      availableResolutions: dto.availableResolutions,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt.toISOString(),
      publicationDate: publicationDate.toISOString(),
    };

    return videosRepository.create(videoCreatedData);
  },

  update(id: string, dto: UpdateVideoInputModel) {
    const video = videosRepository.findVideoById(id);
    if (!video) return false;

    const updatedVideoData: UpdateVideoInputModel = {
      title: dto.title,
      author: dto.author,
      availableResolutions: dto.availableResolutions,
      publicationDate: dto.publicationDate,
      canBeDownloaded: dto.canBeDownloaded ?? false,
      minAgeRestriction: dto.minAgeRestriction ?? null,
    };

    return videosRepository.update(id, updatedVideoData);
  },

  delete(id: string) {
    const user = videosRepository.findVideoById(id);
    if (!user) return false;

    return videosRepository.delete(id);
  },
};
