import { type CreateVideoInputModel, type UpdateVideoInputModel } from '../types/video.interface';
import { videosRepository } from '../repositories/videos.repository';
import type { VideoDb } from '../types/video.db.interface';

export const videosService = {
  async create(dto: CreateVideoInputModel): Promise<string> {
    const createdAt = new Date();
    // прибавление 1 дня (24 часа) в миллисекундах
    const publicationDate = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    const videoCreatedData: VideoDb = {
      title: dto.title,
      author: dto.author,
      availableResolutions: dto.availableResolutions,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt.toISOString(),
      publicationDate: publicationDate.toISOString(),
    };

    return await videosRepository.create(videoCreatedData);
  },

  async update(id: string, dto: UpdateVideoInputModel): Promise<boolean> {
    const currentVideo = await videosRepository.findVideoById(id);
    if (!currentVideo) return false;

    const updatedVideoData: VideoDb = {
      title: dto.title,
      author: dto.author,
      availableResolutions: dto.availableResolutions,
      canBeDownloaded: dto.canBeDownloaded,
      minAgeRestriction: dto.minAgeRestriction,
      publicationDate: dto.publicationDate,
      createdAt: currentVideo.createdAt,
    };

    return await videosRepository.update(id, updatedVideoData);
  },

  async delete(id: string): Promise<boolean> {
    return videosRepository.delete(id);
  },
};
