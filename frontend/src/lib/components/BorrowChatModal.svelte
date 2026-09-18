<script lang="ts">
  import { onMount } from 'svelte';
  import {
    getRequestMessages,
    sendRequestMessage,
    type BorrowingRequest,
    type BorrowingMessage,
  } from '$lib/api/borrowing.api';
  import { authState } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';
  import { X, Send, MessageSquare, Clock, User, RefreshCw } from 'lucide-svelte';

  export let request: BorrowingRequest;
  export let onClose: () => void;

  let messages: BorrowingMessage[] = [];
  let newMessage = '';
  let loading = true;
  let sending = false;
  let chatContainer: HTMLElement;

  $: currentUserId = $authState.resident?.id || $authState.user?.id;

  async function loadMessages() {
    try {
      const res = await getRequestMessages(request.id);
      if (res.success && res.data) {
        messages = res.data;
        scrollToBottom();
      }
    } catch {
      // Ignored
    } finally {
      loading = false;
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);
  }

  async function handleSend() {
    if (!newMessage.trim() || sending) return;
    const text = newMessage.trim();
    newMessage = '';
    sending = true;

    try {
      const res = await sendRequestMessage(request.id, text);
      if (res.success && res.data) {
        messages = [...messages, res.data];
        scrollToBottom();
      } else {
        toast.error(res.error?.message || 'Gagal mengirim pesan.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan pengiriman.');
    } finally {
      sending = false;
    }
  }

  onMount(() => {
    loadMessages();
  });
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/60 backdrop-blur-sm animate-in fade-in duration-200">
  <div class="bg-white rounded-3xl border border-surface-border max-w-lg w-full p-6 shadow-2xl flex flex-col h-[600px] max-h-[90vh] relative">
    
    <!-- Close Button -->
    <button
      type="button"
      on:click={onClose}
      class="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-muted text-ink-muted transition-colors"
      aria-label="Tutup pesan"
    >
      <X class="w-5 h-5" />
    </button>

    <!-- Header -->
    <div class="pb-4 border-b border-surface-border">
      <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-900 border border-brand-200 text-[10px] font-bold uppercase tracking-wider mb-1.5">
        <MessageSquare class="w-3 h-3 text-brand-600" />
        Koordinasi Peminjaman
      </div>
      <h3 class="text-base font-bold text-ink-primary truncate">
        {request.item?.name || 'Barang Inventaris'}
      </h3>
      <p class="text-xs text-ink-secondary mt-0.5">
        Koordinasikan lokasi penjemputan dan waktu serah terima dengan tetangga.
      </p>
    </div>

    <!-- Messages List -->
    <div
      bind:this={chatContainer}
      class="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin"
    >
      {#if loading}
        <div class="py-12 text-center">
          <RefreshCw class="w-6 h-6 text-brand-500 animate-spin mx-auto mb-2" />
          <p class="text-xs text-ink-muted">Memuat percakapan...</p>
        </div>
      {:else if messages.length === 0}
        <div class="py-12 text-center text-ink-muted px-4">
          <MessageSquare class="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p class="text-xs font-semibold text-ink-primary">Belum ada pesan koordinasi</p>
          <p class="text-[11px] text-ink-muted mt-1">
            Kirimkan pesan untuk menyepakati jam dan lokasi penjemputan alat.
          </p>
        </div>
      {:else}
        {#each messages as msg}
          {@const isMe = msg.sender_id === currentUserId}
          <div class="flex flex-col {isMe ? 'items-end' : 'items-start'}">
            <div class="flex items-center gap-1.5 text-[10px] text-ink-muted mb-1 px-1">
              <span>{isMe ? 'Anda' : (msg.sender?.full_name || 'Tetangga')}</span>
              <span>•</span>
              <span>{new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div
              class="max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm
                {isMe ? 'bg-brand-500 text-white rounded-br-none' : 'bg-surface-muted text-ink-primary rounded-bl-none border border-surface-border'}"
            >
              {msg.message}
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Send Input Form -->
    <form on:submit|preventDefault={handleSend} class="pt-3 border-t border-surface-border flex items-center gap-2">
      <input
        type="text"
        bind:value={newMessage}
        placeholder="Tulis pesan atau lokasi penjemputan..."
        class="flex-1 px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
      />
      <button
        type="submit"
        disabled={!newMessage.trim() || sending}
        class="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
        title="Kirim"
        aria-label="Kirim pesan"
      >
        <Send class="w-4 h-4" />
      </button>
    </form>

  </div>
</div>
