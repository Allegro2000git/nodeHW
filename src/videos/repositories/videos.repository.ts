import { db } from '../../db/ in-memory.db';
import type { VideoViewModel } from '../types/video.interface';

export const videosRepository = {
  findVideoById(id: string) {
    return db.videos.find((video) => video.id === +id);
  },
  create(video: VideoViewModel) {
    db.videos.push(video);
    return video;
  },
  update(id: string, updatedVideo: VideoViewModel): boolean {
    const index = db.videos.findIndex((v) => v.id === +id);
    if (index === -1) return false;

    db.videos[index] = updatedVideo;
    return true;
  },
  delete(id: string) {
    const index = db.videos.findIndex((v) => v.id === +id);
    if (index === -1) return false;

    db.videos.splice(index, 1);
    return true;
  },
};
