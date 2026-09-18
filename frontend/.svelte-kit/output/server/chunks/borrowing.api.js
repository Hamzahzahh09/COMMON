import { a as apiRequest } from "./client.js";
async function getMyRequests() {
  return apiRequest("/borrowing-requests/me");
}
async function getIncomingRequests() {
  return apiRequest("/borrowing-requests/incoming");
}
export {
  getMyRequests as a,
  getIncomingRequests as g
};
