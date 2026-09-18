import { a as apiRequest } from "./client.js";
async function getAllCommunities(search) {
  const params = new URLSearchParams();
  params.append("all", "true");
  if (search && search.trim()) {
    params.append("search", search.trim());
  }
  return apiRequest(`/communities?${params.toString()}`);
}
async function getMyCommunities() {
  return apiRequest("/communities");
}
async function getCommunityBySlug(slug) {
  return apiRequest(`/communities/slug/${encodeURIComponent(slug)}`);
}
async function getCommunityMembers(communityId) {
  return apiRequest(`/communities/${communityId}/members`);
}
export {
  getCommunityMembers as a,
  getAllCommunities as b,
  getMyCommunities as c,
  getCommunityBySlug as g
};
