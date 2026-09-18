import { apiRequest } from './client';

export type Item = {
  id: string;
  community_id: string;
  owner_id: string;
  name: string;
  description: string | null;
  category: string;
  condition: string | null;
  location_hint: string | null;
  borrowing_rules: string | null;
  ownership_type?: 'personal' | 'community';
  status: 'available' | 'borrowed' | 'unavailable';
  image_url: string | null;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  community?: {
    id: string;
    name: string;
    slug: string;
    location?: string;
  };
};

export type ItemFilters = {
  community_id?: string;
  category?: string;
  ownership_type?: string;
  status?: string;
  search?: string;
  owner_id?: string;
};

export async function getItems(filters: ItemFilters = {}) {
  const params = new URLSearchParams();
  if (filters.community_id) params.append('community_id', filters.community_id);
  if (filters.category && filters.category !== 'Semua') params.append('category', filters.category);
  if (filters.ownership_type && filters.ownership_type !== 'Semua') params.append('ownership_type', filters.ownership_type);
  if (filters.status) params.append('status', filters.status);
  if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());
  if (filters.owner_id) params.append('owner_id', filters.owner_id);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<Item[]>(`/items${query}`);
}

export async function getItemById(id: string) {
  return apiRequest<Item>(`/items/${id}`);
}

export async function createItem(data: {
  community_id: string;
  name: string;
  description?: string;
  category: string;
  condition?: string;
  location_hint?: string;
  borrowing_rules?: string;
  ownership_type?: 'personal' | 'community';
  image_url?: string;
}) {
  return apiRequest<Item>('/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateItem(id: string, data: Partial<Item>) {
  return apiRequest<Item>(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteItem(id: string) {
  return apiRequest<{ id: string; deleted: boolean }>(`/items/${id}`, {
    method: 'DELETE',
  });
}
