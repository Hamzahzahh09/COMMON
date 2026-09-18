export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ItemStatus = 'available' | 'borrowed' | 'unavailable';
export type BorrowRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'returned' | 'overdue';
export type CommunityNeedStatus = 'open' | 'fulfilled' | 'closed';
export type MemberRole = 'member' | 'admin';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          phone_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      communities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          location: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          location?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          location?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'communities_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          role: MemberRole;
          joined_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          role?: MemberRole;
          joined_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          user_id?: string;
          role?: MemberRole;
          joined_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'community_members_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'communities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      items: {
        Row: {
          id: string;
          community_id: string;
          owner_id: string;
          name: string;
          description: string | null;
          category: string;
          condition: string | null;
          location_hint: string | null;
          borrowing_rules: string | null;
          ownership_type: 'personal' | 'community';
          status: ItemStatus;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          owner_id: string;
          name: string;
          description?: string | null;
          category: string;
          condition?: string | null;
          location_hint?: string | null;
          borrowing_rules?: string | null;
          ownership_type?: 'personal' | 'community';
          status?: ItemStatus;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          owner_id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          condition?: string | null;
          location_hint?: string | null;
          borrowing_rules?: string | null;
          ownership_type?: 'personal' | 'community';
          status?: ItemStatus;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'items_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'communities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'items_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      borrowing_requests: {
        Row: {
          id: string;
          item_id: string;
          requester_id: string;
          start_date: string;
          end_date: string;
          purpose: string;
          status: BorrowRequestStatus;
          approved_at: string | null;
          returned_at: string | null;
          pickup_instructions: string | null;
          return_condition: string | null;
          return_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          requester_id: string;
          start_date: string;
          end_date: string;
          purpose: string;
          status?: BorrowRequestStatus;
          approved_at?: string | null;
          returned_at?: string | null;
          pickup_instructions?: string | null;
          return_condition?: string | null;
          return_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          requester_id?: string;
          start_date?: string;
          end_date?: string;
          purpose?: string;
          status?: BorrowRequestStatus;
          approved_at?: string | null;
          returned_at?: string | null;
          pickup_instructions?: string | null;
          return_condition?: string | null;
          return_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'borrowing_requests_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'borrowing_requests_requester_id_fkey';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      community_needs: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          title: string;
          description: string | null;
          needed_from: string | null;
          needed_until: string | null;
          status: CommunityNeedStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          title: string;
          description?: string | null;
          needed_from?: string | null;
          needed_until?: string | null;
          status?: CommunityNeedStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          needed_from?: string | null;
          needed_until?: string | null;
          status?: CommunityNeedStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'community_needs_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'communities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_needs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      community_need_offers: {
        Row: {
          id: string;
          need_id: string;
          user_id: string;
          item_id: string | null;
          message: string;
          status: 'pending' | 'accepted' | 'declined';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          need_id: string;
          user_id: string;
          item_id?: string | null;
          message: string;
          status?: 'pending' | 'accepted' | 'declined';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          need_id?: string;
          user_id?: string;
          item_id?: string | null;
          message?: string;
          status?: 'pending' | 'accepted' | 'declined';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      borrowing_messages: {
        Row: {
          id: string;
          request_id: string;
          sender_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          sender_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          sender_id?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      community_discussions: {
        Row: {
          id: string;
          community_id: string;
          author_id: string;
          title: string;
          content: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          author_id: string;
          title: string;
          content: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      approve_borrow_request: {
        Args: { p_request_id: string };
        Returns: Json;
      };
      reject_borrow_request: {
        Args: { p_request_id: string; p_reason?: string | null };
        Returns: Json;
      };
      return_borrowed_item: {
        Args: { p_request_id: string };
        Returns: Json;
      };
      cancel_borrow_request: {
        Args: { p_request_id: string };
        Returns: Json;
      };
      sync_overdue_borrowing_requests: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      is_community_member: {
        Args: { p_community_id: string; p_user_id?: string };
        Returns: boolean;
      };
      is_community_admin: {
        Args: { p_community_id: string; p_user_id?: string };
        Returns: boolean;
      };
      shares_community_with: {
        Args: { p_target_user_id: string; p_user_id?: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
