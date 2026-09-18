import { s as sanitize_props, a as spread_props, b as slot, c as store_get, u as unsubscribe_stores, e as escape_html, d as attr, i as attr_class, j as ensure_array_like } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/stores.js";
import { g as getCommunityBySlug, a as getCommunityMembers } from "../../../../chunks/communities.api.js";
import { g as getItems } from "../../../../chunks/items.api.js";
import { a as apiRequest } from "../../../../chunks/client.js";
import { R as ResourceCard, B as BorrowModal } from "../../../../chunks/BorrowModal.js";
import { E as EmptyState } from "../../../../chunks/EmptyState.js";
import { S as ShareResourceModal } from "../../../../chunks/ShareResourceModal.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { R as Refresh_cw } from "../../../../chunks/refresh-cw.js";
import { S as Shield_check } from "../../../../chunks/shield-check.js";
import { M as Map_pin } from "../../../../chunks/map-pin.js";
import { U as Users } from "../../../../chunks/users.js";
import { P as Package } from "../../../../chunks/package.js";
import { C as Check } from "../../../../chunks/check.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { H as Heart_handshake } from "../../../../chunks/heart-handshake.js";
import { M as Message_square } from "../../../../chunks/message-square.js";
function Info($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.475.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "info" },
    $$sanitized_props,
    {
      /**
       * @component @name Info
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
async function getCommunityNeeds(filters = {}) {
  const params = new URLSearchParams();
  if (filters.community_id) params.append("community_id", filters.community_id);
  if (filters.status) params.append("status", filters.status);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/community-needs${query}`);
}
async function getDiscussions(communityId, category) {
  const query = "";
  return apiRequest(`/communities/${communityId}/discussions${query}`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let slug, filterKey;
    let community = null;
    let items = [];
    let needs = [];
    let members = [];
    let discussions = [];
    let loading = true;
    let loadingJoin = false;
    let errorMsg = "";
    let borrowingItem = null;
    let showShareModal = false;
    let selectedCategory = "Semua";
    let selectedOwnership = "all";
    let searchQuery = "";
    const CATEGORIES = ["Semua", "Tools", "Home", "Events", "Outdoor", "Electronics"];
    async function loadCommunityData() {
      if (!slug) return;
      loading = true;
      errorMsg = "";
      try {
        const commRes = await getCommunityBySlug(slug);
        if (!commRes.success || !commRes.data) {
          errorMsg = commRes.error?.message || "Komunitas tidak ditemukan.";
          loading = false;
          return;
        }
        community = commRes.data;
        const [itemsRes, needsRes, membersRes, discRes] = await Promise.all([
          getItems({
            community_id: community.id,
            category: selectedCategory !== "Semua" ? selectedCategory : void 0,
            ownership_type: selectedOwnership !== "all" ? selectedOwnership : void 0,
            search: searchQuery.trim() || void 0
          }),
          getCommunityNeeds({ community_id: community.id }),
          getCommunityMembers(community.id),
          getDiscussions(community.id)
        ]);
        if (itemsRes.success && itemsRes.data) items = itemsRes.data;
        if (needsRes.success && needsRes.data) needs = needsRes.data;
        if (membersRes.success && membersRes.data) members = membersRes.data;
        if (discRes.success && discRes.data) discussions = discRes.data;
        lastFilteredKey = `${selectedCategory}:${selectedOwnership}:${searchQuery}`;
      } catch (err) {
        errorMsg = err.message || "Terjadi kesalahan saat memuat komunitas.";
      } finally {
        loading = false;
      }
    }
    let lastFilteredKey = "";
    let lastSlug = "";
    slug = store_get($$store_subs ??= {}, "$page", page).params.slug;
    if (slug && slug !== lastSlug) {
      lastSlug = slug;
      loadCommunityData();
    }
    filterKey = `${selectedCategory}:${selectedOwnership}:${searchQuery}`;
    if (community && filterKey !== lastFilteredKey) {
      lastFilteredKey = filterKey;
      getItems({
        community_id: community.id,
        category: void 0,
        ownership_type: void 0,
        search: searchQuery.trim() || void 0
      }).then((r) => {
        if (r.success && r.data) items = r.data;
      });
    }
    if (loading) {
      $$renderer2.push(`<!--[0--><div class="py-24 text-center">`);
      Refresh_cw($$renderer2, { class: "w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" });
      $$renderer2.push(`<!----> <p class="text-xs font-semibold text-ink-secondary">Memuat data komunitas...</p></div>`);
    } else if (errorMsg || !community) {
      $$renderer2.push("<!--[1-->");
      EmptyState($$renderer2, {
        title: "Komunitas Tidak Ditemukan",
        description: errorMsg || "Komunitas yang Anda tuju tidak tersedia.",
        actionText: "Lihat Direktori Komunitas",
        actionHref: "/communities"
      });
    } else {
      $$renderer2.push(`<!--[-1--><div class="space-y-8 animate-in fade-in duration-200"><section class="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 shadow-sm"><div class="flex flex-col md:flex-row md:items-center justify-between gap-6"><div><div class="flex items-center gap-2 mb-2"><span class="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100">c/${escape_html(community.slug)}</span> `);
      if (community.user_role === "admin") {
        $$renderer2.push(`<!--[0--><span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">`);
        Shield_check($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----> Administrator</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <h1 class="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">${escape_html(community.name)}</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1.5 max-w-2xl leading-relaxed">${escape_html(community.description || "Komunitas warga untuk berbagi alat dan inventaris bersama.")}</p> <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-muted">`);
      if (community.location) {
        $$renderer2.push(`<!--[0--><div class="flex items-center gap-1.5 text-ink-secondary">`);
        Map_pin($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
        $$renderer2.push(`<!----> <span>${escape_html(community.location)}</span></div> <span class="text-stone-300">•</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex items-center gap-1.5 font-medium text-ink-primary">`);
      Users($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
      $$renderer2.push(`<!----> <span>${escape_html(community.member_count || 0)} Warga Bergabung</span></div> <span class="text-stone-300">•</span> <div class="flex items-center gap-1.5 font-medium text-ink-primary">`);
      Package($$renderer2, { class: "w-3.5 h-3.5 text-stone-500" });
      $$renderer2.push(`<!----> <span>${escape_html(items.length)} Alat Terdaftar</span></div></div></div> <div class="flex items-center gap-3"><button type="button"${attr("disabled", loadingJoin, true)}${attr_class(`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${community.is_joined ? "bg-surface-muted text-ink-secondary hover:bg-stone-200 border border-surface-border" : "bg-brand-500 hover:bg-brand-600 text-white"}`)}>`);
      if (community.is_joined) {
        $$renderer2.push("<!--[1-->");
        Check($$renderer2, { class: "w-4 h-4 text-brand-600 stroke-[2.5]" });
        $$renderer2.push(`<!----> <span>JOINED</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        Plus($$renderer2, { class: "w-4 h-4 stroke-[2.5]" });
        $$renderer2.push(`<!----> <span>JOIN COMMUNITY</span>`);
      }
      $$renderer2.push(`<!--]--></button></div></div> <div class="mt-8 pt-4 border-t border-surface-border flex items-center gap-2 overflow-x-auto scrollbar-none"><button type="button"${attr_class(`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${"bg-brand-500 text-white shadow-sm"}`)}>`);
      Package($$renderer2, { class: "w-3.5 h-3.5" });
      $$renderer2.push(`<!----> <span>Resources (${escape_html(items.length)})</span></button> <button type="button"${attr_class(`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${"text-ink-secondary hover:bg-surface-muted"}`)}>`);
      Heart_handshake($$renderer2, { class: "w-3.5 h-3.5" });
      $$renderer2.push(`<!----> <span>Needs (${escape_html(needs.length)})</span></button> <button type="button"${attr_class(`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${"text-ink-secondary hover:bg-surface-muted"}`)}>`);
      Message_square($$renderer2, { class: "w-3.5 h-3.5" });
      $$renderer2.push(`<!----> <span>Papan Warga (${escape_html(discussions.length)})</span></button> <button type="button"${attr_class(`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${"text-ink-secondary hover:bg-surface-muted"}`)}>`);
      Users($$renderer2, { class: "w-3.5 h-3.5" });
      $$renderer2.push(`<!----> <span>Members (${escape_html(members.length)})</span></button> <button type="button"${attr_class(`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${"text-ink-secondary hover:bg-surface-muted"}`)}>`);
      Info($$renderer2, { class: "w-3.5 h-3.5" });
      $$renderer2.push(`<!----> <span>About</span></button></div></section>  `);
      {
        $$renderer2.push(`<!--[0--><div class="space-y-6"><div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"><div class="flex flex-wrap items-center gap-2"><div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"><!--[-->`);
        const each_array = ensure_array_like(CATEGORIES);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cat = each_array[$$index];
          $$renderer2.push(`<button type="button"${attr_class(`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-brand-500 text-white shadow-sm font-bold" : "bg-white border border-surface-border text-ink-secondary hover:bg-stone-50"}`)}>${escape_html(cat)}</button>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="hidden sm:block h-5 w-px bg-surface-border mx-1"></div> <div class="flex items-center gap-1 bg-surface-muted/70 p-1 rounded-xl border border-surface-border"><button type="button"${attr_class(`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${"bg-white text-ink-primary shadow-xs"}`)}>Semua Model</button> <button type="button"${attr_class(`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${"text-ink-secondary hover:text-ink-primary"}`)}><span>🏠</span> <span>Pribadi Warga</span></button> <button type="button"${attr_class(`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${"text-ink-secondary hover:text-ink-primary"}`)}><span>🏛️</span> <span>Inventaris RT/RW</span></button></div></div> <button type="button" class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 self-start md:self-auto">`);
        Plus($$renderer2, { class: "w-3.5 h-3.5 stroke-[2.5]" });
        $$renderer2.push(`<!----> <span>+ Share a Resource</span></button></div> `);
        if (items.length === 0) {
          $$renderer2.push("<!--[0-->");
          EmptyState($$renderer2, {
            title: "Belum Ada Barang yang Sesuai",
            description: "Tidak ada barang yang ditemukan dengan filter yang dipilih. Bagikan barang atau sesuaikan pencarian.",
            actionText: "+ Bagikan Barang Pertama",
            onAction: () => showShareModal = true
          });
        } else {
          $$renderer2.push(`<!--[-1--><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
          const each_array_1 = ensure_array_like(items);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let item = each_array_1[$$index_1];
            ResourceCard($$renderer2, { item, onBorrow: (selected) => borrowingItem = selected });
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (borrowingItem) {
      $$renderer2.push("<!--[0-->");
      BorrowModal($$renderer2, {
        item: borrowingItem,
        onClose: () => borrowingItem = null,
        onSuccess: loadCommunityData
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showShareModal) {
      $$renderer2.push("<!--[0-->");
      ShareResourceModal($$renderer2, {
        onClose: () => showShareModal = false,
        onSuccess: loadCommunityData
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
