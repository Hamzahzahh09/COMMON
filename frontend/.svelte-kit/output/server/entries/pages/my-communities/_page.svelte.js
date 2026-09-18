import { s as sanitize_props, a as spread_props, b as slot, h as fallback, e as escape_html, d as attr, l as stringify, i as attr_class, f as bind_props, c as store_get, u as unsubscribe_stores, j as ensure_array_like } from "../../../chunks/index.js";
import { c as getMyCommunities } from "../../../chunks/communities.api.js";
import "../../../chunks/client.js";
import { I as Icon, a as authState } from "../../../chunks/Icon.js";
import { M as Map_pin } from "../../../chunks/map-pin.js";
import { U as Users } from "../../../chunks/users.js";
import { P as Package } from "../../../chunks/package.js";
import { C as Check } from "../../../chunks/check.js";
import { E as EmptyState } from "../../../chunks/EmptyState.js";
import { P as Plus } from "../../../chunks/plus.js";
import { R as Refresh_cw } from "../../../chunks/refresh-cw.js";
function Folder_heart($$renderer, $$props) {
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
    [
      "path",
      {
        "d": "M11 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.5"
      }
    ],
    [
      "path",
      {
        "d": "M13.9 17.45c-1.2-1.2-1.14-2.8-.2-3.73a2.43 2.43 0 0 1 3.44 0l.36.34.34-.34a2.43 2.43 0 0 1 3.45-.01c.95.95 1 2.53-.2 3.74L17.5 21Z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "folder-heart" },
    $$sanitized_props,
    {
      /**
       * @component @name FolderHeart
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMjBINGEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMmgzLjlhMiAyIDAgMCAxIDEuNjkuOWwuODEgMS4yYTIgMiAwIDAgMCAxLjY3LjlIMjBhMiAyIDAgMCAxIDIgMnYxLjUiIC8+CiAgPHBhdGggZD0iTTEzLjkgMTcuNDVjLTEuMi0xLjItMS4xNC0yLjgtLjItMy43M2EyLjQzIDIuNDMgMCAwIDEgMy40NCAwbC4zNi4zNC4zNC0uMzRhMi40MyAyLjQzIDAgMCAxIDMuNDUtLjAxYy45NS45NSAxIDIuNTMtLjIgMy43NEwxNy41IDIxWiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/folder-heart
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
function CommunityCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let community = $$props["community"];
    let onUpdated = fallback($$props["onUpdated"], void 0);
    let loadingAction = false;
    $$renderer2.push(`<div class="group bg-white rounded-2xl border border-surface-border p-5 flex flex-col justify-between hover:border-brand-300 hover:shadow-md hover:shadow-brand-900/5 transition-all"><div><div class="flex items-center justify-between gap-2 mb-2"><span class="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100">c/${escape_html(community.slug)}</span> `);
    if (community.user_role === "admin") {
      $$renderer2.push(`<!--[0--><span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Admin</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <a${attr("href", `/c/${stringify(community.slug)}`)} class="block group-hover:text-brand-700 transition-colors"><h3 class="font-bold text-base text-ink-primary tracking-tight line-clamp-1">${escape_html(community.name)}</h3></a> <p class="text-xs text-ink-secondary mt-1.5 line-clamp-2 leading-relaxed">${escape_html(community.description || "Komunitas berbagi alat dan inventaris bersama warga.")}</p> `);
    if (community.location) {
      $$renderer2.push(`<!--[0--><div class="flex items-center gap-1 text-[11px] text-ink-muted mt-2.5">`);
      Map_pin($$renderer2, { class: "w-3.5 h-3.5 text-stone-400 flex-shrink-0" });
      $$renderer2.push(`<!----> <span class="truncate">${escape_html(community.location)}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-5 pt-4 border-t border-surface-border flex items-center justify-between gap-3"><div class="flex items-center gap-3 text-xs text-ink-secondary"><span class="inline-flex items-center gap-1 font-medium" title="Jumlah Warga Bergabung">`);
    Users($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
    $$renderer2.push(`<!----> ${escape_html(community.member_count || 0)}</span> <span class="text-stone-300">•</span> <span class="inline-flex items-center gap-1 font-medium" title="Jumlah Alat Terdaftar">`);
    Package($$renderer2, { class: "w-3.5 h-3.5 text-stone-500" });
    $$renderer2.push(`<!----> ${escape_html(community.resource_count || 0)} barang</span></div> <button type="button"${attr("disabled", loadingAction, true)}${attr_class(`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${community.is_joined ? "bg-surface-muted text-ink-secondary hover:bg-stone-200 border border-surface-border" : "bg-brand-500 hover:bg-brand-600 text-white"}`)}>`);
    if (community.is_joined) {
      $$renderer2.push("<!--[1-->");
      Check($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
      $$renderer2.push(`<!----> <span>JOINED</span>`);
    } else {
      $$renderer2.push(`<!--[-1--><span>JOIN</span>`);
    }
    $$renderer2.push(`<!--]--></button></div></div>`);
    bind_props($$props, { community, onUpdated });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let communities = [];
    let loading = true;
    async function loadMyCommunities() {
      loading = true;
      try {
        const res = await getMyCommunities();
        if (res.success && res.data) {
          communities = res.data;
        }
      } catch (err) {
        console.error("Failed to load my communities:", err);
      } finally {
        loading = false;
      }
    }
    let lastResidentId = "";
    if (store_get($$store_subs ??= {}, "$authState", authState).resident && store_get($$store_subs ??= {}, "$authState", authState).resident.id !== lastResidentId) {
      lastResidentId = store_get($$store_subs ??= {}, "$authState", authState).resident.id;
      loadMyCommunities();
    }
    $$renderer2.push(`<div class="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">`);
    Folder_heart($$renderer2, { class: "w-3.5 h-3.5 text-brand-500" });
    $$renderer2.push(`<!----> Keanggotaan Saya</div> <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">Komunitas Saya</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1">Daftar ruang komunitas di mana Anda telah terdaftar sebagai anggota atau administrator.</p></div> <div class="flex items-center gap-3 self-start sm:self-auto"><a href="/create-community" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95">`);
    Plus($$renderer2, { class: "w-4 h-4 stroke-[2.5]" });
    $$renderer2.push(`<!----> <span>Buat Komunitas Baru</span></a></div></div> `);
    if (loading) {
      $$renderer2.push(`<!--[0--><div class="py-24 text-center">`);
      Refresh_cw($$renderer2, { class: "w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" });
      $$renderer2.push(`<!----> <p class="text-xs font-semibold text-ink-secondary">Memuat komunitas yang Anda ikuti...</p></div>`);
    } else if (communities.length === 0) {
      $$renderer2.push("<!--[1-->");
      EmptyState($$renderer2, {
        title: "Belum Bergabung dengan Komunitas",
        description: "Anda belum bergabung dengan komunitas manapun. Temukan komunitas tetangga atau buat komunitas baru.",
        actionText: "Jelajahi Direktori Komunitas",
        actionHref: "/communities"
      });
    } else {
      $$renderer2.push(`<!--[-1--><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      const each_array = ensure_array_like(communities);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let comm = each_array[$$index];
        CommunityCard($$renderer2, { community: comm, onUpdated: loadMyCommunities });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
