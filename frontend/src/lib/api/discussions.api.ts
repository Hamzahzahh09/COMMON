import { apiRequest } from './client';

export type DiscussionPost = {
  id: string;
  community_id: string;
  author_id: string;
  title: string;
  content: string;
  category: 'general' | 'resource_qa' | 'announcement';
  created_at: string;
  updated_at?: string;
  author?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
};

export async function getDiscussions(communityId: string, category?: string) {
  const query = category && category !== 'Semua' ? `?category=${encodeURIComponent(category)}` : '';
  return apiRequest<DiscussionPost[]>(`/communities/${communityId}/discussions${query}`);
}

export async function createDiscussion(
  communityId: string,
  data: { title: string; content: string; category?: string }
) {
  return apiRequest<DiscussionPost>(`/communities/${communityId}/discussions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteDiscussion(communityId: string, discussionId: string) {
  return apiRequest<{ success: boolean; message: string }>(
    `/communities/${communityId}/discussions/${discussionId}`,
    {
      method: 'DELETE',
    }
  );
}
