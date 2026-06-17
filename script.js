// ===================== CONFIG =====================
const API_URL = "https://cooknest-production.up.railway.app";
const K = { W:'cn_wish', FF:'cn_fanfav', CU:'cn_currentuser' };

function load(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}

let wishlist = load(K.W, []);
let fanFavId = load(K.FF, 3);
let currentUser = load(K.CU, null);

let recipes = [];
let cart = [];
let orders = [];
let comments = {};

// ===================== BACKEND CALLS =====================
async function fetchRecipes() {
  const res = await fetch(`${API_URL}/recipes`);
  return await res.json();
}

async function registerUser(fname, lname, email, password) {
  const name = `${fname} ${lname}`;
  const res = await fetch(`${API_URL}/users/register`, {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ name, email, password })
  });
  return await res.json();
}

async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ email, password })
  });
  return await res.json();
}

async function placeOrder(order) {
  const res = await fetch(`${API_URL}/orders`, {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(order)
  });
  return await res.json();
}

async function getOrders(user_id) {
  const res = await fetch(`${API_URL}/orders/${user_id}`);
  return await res.json();
}

async function addToCart(user_id, recipe_id, qty) {
  const res = await fetch(`${API_URL}/cart`, {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ user_id, recipe_id, qty })
  });
  return await res.json();
}

async function getCart(user_id) {
  const res = await fetch(`${API_URL}/cart/${user_id}`);
  return await res.json();
}

async function postComment(recipe_id, user_id, text, rating) {
  const res = await fetch(`${API_URL}/comments`, {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ recipe_id, user_id, text, rating })
  });
  return await res.json();
}

async function getComments(recipe_id) {
  const res = await fetch(`${API_URL}/comments/${recipe_id}`);
  return await res.json();
}

// ===================== UI LOGIC =====================
let currentFilter = 'All';
let currentSort = 'default';
let activeRecipe = null;

function renderFilters() {
  const cats = ['All', ...new Set(recipes.map(r => r.cat))];
  document.getElementById('filter-pills').innerHTML = cats.map(c =>
    `<button class="filter-pill${c===currentFilter?' active':''}" onclick="setFilter('${c}')">${c}</button>`
  ).join('');
}

function setFilter(f){currentFilter=f;renderFilters();renderGrid()}

function getFiltered() {
  const q=document.getElementById('search-input').value.toLowerCase().trim();
  let r=[...recipes];
  if(currentFilter!=='All')r=r.filter(x=>x.cat===currentFilter);
  if(q)r=r.filter(x=>x.title.toLowerCase().includes(q)||x.cat.toLowerCase().includes(q)||x.description.toLowerCase().includes(q));
  if(currentSort==='rating')r.sort((a,b)=>b.rating-a.rating);
  else if(currentSort==='name')r.sort((a,b)=>a.title.localeCompare(b.title));
  else if(currentSort==='price-asc')r.sort((a,b)=>a.price-b.price);
  else if(currentSort==='price-desc')r.sort((a,b)=>b.price-a.price);
  return r;
}

function renderGrid() {
  const r=getFiltered();
  document.getElementById('grid-count').textContent=r.length+' recipe'+(r.length!==1?'s':'');
  if(!r.length){
    document.getElementById('recipe-grid').innerHTML='<div>No recipes found</div>';
    return;
  }
  document.getElementById('recipe-grid').innerHTML=r.map(rec=>`
    <div class="recipe-card" onclick="openRecipe(${rec.id})">
      <div class="recipe-card-thumb">${rec.emoji||'🍴'}
        <button class="recipe-card-wish${wishlist.includes(rec.id)?' wishlisted':''}" onclick="event.stopPropagation();toggleWishId(${rec.id})">${wishlist.includes(rec.id)?'♥':'♡'}</button>
      </div>
      <div class="recipe-card-body">
        <div class="recipe-card-cat">${rec.cat}</div>
        <div class="recipe-card-title">${rec.title}</div>
        <div class="recipe-card-desc">${rec.description}</div>
        <div class="recipe-card-foot">
          <div class="stars-row">★${rec.rating} (${rec.reviews})</div>
          <div class="recipe-card-price-wrap">
            <span class="recipe-card-price">₱${rec.price}</span>
            <button class="btn-add-card" onclick="event.stopPropagation();addToCart(currentUser.id, ${rec.id}, 1)">+ Cart</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ===================== MODAL =====================
async function openRecipe(id){
  const r=recipes.find(x=>x.id===id);
  if(!r)return;
  activeRecipe=r;
  document.getElementById('modal-title').textContent=r.title;
  document.getElementById('m-cat').textContent=r.cat;
  document.getElementById('m-price').textContent='₱'+r.price;
  document.getElementById('m-thumb').innerHTML=`<div>${r.emoji||'🍴'} ★${r.rating}</div>`;
  document.getElementById('m-ing').innerHTML=r.ing.map(i=>`<div>${i}</div>`).join('');
  document.getElementById('m-steps').innerHTML=r.steps.map((s,i)=>`<div>${i+1}. ${s}</div>`).join('');
  const wb=document.getElementById('btn-wish-big');
  const w=wishlist.includes(id);
  wb.textContent=w?'♥':'♡';
  wb.classList.toggle('wishlisted',w);
  const comm=await getComments(id);
  renderModalComments(comm);
  document.getElementById('recipe-overlay').classList.add('open');
}

function renderModalComments(list){
  const el=document.getElementById('m-comments');
  el.innerHTML=list.length
    ?list.map(c=>`<div><b>${c.user_id||c.name}</b>: ${c.text}</div>`).join('')
    :'<div>No reviews yet</div>';
}

// ===================== WISHLIST =====================
function toggleWishId(id){
  const i=wishlist.indexOf(id);
  i===-1?wishlist.push(id):wishlist.splice(i,1);
  save(K.W,wishlist);
  renderGrid();
}

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", async () => {
  recipes = await fetchRecipes();
  renderFilters();
  renderGrid();
  renderHeroFanFav();
});
