import { apiRequest } from './client';
import type { Item } from './items.api';

export type BorrowingRequest = {
  id: string;
  item_id: string;
  requester_id: string;
  start_date: string;
  end_date: string;
  purpose: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'cancelled' | 'overdue';
  approved_at: string | null;
  returned_at: string | null;
  rejection_reason: string | null;
  pickup_instructions?: string | null;
  return_condition?: 'pristine' | 'good' | 'fair' | 'needs_maintenance' | null;
  return_notes?: string | null;
  created_at: string;
  updated_at: string;
  item?: Item;
  requester?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone_number?: string | null;
  };
};

export type BorrowingMessage = {
  id: string;
  request_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
};

export async function requestBorrow(data: {
  item_id: string;
  start_date: string;
  end_date: string;
  purpose?: string;
}) {
  return apiRequest<BorrowingRequest>('/borrowing-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMyRequests() {
  return apiRequest<BorrowingRequest[]>('/borrowing-requests/me');
}

export async function getIncomingRequests() {
  return apiRequest<BorrowingRequest[]>('/borrowing-requests/incoming');
}

export async function getRequestById(id: string) {
  return apiRequest<BorrowingRequest>(`/borrowing-requests/${id}`);
}

export async function approveRequest(id: string, pickupInstructions?: string) {
  return apiRequest<{ request: BorrowingRequest; item_status: string }>(
    `/borrowing-requests/${id}/approve`,
    {
      method: 'POST',
      body: JSON.stringify({ pickup_instructions: pickupInstructions }),
    }
  );
}

export async function rejectRequest(id: string, reason?: string) {
  return apiRequest<{ request: BorrowingRequest }>(
    `/borrowing-requests/${id}/reject`,
    {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }
  );
}

export async function returnItem(id: string, condition?: string, notes?: string) {
  return apiRequest<{ request: BorrowingRequest; item_status: string }>(
    `/borrowing-requests/${id}/return`,
    {
      method: 'POST',
      body: JSON.stringify({ return_condition: condition, return_notes: notes }),
    }
  );
}

export async function cancelRequest(id: string) {
  return apiRequest<{ request: BorrowingRequest }>(
    `/borrowing-requests/${id}/cancel`,
    { method: 'POST' }
  );
}

export async function getRequestMessages(requestId: string) {
  return apiRequest<BorrowingMessage[]>(`/borrowing-requests/${requestId}/messages`);
}

export async function sendRequestMessage(requestId: string, message: string) {
  return apiRequest<BorrowingMessage>(`/borrowing-requests/${requestId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

