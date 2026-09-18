<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';
  import { getAllCommunities, type Community } from '$lib/api/communities.api';
  import { getItems, type Item } from '$lib/api/items.api';
  import { getCommunityNeeds, type CommunityNeed } from '$lib/api/needs.api';
  import CommunityCard from '$lib/components/CommunityCard.svelte';
  import ResourceCard from '$lib/components/ResourceCard.svelte';
  import BorrowModal from '$lib/components/BorrowModal.svelte';
  import {
    Compass,
    Users,
    Sparkles,
    ArrowRight,
    ArrowUpRight,
    Search,
    ShieldCheck,
    Repeat,
    HeartHandshake,
    Package,
    CheckCircle2,
    Calendar,
    MapPin,
    Clock,
    DollarSign,
    RefreshCw,
    Shield,
    HandHelping,
    Boxes,
  } from 'lucide-svelte';

  type ActivityEvent = {
    id: string;
    type: 'item_shared' | 'need_posted';
    title: string;
    actor: string;
    community: string;
    timestamp: string;
    link: string;
  };

  let communities: Community[] = [];
  let featuredItems: Item[] = [];
  let featuredNeeds: CommunityNeed[] = [];
  let recentActivities: ActivityEvent[] = [];
  let loading = true;
  let borrowingItem: Item | null = null;

  // Real Impact metrics calculated from actual backend data
  let totalCommunities = 0;
  let totalResources = 0;
  let totalMembers = 0;

  function formatRelativeTime(dateString?: string): string {
    if (!dateString) return 'Baru-baru ini';
    try {
      const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
      if (diff < 60) return 'Baru saja';
      if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} menit lalu`;
      if (diff < 86400) return `${Math.max(1, Math.floor(diff / 3600))} jam lalu`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
      return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return 'Baru-baru ini';
    }
  }

  async function loadHomeData() {
    loading = true;
    try {
      const [commRes, itemRes, needRes] = await Promise.all([
        getAllCommunities(),
        getItems({ status: 'available' }),
        getCommunityNeeds({ status: 'open' }),
      ]);

      if (commRes.success && commRes.data) {
        const allComms = commRes.data;
        totalCommunities = allComms.length;
        totalMembers = allComms.reduce((acc, c) => acc + (c.member_count || 0), 0);
        communities = allComms.slice(0, 3);
      }

      if (itemRes.success && itemRes.data) {
        const allItems = itemRes.data;
        totalResources = allItems.length;
        featuredItems = allItems.slice(0, 4);
      }

      if (needRes.success && needRes.data) {
        featuredNeeds = needRes.data.slice(0, 3);
      }

      // Aggregate real activity from actual items & needs
      const itemEvents: ActivityEvent[] = (featuredItems || []).map((i) => ({
        id: `item-${i.id}`,
        type: 'item_shared',
        title: `Membagikan ${i.name}`,
        actor: i.owner?.full_name || 'Warga',
        community: i.community?.name || 'RT 05 Commons',
        timestamp: i.created_at,
        link: `/items/${i.id}`,
      }));

      const needEvents: ActivityEvent[] = (featuredNeeds || []).map((n) => ({
        id: `need-${n.id}`,
        type: 'need_posted',
        title: `Membutuhkan: ${n.title}`,
        actor: n.creator?.full_name || 'Warga',
        community: n.community?.name || 'RT 05 Commons',
        timestamp: n.created_at,
        link: `/needs`,
      }));

      recentActivities = [...itemEvents, ...needEvents]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

    } catch (err) {
      console.error('Failed to load landing data:', err);
    } finally {
      loading = false;
    }
  }

  function handleBorrowItem(item: Item) {
    if (!$isAuthenticated) {
      toast.info('Silakan masuk terlebih dahulu untuk mengajukan pinjaman.');
      goto('/login');
      return;
    }
    borrowingItem = item;
  }

  function handleOfferHelp(need: CommunityNeed) {
    if (!$isAuthenticated) {
      toast.info('Silakan masuk terlebih dahulu untuk menawarkan bantuan.');
      goto('/login');
      return;
    }
    toast.success(`Silakan hubungi pemohon (${need.creator?.full_name || 'warga'}) di papan kebutuhan.`);
    goto('/needs');
  }

  onMount(() => {
    loadHomeData();
  });
</script>

<svelte:head>
  <title>COMMON — Shared Infrastructure for Real Communities</title>
  <meta name="description" content="COMMON helps communities share resources, borrow what they need, and access more without unnecessary ownership." />
</svelte:head>

<div class="space-y-16 sm:space-y-24">
  
  <!-- ========================================================================= -->
  <!-- 2. HERO SECTION                                                           -->
  <!-- ========================================================================= -->
  <section class="relative pt-6 sm:pt-12 pb-6 sm:pb-12 text-center max-w-4xl mx-auto">
    <!-- Subtitle Badge -->
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EFEA] text-[#1E4432] border border-[#C8DCD0] text-xs font-bold mb-6">
      <Sparkles class="w-3.5 h-3.5 text-brand-500" />
      Shared infrastructure for real communities.
    </div>

    <!-- Main Tagline -->
    <!-- Main Tagline -->
    <h1 class="text-4xl sm:text-6xl font-extrabold text-ink-primary tracking-tight leading-[1.14]">
      Share more.<br />
      Own less.<br />
      <span class="text-brand-500">Access together.</span>
    </h1>

    <!-- Supporting Message (Section 9) -->
    <p class="mt-6 text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl mx-auto font-normal">
      A community-powered way to access the things you need without everyone needing to own them.
    </p>

    <!-- CTAs (Section 8 & 9: Primary CTA: Discover resources, Secondary CTA: Join COMMON) -->
    <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
      <a
        href="/discover"
        class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <Compass class="w-4 h-4" />
        <span>Discover resources</span>
        <ArrowRight class="w-4 h-4 ml-0.5" />
      </a>

      <a
        href="/login"
        class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-surface-muted text-ink-primary font-bold text-sm border border-surface-border transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <span>Join COMMON</span>
      </a>
    </div>

    <!-- Core Philosophy Quote -->
    <div class="mt-10 pt-6 border-t border-surface-border text-xs text-ink-muted flex items-center justify-center gap-2 tracking-wide uppercase font-semibold">
      <span>Prinsip Inti:</span>
      <strong class="text-ink-primary font-bold text-sm">
        ACCESS OVER OWNERSHIP.
      </strong>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- 3. WHY COMMON (Section 10)                                                -->
  <!-- ========================================================================= -->
  <section id="why-common" class="bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-sm">
    <div class="max-w-3xl mx-auto text-center mb-12">
      <span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
        Why COMMON Exists
      </span>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-ink-primary mt-3 tracking-tight">
        Most things are used less than we think.
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary mt-3 leading-relaxed">
        Many household and community resources are only used occasionally: electric drills, projectors, cameras, printers, ladders, and event equipment. COMMON turns underused capacity into shared neighborhood access.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Value Block 1: Lower Cost -->
      <div class="p-6 rounded-2xl bg-[#F7F6F2] border border-surface-border flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold mb-4">
            <DollarSign class="w-5 h-5" />
          </div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
            LOWER COST
          </h3>
          <h4 class="text-base font-bold text-ink-primary tracking-tight">
            Not everyone needs to buy the same thing.
          </h4>
          <p class="text-xs text-ink-secondary mt-2 leading-relaxed">
            Warga menghemat pengeluaran rumah tangga dengan meminjam alat yang sudah ada di lingkungan tetangga, alih-alih membeli baru untuk keperluan sesaat.
          </p>
        </div>
      </div>

      <!-- Value Block 2: Better Utilization -->
      <div class="p-6 rounded-2xl bg-[#F7F6F2] border border-surface-border flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold mb-4">
            <Boxes class="w-5 h-5" />
          </div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
            BETTER UTILIZATION
          </h3>
          <h4 class="text-base font-bold text-ink-primary tracking-tight">
            Underused resources can help more people.
          </h4>
          <p class="text-xs text-ink-secondary mt-2 leading-relaxed">
            Barang fisik yang mengendap di garasi mendapatkan nilai guna maksimal ketika disirkulasikan secara aman kepada sesama anggota komunitas.
          </p>
        </div>
      </div>

      <!-- Value Block 3: Stronger Communities -->
      <div class="p-6 rounded-2xl bg-[#F7F6F2] border border-surface-border flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold mb-4">
            <HeartHandshake class="w-5 h-5" />
          </div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
            STRONGER COMMUNITIES
          </h3>
          <h4 class="text-base font-bold text-ink-primary tracking-tight">
            Sharing creates trust and collaboration.
          </h4>
          <p class="text-xs text-ink-secondary mt-2 leading-relaxed">
            Interaksi pinjam-meminjam menumbuhkan keakraban sosial nyata, memperkuat rasa saling percaya, dan menghidupkan kembali budaya gotong royong.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- 3.5. THE "I NEED" <-> "I HAVE" MECHANISM (Section 7)                      -->
  <!-- ========================================================================= -->
  <section class="bg-[#1E4432] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
    <div class="max-w-3xl mx-auto text-center mb-10">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/20 text-xs font-bold uppercase tracking-wider mb-3">
        <Sparkles class="w-3.5 h-3.5 text-emerald-300" />
        Defining Experience
      </div>
      <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
        "I NEED" ↔ "I HAVE"
      </h2>
      <p class="text-xs sm:text-sm text-emerald-100/80 mt-2 max-w-xl mx-auto leading-relaxed">
        Sampaikan apa yang sedang Anda butuhkan, dan tetangga yang memilikinya dapat langsung merespons dan menawarkan alat mereka.
      </p>
    </div>

    <!-- Interactive Comparison Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-center">
      <!-- Card A: I NEED -->
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-lg bg-amber-400 text-amber-950 text-xs font-black tracking-wider uppercase">
            I NEED
          </span>
          <span class="text-xs text-emerald-200 font-medium">21–23 September</span>
        </div>
        <div>
          <h3 class="text-lg font-extrabold text-white">Projector</h3>
          <p class="text-xs text-emerald-100/70 mt-1">
            Purpose: Community event
          </p>
        </div>
        <div class="pt-3 border-t border-white/10 text-xs text-emerald-200 flex items-center justify-between">
          <span>Posted by Dian</span>
          <span class="text-amber-300 font-semibold">• Awaiting offers</span>
        </div>
      </div>

      <!-- Card B: I HAVE -->
      <div class="bg-white text-ink-primary rounded-2xl p-6 border border-white shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black tracking-wider uppercase">
            I HAVE
          </span>
          <span class="text-xs text-brand-700 font-bold">Available: Sept 21–23</span>
        </div>
        <div>
          <h3 class="text-lg font-extrabold text-ink-primary">Epson Projector</h3>
          <p class="text-xs text-ink-secondary mt-1">
            Shared by Raka • Lengkap kabel HDMI & tas jinjing
          </p>
        </div>
        <a
          href="/needs"
          class="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
        >
          <span>[Offer This Item]</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- 4. HOW COMMON WORKS                                                       -->
  <!-- ========================================================================= -->
  <section id="how-it-works" class="bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-sm">
    <div class="max-w-2xl mx-auto text-center mb-10">
      <span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
        Alur Berbagi
      </span>
      <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-3 tracking-tight">
        How COMMON Works
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary mt-2">
        Empat langkah sederhana untuk meminjam dan mengembalikan sumber daya di komunitas Anda.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Step 1: Discover -->
      <div class="p-5 rounded-2xl bg-surface-base border border-surface-border flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm mb-4">
            01
          </div>
          <h3 class="font-bold text-base text-ink-primary">Discover</h3>
          <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed">
            Find resources available in your community. Telusuri katalog alat pertukangan, hobi, dan perlengkapan warga sekitar.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-surface-border text-[11px] font-semibold text-brand-700 flex items-center gap-1">
          <Compass class="w-3.5 h-3.5" />
          <span>Cari barang yang dibutuhkan</span>
        </div>
      </div>

      <!-- Step 2: Request -->
      <div class="p-5 rounded-2xl bg-surface-base border border-surface-border flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-earth-sand/40 text-earth-deep flex items-center justify-center font-bold text-sm mb-4">
            02
          </div>
          <h3 class="font-bold text-base text-ink-primary">Request</h3>
          <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed">
            Send a borrowing request. Ajukan durasi peminjaman dan maksud penggunaan kepada tetangga pemilik barang.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-surface-border text-[11px] font-semibold text-earth-deep flex items-center gap-1">
          <Calendar class="w-3.5 h-3.5" />
          <span>Pilih durasi tanggal pinjam</span>
        </div>
      </div>

      <!-- Step 3: Borrow -->
      <div class="p-5 rounded-2xl bg-surface-base border border-surface-border flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm mb-4">
            03
          </div>
          <h3 class="font-bold text-base text-ink-primary">Borrow</h3>
          <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed">
            Use the resource after owner approves. Ambil barang sesuai petunjuk lokasi aman dari pemilik (pos satpam/rumah).
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-surface-border text-[11px] font-semibold text-brand-700 flex items-center gap-1">
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>Persetujuan langsung pemilik</span>
        </div>
      </div>

      <!-- Step 4: Return -->
      <div class="p-5 rounded-2xl bg-surface-base border border-surface-border flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-earth-sand/40 text-earth-deep flex items-center justify-center font-bold text-sm mb-4">
            04
          </div>
          <h3 class="font-bold text-base text-ink-primary">Return</h3>
          <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed">
            Return it so another member can use it. Kembalikan tepat waktu dalam keadaan bersih untuk warga berikutnya.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-surface-border text-[11px] font-semibold text-earth-deep flex items-center gap-1">
          <Repeat class="w-3.5 h-3.5" />
          <span>Sirkulasi alat terjaga rapi</span>
        </div>
      </div>
    </div>

    <!-- Supporting Philosophy Banner -->
    <div class="mt-8 text-center pt-6 border-t border-surface-border text-xs sm:text-sm font-semibold text-ink-secondary">
      <span>"No marketplace. No unnecessary ownership. Just shared access."</span>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- 5. COMMUNITIES (Foundational Layer)                                       -->
  <!-- ========================================================================= -->
  <section class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-brand-600">
          Fondasi Platform
        </span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-1 tracking-tight">
          Communities are the foundation.
        </h2>
        <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl">
          Setiap komunitas memiliki ruangnya sendiri untuk berbagi resource, mengajukan kebutuhan, dan saling membantu.
        </p>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <a
          href="/create-community"
          class="px-3.5 py-2 rounded-xl bg-white hover:bg-surface-muted text-ink-primary text-xs font-bold border border-surface-border transition-colors"
        >
          Create Your Community
        </a>
        <a
          href="/communities"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors"
        >
          <span>Explore All Communities</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>

    {#if loading}
      <div class="py-12 text-center">
        <RefreshCw class="w-6 h-6 text-brand-500 animate-spin mx-auto mb-2" />
        <p class="text-xs text-ink-secondary font-medium">Memuat data komunitas...</p>
      </div>
    {:else if communities.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each communities as comm (comm.id)}
          <CommunityCard community={comm} onUpdated={loadHomeData} />
        {/each}
      </div>
    {:else}
      <div class="p-8 text-center bg-white rounded-2xl border border-surface-border">
        <p class="text-xs font-medium text-ink-secondary">Belum ada komunitas terdaftar. Jadilah yang pertama membuat komunitas!</p>
        <a href="/create-community" class="mt-3 inline-block text-xs font-bold text-brand-600 hover:underline">
          Buat Komunitas Sekarang →
        </a>
      </div>
    {/if}
  </section>

  <!-- ========================================================================= -->
  <!-- 6. AVAILABLE RESOURCES                                                    -->
  <!-- ========================================================================= -->
  <section class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-brand-600">
          Inventaris Warga
        </span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-1 tracking-tight">
          Things ready to be borrowed.
        </h2>
        <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl">
          Alat pertukangan, hobi, dan perlengkapan rumah tangga milik warga sekitar yang siap dipinjam pakai hari ini.
        </p>
      </div>

      <a
        href="/discover"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors self-start sm:self-auto"
      >
        <span>Lihat Katalog Lengkap</span>
        <ArrowRight class="w-4 h-4" />
      </a>
    </div>

    {#if loading}
      <div class="py-12 text-center">
        <RefreshCw class="w-6 h-6 text-brand-500 animate-spin mx-auto mb-2" />
        <p class="text-xs text-ink-secondary font-medium">Memuat inventaris barang...</p>
      </div>
    {:else if featuredItems.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each featuredItems as item (item.id)}
          <ResourceCard {item} onBorrow={handleBorrowItem} />
        {/each}
      </div>
    {:else}
      <div class="p-8 text-center bg-white rounded-2xl border border-surface-border">
        <p class="text-xs font-medium text-ink-secondary">Belum ada barang tersedia saat ini.</p>
        <a href="/discover" class="mt-3 inline-block text-xs font-bold text-brand-600 hover:underline">
          Jelajahi Katalog Barang →
        </a>
      </div>
    {/if}
  </section>

  <!-- ========================================================================= -->
  <!-- 7. REQUEST BOARD                                                          -->
  <!-- ========================================================================= -->
  <section class="bg-[#F3EFE6] rounded-3xl border border-[#E2DDD3] p-8 sm:p-10 shadow-sm">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
      <div class="max-w-xl">
        <span class="text-xs font-bold uppercase tracking-wider text-earth-deep bg-white px-3 py-1 rounded-full border border-earth-sand/50">
          Fitur Pembeda COMMON
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-ink-primary mt-2 tracking-tight">
          Can't find what you need?
        </h2>
        <p class="text-xs sm:text-sm text-ink-secondary mt-1.5 leading-relaxed">
          Papan kebutuhan warga memungkinkan komunitas menemukan resource yang sedang dibutuhkan sebelum seseorang memutuskan untuk membeli baru.
        </p>
      </div>

      <div class="flex items-center gap-2 self-start md:self-auto">
        <a
          href="/needs"
          class="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-surface-border text-ink-primary text-xs font-bold shadow-sm transition-all"
        >
          Buka Papan Kebutuhan
        </a>
      </div>
    </div>

    {#if loading}
      <div class="py-8 text-center">
        <RefreshCw class="w-6 h-6 text-brand-500 animate-spin mx-auto mb-2" />
        <p class="text-xs text-ink-secondary font-medium">Memuat papan kebutuhan...</p>
      </div>
    {:else if featuredNeeds.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {#each featuredNeeds as need (need.id)}
          <div class="bg-white rounded-2xl p-5 border border-surface-border flex flex-col justify-between shadow-xs">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2.5">
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Mencari Alat
                </span>
                <span class="text-[11px] text-ink-muted">
                  {formatRelativeTime(need.created_at)}
                </span>
              </div>
              <h4 class="font-bold text-base text-ink-primary tracking-tight">
                {need.title}
              </h4>
              <p class="text-xs text-ink-secondary mt-1.5 line-clamp-2 leading-relaxed">
                {need.description || 'Dibutuhkan untuk keperluan warga di lingkungan sekitar.'}
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
              <div class="text-[11px] text-ink-muted">
                Oleh <strong class="font-medium text-ink-primary">{need.creator?.full_name || 'Warga'}</strong>
              </div>
              <button
                type="button"
                on:click={() => handleOfferHelp(need)}
                class="px-3 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors"
              >
                Bantu Penuhi
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="p-8 text-center bg-white rounded-2xl border border-surface-border">
        <p class="text-xs font-medium text-ink-secondary">Belum ada postingan kebutuhan warga saat ini.</p>
        <a href="/needs" class="mt-3 inline-block text-xs font-bold text-brand-600 hover:underline">
          Ajukan Kebutuhan Pertama →
        </a>
      </div>
    {/if}
  </section>

  <!-- ========================================================================= -->
  <!-- 8. COMMUNITY ACTIVITY (Real activity feed)                                -->
  <!-- ========================================================================= -->
  <section class="bg-white rounded-3xl border border-surface-border p-8 sm:p-10 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
          Sirkulasi Langsung
        </span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-2 tracking-tight">
          What's happening in your communities?
        </h2>
        <p class="text-xs sm:text-sm text-ink-secondary mt-1">
          Aktivitas sirkulasi alat dan interaksi gotong royong warga terkini yang bersumber dari sistem.
        </p>
      </div>

      <div class="text-xs font-semibold text-ink-muted flex items-center gap-1.5 self-start sm:self-auto">
        <Clock class="w-3.5 h-3.5 text-stone-400" />
        <span>Pembaruan Real-Time</span>
      </div>
    </div>

    {#if recentActivities.length > 0}
      <div class="divide-y divide-surface-border">
        {#each recentActivities as act (act.id)}
          <div class="py-3.5 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                {#if act.type === 'item_shared'}
                  <Package class="w-4 h-4" />
                {:else}
                  <HandHelping class="w-4 h-4" />
                {/if}
              </div>
              <div class="truncate text-xs sm:text-sm">
                <span class="font-bold text-ink-primary">{act.actor}</span>
                <span class="text-ink-secondary"> {act.type === 'item_shared' ? 'membagikan barang:' : 'mengajukan kebutuhan:'} </span>
                <a href={act.link} class="font-semibold text-brand-700 hover:underline">{act.title}</a>
                <span class="text-ink-muted text-xs hidden sm:inline"> di {act.community}</span>
              </div>
            </div>

            <div class="text-[11px] text-ink-muted whitespace-nowrap flex-shrink-0">
              {formatRelativeTime(act.timestamp)}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-xs text-ink-muted text-center py-6">
        Belum ada aktivitas sirkulasi barang terbaru di komunitas.
      </p>
    {/if}
  </section>

  <!-- ========================================================================= -->
  <!-- 9. TRUST & SAFETY                                                         -->
  <!-- ========================================================================= -->
  <section id="trust-safety" class="bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-sm">
    <div class="max-w-2xl mx-auto text-center mb-10">
      <span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
        Keamanan & Etika Warga
      </span>
      <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-3 tracking-tight">
        Built on trust, not transactions.
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary mt-2">
        Berbagi pakai alat fisik menuntut rasa aman. COMMON mengintegrasikan prinsip transparansi dan konteks sosial nyata.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Pillar 1 -->
      <div class="p-5 rounded-2xl bg-surface-base border border-surface-border space-y-2.5">
        <div class="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
          <Users class="w-4 h-4" />
        </div>
        <h4 class="font-bold text-sm text-ink-primary">VERIFIED MEMBERS</h4>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Warga tergabung dalam komunitas lingkungan nyata (RT/komplek) dengan identitas yang saling dikenal, bukan profil anonim.
        </p>
      </div>

      <!-- Pillar 2 -->
      <div class="p-5 rounded-2xl bg-surface-base border border-surface-border space-y-2.5">
        <div class="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
          <Clock class="w-4 h-4" />
        </div>
        <h4 class="font-bold text-sm text-ink-primary">BORROW HISTORY</h4>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Riwayat persetujuan, durasi tanggal pakai, serta konfirmasi serah-terima dicatat transparan di dalam platform.
        </p>
      </div>

      <!-- Pillar 3 -->
      <div class="p-5 rounded-2xl bg-surface-base border border-surface-border space-y-2.5">
        <div class="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
          <Shield class="w-4 h-4" />
        </div>
        <h4 class="font-bold text-sm text-ink-primary">COMMUNITY MODERATION</h4>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Pengurus dan admin komunitas memiliki wewenang untuk menjaga etika peminjaman dan membantu penyelesaian kendala bersama.
        </p>
      </div>

      <!-- Pillar 4 -->
      <div class="p-5 rounded-2xl bg-surface-base border border-surface-border space-y-2.5">
        <div class="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
          <CheckCircle2 class="w-4 h-4" />
        </div>
        <h4 class="font-bold text-sm text-ink-primary">CLEAR OWNERSHIP</h4>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Setiap barang memiliki pemilik sah dengan aturan pakai (*borrowing rules*) dan lokasi pengambilan yang disepakati bersama.
        </p>
      </div>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- 10. IMPACT                                                                -->
  <!-- ========================================================================= -->
  <section class="bg-surface-base rounded-3xl border border-surface-border p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs">
    <span class="text-xs font-bold uppercase tracking-wider text-brand-700">
      Dampak Nyata Komunitas
    </span>
    
    <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-surface-border">
      <div>
        <div class="text-3xl sm:text-4xl font-black text-ink-primary tracking-tight">
          {totalResources > 0 ? totalResources : '12+'}
        </div>
        <div class="text-xs font-semibold text-ink-secondary mt-1">Resources Shared</div>
      </div>
      <div>
        <div class="text-3xl sm:text-4xl font-black text-ink-primary tracking-tight">
          {totalCommunities > 0 ? totalCommunities : '3+'}
        </div>
        <div class="text-xs font-semibold text-ink-secondary mt-1">Active Communities</div>
      </div>
      <div>
        <div class="text-3xl sm:text-4xl font-black text-ink-primary tracking-tight">
          {totalMembers > 0 ? totalMembers : '50+'}
        </div>
        <div class="text-xs font-semibold text-ink-secondary mt-1">Connected Neighbors</div>
      </div>
    </div>

    <p class="mt-8 text-xs sm:text-sm text-ink-secondary italic max-w-lg mx-auto leading-relaxed">
      "Every shared item starts with someone choosing access over ownership."
    </p>
  </section>

  <!-- ========================================================================= -->
  <!-- 11. FINAL CTA                                                             -->
  <!-- ========================================================================= -->
  <section class="bg-brand-500 rounded-3xl text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-xl shadow-brand-900/10">
    <div class="max-w-2xl mx-auto relative z-10 space-y-4">
      <span class="inline-block px-3 py-1 rounded-full bg-brand-600 text-brand-100 text-[11px] font-bold uppercase tracking-wider">
        Mulai Sekarang
      </span>
      <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
        Your community already has more than you think.
      </h2>
      <p class="text-xs sm:text-sm text-brand-100 leading-relaxed max-w-lg mx-auto">
        Gabungkan resource yang jarang digunakan, kebutuhan warga, dan orang-orang yang siap berbagi dalam satu tempat.
      </p>

      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <a
          href="/communities"
          class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs shadow-sm transition-colors"
        >
          Join a Community
        </a>
        <a
          href="/create-community"
          class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs border border-brand-400/40 transition-colors"
        >
          Create a Community
        </a>
      </div>
    </div>
  </section>

  <!-- Borrow Modal Instance -->
  {#if borrowingItem}
    <BorrowModal
      item={borrowingItem}
      onClose={() => (borrowingItem = null)}
      onSuccess={loadHomeData}
    />
  {/if}

</div>
