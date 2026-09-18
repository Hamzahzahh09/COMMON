<script lang="ts">
  import { onMount } from 'svelte';
  import { apiRequest } from '$lib/api';
  import { getItems, type Item } from '$lib/api/items.api';
  import { getNeedOffers, acceptNeedOffer, type NeedOffer } from '$lib/api/need-offers.api';
  import { authState } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';
  import PostNeedModal from '$lib/components/PostNeedModal.svelte';
  import OfferItemModal from '$lib/components/OfferItemModal.svelte';
  import BorrowModal from '$lib/components/BorrowModal.svelte';
  import {
    Sparkles,
    Plus,
    Calendar,
    User,
    Trash2,
    CheckCircle2,
    Clock,
    RefreshCw,
    HeartHandshake,
    Package,
    ArrowRight,
    Check,
  } from 'lucide-svelte';

  let needs: any[] = [];
  let communityItems: Item[] = [];
  let offersByNeedId: Record<string, NeedOffer[]> = {};
  let loading = true;
  let showPostModal = false;
  let offeringNeed: any | null = null;
  let borrowingItem: Item | null = null;
  let acceptingOfferId: string | null = null;

  $: currentUserId = $authState.resident?.id || $authState.user?.id;

  async function loadNeeds() {
    loading = true;
    try {
      const [needsRes, itemsRes] = await Promise.all([
        apiRequest('/community-needs'),
        getItems({ status: 'available' }),
      ]);

      if (needsRes.success && needsRes.data) {
        needs = needsRes.data;
        // Load offers for each need in parallel
        needs.forEach((n) => loadOffersForNeed(n.id));
      }

      if (itemsRes.success && itemsRes.data) {
        communityItems = itemsRes.data;
      }
    } catch {
      // Ignored
    } finally {
      loading = false;
    }
  }

  async function loadOffersForNeed(needId: string) {
    try {
      const res = await getNeedOffers(needId);
      if (res.success && res.data) {
        offersByNeedId = { ...offersByNeedId, [needId]: res.data };
      }
    } catch {
      // Ignored
    }
  }

  async function handleAcceptOffer(needId: string, offerId: string) {
    acceptingOfferId = offerId;
    try {
      const res = await acceptNeedOffer(needId, offerId);
      if (res.success) {
        toast.success('Tawaran diterima! Permintaan pinjam otomatis dibuat.');
        loadNeeds();
      } else {
        toast.error(res.error?.message || 'Gagal menerima tawaran.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan.');
    } finally {
      acceptingOfferId = null;
    }
  }

  async function handleDelete(needId: string) {
    if (!confirm('Hapus postingan kebutuhan ini?')) return;

    const res = await apiRequest(`/community-needs/${needId}`, {
      method: 'DELETE',
    });

    if (!res.success) {
      toast.error(res.error?.message || 'Gagal menghapus postingan.');
      return;
    }

    toast.info('Postingan kebutuhan dihapus.');
    loadNeeds();
  }

  // Find matching items from community catalog based on need title keywords
  function findMatchingCatalogItems(title: string): Item[] {
    const words = title.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    if (words.length === 0) return [];
    return communityItems.filter((item) => {
      const itemName = item.name.toLowerCase();
      const desc = (item.description || '').toLowerCase();
      return words.some((w) => itemName.includes(w) || desc.includes(w));
    }).slice(0, 2);
  }

  onMount(() => {
    loadNeeds();
  });
</script>

<svelte:head>
  <title>I NEED ↔ I HAVE — Papan Kebutuhan Warga COMMON</title>
</svelte:head>

<div class="space-y-8 animate-in fade-in duration-200 max-w-7xl mx-auto">
  
  <!-- Header with Defining Experience Philosophy -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
        <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
        I NEED ↔ I HAVE Mechanism
      </div>
      <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">
        Papan Kebutuhan Warga
      </h1>
      <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-2xl leading-relaxed">
        Butuh alat yang belum ada di katalog? Tulis di sini. Tetangga yang memiliki alatnya dapat langsung menawarkan bantuan lewat <strong>"I HAVE"</strong>.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        on:click={loadNeeds}
        class="p-2.5 rounded-xl border border-surface-border hover:bg-surface-muted text-ink-secondary transition-colors"
        title="Segarkan"
      >
        <RefreshCw class="w-4 h-4 {loading ? 'animate-spin' : ''}" />
      </button>

      <button
        type="button"
        on:click={() => (showPostModal = true)}
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
      >
        <Plus class="w-4 h-4 stroke-[2.5]" />
        <span>Post Kebutuhan Baru</span>
      </button>
    </div>
  </div>

  <!-- Needs List -->
  {#if loading}
    <div class="py-24 text-center">
      <RefreshCw class="w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" />
      <p class="text-xs font-semibold text-ink-secondary">Memuat papan kebutuhan warga...</p>
    </div>
  {:else if needs.length === 0}
    <div class="py-16 text-center bg-white rounded-3xl border border-surface-border p-8 max-w-md mx-auto">
      <Sparkles class="w-12 h-12 text-stone-300 mx-auto mb-3" />
      <h3 class="font-bold text-base text-ink-primary">Belum Ada Kebutuhan yang Diposting</h3>
      <p class="text-xs text-ink-secondary mt-1">
        Saat ini semua warga sudah memiliki peralatan yang dibutuhkan, atau belum ada yang meminta.
      </p>
      <button
        type="button"
        on:click={() => (showPostModal = true)}
        class="mt-4 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold"
      >
        Tulis Kebutuhan Pertama
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#each needs as need (need.id)}
        {@const isCreator = need.user_id === currentUserId}
        {@const offers = offersByNeedId[need.id] || []}
        {@const matchingItems = findMatchingCatalogItems(need.title)}

        <div class="bg-white rounded-3xl border border-surface-border p-6 shadow-sm hover:border-brand-300 transition-all flex flex-col justify-between space-y-5">
          <div>
            <!-- Header Tag & Status -->
            <div class="flex items-start justify-between gap-3">
              <div>
                <span class="inline-block px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-2">
                  I NEED
                </span>
                <h3 class="font-bold text-lg text-ink-primary leading-snug">
                  {need.title}
                </h3>
              </div>

              <span class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex-shrink-0
                {need.status === 'open' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}">
                {need.status === 'open' ? 'Menunggu Tawaran' : 'Terpenuhi'}
              </span>
            </div>

            <!-- Description -->
            {#if need.description}
              <p class="text-xs text-ink-secondary mt-2 leading-relaxed">
                {need.description}
              </p>
            {/if}

            <!-- Metadata (Creator & Date Window) -->
            <div class="mt-4 pt-3 border-t border-surface-border flex flex-wrap items-center justify-between gap-3 text-xs text-ink-secondary">
              <div class="flex items-center gap-2">
                <img
                  src={need.creator?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={need.creator?.full_name}
                  class="w-5 h-5 rounded-full object-cover ring-1 ring-surface-border"
                />
                <span class="font-medium text-ink-primary">{need.creator?.full_name || 'Warga'}</span>
              </div>

              {#if need.needed_from || need.needed_until}
                <div class="flex items-center gap-1.5 text-[11px] text-ink-muted">
                  <Calendar class="w-3.5 h-3.5" />
                  <span>{need.needed_from || 'Fleksibel'} s/d {need.needed_until || 'Selesai'}</span>
                </div>
              {/if}
            </div>

            <!-- Intelligent Matching from Existing Catalog -->
            {#if matchingItems.length > 0}
              <div class="mt-4 p-3 rounded-2xl bg-[#E8EFEA] border border-[#C8DCD0] space-y-2">
                <div class="text-[11px] font-bold text-[#1E4432] flex items-center gap-1.5">
                  <Sparkles class="w-3.5 h-3.5 text-brand-600" />
                  <span>Alat Serupa Ditemukan di Katalog RT 05:</span>
                </div>
                <div class="space-y-1.5">
                  {#each matchingItems as match}
                    <div class="flex items-center justify-between bg-white p-2 rounded-xl text-xs">
                      <span class="font-bold text-ink-primary truncate max-w-[200px]">{match.name}</span>
                      <button
                        type="button"
                        on:click={() => (borrowingItem = match)}
                        class="px-2.5 py-1 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-[11px] transition-colors"
                      >
                        Pinjam Langsung
                      </button>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Community Offers ("I HAVE" Responses) -->
            {#if offers.length > 0}
              <div class="mt-4 pt-3 border-t border-surface-border space-y-2.5">
                <div class="text-[11px] font-bold text-ink-primary flex items-center justify-between">
                  <span>Tawaran dari Warga ({offers.length}):</span>
                </div>

                {#each offers as offer (offer.id)}
                  <div class="p-3 rounded-2xl bg-surface-base border border-surface-border flex items-start justify-between gap-3 text-xs">
                    <div class="space-y-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <img
                          src={offer.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={offer.user?.full_name}
                          class="w-4 h-4 rounded-full object-cover"
                        />
                        <strong class="font-bold text-ink-primary truncate">{offer.user?.full_name || 'Tetangga'}</strong>
                        {#if offer.item}
                          <span class="text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 font-semibold truncate">
                            {offer.item.name}
                          </span>
                        {/if}
                      </div>
                      <p class="text-[11px] text-ink-secondary leading-snug">
                        "{offer.message}"
                      </p>
                    </div>

                    {#if isCreator && offer.status === 'pending' && need.status === 'open'}
                      <button
                        type="button"
                        on:click={() => handleAcceptOffer(need.id, offer.id)}
                        disabled={acceptingOfferId === offer.id}
                        class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all flex-shrink-0 active:scale-95 disabled:opacity-50"
                      >
                        {acceptingOfferId === offer.id ? 'Memproses...' : 'Terima Tawaran'}
                      </button>
                    {:else if offer.status === 'accepted'}
                      <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                        <Check class="w-3 h-3" />
                        Diterima
                      </span>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}

          </div>

          <!-- Bottom Actions: "I HAVE" Offer Button or Delete Post -->
          <div class="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
            {#if isCreator}
              <button
                type="button"
                on:click={() => handleDelete(need.id)}
                class="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition-colors"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span>Hapus Postingan</span>
              </button>
            {:else if need.status === 'open'}
              <button
                type="button"
                on:click={() => (offeringNeed = need)}
                class="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
              >
                <HeartHandshake class="w-4 h-4" />
                <span>I HAVE — [Offer This Item]</span>
              </button>
            {/if}
          </div>

        </div>
      {/each}
    </div>
  {/if}

  <!-- Modals -->
  {#if showPostModal}
    <PostNeedModal
      onClose={() => (showPostModal = false)}
      onSuccess={loadNeeds}
    />
  {/if}

  {#if offeringNeed}
    <OfferItemModal
      need={offeringNeed}
      onClose={() => (offeringNeed = null)}
      onSuccess={loadNeeds}
    />
  {/if}

  {#if borrowingItem}
    <BorrowModal
      item={borrowingItem}
      onClose={() => (borrowingItem = null)}
      onSuccess={() => {
        borrowingItem = null;
        loadNeeds();
      }}
    />
  {/if}

</div>
