import { a as apiRequest } from "./client.js";
async function getItems(filters = {}) {
  const params = new URLSearchParams();
  if (filters.community_id) params.append("community_id", filters.community_id);
  if (filters.category && filters.category !== "Semua") params.append("category", filters.category);
  if (filters.ownership_type && filters.ownership_type !== "Semua") params.append("ownership_type", filters.ownership_type);
  if (filters.status) params.append("status", filters.status);
  if (filters.search && filters.search.trim()) params.append("search", filters.search.trim());
  if (filters.owner_id) params.append("owner_id", filters.owner_id);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/items${query}`);
}
export {
  getItems as g
};
