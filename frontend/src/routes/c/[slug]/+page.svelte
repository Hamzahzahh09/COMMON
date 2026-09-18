<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getCommunityBySlug, joinCommunity, leaveCommunity, getCommunityMembers, type Community, type CommunityMember } from '$lib/api/communities.api';
  import { getItems, type Item } from '$lib/api/items.api';
  import { getCommunityNeeds, type CommunityNeed } from '$lib/api/needs.api';
  import { getDiscussions, createDiscussion, deleteDiscussion, type DiscussionPost } from '$lib/api/discussions.api';
  import ResourceCard from '$lib/components/ResourceCard.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import BorrowModal from '$lib/components/BorrowModal.svelte';
  import ShareResourceModal from '$lib/components/ShareResourceModal.svelte';
  import PostNeedModal from '$lib/components/PostNeedModal.svelte';
  import OfferItemModal from '$lib/components/OfferItemModal.svelte';
  import { authState } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';
  import {
    Users,
    Package,
    MapPin,
    Check,
    Plus,
    Sparkles,
    HeartHandshake,
    ShieldCheck,
    Info,
    RefreshCw,
    Search,
    MessageSquare,
    Send,
    Layers,
    Home,
    Building2,
    Trash2,
  } from 'lucide-svelte';

  let community: Community | null = null;
  let items: Item[] = [];
  let needs: CommunityNeed[] = [];
  let members: CommunityMember[] = [];
  let discussions: DiscussionPost[] = [];

  let activeTab: 'resources' | 'needs' | 'discussions' | 'members' | 'about' = 'resources';
  let loading = true;
  let loadingJoin = false;
  let errorMsg = '';

  // Modals
  let borrowingItem: Item | null = null;
  let showShareModal = false;
  let showPostNeedModal = false;
  let selectedNeedForOffer: CommunityNeed | null = null;

  // Resource filters inside community
  let selectedCategory = 'Semua';
  let selectedOwnership: 'all' | 'personal' | 'community' = 'all';
  let searchQuery = '';
  const CATEGORIES = ['Semua', 'Tools', 'Home', 'Events', 'Outdoor', 'Electronics'];

  // Discussions state
  let loadingDiscussions = false;
  let submittingDiscussion = false;
  let newDiscussionTitle = '';
  let newDiscussionContent = '';
  let newDiscussionCategory: 'general' | 'resource_qa' | 'announcement' = 'general';
  let selectedDiscussionCategory = 'Semua';

  $: slug = $page.params.slug;

  async function loadCommunityData() {
    if (!slug) return;
    loading = true;
    errorMsg = '';

    try {
      const commRes = await getCommunityBySlug(slug);
      if (!commRes.success || !commRes.data) {
        errorMsg = commRes.error?.message || 'Komunitas tidak ditemukan.';
        loading = false;
        return;
      }
      community = commRes.data;

      // Load items, needs, members, and discussions for this community
      const [itemsRes, needsRes, membersRes, discRes] = await Promise.all([
        getItems({
          community_id: community.id,
          category: selectedCategory !== 'Semua' ? selectedCategory : undefined,
          ownership_type: selectedOwnership !== 'all' ? selectedOwnership : undefined,
          search: searchQuery.trim() || undefined,
        }),
        getCommunityNeeds({ community_id: community.id }),
        getCommunityMembers(community.id),
        getDiscussions(community.id),
      ]);

      if (itemsRes.success && itemsRes.data) items = itemsRes.data;
      if (needsRes.success && needsRes.data) needs = needsRes.data;
      if (membersRes.success && membersRes.data) members = membersRes.data;
      if (discRes.success && discRes.data) discussions = discRes.data;
      lastFilteredKey = `${selectedCategory}:${selectedOwnership}:${searchQuery}`;
    } catch (err: any) {
      errorMsg = err.message || 'Terjadi kesalahan saat memuat komunitas.';
    } finally {
      loading = false;
    }
  }

  async function reloadDiscussions() {
    if (!community) return;
    loadingDiscussions = true;
    const res = await getDiscussions(
      community.id,
      selectedDiscussionCategory !== 'Semua' ? selectedDiscussionCategory : undefined
    );
    if (res.success && res.data) {
      discussions = res.data;
    }
    loadingDiscussions = false;
  }

  async function handleCreateDiscussion() {
    if (!community) return;
    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim()) {
      toast.error('Judul dan isi diskusi harus diisi.');
      return;
    }

    submittingDiscussion = true;
    try {
      const res = await createDiscussion(community.id, {
        title: newDiscussionTitle.trim(),
        content: newDiscussionContent.trim(),
        category: newDiscussionCategory,
      });

      if (res.success && res.data) {
        toast.success('Diskusi berhasil diposting.');
        newDiscussionTitle = '';
        newDiscussionContent = '';
        await reloadDiscussions();
      } else {
        toast.error(res.error?.message || 'Gagal memposting diskusi.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan.');
    } finally {
      submittingDiscussion = false;
    }
  }

  async function handleDeleteDiscussion(id: string) {
    if (!community) return;
    if (!confirm('Hapus postingan diskusi ini?')) return;

    try {
      const res = await deleteDiscussion(community.id, id);
      if (res.success) {
        toast.success('Diskusi dihapus.');
        discussions = discussions.filter((d) => d.id !== id);
      } else {
        toast.error(res.error?.message || 'Gagal menghapus diskusi.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan.');
    }
  }

  async function handleToggleJoin() {
    if (!community) return;
    loadingJoin = true;

    try {
      if (community.is_joined) {
        const res = await leaveCommunity(community.id);
        if (res.success) {
          community.is_joined = false;
          community.member_count = Math.max(0, (community.member_count || 1) - 1);
          toast.info(`Anda telah keluar dari komunitas ${community.name}.`);
          loadCommunityData();
        } else {
          toast.error(res.error?.message || 'Gagal keluar dari komunitas.');
        }
      } else {
        const res = await joinCommunity(community.id);
        if (res.success) {
          community.is_joined = true;
          community.member_count = (community.member_count || 0) + 1;
          toast.success(`Selamat bergabung di komunitas ${community.name}!`);
          loadCommunityData();
        } else {
          toast.error(res.error?.message || 'Gagal bergabung ke komunitas.');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan.');
    } finally {
      loadingJoin = false;
    }
  }

  let lastFilteredKey = '';
  let lastSlug = '';

  $: if (slug && slug !== lastSlug) {
    lastSlug = slug;
    loadCommunityData();
  }

  $: filterKey = `${selectedCategory}:${selectedOwnership}:${searchQuery}`;
  $: if (community && filterKey !== lastFilteredKey) {
    lastFilteredKey = filterKey;
    getItems({
      community_id: community.id,
      category: selectedCategory !== 'Semua' ? selectedCategory : undefined,
      ownership_type: selectedOwnership !== 'all' ? selectedOwnership : undefined,
      search: searchQuery.trim() || undefined,
    }).then((r) => {
      if (r.success && r.data) items = r.data;
    });
  }

</script>

{#if loading}
  <div class="py-24 text-center">
    <RefreshCw class="w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" />
    <p class="text-xs font-semibold text-ink-secondary">Memuat data komunitas...</p>
  </div>
{:else if errorMsg || !community}
  <EmptyState
    title="Komunitas Tidak Ditemukan"
    description={errorMsg || 'Komunitas yang Anda tuju tidak tersedia.'}
    actionText="Lihat Direktori Komunitas"
    actionHref="/communities"
  />
{:else}
  <div class="space-y-8 animate-in fade-in duration-200">
    
    <!-- ========================================================================= -->
    <!-- COMMUNITY HEADER                                                          -->
    <!-- ========================================================================= -->
    <section class="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <!-- Slug & Admin Badge -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100">
              c/{community.slug}
            </span>
            {#if community.user_role === 'admin'}
              <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                <ShieldCheck class="w-3 h-3" />
                Administrator
              </span>
            {/if}
          </div>

          <!-- Name -->
          <h1 class="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
            {community.name}
          </h1>

          <!-- Description -->
          <p class="text-xs sm:text-sm text-ink-secondary mt-1.5 max-w-2xl leading-relaxed">
            {community.description || 'Komunitas warga untuk berbagi alat dan inventaris bersama.'}
          </p>

          <!-- Location & Stats Meta -->
          <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
            {#if community.location}
              <div class="flex items-center gap-1.5 text-ink-secondary">
                <MapPin class="w-3.5 h-3.5 text-brand-600" />
                <span>{community.location}</span>
              </div>
              <span class="text-stone-300">•</span>
            {/if}

            <div class="flex items-center gap-1.5 font-medium text-ink-primary">
              <Users class="w-3.5 h-3.5 text-brand-600" />
              <span>{community.member_count || 0} Warga Bergabung</span>
            </div>

            <span class="text-stone-300">•</span>

            <div class="flex items-center gap-1.5 font-medium text-ink-primary">
              <Package class="w-3.5 h-3.5 text-stone-500" />
              <span>{items.length} Alat Terdaftar</span>
            </div>
          </div>
        </div>

        <!-- Join / Leave Button Action -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            on:click={handleToggleJoin}
            disabled={loadingJoin}
            class="px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2
              {community.is_joined
                ? 'bg-surface-muted text-ink-secondary hover:bg-stone-200 border border-surface-border'
                : 'bg-brand-500 hover:bg-brand-600 text-white'}"
          >
            {#if loadingJoin}
              <span class="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            {:else if community.is_joined}
              <Check class="w-4 h-4 text-brand-600 stroke-[2.5]" />
              <span>JOINED</span>
            {:else}
              <Plus class="w-4 h-4 stroke-[2.5]" />
              <span>JOIN COMMUNITY</span>
            {/if}
          </button>
        </div>
      </div>

      <!-- Community Tabs -->
      <div class="mt-8 pt-4 border-t border-surface-border flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          on:click={() => (activeTab = 'resources')}
          class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5
            {activeTab === 'resources' ? 'bg-brand-500 text-white shadow-sm' : 'text-ink-secondary hover:bg-surface-muted'}"
        >
          <Package class="w-3.5 h-3.5" />
          <span>Resources ({items.length})</span>
        </button>

        <button
          type="button"
          on:click={() => (activeTab = 'needs')}
          class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5
            {activeTab === 'needs' ? 'bg-brand-500 text-white shadow-sm' : 'text-ink-secondary hover:bg-surface-muted'}"
        >
          <HeartHandshake class="w-3.5 h-3.5" />
          <span>Needs ({needs.length})</span>
        </button>

        <button
          type="button"
          on:click={() => (activeTab = 'discussions')}
          class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5
            {activeTab === 'discussions' ? 'bg-brand-500 text-white shadow-sm' : 'text-ink-secondary hover:bg-surface-muted'}"
        >
          <MessageSquare class="w-3.5 h-3.5" />
          <span>Papan Warga ({discussions.length})</span>
        </button>

        <button
          type="button"
          on:click={() => (activeTab = 'members')}
          class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5
            {activeTab === 'members' ? 'bg-brand-500 text-white shadow-sm' : 'text-ink-secondary hover:bg-surface-muted'}"
        >
          <Users class="w-3.5 h-3.5" />
          <span>Members ({members.length})</span>
        </button>

        <button
          type="button"
          on:click={() => (activeTab = 'about')}
          class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5
            {activeTab === 'about' ? 'bg-brand-500 text-white shadow-sm' : 'text-ink-secondary hover:bg-surface-muted'}"
        >
          <Info class="w-3.5 h-3.5" />
          <span>About</span>
        </button>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- TAB 1: RESOURCES                                                          -->
    <!-- ========================================================================= -->
    {#if activeTab === 'resources'}
      <div class="space-y-6">
        <!-- Resource Controls: Search, Category, Ownership, Add CTA -->
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <!-- Category Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {#each CATEGORIES as cat}
                <button
                  type="button"
                  on:click={() => (selectedCategory = cat)}
                  class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap
                    {selectedCategory === cat
                      ? 'bg-brand-500 text-white shadow-sm font-bold'
                      : 'bg-white border border-surface-border text-ink-secondary hover:bg-stone-50'}"
                >
                  {cat}
                </button>
              {/each}
            </div>

            <div class="hidden sm:block h-5 w-px bg-surface-border mx-1"></div>

            <!-- Ownership Model Pills -->
            <div class="flex items-center gap-1 bg-surface-muted/70 p-1 rounded-xl border border-surface-border">
              <button
                type="button"
                on:click={() => (selectedOwnership = 'all')}
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all
                  {selectedOwnership === 'all'
                    ? 'bg-white text-ink-primary shadow-xs'
                    : 'text-ink-secondary hover:text-ink-primary'}"
              >
                Semua Model
              </button>
              <button
                type="button"
                on:click={() => (selectedOwnership = 'personal')}
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1
                  {selectedOwnership === 'personal'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-ink-secondary hover:text-ink-primary'}"
              >
                <span>🏠</span>
                <span>Pribadi Warga</span>
              </button>
              <button
                type="button"
                on:click={() => (selectedOwnership = 'community')}
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1
                  {selectedOwnership === 'community'
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-ink-secondary hover:text-ink-primary'}"
              >
                <span>🏛️</span>
                <span>Inventaris RT/RW</span>
              </button>
            </div>
          </div>

          <!-- Add Item Action for Community Members -->
          <button
            type="button"
            on:click={() => (showShareModal = true)}
            class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 self-start md:self-auto"
          >
            <Plus class="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Share a Resource</span>
          </button>
        </div>

        <!-- Items Grid -->
        {#if items.length === 0}
          <EmptyState
            title="Belum Ada Barang yang Sesuai"
            description="Tidak ada barang yang ditemukan dengan filter yang dipilih. Bagikan barang atau sesuaikan pencarian."
            actionText="+ Bagikan Barang Pertama"
            onAction={() => (showShareModal = true)}
          />
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {#each items as item (item.id)}
              <ResourceCard
                {item}
                onBorrow={(selected) => (borrowingItem = selected)}
              />
            {/each}
          </div>
        {/if}
      </div>

    <!-- ========================================================================= -->
    <!-- TAB 2: COMMUNITY NEEDS                                                    -->
    <!-- ========================================================================= -->
    {:else if activeTab === 'needs'}
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-lg text-ink-primary">Papan Kebutuhan Warga (I NEED)</h3>
            <p class="text-xs text-ink-secondary">Tetangga mencari barang untuk dipinjam sebelum memutuskan membeli baru.</p>
          </div>

          <button
            type="button"
            on:click={() => (showPostNeedModal = true)}
            class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <Plus class="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Post a Community Need</span>
          </button>
        </div>

        {#if needs.length === 0}
          <EmptyState
            title="Belum Ada Kebutuhan yang Diposting"
            description="Sedang membutuhkan alat tertentu untuk perbaikan rumah atau acara? Sampaikan ke warga di sini."
            actionText="Posting Kebutuhan Sekarang"
            onAction={() => (showPostNeedModal = true)}
          />
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {#each needs as need (need.id)}
              <div class="bg-white rounded-2xl border border-surface-border p-5 flex flex-col justify-between hover:border-brand-300 transition-colors shadow-sm">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Mencari Alat
                    </span>
                    <span class="text-[11px] text-ink-muted">
                      {need.creator?.full_name || 'Warga'}
                    </span>
                  </div>

                  <h4 class="font-bold text-base text-ink-primary tracking-tight">
                    {need.title}
                  </h4>

                  <p class="text-xs text-ink-secondary mt-1.5 line-clamp-3 leading-relaxed">
                    {need.description || 'Dibutuhkan untuk keperluan warga.'}
                  </p>

                  {#if need.needed_from || need.needed_until}
                    <div class="mt-3 text-[11px] text-ink-muted bg-surface-base p-2 rounded-lg border border-surface-border">
                      Dibutuhkan: <strong class="text-ink-primary font-medium">{need.needed_from || '?'}</strong> s/d <strong class="text-ink-primary font-medium">{need.needed_until || '?'}</strong>
                    </div>
                  {/if}
                </div>

                <div class="mt-5 pt-3 border-t border-surface-border flex items-center justify-between gap-2">
                  <div class="text-[11px] text-ink-muted">
                    Punya alat ini?
                  </div>
                  <button
                    type="button"
                    on:click={() => (selectedNeedForOffer = need)}
                    class="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles class="w-3.5 h-3.5 text-brand-600" />
                    <span>Tawarkan (I HAVE)</span>
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

    <!-- ========================================================================= -->
    <!-- TAB 3: PAPAN WARGA & DISKUSI (NEW)                                        -->
    <!-- ========================================================================= -->
    {:else if activeTab === 'discussions'}
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-lg text-ink-primary">Papan Warga & Diskusi Komunitas</h3>
            <p class="text-xs text-ink-secondary">Pengumuman inventaris, tanya jawab pemeliharaan alat, dan koordinasi antar warga.</p>
          </div>
        </div>

        <!-- Post Discussion Form -->
        <div class="bg-white rounded-3xl border border-surface-border p-6 shadow-sm">
          <h4 class="font-bold text-sm text-ink-primary mb-3 flex items-center gap-2">
            <MessageSquare class="w-4 h-4 text-brand-600" />
            <span>Tulis Kabar / Pertanyaan ke Papan Warga</span>
          </h4>

          <div class="space-y-3">
            <input
              type="text"
              bind:value={newDiscussionTitle}
              placeholder="Judul pesan atau topik (contoh: Petunjuk penggunaan Mesin Rumput RT)"
              class="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:outline-none bg-surface-base"
            />

            <textarea
              bind:value={newDiscussionContent}
              rows="3"
              placeholder="Tuliskan informasi lengkap atau pertanyaan Anda untuk tetangga di komunitas..."
              class="w-full text-xs px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:outline-none bg-surface-base resize-none"
            ></textarea>

            <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-ink-muted font-medium">Kategori:</span>
                <select
                  bind:value={newDiscussionCategory}
                  class="text-xs font-medium px-3 py-1.5 rounded-xl border border-surface-border bg-white focus:outline-none focus:border-brand-500"
                >
                  <option value="general">💬 Diskusi Umum</option>
                  <option value="resource_qa">🔧 Q&A Pemakaian Alat</option>
                  <option value="announcement">📢 Pengumuman Komunitas</option>
                </select>
              </div>

              <button
                type="button"
                on:click={handleCreateDiscussion}
                disabled={submittingDiscussion}
                class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {#if submittingDiscussion}
                  <span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Mengirim...</span>
                {:else}
                  <Send class="w-3.5 h-3.5" />
                  <span>Kirim ke Papan Warga</span>
                {/if}
              </button>
            </div>
          </div>
        </div>

        <!-- Discussions Feed -->
        {#if loadingDiscussions}
          <div class="py-12 text-center text-xs text-ink-secondary">Memuat diskusi...</div>
        {:else if discussions.length === 0}
          <EmptyState
            title="Belum Ada Diskusi di Papan Warga"
            description="Mulai percakapan pertama tentang pemeliharaan alat bersama atau info kegiatan warga."
            actionText="Tulis Pesan Pertama"
            onAction={() => {}}
          />
        {:else}
          <div class="space-y-4">
            {#each discussions as post (post.id)}
              <div class="bg-white rounded-2xl border border-surface-border p-5 hover:border-surface-border/80 shadow-xs transition-colors">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <img
                      src={post.author?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={post.author?.full_name || 'Penulis'}
                      class="w-9 h-9 rounded-full object-cover ring-1 ring-surface-border"
                    />
                    <div>
                      <div class="text-xs font-bold text-ink-primary">
                        {post.author?.full_name || 'Warga'}
                      </div>
                      <div class="text-[10px] text-ink-muted">
                        {new Date(post.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded border
                      {post.category === 'announcement'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : post.category === 'resource_qa'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-stone-50 text-stone-700 border-stone-200'}">
                      {post.category === 'announcement' ? '📢 Pengumuman' : post.category === 'resource_qa' ? '🔧 Q&A Alat' : '💬 Umum'}
                    </span>

                    {#if post.author_id === ($authState.resident?.id || $authState.user?.id) || community?.user_role === 'admin'}
                      <button
                        type="button"
                        on:click={() => handleDeleteDiscussion(post.id)}
                        class="p-1 text-ink-muted hover:text-red-600 transition-colors"
                        title="Hapus Diskusi"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    {/if}
                  </div>
                </div>

                <div class="mt-3">
                  <h4 class="font-bold text-sm text-ink-primary">
                    {post.title}
                  </h4>
                  <p class="text-xs text-ink-secondary mt-1 whitespace-pre-line leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

    <!-- ========================================================================= -->
    <!-- TAB 4: MEMBERS                                                            -->
    <!-- ========================================================================= -->
    {:else if activeTab === 'members'}
      <div class="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 space-y-5 shadow-sm">
        <div>
          <h3 class="font-bold text-lg text-ink-primary">Anggota Komunitas</h3>
          <p class="text-xs text-ink-secondary">
            {members.length} warga yang saling berbagi akses dan merawat inventaris bersama.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {#each members as member (member.id)}
            <div class="p-3.5 rounded-2xl border border-surface-border bg-surface-base flex items-center gap-3">
              <img
                src={member.profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={member.profile?.full_name || 'Member'}
                class="w-10 h-10 rounded-xl object-cover ring-1 ring-brand-500/20"
              />
              <div class="min-w-0 flex-1">
                <div class="font-bold text-xs text-ink-primary truncate">
                  {member.profile?.full_name || 'Warga'}
                </div>
                <div class="text-[10px] font-semibold mt-0.5">
                  {#if member.role === 'admin'}
                    <span class="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Admin
                    </span>
                  {:else}
                    <span class="text-ink-muted">
                      Member
                    </span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

    <!-- ========================================================================= -->
    <!-- TAB 5: ABOUT                                                              -->
    <!-- ========================================================================= -->
    {:else if activeTab === 'about'}
      <div class="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 space-y-6 shadow-sm max-w-3xl">
        <div>
          <h3 class="font-bold text-lg text-ink-primary">Tentang {community.name}</h3>
          <p class="text-xs sm:text-sm text-ink-secondary mt-2 leading-relaxed">
            {community.description || 'Komunitas ini didirikan sebagai sarana berbagi pakai sumber daya fisik di lingkungan sekitar, mengurangi pembelian barang berlebih, dan saling membantu antar sesama warga.'}
          </p>
        </div>

        {#if community.location}
          <div class="pt-4 border-t border-surface-border">
            <h4 class="font-bold text-xs uppercase tracking-wider text-ink-muted mb-1.5">Lokasi Wilayah</h4>
            <div class="flex items-center gap-2 text-xs font-medium text-ink-primary">
              <MapPin class="w-4 h-4 text-brand-600" />
              <span>{community.location}</span>
            </div>
          </div>
        {/if}

        <div class="pt-4 border-t border-surface-border">
          <h4 class="font-bold text-xs uppercase tracking-wider text-ink-muted mb-2">Prinsip Bersama</h4>
          <ul class="text-xs text-ink-secondary space-y-2 list-disc list-inside leading-relaxed">
            <li><strong>Access over ownership</strong>: Gunakan barang sesuai kebutuhan dan kembalikan tepat waktu.</li>
            <li><strong>Rawat seperti milik sendiri</strong>: Pastikan alat dikembalikan dalam kondisi bersih dan lengkap.</li>
            <li><strong>Komunikasi terbuka</strong>: Sampaikan rencana peminjaman dengan jelas kepada tetangga pemilik.</li>
          </ul>
        </div>
      </div>
    {/if}

  </div>
{/if}

<!-- Modals -->
{#if borrowingItem}
  <BorrowModal
    item={borrowingItem}
    onClose={() => (borrowingItem = null)}
    onSuccess={loadCommunityData}
  />
{/if}

{#if showShareModal}
  <ShareResourceModal
    onClose={() => (showShareModal = false)}
    onSuccess={loadCommunityData}
  />
{/if}

{#if showPostNeedModal && community}
  <PostNeedModal
    initialCommunityId={community.id}
    onClose={() => (showPostNeedModal = false)}
    onSuccess={loadCommunityData}
  />
{/if}

{#if selectedNeedForOffer}
  <OfferItemModal
    need={selectedNeedForOffer}
    onClose={() => (selectedNeedForOffer = null)}
    onSuccess={() => {
      selectedNeedForOffer = null;
      loadCommunityData();
    }}
  />
{/if}
