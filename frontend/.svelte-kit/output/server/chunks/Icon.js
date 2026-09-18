import { w as writable, d as derived } from "./index2.js";
import { createClient } from "@supabase/supabase-js";
import { s as sanitize_props, ai as rest_props, h as fallback, aj as attributes, ah as clsx, j as ensure_array_like, ak as element, b as slot, f as bind_props } from "./index.js";
const PUBLIC_SUPABASE_URL = "https://llsubmizttyjfakgedwp.supabase.co";
const PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3VibWl6dHR5amZha2dlZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NzA2NzAsImV4cCI6MjEwNDA0NjY3MH0.h17u3vDWzo3I4m3iWDu765GiKwlfhr4SpLSxHoaoc0Q";
const PUBLIC_API_BASE_URL = "http://127.0.0.1:8787/api/v1";
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;
createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
function createToastStore() {
  const { subscribe, update } = writable([]);
  function show(message, type = "info", duration = 4e3) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast2 = { id, type, message, duration };
    update((all) => [...all, toast2]);
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }
  function dismiss(id) {
    update((all) => all.filter((t) => t.id !== id));
  }
  return {
    subscribe,
    show,
    success: (msg, duration) => show(msg, "success", duration),
    error: (msg, duration) => show(msg, "error", duration),
    info: (msg, duration) => show(msg, "info", duration),
    dismiss
  };
}
const toast = createToastStore();
const DEMO_RESIDENTS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Pak Budi Santoso",
    email: "budi@rt05.commons.id",
    role: "Ketua RT (Admin)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    desc: "Pemilik Tangga Teleskopik & Mesin Rumput"
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Ibu Siti Rahma",
    email: "siti@rt05.commons.id",
    role: "Warga",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    desc: "Pemilik Vacuum Cleaner & Steamer Baju"
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Arif Hidayat",
    email: "arif@rt05.commons.id",
    role: "Warga",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    desc: "Pemilik Bor Listrik Bosch & Jigsaw"
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Dian Prasetyo",
    email: "dian@rt05.commons.id",
    role: "Warga",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    desc: "Pemilik Portable Power Station 600W"
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "Hendra Wijaya",
    email: "hendra@rt05.commons.id",
    role: "Warga",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
    desc: "Pemilik Tenda Camping & Cooler Box"
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    name: "Maya Indah",
    email: "maya@rt05.commons.id",
    role: "Warga",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    desc: "Pemilik Meja Lipat & Kompor Gas Portable"
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    name: "Rizky Pratama",
    email: "rizky@rt05.commons.id",
    role: "Warga",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    desc: "Pemilik Toolbox 120 Pcs & Steam Washer"
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    name: "Dewi Lestari",
    email: "dewi@rt05.commons.id",
    role: "Warga",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    desc: "Pemilik Proyektor Bioskop & Speaker JBL"
  }
];
const activeCommunity = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "RT 05 Commons",
  slug: "rt-05-commons",
  location: "Komp. Griya Harmoni, Jakarta Selatan"
};
const REGISTERED_USERS_KEY = "common_registered_users_v1";
const ACTIVE_RESIDENT_KEY = "common_active_resident";
function getRegisteredUsers() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function getAllResidents() {
  const customUsers = getRegisteredUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    desc: u.desc
  }));
  return [...DEMO_RESIDENTS, ...customUsers];
}
function getInitialResident() {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(ACTIVE_RESIDENT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const all = getAllResidents();
        const matched = all.find((r) => r.id === parsed.id || r.email === parsed.email);
        if (matched) return matched;
        return parsed;
      }
    } catch {
    }
  }
  return null;
}
const authState = writable({
  user: null,
  session: null,
  resident: getInitialResident(),
  loading: false,
  community: activeCommunity
});
const isAuthenticated = derived(
  authState,
  ($s) => Boolean($s.user || $s.resident)
);
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
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  $$renderer.component(($$renderer2) => {
    let name = fallback($$props["name"], void 0);
    let color = fallback($$props["color"], "currentColor");
    let size = fallback($$props["size"], 24);
    let strokeWidth = fallback($$props["strokeWidth"], 2);
    let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
    let iconNode = fallback($$props["iconNode"], () => [], true);
    const mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && array.indexOf(className) === index;
    }).join(" ");
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...$$restProps,
        width: size,
        height: size,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        class: clsx(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    slot($$renderer2, $$props, "default", {}, null);
    $$renderer2.push(`<!--]--></svg>`);
    bind_props($$props, {
      name,
      color,
      size,
      strokeWidth,
      absoluteStrokeWidth,
      iconNode
    });
  });
}
export {
  DEMO_RESIDENTS as D,
  Icon as I,
  PUBLIC_API_BASE_URL as P,
  authState as a,
  isAuthenticated as i,
  toast as t
};
