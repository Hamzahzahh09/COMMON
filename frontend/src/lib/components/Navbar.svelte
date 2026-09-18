<script lang="ts">
  import { onMount } from 'svelte';
  import { authState, isAuthenticated, signOut } from '../stores/auth';
  import { getIncomingRequests } from '../api/borrowing.api';
  import { savedItems } from '../stores/saved';
  import {
    Plus,
    ChevronDown,
    ShieldCheck,
    Compass,
    Users,
    FolderHeart,
    Clock,
    Inbox,
    User,
    Menu,
    X,
    LogOut,
    HelpCircle,
    LayoutDashboard,
    Bookmark,
    MessageSquare,
    Boxes,
  } from 'lucide-svelte';

  export let onOpenShare: () => void = () => {};

  let showResidentMenu = false;
  let showMobileMenu = false;
  let pendingIncomingCount = 0;

  $: savedCount = $savedItems.length;

  async function checkIncomingCount() {
    if (!$isAuthenticated) return;
    try {
      const res = await getIncomingRequests();
      if (res.success && res.data) {
        pendingIncomingCount = res.data.filter((r) => r.status === 'pending').length;
      }
    } catch {
      // Ignored
    }
  }

  let lastResidentId = '';

  $: if ($isAuthenticated && $authState.resident && $authState.resident.id !== lastResidentId) {
    lastResidentId = $authState.resident.id;
    checkIncomingCount();
  }

  function toggleResidentMenu() {
    showResidentMenu = !showResidentMenu;
  }

  async function handleSignOut() {
    showResidentMenu = false;
    showMobileMenu = false;
    lastResidentId = '';
    pendingIncomingCount = 0;
    await signOut();
  }
</script>

