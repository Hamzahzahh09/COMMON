import { apiRequest } from './client';

export type CommunityNeed = {
  id: string;
  community_id: string;
  creator_id: string;
  title: string;
  description: string | null;
  status: 'open' | 'fulfilled' | 'cancelled';
  needed_from: string | null;
  needed_until: string | null;
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  community?: {
    id: string;
    name: string;
    slug: string;
  };
};

export async function getCommunityNeeds(filters: { community_id?: string; status?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.community_id) params.append('community_id', filters.community_id);
  if (filters.status) params.append('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<CommunityNeed[]>(`/community-needs${query}`);
}

export async function createNeed(data: {
  community_id: string;
  title: string;
  description?: string;
  needed_from?: string;
  needed_until?: string;
}) {
  return apiRequest<CommunityNeed>('/community-needs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateNeed(id: string, data: Partial<CommunityNeed>) {
  return apiRequest<CommunityNeed>(`/community-needs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteNeed(id: string) {
  return apiRequest<{ id: string; deleted: boolean }>(`/community-needs/${id}`, {
    method: 'DELETE',
  });
}
