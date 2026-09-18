export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ItemStatus = 'available' | 'borrowed' | 'unavailable'
export type BorrowRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'returned' | 'overdue'
export type CommunityNeedStatus = 'open' | 'fulfilled' | 'closed'
export type MemberRole = 'member' | 'admin'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          phone_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          location: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          location?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          location?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      community_members: {
        Row: {
          id: string
          community_id: string
          user_id: string
          role: MemberRole
          joined_at: string
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          role?: MemberRole
          joined_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          role?: MemberRole
          joined_at?: string
        }
      }
      items: {
        Row: {
          id: string
          community_id: string
          owner_id: string
          name: string
          description: string | null
          category: string
          condition: string | null
          location_hint: string | null
          borrowing_rules: string | null
          status: ItemStatus
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          community_id: string
          owner_id: string
          name: string
          description?: string | null
          category: string
          condition?: string | null
          location_hint?: string | null
          borrowing_rules?: string | null
          status?: ItemStatus
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          owner_id?: string
          name?: string
          description?: string | null
          category?: string
          condition?: string | null
          location_hint?: string | null
          borrowing_rules?: string | null
          status?: ItemStatus
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      borrowing_requests: {
        Row: {
          id: string
          item_id: string
          requester_id: string
          start_date: string
          end_date: string
          purpose: string
          status: BorrowRequestStatus
          approved_at: string | null
          returned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_id: string
          requester_id: string
          start_date: string
          end_date: string
          purpose: string
          status?: BorrowRequestStatus
          approved_at?: string | null
          returned_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          requester_id?: string
          start_date?: string
          end_date?: string
          purpose?: string
          status?: BorrowRequestStatus
          approved_at?: string | null
          returned_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      community_needs: {
        Row: {
          id: string
          community_id: string
          user_id: string
          title: string
          description: string | null
          needed_from: string | null
          needed_until: string | null
          status: CommunityNeedStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          title: string
          description?: string | null
          needed_from?: string | null
          needed_until?: string | null
          status?: CommunityNeedStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          title?: string
          description?: string | null
          needed_from?: string | null
          needed_until?: string | null
          status?: CommunityNeedStatus
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      approve_borrow_request: {
        Args: { p_request_id: string }
        Returns: Json
      }
      reject_borrow_request: {
        Args: { p_request_id: string; p_reason?: string | null }
        Returns: Json
      }
      return_borrowed_item: {
        Args: { p_request_id: string }
        Returns: Json
      }
      cancel_borrow_request: {
        Args: { p_request_id: string }
        Returns: Json
      }
      sync_overdue_borrowing_requests: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_community_member: {
        Args: { p_community_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_community_admin: {
        Args: { p_community_id: string; p_user_id?: string }
        Returns: boolean
      }
      shares_community_with: {
        Args: { p_target_user_id: string; p_user_id?: string }
        Returns: boolean
      }
    }
  }
}
