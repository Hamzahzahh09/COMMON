import { apiRequest } from './client';
import type { Item } from './items.api';

export type NeedOffer = {
  id: string;
  need_id: string;
  user_id: string;
  item_id: string | null;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  item?: Item;
};

export async function getNeedOffers(needId: string) {
  return apiRequest<NeedOffer[]>(`/community-needs/${needId}/offers`);
}

export async function createNeedOffer(
  needId: string,
  data: { item_id?: string; message: string }
) {
  return apiRequest<NeedOffer>(`/community-needs/${needId}/offers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function acceptNeedOffer(needId: string, offerId: string) {
  return apiRequest<{ offer: NeedOffer; borrow_request?: any }>(
    `/community-needs/${needId}/offers/${offerId}/accept`,
    {
      method: 'POST',
    }
  );
}
