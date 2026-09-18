-- ==============================================================================
-- COMMON Backend: Demo Seed Data
-- Community: RT 05 Commons
-- 8 Residents, 18 Items, Active/Pending/Returned/Overdue Requests, Community Needs
-- ==============================================================================

-- Temporarily disable trigger for user creation during seed if handling raw auth.users
-- so we can insert consistent demo UUIDs into both auth.users and public.profiles.

DO $$
BEGIN

    -- ==============================================================================
    -- 1. AUTH USERS (Supabase Auth Mock Accounts)
    -- Password for all demo accounts: 'Password123!'
    -- ==============================================================================
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at
    )
    VALUES
        ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'budi@rt05.commons.id', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Budi Santoso"}', now(), now()),
        ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'siti@rt05.commons.id', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Siti Rahma"}', now(), now()),
        ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'arif@rt05.commons.id', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Arif Hidayat"}', now(), now()),
        ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dian@rt05.commons.id', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dian Prasetyo"}', now(), now()),
        ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hendra@rt05.commons.id', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hendra Wijaya"}', now(), now()),
        ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maya@rt05.commons.id', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Maya Indah"}', now(), now()),
        ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rizky@rt05.commons.id', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Rizky Pratama"}', now(), now()),
        ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dewi@rt05.commons.id', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dewi Lestari"}', now(), now())
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 2. RESIDENT PROFILES
    -- ==============================================================================
    INSERT INTO public.profiles (id, full_name, avatar_url, phone_number)
    VALUES
        ('00000000-0000-0000-0000-000000000001', 'Pak Budi Santoso', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+62811000001'),
        ('00000000-0000-0000-0000-000000000002', 'Ibu Siti Rahma', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+62811000002'),
        ('00000000-0000-0000-0000-000000000003', 'Arif Hidayat', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+62811000003'),
        ('00000000-0000-0000-0000-000000000004', 'Dian Prasetyo', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '+62811000004'),
        ('00000000-0000-0000-0000-000000000005', 'Hendra Wijaya', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', '+62811000005'),
        ('00000000-0000-0000-0000-000000000006', 'Maya Indah', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+62811000006'),
        ('00000000-0000-0000-0000-000000000007', 'Rizky Pratama', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', '+62811000007'),
        ('00000000-0000-0000-0000-000000000008', 'Dewi Lestari', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+62811000008')
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;

    -- ==============================================================================
    -- 3. COMMUNITY (RT 05 Commons)
    -- ==============================================================================
    INSERT INTO public.communities (id, name, slug, description, location, created_by)
    VALUES (
        '11111111-1111-1111-1111-111111111111',
        'RT 05 Commons',
        'rt-05-commons',
        'Komunitas warga RT 05 / RW 03. Tempat berbagi pakai alat rumah tangga, pertukangan, dan perlengkapan kegiatan warga.',
        'Komp. Griya Harmoni, Jakarta Selatan',
        '00000000-0000-0000-0000-000000000001'
    )
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 4. COMMUNITY MEMBERSHIPS
    -- ==============================================================================
    INSERT INTO public.community_members (community_id, user_id, role)
    VALUES
        ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'admin'),
        ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'member'),
        ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', 'member'),
        ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000004', 'member'),
        ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000005', 'member'),
        ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000006', 'member'),
        ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000007', 'member'),
        ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000008', 'member')
    ON CONFLICT (community_id, user_id) DO NOTHING;

    -- ==============================================================================
    -- 5. SHARED ITEMS (18 items across 5 categories)
    -- ==============================================================================
    INSERT INTO public.items (id, community_id, owner_id, name, description, category, condition, location_hint, borrowing_rules, status, image_url)
    VALUES
        -- Tools
        ('22222222-2222-2222-2222-000000000001', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003',
         'Bosch Impact Power Drill 650W', 'Lengkap dengan set mata bor beton, besi, dan obeng. Sangat cocok untuk pasang rak dinding atau pigura.', 'Tools', 'Excellent', 'Blok B3 No. 7', 'Harap kembalikan mata bor ke kotaknya setelah digunakan.', 'available', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600'),

        ('22222222-2222-2222-2222-000000000002', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001',
         'Tangga Lipat Teleskopik 4.4 Meter', 'Tangga aluminium kuat dan ringkas. Bisa dilipat pendek untuk dibawa di bagasi mobil.', 'Tools', 'Good', 'Pos Keamanan RT / Rumah Blok A1 No. 1', 'Maksimal beban 150kg. Jangan ditinggal di luar ruangan semalaman.', 'available', 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600'),

        ('22222222-2222-2222-2222-000000000003', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000007',
         'Stanley Mechanics Toolbox 120 Pcs', 'Kunci pas, obeng ratchet, soket metrik, tang lengkap untuk perbaikan mobil/motor atau perabot rumah.', 'Tools', 'Good', 'Garasi Blok C2 No. 14', 'Lap bersih oli/gemuk sebelum dikembalikan.', 'borrowed', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600'),

        ('22222222-2222-2222-2222-000000000004', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000007',
         'High-Pressure Washer 110 Bar', 'Pembersih steam bertekanan tinggi untuk cuci mobil, motor, paving block, atau lumut dinding.', 'Tools', 'Excellent', 'Blok C2 No. 14', 'Pastikan air mengalir sebelum menyalakan saklar motor.', 'available', 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600'),

        ('22222222-2222-2222-2222-000000000005', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003',
         'Gergaji Listrik Cordless Jigsaw 20V', 'Gergaji presisi untuk memotong kayu, triplek, atau pipa PVC. Termasuk 2 baterai dan charger.', 'Tools', 'Good', 'Blok B3 No. 7', 'Pakai kacamata pelindung (tersedia di tas).', 'available', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600'),

        -- Home Equipment
        ('22222222-2222-2222-2222-000000000006', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002',
         'Kärcher Wet & Dry Vacuum Cleaner', 'Penyedot debu serbaguna kapasitas besar. Kuat untuk debu konstruksi atau sedot genangan air.', 'Home', 'Excellent', 'Blok A2 No. 5', 'Buang debu dan keringkan tabung sebelum mengembalikan.', 'available', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600'),

        ('22222222-2222-2222-2222-000000000007', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002',
         'Philips Garment Steamer Pro', 'Setrika uap vertikal untuk merapikan pakaian pesta, gorden, atau jas tanpa merusak kain.', 'Home', 'Good', 'Blok A2 No. 5', 'Gunakan air mineral/aquades agar tidak berkerak.', 'available', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600'),

        ('22222222-2222-2222-2222-000000000008', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001',
         'Mesin Pemotong Rumput Elektrik', 'Pemotong rumput dorong kabel 10 meter. Efisien dan bersih untuk merapikan halaman rumah.', 'Home', 'Good', 'Gudang Balai RT', 'Cek apakah ada batu besar di rumput sebelum mulai.', 'borrowed', 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600'),

        ('22222222-2222-2222-2222-000000000009', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000005',
         'Troli Angkut Lipat / Hand Truck 150kg', 'Troli roda lipat untuk pindahan kardus berat, tabung gas besar, atau galon air.', 'Home', 'Good', 'Blok D1 No. 3', 'Kapasitas maksimal 150kg.', 'available', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600'),

        ('22222222-2222-2222-2222-000000000010', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000006',
         'Mesin Cuci Karpet Portable Spot Cleaner', 'Alat pembersih noda sofa, kasur, jok mobil, dan karpet dengan semprotan dan ekstraktor.', 'Home', 'Excellent', 'Blok C1 No. 8', 'Bilas tangki air kotor sampai bersih tuntas.', 'available', 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600'),

        -- Events
        ('22222222-2222-2222-2222-000000000011', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000008',
         'Epson Full HD Cinema Projector 3500 Lumens', 'Proyektor tajam terang untuk nobar warga, presentasi, atau bioskop keluarga di garasi.', 'Events', 'Excellent', 'Blok B1 No. 12', 'Kabel HDMI 10m disertakan. Matikan lampu proyektor dengan prosedur standby.', 'borrowed', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600'),

        ('22222222-2222-2222-2222-000000000012', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000008',
         'JBL PartyBox Portable Bluetooth Speaker', 'Speaker outdoor bertenaga dengan lampu RGB, baterai tahan 12 jam, dan input mic/gitar.', 'Events', 'Excellent', 'Blok B1 No. 12', 'Jangan terkena guyuran hujan langsung.', 'borrowed', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600'),

        ('22222222-2222-2222-2222-000000000013', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000006',
         'Meja Lipat Acara 180cm (Set isi 2 unit)', 'Meja lipat serbaguna putih tebal untuk acara arisan, bazar makanan, atau rapat RT.', 'Events', 'Good', 'Blok C1 No. 8', 'Lap bersih dari tumpahan makanan sebelum dilipat.', 'available', 'https://images.unsplash.com/photo-1530629013299-6cb10d168419?w=600'),

        ('22222222-2222-2222-2222-000000000014', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000008',
         'Shure Wireless Dual Microphone UHF Set', 'Mikrofon nirkabel 2 buah jangkauan 50 meter dengan receiver dan baterai cadangan rechargeable.', 'Events', 'Excellent', 'Blok B1 No. 12', 'Matikan switch mic bila tidak dipakai agar baterai hemat.', 'available', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600'),

        -- Outdoor
        ('22222222-2222-2222-2222-000000000015', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000005',
         'Tenda Camping Keluarga 4-5 Orang Waterproof', 'Tenda dome double layer anti bocor dengan vestibule luas dan pasak aluminium.', 'Outdoor', 'Excellent', 'Blok D1 No. 3', 'Wajib dijemur kering sebelum dimasukkan ke kantong penyimpanan.', 'available', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600'),

        ('22222222-2222-2222-2222-000000000016', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000005',
         'Coleman Rolling Cooler Box 50 Liter', 'Cooler box beroda tahan es hingga 4 hari. Muat 80 kaleng minuman untuk piknik atau kumpul warga.', 'Outdoor', 'Good', 'Blok D1 No. 3', 'Kuras air lelehan dan cuci bersih bagian dalam.', 'available', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600'),

        ('22222222-2222-2222-2222-000000000017', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000006',
         'Kompor Gas Portable & Set Panci Grill Camping', 'Kompor mini gas butana + piringan grill anti lengket untuk BBQ santai bersama tetangga.', 'Outdoor', 'Good', 'Blok C1 No. 8', 'Gas kaleng bawa sendiri. Cuci bersih wajan grill tanpa sabut kawat kasar.', 'available', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600'),

        -- Electronics
        ('22222222-2222-2222-2222-000000000018', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000004',
         'Portable Power Station 600W / 512Wh', 'Baterai cadangan darurat dengan colokan AC 220V, USB-C PD 100W, dan lampu darurat.', 'Electronics', 'Excellent', 'Blok B2 No. 10', 'Kembalikan dalam kondisi terisi minimal 80%.', 'available', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600')
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 6. BORROWING REQUESTS (Showcasing All Lifecycle States)
    -- ==============================================================================
    INSERT INTO public.borrowing_requests (
        id, item_id, requester_id, start_date, end_date, purpose, status, approved_at, returned_at
    )
    VALUES
        -- 1. Active Approved Borrow: Stanley Toolbox
        ('33333333-3333-3333-3333-000000000001',
         '22222222-2222-2222-2222-000000000003', -- Stanley Toolbox (Owner: Rizky)
         '00000000-0000-0000-0000-000000000005', -- Requester: Hendra
         CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days',
         'Ganti oli motor dan stel rantai sepeda anak.',
         'approved', now() - INTERVAL '1 day', NULL),

        -- 2. Active Approved Borrow: Mesin Potong Rumput
        ('33333333-3333-3333-3333-000000000002',
         '22222222-2222-2222-2222-000000000008', -- Lawn Mower (Owner: Pak Budi)
         '00000000-0000-0000-0000-000000000003', -- Requester: Arif
         CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day',
         'Merapikan rumput taman depan rumah yang sudah mulai tinggi.',
         'approved', now(), NULL),

        -- 3. Active Approved Borrow: Epson Projector
        ('33333333-3333-3333-3333-000000000003',
         '22222222-2222-2222-2222-000000000011', -- Projector (Owner: Dewi)
         '00000000-0000-0000-0000-000000000006', -- Requester: Maya
         CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days',
         'Nobar film animasi anak-anak warga RT 05 di teras balai warga.',
         'approved', now(), NULL),

        -- 4. Overdue Borrow: JBL Speaker (Past end_date, item still unreturned)
        ('33333333-3333-3333-3333-000000000004',
         '22222222-2222-2222-2222-000000000012', -- JBL Speaker (Owner: Dewi)
         '00000000-0000-0000-0000-000000000007', -- Requester: Rizky
         CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '2 days',
         'Acara syukuran ulang tahun anak di rumah.',
         'overdue', now() - INTERVAL '7 days', NULL),

        -- 5. Pending Request: Bosch Power Drill (Awaiting Arif approval)
        ('33333333-3333-3333-3333-000000000005',
         '22222222-2222-2222-2222-000000000001', -- Drill (Owner: Arif)
         '00000000-0000-0000-0000-000000000004', -- Requester: Dian
         CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '4 days',
         'Pasang bracket monitor dan ambalan meja kerja di kamar.',
         'pending', NULL, NULL),

        -- 6. Pending Request: Tangga Teleskopik (Awaiting Pak Budi approval)
        ('33333333-3333-3333-3333-000000000006',
         '22222222-2222-2222-2222-000000000002', -- Tangga (Owner: Pak Budi)
         '00000000-0000-0000-0000-000000000002', -- Requester: Siti
         CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days',
         'Merapikan ranting pohon mangga dan bersihkan talang air.',
         'pending', NULL, NULL),

        -- 7. Pending Request: Tenda Camping (Awaiting Hendra approval)
        ('33333333-3333-3333-3333-000000000007',
         '22222222-2222-2222-2222-000000000015', -- Tenda (Owner: Hendra)
         '00000000-0000-0000-0000-000000000008', -- Requester: Dewi
         CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days',
         'Camping akhir pekan keluarga di Gunung Pancar.',
         'pending', NULL, NULL),

        -- 8. Returned Past Request: Pressure Washer (Successfully returned)
        ('33333333-3333-3333-3333-000000000008',
         '22222222-2222-2222-2222-000000000004', -- Pressure Washer (Owner: Rizky)
         '00000000-0000-0000-0000-000000000001', -- Requester: Pak Budi
         CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days',
         'Bersihkan paving block lapangan bulutangkis RT yang berlumut.',
         'returned', now() - INTERVAL '10 days', now() - INTERVAL '8 days'),

        -- 9. Returned Past Request: Wet & Dry Vacuum (Successfully returned)
        ('33333333-3333-3333-3333-000000000009',
         '22222222-2222-2222-2222-000000000006', -- Vacuum (Owner: Siti)
         '00000000-0000-0000-0000-000000000004', -- Requester: Dian
         CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '13 days',
         'Bersihkan sisa serbuk kayu setelah pasang lemari.',
         'returned', now() - INTERVAL '14 days', now() - INTERVAL '13 days'),

        -- 10. Rejected Request: Meja Lipat
        ('33333333-3333-3333-3333-000000000010',
         '22222222-2222-2222-2222-000000000013', -- Meja Lipat (Owner: Maya)
         '00000000-0000-0000-0000-000000000002', -- Requester: Siti
         CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '3 days',
         'Pinjam untuk display kue bazar.',
         'rejected', NULL, NULL)
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 7. COMMUNITY NEEDS (Wishlist Board)
    -- ==============================================================================
    INSERT INTO public.community_needs (
        id, community_id, user_id, title, description, needed_from, needed_until, status
    )
    VALUES
        ('44444444-4444-4444-4444-000000000001',
         '11111111-1111-1111-1111-111111111111',
         '00000000-0000-0000-0000-000000000002', -- Ibu Siti
         'Butuh Leaf Blower (Peniup Daun) untuk Kerja Bakti Minggu Ini',
         'Minggu pagi ada kerja bakti membersihkan taman RT. Jika ada warga yang punya leaf blower bertenaga baterai/listrik untuk mempermudah kumpul daun kering.',
         CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '3 days',
         'open'),

        ('44444444-4444-4444-4444-000000000002',
         '11111111-1111-1111-1111-111111111111',
         '00000000-0000-0000-0000-000000000006', -- Maya Indah
         'Butuh Layar Proyektor Lipat Portable 84-100 Inch',
         'Untuk melengkapi proyektor Mbak Dewi saat pemutaran film edukasi anak warga. Biar tidak perlu tembak ke dinding tembok bertekstur.',
         CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '4 days',
         'open'),

        ('44444444-4444-4444-4444-000000000003',
         '11111111-1111-1111-1111-111111111111',
         '00000000-0000-0000-0000-000000000004', -- Dian Prasetyo
         'Butuh Rotary Hammer Drill SDS Plus untuk Pasang Bracket Berat',
         'Perlu melubangi kolom beton untuk pasang cantolan sepeda gantung.',
         CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days',
         'fulfilled')
    ON CONFLICT (id) DO NOTHING;

END $$;
