import { apiRequest } from './client';

export type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  member_count: number;
  resource_count: number;
  is_joined?: boolean;
  user_role?: string | null;
};

export type CommunityMember = {
  id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
};

export async function getAllCommunities(search?: string) {
  const params = new URLSearchParams();
  params.append('all', 'true');
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  return apiRequest<Community[]>(`/communities?${params.toString()}`);
}

export async function getMyCommunities() {
  return apiRequest<Community[]>('/communities');
}

export async function getCommunityBySlug(slug: string) {
  return apiRequest<Community>(`/communities/slug/${encodeURIComponent(slug)}`);
}

export async function getCommunityById(id: string) {
  return apiRequest<Community>(`/communities/${id}`);
}

export async function createCommunity(data: {
  name: string;
  slug: string;
  description?: string;
  location?: string;
}) {
  return apiRequest<Community>('/communities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function joinCommunity(communityId: string) {
  return apiRequest<{ community_id: string; joined: boolean; role: string }>(
    `/communities/${communityId}/join`,
    { method: 'POST' }
  );
}

export async function leaveCommunity(communityId: string) {
  return apiRequest<{ community_id: string; left: boolean }>(
    `/communities/${communityId}/leave`,
    { method: 'POST' }
  );
}

export async function getCommunityMembers(communityId: string) {
  return apiRequest<CommunityMember[]>(`/communities/${communityId}/members`);
}
