<script lang="ts">
  import type { Community } from '$lib/api/communities.api';
  import { joinCommunity, leaveCommunity } from '$lib/api/communities.api';
  import { toast } from '$lib/stores/toast';
  import { Users, Package, MapPin, Check } from 'lucide-svelte';

  export let community: Community;
  export let onUpdated: (() => void) | undefined = undefined;

  let loadingAction = false;

  async function handleToggleJoin() {
    loadingAction = true;
    try {
      if (community.is_joined) {
        const res = await leaveCommunity(community.id);
        if (res.success) {
          community.is_joined = false;
          community.member_count = Math.max(0, (community.member_count || 1) - 1);
          toast.info(`Anda telah keluar dari komunitas ${community.name}.`);
          onUpdated?.();
        } else {
          toast.error(res.error?.message || 'Gagal keluar dari komunitas.');
        }
      } else {
        const res = await joinCommunity(community.id);
        if (res.success) {
          community.is_joined = true;
          community.member_count = (community.member_count || 0) + 1;
          toast.success(`Selamat bergabung di komunitas ${community.name}!`);
          onUpdated?.();
        } else {
          toast.error(res.error?.message || 'Gagal bergabung ke komunitas.');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan.');
    } finally {
      loadingAction = false;
    }
  }
</script>

<div class="group bg-white rounded-2xl border border-surface-border p-5 flex flex-col justify-between hover:border-brand-300 hover:shadow-md hover:shadow-brand-900/5 transition-all">
  <div>
    <!-- Header: Slug & Role badge -->
    <div class="flex items-center justify-between gap-2 mb-2">
      <span class="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100">
        c/{community.slug}
      </span>
      {#if community.user_role === 'admin'}
        <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Admin
        </span>
      {/if}
    </div>

    <!-- Title & Description -->
    <a href="/c/{community.slug}" class="block group-hover:text-brand-700 transition-colors">
      <h3 class="font-bold text-base text-ink-primary tracking-tight line-clamp-1">
        {community.name}
      </h3>
    </a>

    <p class="text-xs text-ink-secondary mt-1.5 line-clamp-2 leading-relaxed">
      {community.description || 'Komunitas berbagi alat dan inventaris bersama warga.'}
    </p>

    <!-- Location -->
    {#if community.location}
      <div class="flex items-center gap-1 text-[11px] text-ink-muted mt-2.5">
        <MapPin class="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
        <span class="truncate">{community.location}</span>
      </div>
    {/if}
  </div>

  <!-- Footer: Stats & Join Button -->
  <div class="mt-5 pt-4 border-t border-surface-border flex items-center justify-between gap-3">
    <div class="flex items-center gap-3 text-xs text-ink-secondary">
      <span class="inline-flex items-center gap-1 font-medium" title="Jumlah Warga Bergabung">
        <Users class="w-3.5 h-3.5 text-brand-600" />
        {community.member_count || 0}
      </span>
      <span class="text-stone-300">•</span>
      <span class="inline-flex items-center gap-1 font-medium" title="Jumlah Alat Terdaftar">
        <Package class="w-3.5 h-3.5 text-stone-500" />
        {community.resource_count || 0} barang
      </span>
    </div>

    <button
      type="button"
      on:click={handleToggleJoin}
      disabled={loadingAction}
      class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm
        {community.is_joined
          ? 'bg-surface-muted text-ink-secondary hover:bg-stone-200 border border-surface-border'
          : 'bg-brand-500 hover:bg-brand-600 text-white'}"
    >
      {#if loadingAction}
        <span class="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      {:else if community.is_joined}
        <Check class="w-3.5 h-3.5 text-brand-600" />
        <span>JOINED</span>
      {:else}
        <span>JOIN</span>
      {/if}
    </button>
  </div>
</div>
