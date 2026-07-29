import { Db, MongoClient } from 'mongodb';
import { appConfig } from '../common/config/config';
import type { VideoDb } from '../videos/types/video.db.interface';
import type { BlogDb } from '../blogs/types/blog.db.interface';
import type { PostDb } from '../posts/types/post.db.interface';

export const db = {
  client: null as MongoClient | null,

  getDbName(): Db {
    if (!this.client) {
      throw new Error('working before');
    }
    return this.client.db(appConfig.DB_NAME);
  },

  async run(url: string) {
    try {
      this.client = new MongoClient(url);
      await this.client.connect();
      console.log('All collections cleared successfully');
    } catch (e: unknown) {
      await this.stop();
      console.log("Can't connect to mongo server", e);
    }
  },

  async stop() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log('Connection successful closed');
    }
  },

  async drop() {
    try {
      const collections = this.collections;
      await Promise.all([
        collections.videosCollection.deleteMany({}),
        collections.blogsCollection.deleteMany({}),
        collections.postsCollection.deleteMany({}),
      ]);
      console.log('All collections cleared successfully');
    } catch (e) {
      console.error('Error in drop db:', e);
      await this.stop();
    }
  },

  get collections() {
    return {
      videosCollection: this.getDbName().collection<VideoDb>('videos'),
      blogsCollection: this.getDbName().collection<BlogDb>('blogs'),
      postsCollection: this.getDbName().collection<PostDb>('posts'),
    };
  },
};
