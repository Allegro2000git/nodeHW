import { type CreateVideoInputModel, type UpdateVideoInputModel, type VideoViewModel } from '../types/video.interface';
import { videosRepository } from '../repositories/videos.repository';

export const videosService = {
  create(dto: CreateVideoInputModel) {
    const createdAt = new Date();

    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);

    const newVideo: VideoViewModel = {
      id: Date.now(),
      title: dto.title,
      author: dto.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt.toISOString(),
      publicationDate: publicationDate.toISOString(),
      availableResolutions: dto.availableResolutions,
    };

    return videosRepository.create(newVideo);
  },

  update(id: string, dto: UpdateVideoInputModel) {
    const video = videosRepository.findVideoById(id);
    if (!video) return false;

    const updatedVideo: VideoViewModel = {
      ...video,
      title: dto.title,
      author: dto.author,
      availableResolutions: dto.availableResolutions,
      canBeDownloaded: dto.canBeDownloaded ?? false,
      minAgeRestriction: dto.minAgeRestriction ?? null,
      publicationDate: dto.publicationDate,
    };

    return videosRepository.update(id, updatedVideo);
  },

  delete(id: string) {
    const user = videosRepository.findVideoById(id);
    if (!user) return false;

    return videosRepository.delete(id);
  },
};
