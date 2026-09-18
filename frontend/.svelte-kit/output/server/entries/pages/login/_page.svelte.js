import { s as sanitize_props, a as spread_props, b as slot, k as head, i as attr_class, d as attr, e as escape_html } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { H as Heart_handshake } from "../../../chunks/heart-handshake.js";
import { A as Arrow_right } from "../../../chunks/arrow-right.js";
import { H as House } from "../../../chunks/house.js";
function Eye($$renderer, $$props) {
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
        "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "eye" },
    $$sanitized_props,
    {
      /**
       * @component @name Eye
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
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
function Lock($$renderer, $$props) {
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
      {
        "width": "18",
        "height": "11",
        "x": "3",
        "y": "11",
        "rx": "2",
        "ry": "2"
      }
    ],
    ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "lock" },
    $$sanitized_props,
    {
      /**
       * @component @name Lock
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTEiIHg9IjMiIHk9IjExIiByeD0iMiIgcnk9IjIiIC8+CiAgPHBhdGggZD0iTTcgMTFWN2E1IDUgMCAwIDEgMTAgMHY0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/lock
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
function Mail($$renderer, $$props) {
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
      { "width": "20", "height": "16", "x": "2", "y": "4", "rx": "2" }
    ],
    ["path", { "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "mail" },
    $$sanitized_props,
    {
      /**
       * @component @name Mail
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHg9IjIiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Im0yMiA3LTguOTcgNS43YTEuOTQgMS45NCAwIDAgMS0yLjA2IDBMMiA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/mail
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let password = "";
    let rememberMe = true;
    let loading = false;
    let oauthLoading = false;
    head("1x05zx6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html("Sign in")} — COMMON</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-[#F7F6F2] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8"><div class="max-w-md w-full mx-auto space-y-7"><div class="text-center space-y-2.5"><a href="/" class="inline-flex items-center gap-2 group"><div class="w-12 h-12 rounded-2xl bg-[#2F6B4F] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">`);
    Heart_handshake($$renderer2, { class: "w-7 h-7" });
    $$renderer2.push(`<!----></div></a> <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C1C1A] tracking-tight">Selamat Datang di COMMON</h1> <p class="text-xs sm:text-sm text-[#736B5E] max-w-sm mx-auto leading-relaxed">Akses infrastruktur bersama untuk warga lingkungan. Pinjam alat berkualitas tanpa harus membeli sendiri.</p></div> <div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 shadow-sm"><div class="flex rounded-xl bg-[#F7F6F2] p-1 mb-6 border border-[#E5E0D8]"><button type="button"${attr_class(`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${"bg-white text-[#1C1C1A] shadow-sm font-bold"}`)}>Sign In</button> <button type="button"${attr_class(`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${"text-[#736B5E] hover:text-[#1C1C1A]"}`)}>Sign Up</button></div> <button type="button"${attr("disabled", loading, true)} class="w-full py-2.5 px-4 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#F7F6F2] hover:border-[#D5CFBF] text-[#1C1C1A] text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">`);
    {
      $$renderer2.push(`<!--[-1--><svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path></svg> <span>Continue with Google</span>`);
    }
    $$renderer2.push(`<!--]--></button> <div class="relative my-6 text-center"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-[#E5E0D8]"></div></div> <span class="relative bg-white px-3 text-xs text-[#736B5E] font-medium uppercase tracking-wider">or</span></div> `);
    {
      $$renderer2.push(`<!--[0--><form class="space-y-4"><div><label for="signin-email" class="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Email address</label> <div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B5E]">`);
      Mail($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></div> <input id="signin-email" type="email"${attr("value", email)} placeholder="nama@email.com" required="" autocomplete="email"${attr("disabled", loading, true)} class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] text-sm text-[#1C1C1A] placeholder-[#736B5E] focus:outline-none focus:border-[#2F6B4F] focus:bg-white transition-colors disabled:opacity-60"/></div></div> <div><label for="signin-password" class="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Password</label> <div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B5E]">`);
      Lock($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></div> <input id="signin-password"${attr("type", "password")}${attr("value", password)} placeholder="Masukkan kata sandi" required="" autocomplete="current-password"${attr("disabled", loading, true)} class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] text-sm text-[#1C1C1A] placeholder-[#736B5E] focus:outline-none focus:border-[#2F6B4F] focus:bg-white transition-colors disabled:opacity-60"/> <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#736B5E] hover:text-[#1C1C1A] focus:outline-none"${attr("aria-label", "Tampilkan kata sandi")}>`);
      {
        $$renderer2.push("<!--[-1-->");
        Eye($$renderer2, { class: "w-4 h-4" });
      }
      $$renderer2.push(`<!--]--></button></div></div> <div class="flex items-center justify-between pt-0.5 text-xs"><label class="inline-flex items-center gap-2 cursor-pointer select-none"><input type="checkbox"${attr("checked", rememberMe, true)} class="w-4 h-4 rounded border-[#E5E0D8] text-[#2F6B4F] focus:ring-[#2F6B4F] accent-[#2F6B4F]"/> <span class="text-[#736B5E] hover:text-[#1C1C1A]">Ingat saya</span></label> <button type="button" class="text-[#2F6B4F] hover:underline font-semibold focus:outline-none">Lupa password?</button></div> <button type="submit"${attr("disabled", oauthLoading, true)} class="w-full mt-2 py-3 px-4 rounded-xl bg-[#2F6B4F] hover:bg-[#25563F] text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 active:scale-[0.99]">`);
      {
        $$renderer2.push(`<!--[-1--><span>Sign in</span> `);
        Arrow_right($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!---->`);
      }
      $$renderer2.push(`<!--]--></button></form> <div class="text-center pt-5 border-t border-[#E5E0D8] mt-6"><p class="text-xs text-[#736B5E]">Belum punya akun? <button type="button" class="text-[#2F6B4F] hover:underline font-semibold ml-1 focus:outline-none">Sign up di sini</button></p></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="mt-6 pt-5 border-t border-[#E5E0D8]"><div class="text-[10px] font-bold text-[#736B5E] uppercase tracking-wider mb-2.5 text-center">Atau Masuk Cepat sebagai Warga RT 05:</div> <div class="grid grid-cols-2 gap-2"><button type="button" class="p-2.5 rounded-xl bg-[#F7F6F2] hover:bg-[#EAE6DF] text-xs font-semibold text-[#1C1C1A] text-left border border-[#E5E0D8] transition-colors flex items-center gap-2"><span class="text-sm">👨‍💼</span> <div class="truncate"><div class="font-bold truncate">Pak Budi</div> <div class="text-[10px] text-[#736B5E]">Ketua RT (Admin)</div></div></button> <button type="button" class="p-2.5 rounded-xl bg-[#F7F6F2] hover:bg-[#EAE6DF] text-xs font-semibold text-[#1C1C1A] text-left border border-[#E5E0D8] transition-colors flex items-center gap-2"><span class="text-sm">👩‍🍳</span> <div class="truncate"><div class="font-bold truncate">Ibu Siti</div> <div class="text-[10px] text-[#736B5E]">Warga RT 05</div></div></button></div></div></div> <div class="text-center"><a href="/" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#736B5E] hover:text-[#1C1C1A] transition-colors">`);
    House($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> Kembali ke Beranda COMMON</a></div></div></div>`);
  });
}
export {
  _page as default
};
