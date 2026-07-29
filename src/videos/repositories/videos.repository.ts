import { db } from '../../db/db';
import { ObjectId, type WithId } from 'mongodb';
import type { VideoDb } from '../types/video.db.interface';

export const videosRepository = {
  async findVideoById(id: string): Promise<WithId<VideoDb> | null> {
    return await db.collections.videosCollection.findOne({ _id: new ObjectId(id) });
  },
  async create(newVideoData: VideoDb): Promise<string> {
    const newVideo = await db.collections.videosCollection.insertOne({ ...newVideoData });
    return newVideo.insertedId.toString();
  },
  async update(id: string, updatedVideoData: VideoDb): Promise<boolean> {
    const updateResult = await db.collections.videosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedVideoData }
    );

    return updateResult.matchedCount > 0;
  },
  async delete(id: string): Promise<boolean> {
    const isDeleted = await db.collections.videosCollection.deleteOne({ _id: new ObjectId(id) });
    return isDeleted.deletedCount === 1;
  },
};
