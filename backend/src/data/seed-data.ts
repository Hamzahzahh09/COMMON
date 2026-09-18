export type SeedProfile = {
  id: string;
  full_name: string;
  avatar_url: string;
  phone_number?: string;
};

export type SeedCommunity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  created_by: string;
  member_count?: number;
};

export type SeedItem = {
  id: string;
  community_id: string;
  owner_id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  location_hint: string;
  borrowing_rules: string;
  ownership_type: 'personal' | 'community';
  status: 'available' | 'borrowed' | 'unavailable';
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type SeedBorrowingRequest = {
  id: string;
  item_id: string;
  requester_id: string;
  start_date: string;
  end_date: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'returned' | 'overdue';
  pickup_instructions?: string;
  return_condition?: 'pristine' | 'good' | 'fair' | 'needs_maintenance';
  approved_at?: string | null;
  returned_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type SeedCommunityNeed = {
  id: string;
  community_id: string;
  user_id: string;
  title: string;
  description: string;
  needed_from: string;
  needed_until: string;
  status: 'open' | 'fulfilled' | 'closed';
  created_at: string;
  updated_at: string;
};

export type SeedDiscussion = {
  id: string;
  community_id: string;
  author_id: string;
  title: string;
  content: string;
  category: 'general' | 'resource_qa' | 'announcement';
  created_at: string;
};

export const SEED_PROFILES: SeedProfile[] = [
  { id: '00000000-0000-0000-0000-000000000001', full_name: 'Pak Budi Santoso', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', phone_number: '+62811000001' },
  { id: '00000000-0000-0000-0000-000000000002', full_name: 'Ibu Siti Rahma', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', phone_number: '+62811000002' },
  { id: '00000000-0000-0000-0000-000000000003', full_name: 'Arif Hidayat', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', phone_number: '+62811000003' },
  { id: '00000000-0000-0000-0000-000000000004', full_name: 'Dian Prasetyo', avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', phone_number: '+62811000004' },
  { id: '00000000-0000-0000-0000-000000000005', full_name: 'Hendra Wijaya', avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', phone_number: '+62811000005' },
  { id: '00000000-0000-0000-0000-000000000006', full_name: 'Maya Indah', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', phone_number: '+62811000006' },
  { id: '00000000-0000-0000-0000-000000000007', full_name: 'Rizky Pratama', avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', phone_number: '+62811000007' },
  { id: '00000000-0000-0000-0000-000000000008', full_name: 'Dewi Lestari', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', phone_number: '+62811000008' },
];

export const SEED_COMMUNITIES: SeedCommunity[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'RT 05 Commons',
    slug: 'rt-05-commons',
    description: 'Komunitas warga RT 05 / RW 03. Tempat berbagi pakai alat rumah tangga, pertukangan, dan perlengkapan kegiatan warga.',
    location: 'Komp. Griya Harmoni, Jakarta Selatan',
    created_by: '00000000-0000-0000-0000-000000000001',
    member_count: 8,
  },
];

export const SEED_MEMBERS = [
  { community_id: '11111111-1111-1111-1111-111111111111', user_id: '00000000-0000-0000-0000-000000000001', role: 'admin' },
  { community_id: '11111111-1111-1111-1111-111111111111', user_id: '00000000-0000-0000-0000-000000000002', role: 'member' },
  { community_id: '11111111-1111-1111-1111-111111111111', user_id: '00000000-0000-0000-0000-000000000003', role: 'member' },
  { community_id: '11111111-1111-1111-1111-111111111111', user_id: '00000000-0000-0000-0000-000000000004', role: 'member' },
  { community_id: '11111111-1111-1111-1111-111111111111', user_id: '00000000-0000-0000-0000-000000000005', role: 'member' },
  { community_id: '11111111-1111-1111-1111-111111111111', user_id: '00000000-0000-0000-0000-000000000006', role: 'member' },
  { community_id: '11111111-1111-1111-1111-111111111111', user_id: '00000000-0000-0000-0000-000000000007', role: 'member' },
  { community_id: '11111111-1111-1111-1111-111111111111', user_id: '00000000-0000-0000-0000-000000000008', role: 'member' },
];

export const SEED_ITEMS: SeedItem[] = [
  {
    id: '22222222-2222-2222-2222-000000000001',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000003',
    name: 'Bosch Impact Power Drill 650W',
    description: 'Lengkap dengan set mata bor beton, besi, dan obeng. Sangat cocok untuk pasang rak dinding atau pigura.',
    category: 'Tools',
    condition: 'Excellent',
    location_hint: 'Blok B3 No. 7',
    borrowing_rules: 'Harap kembalikan mata bor ke kotaknya setelah digunakan.',
    ownership_type: 'personal',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-000000000002',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000001',
    name: 'Tangga Lipat Teleskopik 4.4 Meter',
    description: 'Tangga aluminium kuat dan ringkas. Bisa dilipat pendek untuk dibawa di bagasi mobil.',
    category: 'Tools',
    condition: 'Good',
    location_hint: 'Pos Keamanan RT / Rumah Blok A1 No. 1',
    borrowing_rules: 'Maksimal beban 150kg. Jangan ditinggal di luar ruangan semalaman.',
    ownership_type: 'community',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600',
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-000000000003',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000007',
    name: 'Stanley Mechanics Toolbox 120 Pcs',
    description: 'Kunci pas, obeng ratchet, soket metrik, tang lengkap untuk perbaikan mobil/motor atau perabot rumah.',
    category: 'Tools',
    condition: 'Good',
    location_hint: 'Garasi Blok C2 No. 14',
    borrowing_rules: 'Lap bersih oli/gemuk sebelum dikembalikan.',
    ownership_type: 'personal',
    status: 'borrowed',
    image_url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-000000000004',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000007',
    name: 'High-Pressure Washer 110 Bar',
    description: 'Pembersih steam bertekanan tinggi untuk cuci mobil, motor, paving block, atau lumut dinding.',
    category: 'Tools',
    condition: 'Excellent',
    location_hint: 'Blok C2 No. 14',
    borrowing_rules: 'Pastikan air mengalir sebelum menyalakan saklar motor.',
    ownership_type: 'personal',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-000000000005',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000003',
    name: 'Gergaji Listrik Cordless Jigsaw 20V',
    description: 'Gergaji presisi untuk memotong kayu, triplek, atau pipa PVC. Termasuk 2 baterai dan charger.',
    category: 'Tools',
    condition: 'Good',
    location_hint: 'Blok B3 No. 7',
    borrowing_rules: 'Pakai kacamata pelindung (tersedia di tas).',
    ownership_type: 'personal',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-000000000006',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000002',
    name: 'Kärcher Wet & Dry Vacuum Cleaner',
    description: 'Penyedot debu serbaguna kapasitas besar. Kuat untuk debu konstruksi atau sedot genangan air.',
    category: 'Home',
    condition: 'Excellent',
    location_hint: 'Blok A2 No. 5',
    borrowing_rules: 'Buang debu dan keringkan tabung sebelum mengembalikan.',
    ownership_type: 'personal',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-000000000008',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000001',
    name: 'Mesin Pemotong Rumput Elektrik RT',
    description: 'Pemotong rumput dorong kabel 10 meter. Efisien dan bersih untuk merapikan halaman rumah.',
    category: 'Home',
    condition: 'Good',
    location_hint: 'Gudang Balai RT',
    borrowing_rules: 'Cek apakah ada batu besar di rumput sebelum mulai.',
    ownership_type: 'community',
    status: 'borrowed',
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-000000000011',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000008',
    name: 'Epson Full HD Cinema Projector 3500 Lumens',
    description: 'Proyektor tajam terang untuk nobar warga, presentasi, atau bioskop keluarga di garasi.',
    category: 'Events',
    condition: 'Excellent',
    location_hint: 'Blok B1 No. 12',
    borrowing_rules: 'Kabel HDMI 10m disertakan. Matikan lampu proyektor dengan prosedur standby.',
    ownership_type: 'personal',
    status: 'borrowed',
    image_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-000000000012',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000008',
    name: 'JBL PartyBox Portable Bluetooth Speaker',
    description: 'Speaker outdoor bertenaga dengan lampu RGB, baterai tahan 12 jam, dan input mic/gitar.',
    category: 'Events',
    condition: 'Excellent',
    location_hint: 'Blok B1 No. 12',
    borrowing_rules: 'Jangan terkena guyuran hujan langsung.',
    ownership_type: 'community',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-000000000015',
    community_id: '11111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000005',
    name: 'Tenda Camping Keluarga 4-5 Orang Waterproof',
    description: 'Tenda dome double layer anti bocor dengan vestibule luas dan pasak aluminium.',
    category: 'Outdoor',
    condition: 'Excellent',
    location_hint: 'Blok D1 No. 3',
    borrowing_rules: 'Wajib dijemur kering sebelum dimasukkan ke kantong penyimpanan.',
    ownership_type: 'personal',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SEED_NEEDS: SeedCommunityNeed[] = [
  {
    id: '44444444-4444-4444-4444-000000000001',
    community_id: '11111111-1111-1111-1111-111111111111',
    user_id: '00000000-0000-0000-0000-000000000002',
    title: 'Butuh Leaf Blower (Peniup Daun) untuk Kerja Bakti Minggu Ini',
    description: 'Minggu pagi ada kerja bakti membersihkan taman RT. Jika ada warga yang punya leaf blower bertenaga baterai/listrik untuk mempermudah kumpul daun kering.',
    needed_from: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    needed_until: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    status: 'open',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-000000000002',
    community_id: '11111111-1111-1111-1111-111111111111',
    user_id: '00000000-0000-0000-0000-000000000006',
    title: 'Butuh Layar Proyektor Lipat Portable 84-100 Inch',
    description: 'Untuk melengkapi proyektor Mbak Dewi saat pemutaran film edukasi anak warga. Biar tidak perlu tembak ke dinding tembok bertekstur.',
    needed_from: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
    needed_until: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    status: 'open',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SEED_REQUESTS: SeedBorrowingRequest[] = [
  {
    id: '33333333-3333-3333-3333-000000000001',
    item_id: '22222222-2222-2222-2222-000000000003',
    requester_id: '00000000-0000-0000-0000-000000000005',
    start_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    purpose: 'Ganti oli motor dan stel rantai sepeda anak.',
    status: 'approved',
    pickup_instructions: 'Ambil di garasi samping jam 16:00',
    approved_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-000000000005',
    item_id: '22222222-2222-2222-2222-000000000001',
    requester_id: '00000000-0000-0000-0000-000000000004',
    start_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    purpose: 'Pasang bracket monitor dan ambalan meja kerja di kamar.',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SEED_DISCUSSIONS: SeedDiscussion[] = [
  {
    id: '55555555-5555-5555-5555-000000000001',
    community_id: '11111111-1111-1111-1111-111111111111',
    author_id: '00000000-0000-0000-0000-000000000001',
    title: '📢 Jadwal Pemeliharaan Inventaris RT & Kerja Bakti Bulanan',
    content: 'Minggu depan akan diadakan pengecekan rutin mesin rumput dan pembersihan tangga bersama di Balai Warga. Silakan merapat!',
    category: 'announcement',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-000000000002',
    community_id: '11111111-1111-1111-1111-111111111111',
    author_id: '00000000-0000-0000-0000-000000000003',
    title: '🔧 Tips Penggunaan Bor Bosch untuk Dinding Beton Tebal',
    content: 'Gunakan mode impact hammer (gambar palu) dan pastikan mata bor berpendingin air jika mengebor kolom beton keras.',
    category: 'resource_qa',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];