<header class="sticky top-0 z-40 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-surface-border">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      
      <!-- Brand & Primary Navigation (Section 8: COMMON, Discover, Communities, How it works) -->
      <div class="flex items-center gap-6 lg:gap-8">
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-brand-600 transition-colors">
            C
          </div>
          <div>
            <div class="font-extrabold text-base tracking-tight text-ink-primary flex items-center gap-1.5">
              COMMON
              <span class="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8EFEA] text-[#1E4432] border border-[#C8DCD0]">
                Access Together
              </span>
            </div>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 text-xs font-semibold text-ink-secondary">
          <a
            href="/discover"
            class="px-3 py-2 rounded-xl hover:text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-1.5"
          >
            <Compass class="w-4 h-4 text-stone-400" />
            <span>Discover</span>
          </a>

          <a
            href="/communities"
            class="px-3 py-2 rounded-xl hover:text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-1.5"
          >
            <Users class="w-4 h-4 text-stone-400" />
            <span>Communities</span>
          </a>

          <a
            href="/#how-it-works"
            class="px-3 py-2 rounded-xl hover:text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-1.5"
          >
            <HelpCircle class="w-4 h-4 text-stone-400" />
            <span>How it works</span>
          </a>

          {#if $isAuthenticated}
            <a
              href="/dashboard"
              class="px-3 py-2 rounded-xl hover:text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-1.5 font-bold text-brand-700"
            >
              <LayoutDashboard class="w-4 h-4 text-brand-600" />
              <span>Dashboard</span>
            </a>
          {/if}
        </nav>
      </div>

      <!-- Right: Actions & Profile Navigation -->
      <div class="flex items-center gap-2 sm:gap-2.5">
        
        {#if $isAuthenticated}
          <!-- Quick Icons: Saved & Messages -->
          <a
            href="/saved"
            class="p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors relative"
            title="Barang Tersimpan"
            aria-label="Barang Tersimpan"
          >
            <Bookmark class="w-4 h-4" />
            {#if savedCount > 0}
              <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            {/if}
          </a>

          <a
            href="/messages"
            class="p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors relative"
            title="Pesan & Koordinasi"
            aria-label="Pesan & Koordinasi"
          >
            <MessageSquare class="w-4 h-4" />
          </a>

          <a
            href="/incoming"
            class="p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors relative"
            title="Permintaan Masuk"
            aria-label="Permintaan Masuk"
          >
            <Inbox class="w-4 h-4" />
            {#if pendingIncomingCount > 0}
              <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingIncomingCount}
              </span>
            {/if}
          </a>

          <!-- [+ Share Resource] Primary Action -->
          <button
            type="button"
            on:click={onOpenShare}
            class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-all active:scale-95"
          >
            <Plus class="w-4 h-4 stroke-[2.5]" />
            <span>Share Resource</span>
          </button>

          <!-- Resident Menu / Contextual Dropdown -->
          <div class="relative">
            <button
              type="button"
              on:click={toggleResidentMenu}
              class="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-surface-border hover:border-stone-300 bg-white hover:bg-stone-50 transition-colors text-left shadow-sm"
              aria-label="Menu akun warga"
            >
              <img
                src={$authState.resident?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={$authState.resident?.name || 'User'}
                class="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-500/20"
              />
              <div class="hidden lg:block">
                <div class="text-[11px] font-bold text-ink-primary flex items-center gap-1 leading-tight">
                  {$authState.resident?.name || 'Warga'}
                  {#if $authState.resident?.role?.includes('Admin')}
                    <ShieldCheck class="w-3 h-3 text-brand-600" />
                  {/if}
                </div>
                <div class="text-[10px] text-ink-muted leading-tight">
                  Menu Warga
                </div>
              </div>
              <ChevronDown class="w-3.5 h-3.5 text-stone-400" />
            </button>

            <!-- Dropdown List -->
            {#if showResidentMenu}
              <div class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-surface-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                
                <!-- Quick Navigation Section (Section 8) -->
                <div class="px-2 py-1.5 space-y-0.5 text-xs font-medium text-ink-primary border-b border-surface-border">
                  <a
                    href="/dashboard"
                    on:click={() => (showResidentMenu = false)}
                    class="px-3 py-2 rounded-xl hover:bg-surface-muted flex items-center gap-2"
                  >
                    <LayoutDashboard class="w-4 h-4 text-brand-600" />
                    <span>Dashboard</span>
                  </a>

                  <a
                    href="/requests"
                    on:click={() => (showResidentMenu = false)}
                    class="px-3 py-2 rounded-xl hover:bg-surface-muted flex items-center gap-2"
                  >
                    <Clock class="w-4 h-4 text-stone-400" />
                    <span>My Borrowings</span>
                  </a>

                  <a
                    href="/dashboard?tab=my-items"
                    on:click={() => (showResidentMenu = false)}
                    class="px-3 py-2 rounded-xl hover:bg-surface-muted flex items-center gap-2"
                  >
                    <Boxes class="w-4 h-4 text-stone-400" />
                    <span>My Items</span>
                  </a>

                  <a
                    href="/incoming"
                    on:click={() => (showResidentMenu = false)}
                    class="px-3 py-2 rounded-xl hover:bg-surface-muted flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                      <Inbox class="w-4 h-4 text-stone-400" />
                      <span>Requests (Owner Review)</span>
                    </div>
                    {#if pendingIncomingCount > 0}
                      <span class="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {pendingIncomingCount}
                      </span>
                    {/if}
                  </a>

                  <a
                    href="/messages"
                    on:click={() => (showResidentMenu = false)}
                    class="px-3 py-2 rounded-xl hover:bg-surface-muted flex items-center gap-2"
                  >
                    <MessageSquare class="w-4 h-4 text-stone-400" />
                    <span>Messages</span>
                  </a>

                  <a
                    href="/saved"
                    on:click={() => (showResidentMenu = false)}
                    class="px-3 py-2 rounded-xl hover:bg-surface-muted flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                      <Bookmark class="w-4 h-4 text-stone-400" />
                      <span>Saved</span>
                    </div>
                    {#if savedCount > 0}
                      <span class="text-[10px] text-ink-muted font-bold">
                        {savedCount}
                      </span>
                    {/if}
                  </a>

                  <a
                    href="/profile"
                    on:click={() => (showResidentMenu = false)}
                    class="px-3 py-2 rounded-xl hover:bg-surface-muted flex items-center gap-2"
                  >
                    <User class="w-4 h-4 text-stone-400" />
                    <span>Profile</span>
                  </a>
                </div>

                <div class="px-4 pt-2 mt-1 border-t border-surface-border flex items-center justify-end text-[11px]">
                  <button
                    type="button"
                    on:click={handleSignOut}
                    class="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    <LogOut class="w-3 h-3" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {:else}
          <!-- Public Actions for Visitors (Section 8: Primary CTA: Discover resources, Secondary CTA: Join COMMON) -->
          <a
            href="/discover"
            class="px-3.5 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors hidden sm:block"
          >
            Discover resources
          </a>
          <a
            href="/login"
            class="px-3.5 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors"
          >
            Sign in
          </a>
          <a
            href="/login"
            class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            Join COMMON
          </a>
        {/if}

        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          on:click={() => (showMobileMenu = !showMobileMenu)}
          class="md:hidden p-2 rounded-xl text-ink-secondary hover:bg-surface-muted transition-colors"
          aria-label="Toggle navigation menu"
        >
          {#if showMobileMenu}
            <X class="w-5 h-5" />
          {:else}
            <Menu class="w-5 h-5" />
          {/if}
        </button>

      </div>

    </div>
  </div>

  <!-- Mobile Drawer / Menu -->
  {#if showMobileMenu}
    <div class="md:hidden border-t border-surface-border bg-white px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-lg">
      <nav class="flex flex-col space-y-1 text-xs font-semibold text-ink-secondary">
        <a
          href="/discover"
          on:click={() => (showMobileMenu = false)}
          class="px-3 py-2.5 rounded-xl hover:bg-surface-muted flex items-center gap-2"
        >
          <Compass class="w-4 h-4 text-brand-600" />
          <span>Discover</span>
        </a>
        <a
          href="/communities"
          on:click={() => (showMobileMenu = false)}
          class="px-3 py-2.5 rounded-xl hover:bg-surface-muted flex items-center gap-2"
        >
          <Users class="w-4 h-4 text-brand-600" />
          <span>Communities</span>
        </a>
        <a
          href="/#how-it-works"
          on:click={() => (showMobileMenu = false)}
          class="px-3 py-2.5 rounded-xl hover:bg-surface-muted flex items-center gap-2"
        >
          <HelpCircle class="w-4 h-4 text-brand-600" />
          <span>How it works</span>
        </a>

        {#if $isAuthenticated}
          <div class="pt-2 border-t border-surface-border my-1"></div>
          <a
            href="/dashboard"
            on:click={() => (showMobileMenu = false)}
            class="px-3 py-2.5 rounded-xl hover:bg-surface-muted flex items-center gap-2 font-bold text-ink-primary"
          >
            <LayoutDashboard class="w-4 h-4 text-brand-600" />
            <span>Dashboard</span>
          </a>
          <a
            href="/requests"
            on:click={() => (showMobileMenu = false)}
            class="px-3 py-2.5 rounded-xl hover:bg-surface-muted flex items-center gap-2"
          >
            <Clock class="w-4 h-4 text-brand-600" />
            <span>My Borrowings</span>
          </a>
          <a
            href="/incoming"
            on:click={() => (showMobileMenu = false)}
            class="px-3 py-2.5 rounded-xl hover:bg-surface-muted flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <Inbox class="w-4 h-4 text-brand-600" />
              <span>Requests</span>
            </div>
            {#if pendingIncomingCount > 0}
              <span class="px-1.5 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-bold">
                {pendingIncomingCount}
              </span>
            {/if}
          </a>
          <a
            href="/messages"
            on:click={() => (showMobileMenu = false)}
            class="px-3 py-2.5 rounded-xl hover:bg-surface-muted flex items-center gap-2"
          >
            <MessageSquare class="w-4 h-4 text-brand-600" />
            <span>Messages</span>
          </a>
          <a
            href="/saved"
            on:click={() => (showMobileMenu = false)}
            class="px-3 py-2.5 rounded-xl hover:bg-surface-muted flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <Bookmark class="w-4 h-4 text-brand-600" />
              <span>Saved</span>
            </div>
            {#if savedCount > 0}
              <span class="text-xs text-ink-muted font-bold">{savedCount}</span>
            {/if}
          </a>
          <a
            href="/profile"
            on:click={() => (showMobileMenu = false)}
            class="px-3 py-2.5 rounded-xl hover:bg-surface-muted flex items-center gap-2"
          >
            <User class="w-4 h-4 text-brand-600" />
            <span>Profile</span>
          </a>

          <div class="pt-2">
            <button
              type="button"
              on:click={() => {
                showMobileMenu = false;
                onOpenShare();
              }}
              class="w-full py-2.5 px-4 rounded-xl bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus class="w-4 h-4" />
              <span>Share Resource</span>
            </button>
          </div>
        {/if}
      </nav>
    </div>
  {/if}
</header>
