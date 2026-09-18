<script lang="ts">
  import { PackageOpen } from 'lucide-svelte';

  export let title: string = 'Belum ada data';
  export let description: string = 'Data yang Anda cari belum tersedia saat ini.';
  export let actionText: string = '';
  export let actionHref: string = '';
  export let onAction: (() => void) | undefined = undefined;
</script>

<div class="py-14 px-6 text-center bg-white rounded-2xl border border-surface-border max-w-md mx-auto shadow-sm">
  <div class="w-12 h-12 rounded-full bg-[#E8EFEA] text-[#2F6B4F] flex items-center justify-center mx-auto mb-3.5">
    <slot name="icon">
      <PackageOpen class="w-6 h-6 stroke-[1.75]" />
    </slot>
  </div>

  <h3 class="font-bold text-base text-ink-primary tracking-tight">
    {title}
  </h3>

  <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed max-w-xs mx-auto">
    {description}
  </p>

  {#if actionText}
    {#if actionHref}
      <a
        href={actionHref}
        class="mt-5 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-colors"
      >
        {actionText}
      </a>
    {:else if onAction}
      <button
        type="button"
        on:click={onAction}
        class="mt-5 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-colors"
      >
        {actionText}
      </button>
    {/if}
  {/if}
</div>
