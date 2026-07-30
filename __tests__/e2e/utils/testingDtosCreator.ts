export type PostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type BlogDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

export const testingDtosCreator = {
  createPostDto(data: { title?: string; shortDescription?: string; content?: string; blogId: string }): PostDto {
    return {
      title: data.title ?? 'testing Post Title',
      shortDescription: data.shortDescription ?? 'testing Post Short Description',
      content: data.content ?? 'some testing Post content was created for tests',
      blogId: data.blogId,
    };
  },
  createBlogDto(data: { name?: string; description?: string; websiteUrl?: string }): BlogDto {
    return {
      name: data?.name ?? 'Valid Blog Name',
      description: data?.description ?? 'Valid description',
      websiteUrl: data?.websiteUrl ?? 'https://valid-url.com',
    };
  },
};
