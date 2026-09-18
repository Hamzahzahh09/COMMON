import { s as sanitize_props, a as spread_props, b as slot, h as fallback, e as escape_html, d as attr, f as bind_props } from "./index.js";
import { I as Icon } from "./Icon.js";
function Package_open($$renderer, $$props) {
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
    ["path", { "d": "M12 22v-9" }],
    [
      "path",
      {
        "d": "M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"
      }
    ],
    [
      "path",
      {
        "d": "M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"
      }
    ],
    [
      "path",
      {
        "d": "M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "package-open" },
    $$sanitized_props,
    {
      /**
       * @component @name PackageOpen
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjJ2LTkiIC8+CiAgPHBhdGggZD0iTTE1LjE3IDIuMjFhMS42NyAxLjY3IDAgMCAxIDEuNjMgMEwyMSA0LjU3YTEuOTMgMS45MyAwIDAgMSAwIDMuMzZMOC44MiAxNC43OWExLjY1NSAxLjY1NSAwIDAgMS0xLjY0IDBMMyAxMi40M2ExLjkzIDEuOTMgMCAwIDEgMC0zLjM2eiIgLz4KICA8cGF0aCBkPSJNMjAgMTN2My44N2EyLjA2IDIuMDYgMCAwIDEtMS4xMSAxLjgzbC02IDMuMDhhMS45MyAxLjkzIDAgMCAxLTEuNzggMGwtNi0zLjA4QTIuMDYgMi4wNiAwIDAgMSA0IDE2Ljg3VjEzIiAvPgogIDxwYXRoIGQ9Ik0yMSAxMi40M2ExLjkzIDEuOTMgMCAwIDAgMC0zLjM2TDguODMgMi4yYTEuNjQgMS42NCAwIDAgMC0xLjYzIDBMMyA0LjU3YTEuOTMgMS45MyAwIDAgMCAwIDMuMzZsMTIuMTggNi44NmExLjYzNiAxLjYzNiAwIDAgMCAxLjYzIDB6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/package-open
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
function EmptyState($$renderer, $$props) {
  let title = fallback($$props["title"], "Belum ada data");
  let description = fallback($$props["description"], "Data yang Anda cari belum tersedia saat ini.");
  let actionText = fallback($$props["actionText"], "");
  let actionHref = fallback($$props["actionHref"], "");
  let onAction = fallback($$props["onAction"], void 0);
  $$renderer.push(`<div class="py-14 px-6 text-center bg-white rounded-2xl border border-surface-border max-w-md mx-auto shadow-sm"><div class="w-12 h-12 rounded-full bg-[#E8EFEA] text-[#2F6B4F] flex items-center justify-center mx-auto mb-3.5"><!--[-->`);
  slot($$renderer, $$props, "icon", {}, () => {
    Package_open($$renderer, { class: "w-6 h-6 stroke-[1.75]" });
  });
  $$renderer.push(`<!--]--></div> <h3 class="font-bold text-base text-ink-primary tracking-tight">${escape_html(title)}</h3> <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed max-w-xs mx-auto">${escape_html(description)}</p> `);
  if (actionText) {
    $$renderer.push("<!--[0-->");
    if (actionHref) {
      $$renderer.push(`<!--[0--><a${attr("href", actionHref)} class="mt-5 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-colors">${escape_html(actionText)}</a>`);
    } else if (onAction) {
      $$renderer.push(`<!--[1--><button type="button" class="mt-5 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-colors">${escape_html(actionText)}</button>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]-->`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
  bind_props($$props, { title, description, actionText, actionHref, onAction });
}
export {
  EmptyState as E
};
