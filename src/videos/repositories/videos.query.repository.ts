import { db } from '../../db/db';
import { type VideoViewModel } from '../types/video.interface';
import type { VideoDb } from '../types/video.db.interface';
import { ObjectId, type WithId } from 'mongodb';

export const videosQueryRepository = {
  _getView(video: WithId<VideoDb>): VideoViewModel {
    return {
      id: video._id.toString(),
      title: video.title,
      author: video.author,
      canBeDownloaded: video.canBeDownloaded,
      minAgeRestriction: video.minAgeRestriction,
      createdAt: video.createdAt,
      publicationDate: video.publicationDate,
      availableResolutions: video.availableResolutions,
    };
  },
  async findAllVideos(): Promise<VideoViewModel[]> {
    const videos = await db.collections.videosCollection.find().toArray();
    return videos.map((v) => this._getView(v));
  },

  async findVideoById(id: string): Promise<VideoViewModel | null> {
    const video = await db.collections.videosCollection.findOne({ _id: new ObjectId(id) });
    return video ? this._getView(video) : null;
  },
};
