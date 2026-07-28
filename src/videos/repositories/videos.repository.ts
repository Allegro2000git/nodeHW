import { db } from '../../db/ in-memory.db';
import type { UpdateVideoInputModel, VideoViewModel } from '../types/video.interface';

export const videosRepository = {
  findVideoById(id: string) {
    const video = db.videos.find((video) => video.id === +id);
    return video ? video : null;
  },
  create(videoData: Omit<VideoViewModel, 'id'>): VideoViewModel {
    const maxId = db.videos.length > 0 ? Math.max(...db.videos.map((v) => v.id)) : 0;

    const newVideo: VideoViewModel = {
      id: maxId + 1,
      ...videoData,
    };

    db.videos.push(newVideo);
    return newVideo;
  },
  update(id: string, updatedVideoData: UpdateVideoInputModel): boolean {
    const index = db.videos.findIndex((v) => v.id === +id);
    if (index === -1) return false;

    db.videos[index] = {
      ...db.videos[index],
      ...updatedVideoData,
    };
    return true;
  },
  delete(id: string) {
    const index = db.videos.findIndex((v) => v.id === +id);
    if (index === -1) return false;

    db.videos.splice(index, 1);
    return true;
  },
};
