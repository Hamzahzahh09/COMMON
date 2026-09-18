<script lang="ts">
  import { HeartHandshake } from 'lucide-svelte';
</script>

<footer class="border-t border-surface-border bg-white mt-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12">
      
      <!-- Brand & Positioning (Takes 2 cols on md/lg) -->
      <div class="md:col-span-2 space-y-4">
        <a href="/" class="flex items-center gap-2.5 group inline-block">
          <div class="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:bg-brand-600 transition-colors">
            C
          </div>
          <span class="font-extrabold text-lg tracking-tight text-ink-primary">
            COMMON
          </span>
        </a>
        
        <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-sm">
          Shared infrastructure for real communities. Akses alat dan perlengkapan fisik yang sudah ada di sekitar Anda tanpa harus membeli semuanya.
        </p>

        <div class="pt-2 flex items-center gap-2 text-xs font-semibold text-brand-700">
          <HeartHandshake class="w-4 h-4 text-brand-500" />
          <span>Access over ownership.</span>
        </div>
      </div>

      <!-- Column 1: EXPLORE -->
      <div class="space-y-3">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-ink-primary">
          Explore
        </h4>
        <ul class="space-y-2.5 text-xs text-ink-secondary">
          <li>
            <a href="/discover" class="hover:text-ink-primary transition-colors">
              Discover
            </a>
          </li>
          <li>
            <a href="/discover" class="hover:text-ink-primary transition-colors">
              Resources
            </a>
          </li>
          <li>
            <a href="/needs" class="hover:text-ink-primary transition-colors">
              Requests Board
            </a>
          </li>
        </ul>
      </div>

      <!-- Column 2: COMMUNITY -->
      <div class="space-y-3">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-ink-primary">
          Community
        </h4>
        <ul class="space-y-2.5 text-xs text-ink-secondary">
          <li>
            <a href="/communities" class="hover:text-ink-primary transition-colors">
              Join a Community
            </a>
          </li>
          <li>
            <a href="/create-community" class="hover:text-ink-primary transition-colors">
              Create a Community
            </a>
          </li>
          <li>
            <a href="/#trust-safety" class="hover:text-ink-primary transition-colors">
              Community Guidelines
            </a>
          </li>
          <li>
            <a href="/#trust-safety" class="hover:text-ink-primary transition-colors">
              Trust & Safety
            </a>
          </li>
        </ul>
      </div>

      <!-- Column 3: ABOUT -->
      <div class="space-y-3">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-ink-primary">
          About
        </h4>
        <ul class="space-y-2.5 text-xs text-ink-secondary">
          <li>
            <a href="/#why-common" class="hover:text-ink-primary transition-colors">
              Our Mission
            </a>
          </li>
          <li>
            <a href="/#how-it-works" class="hover:text-ink-primary transition-colors">
              How It Works
            </a>
          </li>
          <li>
            <a href="/#why-common" class="hover:text-ink-primary transition-colors">
              Community Principles
            </a>
          </li>
        </ul>
      </div>

    </div>

    <!-- Bottom Divider & Copyright -->
    <div class="mt-12 pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
      <div class="flex items-center gap-2">
        <span class="font-medium text-ink-secondary">© 2026 COMMON</span>
        <span>•</span>
        <span class="italic text-ink-secondary">"Access over ownership."</span>
      </div>

      <div class="text-center sm:text-right font-medium text-ink-secondary">
        Share more. Own less. Access together.
      </div>
    </div>
  </div>
</footer>
