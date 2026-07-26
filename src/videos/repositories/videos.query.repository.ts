import { db } from '../../db/ in-memory.db';

export const videosQueryRepository = {
  findAllVideos() {
    return db.videos;
  },

  findVideoById(id: string) {
    return db.videos.find((video) => video.id === +id);
  },
};
