import type { VideoViewModel } from '../videos/types/video.interface';

export type DBType = {
  videos: VideoViewModel[];
};

export const db: DBType = {
  videos: [],
};
