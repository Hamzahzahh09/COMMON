import { d as attr, i as attr_class, e as escape_html, j as ensure_array_like } from "../../../chunks/index.js";
import { g as getItems } from "../../../chunks/items.api.js";
import { b as getAllCommunities } from "../../../chunks/communities.api.js";
import { R as ResourceCard, B as BorrowModal } from "../../../chunks/BorrowModal.js";
import "../../../chunks/Icon.js";
import { E as EmptyState } from "../../../chunks/EmptyState.js";
import { S as Sparkles } from "../../../chunks/sparkles.js";
import { S as Search } from "../../../chunks/search.js";
import { P as Package } from "../../../chunks/package.js";
import { U as Users } from "../../../chunks/users.js";
import { R as Refresh_cw } from "../../../chunks/refresh-cw.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let items = [];
    let communities = [];
    let activeTab = "resources";
    let loading = true;
    let searchQuery = "";
    let selectedCategory = "Semua";
    let onlyAvailable = false;
    let borrowingItem = null;
    const CATEGORIES = ["Semua", "Tools", "Home", "Events", "Outdoor", "Electronics"];
    async function loadData() {
      loading = true;
      try {
        if (activeTab === "resources") {
          const res = await getItems({
            category: selectedCategory,
            status: onlyAvailable ? "available" : void 0,
            search: searchQuery.trim() || void 0
          });
          if (res.success && res.data) {
            items = res.data;
          }
        }
      } catch (err) {
        console.error("Error loading discover data:", err);
      } finally {
        loading = false;
      }
    }
    if (selectedCategory || onlyAvailable !== void 0 || activeTab) {
      loadData();
    }
    $$renderer2.push(`<div class="space-y-8 animate-in fade-in duration-200"><div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">`);
    Sparkles($$renderer2, { class: "w-3.5 h-3.5 text-brand-500" });
    $$renderer2.push(`<!----> Eksplorasi Bersama</div> <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">Temukan Sumber Daya &amp; Komunitas</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1">Cari alat yang Anda perlukan di sekitar Anda, atau temukan komunitas berbagi untuk bergabung.</p></div> <div class="space-y-4"><div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"><form class="relative flex-1 max-w-lg">`);
    Search($$renderer2, {
      class: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
    });
    $$renderer2.push(`<!----> <input type="text"${attr("value", searchQuery)}${attr(
      "placeholder",
      "Cari bor, tangga, proyektor, tenda..."
    )} class="w-full pl-10 pr-24 py-2.5 rounded-2xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-white shadow-sm"/> <button type="submit" class="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors">Cari</button></form> <div class="inline-flex p-1 rounded-2xl bg-surface-muted border border-surface-border text-xs font-semibold self-start md:self-auto"><button type="button"${attr_class(`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${"bg-white text-ink-primary shadow-sm font-bold"}`)}>`);
    Package($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
    $$renderer2.push(`<!----> <span>Barang (${escape_html(items.length)})</span></button> <button type="button"${attr_class(`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${"text-ink-secondary hover:text-ink-primary"}`)}>`);
    Users($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
    $$renderer2.push(`<!----> <span>Komunitas (${escape_html(communities.length)})</span></button></div></div> `);
    {
      $$renderer2.push(`<!--[0--><div class="flex flex-wrap items-center justify-between gap-3 pt-2"><div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"><!--[-->`);
      const each_array = ensure_array_like(CATEGORIES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cat = each_array[$$index];
        $$renderer2.push(`<button type="button"${attr_class(`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-brand-500 text-white shadow-sm font-bold" : "bg-white border border-surface-border text-ink-secondary hover:bg-stone-50"}`)}>${escape_html(cat)}</button>`);
      }
      $$renderer2.push(`<!--]--></div> <label class="flex items-center gap-2 text-xs font-medium text-ink-secondary cursor-pointer select-none"><input type="checkbox"${attr("checked", onlyAvailable, true)} class="rounded border-surface-border text-brand-600 focus:ring-brand-500 w-4 h-4"/> <span>Hanya yang tersedia</span></label></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (loading) {
      $$renderer2.push(`<!--[0--><div class="py-20 text-center">`);
      Refresh_cw($$renderer2, { class: "w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" });
      $$renderer2.push(`<!----> <p class="text-xs font-semibold text-ink-secondary">Memuat data penjelajahan...</p></div>`);
    } else {
      $$renderer2.push("<!--[1-->");
      if (items.length === 0) {
        $$renderer2.push("<!--[0-->");
        EmptyState($$renderer2, {
          title: "Belum Ada Barang yang Cocok",
          description: "Tidak ditemukan barang dengan kata kunci atau filter ini. Coba sesuaikan kata kunci pencarian Anda.",
          actionText: "Reset Filter",
          onAction: () => {
            searchQuery = "";
            selectedCategory = "Semua";
            onlyAvailable = false;
          }
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
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    if (borrowingItem) {
      $$renderer2.push("<!--[0-->");
      BorrowModal($$renderer2, {
        item: borrowingItem,
        onClose: () => borrowingItem = null,
        onSuccess: loadData
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
