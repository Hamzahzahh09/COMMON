import { c as store_get, k as head, u as unsubscribe_stores } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { a as authState } from "../../../chunks/Icon.js";
import { S as Sparkles } from "../../../chunks/sparkles.js";
import { R as Refresh_cw } from "../../../chunks/refresh-cw.js";
import { P as Plus } from "../../../chunks/plus.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$authState", authState).resident?.id || store_get($$store_subs ??= {}, "$authState", authState).user?.id;
    head("1ilxnhi", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>I NEED ↔ I HAVE — Papan Kebutuhan Warga COMMON</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8 animate-in fade-in duration-200 max-w-7xl mx-auto"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">`);
    Sparkles($$renderer2, { class: "w-3.5 h-3.5 text-emerald-600" });
    $$renderer2.push(`<!----> I NEED ↔ I HAVE Mechanism</div> <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">Papan Kebutuhan Warga</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-2xl leading-relaxed">Butuh alat yang belum ada di katalog? Tulis di sini. Tetangga yang memiliki alatnya dapat langsung menawarkan bantuan lewat <strong>"I HAVE"</strong>.</p></div> <div class="flex items-center gap-3"><button type="button" class="p-2.5 rounded-xl border border-surface-border hover:bg-surface-muted text-ink-secondary transition-colors" title="Segarkan">`);
    Refresh_cw($$renderer2, { class: `w-4 h-4 ${"animate-spin"}` });
    $$renderer2.push(`<!----></button> <button type="button" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95">`);
    Plus($$renderer2, { class: "w-4 h-4 stroke-[2.5]" });
    $$renderer2.push(`<!----> <span>Post Kebutuhan Baru</span></button></div></div> `);
    {
      $$renderer2.push(`<!--[0--><div class="py-24 text-center">`);
      Refresh_cw($$renderer2, { class: "w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" });
      $$renderer2.push(`<!----> <p class="text-xs font-semibold text-ink-secondary">Memuat papan kebutuhan warga...</p></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
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
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
