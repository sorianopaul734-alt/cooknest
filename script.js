// =====================================================
// REFERENCE FILE — not loaded by index.html or admin.html
// =====================================================
// Both HTML files are self-contained (all JS inline in <script> tags,
// matching their original structure) so they don't include this file
// via <script src>. This file mirrors the same API functions for your
// own reference, reuse in other tools, or future refactors.
// =====================================================

// ===================== CONFIG =====================
const API_URL = "https://cooknest-production.up.railway.app";
const K = { CU: 'cn_currentuser', TOKEN: 'cn_token' };

function load(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
function clear(k) { try { localStorage.removeItem(k) } catch {} }

let currentUser = load(K.CU, null);
let authToken = load(K.TOKEN, null);

// ===================== AUTH HELPERS =====================
function authHeaders() {
  return authToken ? { "Authorization": "Bearer " + authToken } : {};
}

function setSession(user, token) {
  currentUser = user;
  authToken = token;
  save(K.CU, user);
  save(K.TOKEN, token);
}

function clearSession() {
  currentUser = null;
  authToken = null;
  clear(K.CU);
  clear(K.TOKEN);
}

function isAdmin() {
  return currentUser && currentUser.role === 'admin';
}

// ===================== BACKEND CALLS =====================
async function fetchRecipes() {
  const res = await fetch(`${API_URL}/recipes`);
  if (!res.ok) throw new Error('Failed to load recipes');
  const data = await res.json();
  // MySQL DECIMAL columns come back as strings — normalize to numbers
  return data.map(r => ({ ...r, price: Number(r.price), rating: Number(r.rating), reviews: Number(r.reviews) }));
}

async function registerUser(fname, lname, email, password) {
  const name = `${fname} ${lname}`.trim();
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  setSession(data.user, data.token);
  return data;
}

async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || data.error || 'Login failed');
  setSession(data.user, data.token);
  return data;
}

function logoutUser() {
  clearSession();
}

async function placeOrderApi(items, total, payment_method) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ items, total, payment_method })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to place order');
  return data;
}

async function getMyOrders(user_id) {
  const res = await fetch(`${API_URL}/orders/${user_id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load orders');
  return await res.json();
}

async function postComment(recipe_id, text, rating) {
  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ recipe_id, text, rating })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to post comment');
  return data;
}

async function getComments(recipe_id) {
  const res = await fetch(`${API_URL}/comments/${recipe_id}`);
  if (!res.ok) throw new Error('Failed to load comments');
  return await res.json();
}

async function getFanFavId() {
  const res = await fetch(`${API_URL}/settings/fan-fav`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.fan_fav_id;
}

// ===================== ADMIN-ONLY CALLS =====================
async function adminGetAllUsers() {
  const res = await fetch(`${API_URL}/users`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load users');
  return await res.json();
}

async function adminGetAllOrders() {
  const res = await fetch(`${API_URL}/orders/all`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load orders');
  return await res.json();
}

async function adminUpdateOrderStatus(id, status) {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return await res.json();
}

async function adminGetAllComments() {
  const res = await fetch(`${API_URL}/comments`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load comments');
  return await res.json();
}

async function adminDeleteComment(id) {
  const res = await fetch(`${API_URL}/comments/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to delete comment');
  return await res.json();
}

async function adminCreateRecipe(recipe) {
  const res = await fetch(`${API_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(recipe)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create recipe');
  return data;
}

async function adminUpdateRecipe(id, recipe) {
  const res = await fetch(`${API_URL}/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(recipe)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update recipe');
  return data;
}

async function adminDeleteRecipe(id) {
  const res = await fetch(`${API_URL}/recipes/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to delete recipe');
  return await res.json();
}

async function adminSetFanFav(recipe_id) {
  const res = await fetch(`${API_URL}/settings/fan-fav`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ recipe_id })
  });
  if (!res.ok) throw new Error('Failed to update fan favourite');
  return await res.json();
}
