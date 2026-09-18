import { s as sanitize_props, a as spread_props, b as slot, c as store_get, e as escape_html, d as attr, u as unsubscribe_stores, f as bind_props, h as fallback, i as attr_class, j as ensure_array_like } from "../../chunks/index.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { I as Icon, i as isAuthenticated, a as authState, t as toast } from "../../chunks/Icon.js";
import { g as getIncomingRequests } from "../../chunks/borrowing.api.js";
import { s as savedItems } from "../../chunks/saved.js";
import { C as Compass } from "../../chunks/compass.js";
import { U as Users } from "../../chunks/users.js";
import { B as Bookmark } from "../../chunks/bookmark.js";
import { M as Message_square } from "../../chunks/message-square.js";
import { I as Inbox } from "../../chunks/inbox.js";
import { P as Plus } from "../../chunks/plus.js";
import { S as Shield_check } from "../../chunks/shield-check.js";
import { p as page } from "../../chunks/stores.js";
import { H as House } from "../../chunks/house.js";
import { C as Clock } from "../../chunks/clock.js";
import { U as User } from "../../chunks/x.js";
import { H as Heart_handshake } from "../../chunks/heart-handshake.js";
import { S as ShareResourceModal } from "../../chunks/ShareResourceModal.js";
function goto(url, opts = {}) {
  {
    throw new Error("Cannot call goto(...) on the server");
  }
}
function Chevron_down($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-down" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiA5IDYgNiA2LTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chevron-down
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
function Circle_help($$renderer, $$props) {
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
    ["path", { "d": "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-help" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleHelp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNOS4wOSA5YTMgMyAwIDAgMSA1LjgzIDFjMCAyLTMgMy0zIDMiIC8+CiAgPHBhdGggZD0iTTEyIDE3aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/circle-help
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
function Layout_dashboard($$renderer, $$props) {
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
      "rect",
      { "width": "7", "height": "9", "x": "3", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "5", "x": "14", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "9", "x": "14", "y": "12", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "5", "x": "3", "y": "16", "rx": "1" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "layout-dashboard" },
    $$sanitized_props,
    {
      /**
       * @component @name LayoutDashboard
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI5IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIxNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-dashboard
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
function Menu($$renderer, $$props) {
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
    ["line", { "x1": "4", "x2": "20", "y1": "12", "y2": "12" }],
    ["line", { "x1": "4", "x2": "20", "y1": "6", "y2": "6" }],
    ["line", { "x1": "4", "x2": "20", "y1": "18", "y2": "18" }]
  ];
  Icon($$renderer, spread_props([
    { name: "menu" },
    $$sanitized_props,
    {
      /**
       * @component @name Menu
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iMTIiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iNiIgeTI9IjYiIC8+CiAgPGxpbmUgeDE9IjQiIHgyPSIyMCIgeTE9IjE4IiB5Mj0iMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/menu
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
function Navbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let savedCount;
    let onOpenShare = fallback($$props["onOpenShare"], () => {
    });
    let pendingIncomingCount = 0;
    async function checkIncomingCount() {
      if (!store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) return;
      try {
        const res = await getIncomingRequests();
        if (res.success && res.data) {
          pendingIncomingCount = res.data.filter((r) => r.status === "pending").length;
        }
      } catch {
      }
    }
    let lastResidentId = "";
    savedCount = store_get($$store_subs ??= {}, "$savedItems", savedItems).length;
    if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && store_get($$store_subs ??= {}, "$authState", authState).resident && store_get($$store_subs ??= {}, "$authState", authState).resident.id !== lastResidentId) {
      lastResidentId = store_get($$store_subs ??= {}, "$authState", authState).resident.id;
      checkIncomingCount();
    }
    $$renderer2.push(`<header class="sticky top-0 z-40 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-surface-border"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><div class="flex items-center gap-6 lg:gap-8"><a href="/" class="flex items-center gap-2.5 group"><div class="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-brand-600 transition-colors">C</div> <div><div class="font-extrabold text-base tracking-tight text-ink-primary flex items-center gap-1.5">COMMON <span class="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8EFEA] text-[#1E4432] border border-[#C8DCD0]">Access Together</span></div></div></a> <nav class="hidden md:flex items-center gap-1 text-xs font-semibold text-ink-secondary"><a href="/discover" class="px-3 py-2 rounded-xl hover:text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-1.5">`);
    Compass($$renderer2, { class: "w-4 h-4 text-stone-400" });
    $$renderer2.push(`<!----> <span>Discover</span></a> <a href="/communities" class="px-3 py-2 rounded-xl hover:text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-1.5">`);
    Users($$renderer2, { class: "w-4 h-4 text-stone-400" });
    $$renderer2.push(`<!----> <span>Communities</span></a> <a href="/#how-it-works" class="px-3 py-2 rounded-xl hover:text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-1.5">`);
    Circle_help($$renderer2, { class: "w-4 h-4 text-stone-400" });
    $$renderer2.push(`<!----> <span>How it works</span></a> `);
    if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
      $$renderer2.push(`<!--[0--><a href="/dashboard" class="px-3 py-2 rounded-xl hover:text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-1.5 font-bold text-brand-700">`);
      Layout_dashboard($$renderer2, { class: "w-4 h-4 text-brand-600" });
      $$renderer2.push(`<!----> <span>Dashboard</span></a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></nav></div> <div class="flex items-center gap-2 sm:gap-2.5">`);
    if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
      $$renderer2.push(`<!--[0--><a href="/saved" class="p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors relative" title="Barang Tersimpan" aria-label="Barang Tersimpan">`);
      Bookmark($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> `);
      if (savedCount > 0) {
        $$renderer2.push(`<!--[0--><span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">${escape_html(savedCount)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></a> <a href="/messages" class="p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors relative" title="Pesan &amp; Koordinasi" aria-label="Pesan &amp; Koordinasi">`);
      Message_square($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></a> <a href="/incoming" class="p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors relative" title="Permintaan Masuk" aria-label="Permintaan Masuk">`);
      Inbox($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> `);
      if (pendingIncomingCount > 0) {
        $$renderer2.push(`<!--[0--><span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">${escape_html(pendingIncomingCount)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></a> <button type="button" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-all active:scale-95">`);
      Plus($$renderer2, { class: "w-4 h-4 stroke-[2.5]" });
      $$renderer2.push(`<!----> <span>Share Resource</span></button> <div class="relative"><button type="button" class="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-surface-border hover:border-stone-300 bg-white hover:bg-stone-50 transition-colors text-left shadow-sm" aria-label="Menu akun warga"><img${attr("src", store_get($$store_subs ??= {}, "$authState", authState).resident?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")}${attr("alt", store_get($$store_subs ??= {}, "$authState", authState).resident?.name || "User")} class="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-500/20"/> <div class="hidden lg:block"><div class="text-[11px] font-bold text-ink-primary flex items-center gap-1 leading-tight">${escape_html(store_get($$store_subs ??= {}, "$authState", authState).resident?.name || "Warga")} `);
      if (store_get($$store_subs ??= {}, "$authState", authState).resident?.role?.includes("Admin")) {
        $$renderer2.push("<!--[0-->");
        Shield_check($$renderer2, { class: "w-3 h-3 text-brand-600" });
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="text-[10px] text-ink-muted leading-tight">Menu Warga</div></div> `);
      Chevron_down($$renderer2, { class: "w-3.5 h-3.5 text-stone-400" });
      $$renderer2.push(`<!----></button> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push(`<!--[-1--><a href="/discover" class="px-3.5 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors hidden sm:block">Discover resources</a> <a href="/login" class="px-3.5 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors">Sign in</a> <a href="/login" class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-all active:scale-95">Join COMMON</a>`);
    }
    $$renderer2.push(`<!--]--> <button type="button" class="md:hidden p-2 rounded-xl text-ink-secondary hover:bg-surface-muted transition-colors" aria-label="Toggle navigation menu">`);
    {
      $$renderer2.push("<!--[-1-->");
      Menu($$renderer2, { class: "w-5 h-5" });
    }
    $$renderer2.push(`<!--]--></button></div></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></header>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { onOpenShare });
  });
}
function MobileNav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentPath;
    let onOpenShare = fallback($$props["onOpenShare"], () => {
    });
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    $$renderer2.push(`<div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-surface-border px-3 py-2 flex items-center justify-around shadow-lg"><a href="/"${attr_class(`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${currentPath === "/" ? "text-brand-600 font-bold" : "text-ink-muted hover:text-ink-primary"}`)}>`);
    House($$renderer2, { class: "w-4 h-4 stroke-[2]" });
    $$renderer2.push(`<!----> <span>Home</span></a> <a href="/discover"${attr_class(`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${currentPath.startsWith("/discover") ? "text-brand-600 font-bold" : "text-ink-muted hover:text-ink-primary"}`)}>`);
    Compass($$renderer2, { class: "w-4 h-4 stroke-[2]" });
    $$renderer2.push(`<!----> <span>Discover</span></a> `);
    if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
      $$renderer2.push(`<!--[0--><button type="button" class="w-10 h-10 -mt-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-900/20 active:scale-95 transition-all" aria-label="Share a Resource">`);
      Plus($$renderer2, { class: "w-5 h-5 stroke-[2.5]" });
      $$renderer2.push(`<!----></button> <a href="/communities"${attr_class(`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${currentPath.startsWith("/communities") || currentPath.startsWith("/c/") ? "text-brand-600 font-bold" : "text-ink-muted hover:text-ink-primary"}`)}>`);
      Users($$renderer2, { class: "w-4 h-4 stroke-[2]" });
      $$renderer2.push(`<!----> <span>Komunitas</span></a> <a href="/requests"${attr_class(`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${currentPath.startsWith("/requests") ? "text-brand-600 font-bold" : "text-ink-muted hover:text-ink-primary"}`)}>`);
      Clock($$renderer2, { class: "w-4 h-4 stroke-[2]" });
      $$renderer2.push(`<!----> <span>Requests</span></a>`);
    } else {
      $$renderer2.push(`<!--[-1--><a href="/communities"${attr_class(`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${currentPath.startsWith("/communities") || currentPath.startsWith("/c/") ? "text-brand-600 font-bold" : "text-ink-muted hover:text-ink-primary"}`)}>`);
      Users($$renderer2, { class: "w-4 h-4 stroke-[2]" });
      $$renderer2.push(`<!----> <span>Komunitas</span></a> <a href="/login"${attr_class(`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${currentPath.startsWith("/login") ? "text-brand-600 font-bold" : "text-ink-muted hover:text-ink-primary"}`)}>`);
      User($$renderer2, { class: "w-4 h-4 stroke-[2]" });
      $$renderer2.push(`<!----> <span>Sign in</span></a>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { onOpenShare });
  });
}
function Footer($$renderer) {
  $$renderer.push(`<footer class="border-t border-surface-border bg-white mt-auto"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"><div class="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12"><div class="md:col-span-2 space-y-4"><a href="/" class="flex items-center gap-2.5 group inline-block"><div class="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:bg-brand-600 transition-colors">C</div> <span class="font-extrabold text-lg tracking-tight text-ink-primary">COMMON</span></a> <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-sm">Shared infrastructure for real communities. Akses alat dan perlengkapan fisik yang sudah ada di sekitar Anda tanpa harus membeli semuanya.</p> <div class="pt-2 flex items-center gap-2 text-xs font-semibold text-brand-700">`);
  Heart_handshake($$renderer, { class: "w-4 h-4 text-brand-500" });
  $$renderer.push(`<!----> <span>Access over ownership.</span></div></div> <div class="space-y-3"><h4 class="text-[11px] font-bold uppercase tracking-wider text-ink-primary">Explore</h4> <ul class="space-y-2.5 text-xs text-ink-secondary"><li><a href="/discover" class="hover:text-ink-primary transition-colors">Discover</a></li> <li><a href="/discover" class="hover:text-ink-primary transition-colors">Resources</a></li> <li><a href="/needs" class="hover:text-ink-primary transition-colors">Requests Board</a></li></ul></div> <div class="space-y-3"><h4 class="text-[11px] font-bold uppercase tracking-wider text-ink-primary">Community</h4> <ul class="space-y-2.5 text-xs text-ink-secondary"><li><a href="/communities" class="hover:text-ink-primary transition-colors">Join a Community</a></li> <li><a href="/create-community" class="hover:text-ink-primary transition-colors">Create a Community</a></li> <li><a href="/#trust-safety" class="hover:text-ink-primary transition-colors">Community Guidelines</a></li> <li><a href="/#trust-safety" class="hover:text-ink-primary transition-colors">Trust &amp; Safety</a></li></ul></div> <div class="space-y-3"><h4 class="text-[11px] font-bold uppercase tracking-wider text-ink-primary">About</h4> <ul class="space-y-2.5 text-xs text-ink-secondary"><li><a href="/#why-common" class="hover:text-ink-primary transition-colors">Our Mission</a></li> <li><a href="/#how-it-works" class="hover:text-ink-primary transition-colors">How It Works</a></li> <li><a href="/#why-common" class="hover:text-ink-primary transition-colors">Community Principles</a></li></ul></div></div> <div class="mt-12 pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted"><div class="flex items-center gap-2"><span class="font-medium text-ink-secondary">© 2026 COMMON</span> <span>•</span> <span class="italic text-ink-secondary">"Access over ownership."</span></div> <div class="text-center sm:text-right font-medium text-ink-secondary">Share more. Own less. Access together.</div></div></div></footer>`);
}
function ToastContainer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toast", toast));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let t = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all duration-200 transform translate-y-0 ${t.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : ""} ${t.type === "error" ? "bg-rose-50 border-rose-200 text-rose-900" : ""} ${t.type === "info" ? "bg-slate-900 border-slate-800 text-white" : ""}`)}><div class="flex-1 font-medium">${escape_html(t.message)}</div> <button type="button" class="opacity-60 hover:opacity-100 transition-opacity ml-2 text-base font-bold leading-none">×</button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let showShareModal = false;
    function handleOpenShare() {
      if (!store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
        toast.info("Silakan masuk terlebih dahulu untuk membagikan barang ke komunitas.");
        goto();
        return;
      }
      showShareModal = true;
    }
    function handleResourceShared(_itemId) {
      window.dispatchEvent(new CustomEvent("resource-added"));
    }
    $$renderer2.push(`<div class="min-h-screen flex flex-col bg-[#F7F6F2] text-[#1C1C1A]">`);
    Navbar($$renderer2, { onOpenShare: handleOpenShare });
    $$renderer2.push(`<!----> <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12"><!--[-->`);
    slot($$renderer2, $$props, "default", {}, null);
    $$renderer2.push(`<!--]--></main> `);
    Footer($$renderer2);
    $$renderer2.push(`<!----> `);
    MobileNav($$renderer2, { onOpenShare: handleOpenShare });
    $$renderer2.push(`<!----> `);
    ToastContainer($$renderer2);
    $$renderer2.push(`<!----> `);
    if (showShareModal) {
      $$renderer2.push("<!--[0-->");
      ShareResourceModal($$renderer2, {
        onClose: () => showShareModal = false,
        onSuccess: handleResourceShared
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
