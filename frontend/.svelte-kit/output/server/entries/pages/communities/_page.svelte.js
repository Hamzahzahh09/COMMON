import { d as attr } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import "../../../chunks/Icon.js";
import { U as Users } from "../../../chunks/users.js";
import { P as Plus } from "../../../chunks/plus.js";
import { S as Search } from "../../../chunks/search.js";
import { R as Refresh_cw } from "../../../chunks/refresh-cw.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let searchQuery = "";
    $$renderer2.push(`<div class="space-y-8 animate-in fade-in duration-200"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">`);
    Users($$renderer2, { class: "w-3.5 h-3.5 text-brand-500" });
    $$renderer2.push(`<!----> Direktori Komunitas</div> <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">Komunitas Berbagi</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1">Temukan ruang berbagi di sekitar Anda atau ciptakan komunitas untuk kelompok Anda.</p></div> <a href="/create-community" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95 self-start sm:self-auto">`);
    Plus($$renderer2, { class: "w-4 h-4 stroke-[2.5]" });
    $$renderer2.push(`<!----> <span>Buat Komunitas</span></a></div> <form class="relative max-w-md">`);
    Search($$renderer2, {
      class: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
    });
    $$renderer2.push(`<!----> <input type="text"${attr("value", searchQuery)} placeholder="Cari komunitas (contoh: RT 05, Makers, Camping)..." class="w-full pl-10 pr-24 py-2.5 rounded-2xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-white shadow-sm"/> <button type="submit" class="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors">Cari</button></form> `);
    {
      $$renderer2.push(`<!--[0--><div class="py-20 text-center">`);
      Refresh_cw($$renderer2, { class: "w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" });
      $$renderer2.push(`<!----> <p class="text-xs font-semibold text-ink-secondary">Memuat daftar komunitas...</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
