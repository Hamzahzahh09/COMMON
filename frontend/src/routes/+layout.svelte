<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { initAuth, isAuthenticated } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';
  import Navbar from '$lib/components/Navbar.svelte';
  import MobileNav from '$lib/components/MobileNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ToastContainer from '$lib/components/ToastContainer.svelte';
  import ShareResourceModal from '$lib/components/ShareResourceModal.svelte';

  let showShareModal = false;

  onMount(() => {
    initAuth();
  });

  function handleOpenShare() {
    if (!$isAuthenticated) {
      toast.info('Silakan masuk terlebih dahulu untuk membagikan barang ke komunitas.');
      goto('/login');
      return;
    }
    showShareModal = true;
  }

  function handleResourceShared(_itemId?: string) {
    window.dispatchEvent(new CustomEvent('resource-added'));
  }
</script>

<div class="min-h-screen flex flex-col bg-[#F7F6F2] text-[#1C1C1A]">
  
  <!-- Main Header Navigation -->
  <Navbar onOpenShare={handleOpenShare} />

  <!-- Page Content -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
    <slot />
  </main>

  <!-- Editorial Community Footer -->
  <Footer />

  <!-- Mobile Bottom Sticky Navigation -->
  <MobileNav onOpenShare={handleOpenShare} />

  <!-- Global Toast Notifications -->
  <ToastContainer />

  <!-- Global Share Resource Modal -->
  {#if showShareModal}
    <ShareResourceModal
      onClose={() => (showShareModal = false)}
      onSuccess={handleResourceShared}
    />
  {/if}
</div>

