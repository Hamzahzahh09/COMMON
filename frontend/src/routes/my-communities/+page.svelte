<script lang="ts">
  import { onMount } from 'svelte';
  import { getMyCommunities, type Community } from '$lib/api/communities.api';
  import CommunityCard from '$lib/components/CommunityCard.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { authState } from '$lib/stores/auth';
  import { FolderHeart, Plus, RefreshCw, Users, ShieldCheck } from 'lucide-svelte';

  let communities: Community[] = [];
  let loading = true;

  async function loadMyCommunities() {
    loading = true;
    try {
      const res = await getMyCommunities();
      if (res.success && res.data) {
        communities = res.data;
      }
    } catch (err) {
      console.error('Failed to load my communities:', err);
    } finally {
      loading = false;
    }
  }

  let lastResidentId = '';

  $: if ($authState.resident && $authState.resident.id !== lastResidentId) {
    lastResidentId = $authState.resident.id;
    loadMyCommunities();
  }

</script>

<div class="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
  
  <!-- Header & Actions -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">
        <FolderHeart class="w-3.5 h-3.5 text-brand-500" />
        Keanggotaan Saya
      </div>
      <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">
        Komunitas Saya
      </h1>
      <p class="text-xs sm:text-sm text-ink-secondary mt-1">
        Daftar ruang komunitas di mana Anda telah terdaftar sebagai anggota atau administrator.
      </p>
    </div>

    <div class="flex items-center gap-3 self-start sm:self-auto">
      <a
        href="/create-community"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
      >
        <Plus class="w-4 h-4 stroke-[2.5]" />
        <span>Buat Komunitas Baru</span>
      </a>
    </div>
  </div>

  {#if loading}
    <div class="py-24 text-center">
      <RefreshCw class="w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" />
      <p class="text-xs font-semibold text-ink-secondary">Memuat komunitas yang Anda ikuti...</p>
    </div>
  {:else if communities.length === 0}
    <EmptyState
      title="Belum Bergabung dengan Komunitas"
      description="Anda belum bergabung dengan komunitas manapun. Temukan komunitas tetangga atau buat komunitas baru."
      actionText="Jelajahi Direktori Komunitas"
      actionHref="/communities"
    />
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each communities as comm (comm.id)}
        <CommunityCard community={comm} onUpdated={loadMyCommunities} />
      {/each}
    </div>
  {/if}

</div>
