<script lang="ts">
  import { onMount } from 'svelte';
  import { authState, signOut } from '$lib/stores/auth';
  import { getMyCommunities, type Community } from '$lib/api/communities.api';
  import { getItems, type Item } from '$lib/api/items.api';
  import { getMyRequests, getIncomingRequests } from '$lib/api/borrowing.api';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import {
    Users,
    Package,
    ArrowUpRight,
    Sparkles,
    Shield,
    LogOut,
    Inbox,
    Clock,
    ExternalLink,
    CheckCircle2
  } from 'lucide-svelte';

  let joinedCommunities: Community[] = [];
  let myItems: Item[] = [];
  let myBorrowsCount = 0;
  let incomingCount = 0;
  let loading = true;

  async function loadProfileData() {
    loading = true;
    try {
      const [commRes, itemsRes, borrowsRes, incomingRes] = await Promise.all([
        getMyCommunities(),
        getItems(),
        getMyRequests(),
        getIncomingRequests()
      ]);

      if (commRes.success && commRes.data) {
        joinedCommunities = commRes.data;
      }

      if (itemsRes.success && itemsRes.data) {
        const currentUserId = $authState.resident?.id || $authState.user?.id;
        myItems = itemsRes.data.filter((i: Item) => i.owner_id === currentUserId);
      }

      if (borrowsRes.success && borrowsRes.data) {
        myBorrowsCount = borrowsRes.data.length;
      }

      if (incomingRes.success && incomingRes.data) {
        incomingCount = incomingRes.data.length;
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
    } finally {
      loading = false;
    }
  }

  let lastResidentId = '';

  $: if ($authState.resident && $authState.resident.id !== lastResidentId) {
    lastResidentId = $authState.resident.id;
    loadProfileData();
  }

</script>

<svelte:head>
  <title>Profil Warga — COMMON</title>
</svelte:head>

<div class="min-h-screen bg-[#F7F6F2] py-8 md:py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    
    <!-- Profile Header Card -->
    <div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="relative">
            <img
              src={$authState.resident?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={$authState.resident?.name || 'Warga'}
              class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#F7F6F2] shadow-sm"
            />
            <span class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" title="Aktif"></span>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A]">
                {$authState.resident?.name || 'Warga Komunitas'}
              </h1>
              <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Shield class="w-3 h-3 text-emerald-600" />
                {$authState.resident?.role || 'Warga Terverifikasi'}
              </span>
            </div>
            <p class="text-sm text-[#736B5E] mt-1">{$authState.resident?.email || $authState.user?.email || 'email@commons.id'}</p>
            <p class="text-sm font-medium text-[#2F6B4F] mt-1.5 flex items-center gap-1.5">
              <Sparkles class="w-4 h-4 text-emerald-600" />
              {$authState.resident?.desc || 'Warga Komunitas RT 05'}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button
            on:click={() => signOut()}
            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-white text-sm font-medium text-[#736B5E] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
          >
            <LogOut class="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E5E0D8]">
        <div class="bg-[#F7F6F2] rounded-xl p-4">
          <div class="flex items-center gap-2 text-[#736B5E] text-xs font-medium uppercase tracking-wider mb-1">
            <Package class="w-4 h-4 text-[#2F6B4F]" />
            Barang Dibagikan
          </div>
          <div class="font-serif text-2xl font-bold text-[#1C1C1A]">
            {myItems.length}
          </div>
        </div>

        <div class="bg-[#F7F6F2] rounded-xl p-4">
          <div class="flex items-center gap-2 text-[#736B5E] text-xs font-medium uppercase tracking-wider mb-1">
            <Users class="w-4 h-4 text-[#2F6B4F]" />
            Komunitas Diikuti
          </div>
          <div class="font-serif text-2xl font-bold text-[#1C1C1A]">
            {joinedCommunities.length}
          </div>
        </div>

        <div class="bg-[#F7F6F2] rounded-xl p-4">
          <div class="flex items-center gap-2 text-[#736B5E] text-xs font-medium uppercase tracking-wider mb-1">
            <Clock class="w-4 h-4 text-[#2F6B4F]" />
            Dipinjam Saya
          </div>
          <div class="font-serif text-2xl font-bold text-[#1C1C1A]">
            {myBorrowsCount}
          </div>
        </div>

        <div class="bg-[#F7F6F2] rounded-xl p-4">
          <div class="flex items-center gap-2 text-[#736B5E] text-xs font-medium uppercase tracking-wider mb-1">
            <Inbox class="w-4 h-4 text-[#2F6B4F]" />
            Permintaan Masuk
          </div>
          <div class="font-serif text-2xl font-bold text-[#1C1C1A]">
            {incomingCount}
          </div>
        </div>
      </div>
    </div>

    <!-- Main 2-Column Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left 2 Cols: My Items & Joined Communities -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- My Shared Items -->
        <div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="font-serif text-lg font-bold text-[#1C1C1A] flex items-center gap-2">
                <Package class="w-5 h-5 text-[#2F6B4F]" />
                Barang yang Saya Bagikan ({myItems.length})
              </h2>
              <p class="text-xs text-[#736B5E] mt-0.5">Sumber daya fisik yang Anda sediakan untuk tetangga.</p>
            </div>
            <a
              href="/discover"
              class="text-xs font-semibold text-[#2F6B4F] hover:underline flex items-center gap-1"
            >
              Lihat Semua
              <ArrowUpRight class="w-3.5 h-3.5" />
            </a>
          </div>

          {#if loading}
            <div class="space-y-3">
              {#each Array(3) as _}
                <div class="h-16 bg-[#F7F6F2] animate-pulse rounded-xl"></div>
              {/each}
            </div>
          {:else if myItems.length === 0}
            <EmptyState
              title="Belum ada barang dibagikan"
              description="Anda belum mendaftarkan barang untuk dipinjamkan ke tetangga. Klik tombol Bagikan Barang di navigasi atas untuk mulai!"
            />
          {:else}
            <div class="divide-y divide-[#E5E0D8]">
              {#each myItems as item}
                <div class="py-3.5 flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3 min-w-0">
                    {#if item.image_url}
                      <img
                        src={item.image_url}
                        alt={item.name}
                        class="w-12 h-12 rounded-lg object-cover bg-[#F7F6F2] flex-shrink-0"
                      />
                    {:else}
                      <div class="w-12 h-12 rounded-lg bg-[#E5E0D8] flex items-center justify-center text-[#736B5E] flex-shrink-0">
                        <Package class="w-5 h-5" />
                      </div>
                    {/if}
                    <div class="min-w-0">
                      <a
                        href="/items/{item.id}"
                        class="text-sm font-bold text-[#1C1C1A] hover:text-[#2F6B4F] transition-colors truncate block"
                      >
                        {item.name}
                      </a>
                      <p class="text-xs text-[#736B5E] truncate">
                        Kategori: {item.category || 'Alat'} • {item.location_hint || 'RT 05'}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={item.status} />
                    <a
                      href="/items/{item.id}"
                      class="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#E5E0D8] hover:bg-[#F7F6F2] text-[#1C1C1A] transition-colors"
                    >
                      Detail
                    </a>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- My Communities -->
        <div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="font-serif text-lg font-bold text-[#1C1C1A] flex items-center gap-2">
                <Users class="w-5 h-5 text-[#2F6B4F]" />
                Komunitas Diikuti ({joinedCommunities.length})
              </h2>
              <p class="text-xs text-[#736B5E] mt-0.5">Komunitas lingkungan tempat Anda aktif meminjam dan berbagi.</p>
            </div>
            <a
              href="/communities"
              class="text-xs font-semibold text-[#2F6B4F] hover:underline flex items-center gap-1"
            >
              Jelajahi Direktori
              <ArrowUpRight class="w-3.5 h-3.5" />
            </a>
          </div>

          {#if loading}
            <div class="space-y-3">
              {#each Array(2) as _}
                <div class="h-16 bg-[#F7F6F2] animate-pulse rounded-xl"></div>
              {/each}
            </div>
          {:else if joinedCommunities.length === 0}
            <EmptyState
              title="Belum bergabung dengan komunitas"
              description="Jelajahi komunitas di sekitar Anda dan klik Gabung untuk mulai berbagi akses."
              actionText="Temukan Komunitas"
              actionHref="/communities"
            />
          {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {#each joinedCommunities as comm}
                <div class="p-4 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] flex flex-col justify-between hover:border-[#2F6B4F] transition-all">
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="text-xs font-mono font-bold text-[#2F6B4F]">c/{comm.slug}</span>
                      <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Anggota
                      </span>
                    </div>
                    <h3 class="text-sm font-bold text-[#1C1C1A] line-clamp-1">{comm.name}</h3>
                    <p class="text-xs text-[#736B5E] mt-1 line-clamp-2">{comm.description || 'Komunitas berbagi warga terpercaya.'}</p>
                  </div>

                  <div class="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                    <span class="text-[#736B5E]">{comm.member_count || 1} Warga</span>
                    <a
                      href="/c/{comm.slug}"
                      class="font-semibold text-[#2F6B4F] hover:underline inline-flex items-center gap-1"
                    >
                      Buka Hub
                      <ExternalLink class="w-3 h-3" />
                    </a>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

      </div>

      <!-- Right 1 Col: Account Security & Community Values -->
      <div class="space-y-6">
        <div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <Shield class="w-5 h-5 text-[#2F6B4F]" />
              <h3 class="font-serif text-base font-bold text-[#1C1C1A]">
                Keanggotaan Warga
              </h3>
            </div>
            <p class="text-xs text-[#736B5E] leading-relaxed">
              Akun Anda terhubung dengan komunitas lokal yang saling percaya.
            </p>
          </div>

          <div class="space-y-3 pt-4 border-t border-[#E5E0D8]">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#736B5E]">Status Akun</span>
              <span class="inline-flex items-center gap-1 font-semibold text-[#2F6B4F]">
                <CheckCircle2 class="w-3.5 h-3.5" />
                Aktif & Terverifikasi
              </span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#736B5E]">ID Warga</span>
              <span class="font-mono font-semibold text-[#1C1C1A] text-[11px] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E0D8]">
                {$authState.resident?.id?.slice(0, 8) || $authState.user?.id?.slice(0, 8) || 'USR-01'}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#736B5E]">Role Warga</span>
              <span class="font-medium text-[#1C1C1A]">
                {$authState.resident?.role || 'Warga Komunitas'}
              </span>
            </div>
          </div>

          <div class="pt-4 border-t border-[#E5E0D8]">
            <h4 class="text-xs font-bold text-[#1C1C1A] uppercase tracking-wider mb-2.5">
              Prinsip Berbagi COMMON
            </h4>
            <ul class="space-y-2.5 text-xs text-[#736B5E]">
              <li class="flex items-start gap-2">
                <span class="text-[#2F6B4F] font-bold">1.</span>
                <span><strong>Saling Menjaga:</strong> Rawat barang bersama seolah milik sendiri.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#2F6B4F] font-bold">2.</span>
                <span><strong>Tepat Waktu:</strong> Kembalikan barang sesuai jadwal yang disetujui.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[#2F6B4F] font-bold">3.</span>
                <span><strong>Komunikasi:</strong> Segera hubungi pemilik jika ada kendala.</span>
              </li>
            </ul>
          </div>

          <div class="pt-4 border-t border-[#E5E0D8]">
            <a
              href="/discover"
              class="w-full py-2.5 px-4 rounded-xl bg-[#2F6B4F] hover:bg-[#255740] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Package class="w-4 h-4" />
              Telusuri Koleksi Komunitas
            </a>
          </div>
        </div>
      </div>

    </div>

  </div>
</div>
