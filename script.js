/* ── DATA ──────────────────────────────────────── */
const K={R:'cn_recipes',C:'cn_cart',O:'cn_orders',W:'cn_wish',CM:'cn_comments',FF:'cn_fanfav',US:'cn_users',CU:'cn_currentuser'};
const DEFAULTS=[
  {id:1,title:'Spaghetti Bolognese',cat:'Italian',emoji:'🍝',desc:'Rich meat sauce over al dente spaghetti — a timeless Italian staple perfected over hours.',ing:['500g ground beef','400g spaghetti','800g canned tomatoes','1 large onion','3 cloves garlic','2 tbsp olive oil','Salt & black pepper'],steps:['Bring a large pot of salted water to a boil and cook pasta until al dente. Drain and set aside.','Dice onion and mince garlic. Sauté in olive oil over medium heat until softened and fragrant, about 5 minutes.','Add ground beef to the pan. Break apart with a wooden spoon and cook until fully browned.','Pour in canned tomatoes, season generously with salt and pepper. Stir well and reduce heat.','Simmer the sauce uncovered for at least 20 minutes, stirring occasionally, until thickened.','Toss pasta with sauce. Serve topped with freshly grated parmesan and torn basil.'],price:199,rating:5.0,reviews:3,added:'2024-01-10'},
  {id:2,title:'Chicken Curry',cat:'Asian',emoji:'🍛',desc:'Aromatic coconut-based curry with tender chicken, warming spices and silky sauce.',ing:['500g chicken breast','400ml coconut milk','2 tbsp curry powder','1 onion','3 cloves garlic','1 tbsp fresh ginger','2 tbsp neutral oil','Salt to taste'],steps:['Heat oil in a deep pan. Sauté diced onion, garlic, and grated ginger over medium heat until golden.','Add chicken pieces and sear until sealed on all sides — don\'t stir too much so it colours nicely.','Stir in curry powder and cook for 60 seconds to bloom the spices.','Pour in coconut milk. Stir to combine and scrape up any browned bits from the bottom.','Simmer uncovered on low heat for 20 minutes until chicken is cooked through and sauce is thick.','Season with salt, serve over steamed jasmine rice with fresh coriander.'],price:179,rating:5.0,reviews:3,added:'2024-01-15'},
  {id:3,title:'Chicken Adobo',cat:'Filipino',emoji:'🍗',desc:'The national dish of the Philippines — tangy, savoury, and deeply satisfying with every bite.',ing:['1kg chicken pieces','½ cup soy sauce','¼ cup white cane vinegar','1 head garlic (crushed)','2 bay leaves','1 tsp black peppercorns','2 tbsp cooking oil','1 tsp sugar (optional)'],steps:['Combine chicken with soy sauce and vinegar in a bowl. Marinate for at least 30 minutes (overnight is better).','Heat oil in a wide pan over medium-high heat. Sauté the crushed garlic until golden and fragrant.','Add the marinated chicken along with all the marinade liquid, bay leaves, and peppercorns.','Bring to a boil, then reduce heat and simmer uncovered for 30 minutes, turning chicken halfway.','Optional: Remove chicken and pan-fry in a separate pan to caramelize and crisp the skin.','Reduce remaining sauce until slightly syrupy. Pour over chicken and serve with steamed rice.'],price:159,rating:5.0,reviews:3,added:'2024-01-05'},
  {id:4,title:'Pancit Canton',cat:'Filipino',emoji:'🍜',desc:'Stir-fried egg noodles loaded with vegetables and your choice of pork or chicken.',ing:['250g canton noodles','200g pork belly (sliced thin)','1 cup cabbage (shredded)','1 carrot (julienned)','3 tbsp soy sauce','2 cups chicken broth','2 cloves garlic','Calamansi to serve'],steps:['Blanch canton noodles in boiling water for 2 minutes, drain and set aside.','Sauté garlic in oil, add pork and cook until browned. Season lightly with soy sauce.','Add carrots and cabbage. Stir-fry for 2 minutes until just tender but still crisp.','Pour in chicken broth and remaining soy sauce. Bring to a rolling boil.','Add noodles and toss constantly until all liquid is absorbed and noodles are coated.','Serve with calamansi halves on the side and a dash of patis if desired.'],price:139,rating:5.0,reviews:3,added:'2024-02-01'},
  {id:5,title:'Caesar Salad',cat:'Healthy',emoji:'🥗',desc:'Crisp romaine with hand-whisked dressing, golden croutons, and aged parmesan.',ing:['1 head romaine lettuce','½ cup Caesar dressing','1 cup croutons','¼ cup parmesan (shaved)','2 tbsp fresh lemon juice','Freshly cracked black pepper'],steps:['Wash romaine thoroughly and spin dry. Tear into generous bite-sized pieces.','Whisk Caesar dressing together with fresh lemon juice until smooth and emulsified.','Add lettuce to a large wide bowl. Pour dressing and toss well to coat every leaf.','Add most of the croutons and parmesan. Toss once more gently.','Transfer to serving plates. Top with remaining croutons, parmesan, and generous black pepper.','Serve immediately — the croutons lose their crunch within minutes.'],price:119,rating:4.7,reviews:3,added:'2024-02-10'},
  {id:6,title:'Leche Flan',cat:'Dessert',emoji:'🍮',desc:'Classic Filipino caramel custard — silky, burnished, and utterly indulgent.',ing:['10 egg yolks','1 can (300ml) condensed milk','1 can (370ml) evaporated milk','1 tsp vanilla extract','1 cup white sugar (for caramel)','2 tbsp water'],steps:['Combine sugar and water in a heavy llanera over low heat. Do not stir — swirl gently until a deep amber caramel forms. Remove from heat.','Let caramel cool slightly and harden in the llanera. It will crack slightly as you tilt it — this is fine.','Whisk egg yolks in a bowl until smooth. Add condensed milk, evaporated milk, and vanilla. Whisk until combined.','Strain the custard mixture twice through a fine-mesh sieve to remove bubbles and chalazae.','Pour carefully over the set caramel. Cover tightly with foil.','Steam over low-medium heat for 45 minutes, or bake in a water bath at 160°C for 50 minutes. A toothpick should come out clean.'],price:129,rating:5.0,reviews:3,added:'2024-01-20'}
];

function load(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}

let recipes=load(K.R,DEFAULTS);
let cart=load(K.C,[]);
let orders=load(K.O,[]);
let wishlist=load(K.W,[]);
let comments=load(K.CM,{});

if(Object.keys(comments).length===0){
  comments = {

1: [
  {name:"Jericho", text:"⭐⭐⭐⭐⭐ A must-try if you want to upgrade your usual weekend dinner."},
  {name:"Mayumi", text:"⭐⭐⭐⭐⭐ Tastes like it came from a high-end Italian restaurant! The meat sauce is incredibly rich and savory."},
  {name:"Arnel", text:"⭐⭐⭐⭐⭐ I didn't expect to be able to make pasta this good at home for only ₱199."}
],

2: [
  {name:"Carmela", text:"⭐⭐⭐⭐⭐ It smells super aromatic while cooking."},
  {name:"Carlo", text:"⭐⭐⭐⭐⭐ Will definitely make you want a second serving of rice! 🍛 10/10"},
  {name:"Isabella", text:"⭐⭐⭐⭐⭐ We thoroughly enjoyed this recipe and my family loved it."}
],

3: [
  {name:"Jonalyn", text:"⭐⭐⭐⭐⭐ Step-by-step instructions were clear, perfect for beginners."},
  {name:"Sharmaine", text:"⭐⭐⭐⭐⭐ I made this for a family gathering last night. The instructions were incredibly straightforward and easy to follow."},
  {name:"Vanessa", text:"⭐⭐⭐⭐⭐ Reminds me of my mom's recipe."}
],

4: [
  {name:"Rowena", text:"⭐⭐⭐⭐⭐ It tastes exactly like the classic pancit you get at family reunions."},
  {name:"Melanie", text:"⭐⭐⭐⭐⭐ Authentic Pinoy flavor!"},
  {name:"Claudia", text:"⭐⭐⭐⭐⭐ Great for celebrations and family gatherings."}
],

5: [
  {name:"Jennie", text:"⭐⭐⭐⭐⭐ Perfect for a quick, healthy lunch."},
  {name:"Jericho", text:"⭐⭐⭐⭐ A solid, classic Caesar."},
  {name:"Mayumi", text:"⭐⭐⭐⭐⭐ Feeling rich kid for today's lunch! Super easy to prepare."}
],

6: [
  {name:"Arnel", text:"⭐⭐⭐⭐⭐ This is by far the best Leche Flan recipe I've tried."},
  {name:"Carmela", text:"⭐⭐⭐⭐⭐ It tastes exactly like the classic Filipino dessert my grandmother used to make for family fiestas."},
  {name:"Carlo", text:"⭐⭐⭐⭐⭐ My in-laws are tough critics when it comes to Filipino desserts, but this Leche Flan completely won them over."}
]

  };
}


let fanFavId=load(K.FF,3); // default: Chicken Adobo
let users=load(K.US,[]);   // [{name,email,password}]
let currentUser=load(K.CU,null);
let currentFilter='All';
let currentSort='default';
let activeRecipe=null;
let selectedPay='GCash';
let pendingFanFavId=fanFavId;

/* ── AUTH ──────────────────────────────────────── */
function renderAuthArea(){
  const el=document.getElementById('nav-auth-area');
  if(currentUser){
    const initials=currentUser.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
    el.innerHTML=`
      <div class="nav-user-pill">
        <div class="nav-user-avatar">${initials}</div>
        <span class="nav-user-name">${currentUser.name.split(' ')[0]}</span>
        <button class="nav-logout" onclick="doLogout()">Sign out</button>
      </div>`;
  } else {
    el.innerHTML=`<button class="nav-auth" onclick="openLogin()">👤 Sign in</button>`;
  }
}

function openLogin(){
  document.getElementById('login-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLogin(){
  document.getElementById('login-overlay').classList.remove('open');
  document.body.style.overflow='';
}
function maybeCloseLogin(e){if(e.target===document.getElementById('login-overlay'))closeLogin()}
function switchLoginTab(tab,btn){
  document.querySelectorAll('.login-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.login-form-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  if(tab==='login'){
    document.getElementById('login-panel-title').textContent='Welcome back';
    document.getElementById('login-panel-sub').textContent='Sign in to track orders and save favourites.';
  } else {
    document.getElementById('login-panel-title').textContent='Join CookNest';
    document.getElementById('login-panel-sub').textContent='Create an account to get started.';
  }
}
function doLogin(){
  const email=document.getElementById('li-email').value.trim().toLowerCase();
  const pass=document.getElementById('li-pass').value;
  const user=users.find(u=>u.email===email&&u.password===pass);
  if(!user){showToast('Incorrect email or password','error');return}
  currentUser=user;save(K.CU,currentUser);
  closeLogin();renderAuthArea();
  showToast('Welcome back, '+user.name.split(' ')[0]+'! 👋','success');
}
function doGuestLogin(){
  closeLogin();
  showToast('Browsing as guest');
}
function doRegister(){
  const fname=document.getElementById('reg-fname').value.trim();
  const lname=document.getElementById('reg-lname').value.trim();
  const email=document.getElementById('reg-email').value.trim().toLowerCase();
  const pass=document.getElementById('reg-pass').value;
  if(!fname||!lname||!email||!pass){showToast('Please fill in all fields','error');return}
  if(users.find(u=>u.email===email)){showToast('An account with that email already exists','error');return}
  if(pass.length<6){showToast('Password must be at least 6 characters','error');return}
  const newUser={name:fname+' '+lname,email,password:pass};
  users.push(newUser);save(K.US,users);
  currentUser=newUser;save(K.CU,currentUser);
  closeLogin();renderAuthArea();
  showToast('Account created! Welcome, '+fname+' 🎉','success');
}
function doLogout(){
  currentUser=null;save(K.CU,null);
  renderAuthArea();
  showToast('Signed out. See you next time!');
}

/* ── FAN FAVOURITE ─────────────────────────────── */
function renderHeroFanFav(){
  const r=recipes.find(x=>x.id===fanFavId)||recipes[0];
  if(!r)return;
  document.getElementById('hero-feature-card').innerHTML=`
    <div class="hero-card-img">${r.emoji||'🍴'}<span class="hero-card-badge">⭐ Fan favourite</span></div>
    <div class="hero-card-body">
      <div class="hero-card-tag">${r.cat}</div>
      <div class="hero-card-title">${r.title}</div>
      <div class="hero-card-desc">${r.desc}</div>
      <div class="hero-card-row">
        <div class="hero-card-price">₱${r.price} <span>/ kit</span></div>
        <button class="btn-ember" style="padding:10px 18px;font-size:13px" onclick="addToCartId(${r.id})">Add to cart</button>
      </div>
    </div>`;
}

function renderFanFavDropdown(){
  const dropdown=document.getElementById('fanfav-dropdown');
  const r=recipes.find(x=>x.id===fanFavId);
  const currentName=r?r.title:'—';
  dropdown.innerHTML=`
    <div style="padding:10px 18px 6px;font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:0.5px;text-transform:uppercase">Current</div>
    <div style="padding:6px 18px 10px;font-size:13px;color:rgba(255,255,255,0.75);border-bottom:1px solid rgba(255,255,255,0.06)">${r?r.emoji:''} ${currentName}</div>
    <button class="nav-dropdown-item" onclick="showPage('fanfav')">⭐ Change fan favourite</button>
    <button class="nav-dropdown-item" onclick="openRecipe(${fanFavId})">👁 View recipe</button>
    <button class="nav-dropdown-item" onclick="addToCartId(${fanFavId})">🛒 Add to cart</button>`;
}

function renderFanFavPage(){
  pendingFanFavId=fanFavId;
  const list=document.getElementById('fanfav-recipe-list');
  list.innerHTML=recipes.map(r=>`
    <div class="fan-fav-recipe-option${r.id===pendingFanFavId?' selected':''}" onclick="selectFanFav(${r.id},this)">
      <div class="fan-fav-opt-emoji">${r.emoji||'🍴'}</div>
      <div class="fan-fav-opt-info">
        <div class="fan-fav-opt-title">${r.title}</div>
        <div class="fan-fav-opt-cat">${r.cat} · ₱${r.price} · ★${r.rating}</div>
      </div>
      <span class="fan-fav-check">✓</span>
    </div>`).join('');
  updateFanFavPreview();
}
function selectFanFav(id,el){
  pendingFanFavId=id;
  document.querySelectorAll('.fan-fav-recipe-option').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  updateFanFavPreview();
}
function updateFanFavPreview(){
  const r=recipes.find(x=>x.id===pendingFanFavId)||recipes[0];
  document.getElementById('fanfav-preview').innerHTML=`
    <div class="fan-fav-preview-emoji">${r.emoji||'🍴'}</div>
    <div class="fan-fav-preview-info">
      <span class="fan-fav-preview-badge">⭐ Fan Favourite</span>
      <div class="fan-fav-preview-title">${r.title}</div>
      <div class="fan-fav-preview-cat">${r.cat} · ₱${r.price} / kit</div>
    </div>`;
}
function saveFanFav(){
  fanFavId=pendingFanFavId;
  save(K.FF,fanFavId);
  renderHeroFanFav();
  renderFanFavDropdown();
  showToast('Fan favourite updated! ⭐','success');
  showPage('home');
}

/* ── PAGES ─────────────────────────────────────── */
function showPage(p){
  document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(el=>el.classList.remove('active'));
  const map={home:0,orders:1};
  if(map[p]!==undefined) document.querySelectorAll('.nav-link')[map[p]].classList.add('active');
  if(p==='cart')renderCart();
  if(p==='orders')renderOrders();
  if(p==='fanfav')renderFanFavPage();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ── FILTERS + GRID ─────────────────────────────── */
function getFiltered(){
  const q=document.getElementById('search-input').value.toLowerCase().trim();
  let r=[...recipes];
  if(currentFilter!=='All')r=r.filter(x=>x.cat===currentFilter);
  if(q)r=r.filter(x=>x.title.toLowerCase().includes(q)||x.cat.toLowerCase().includes(q)||x.desc.toLowerCase().includes(q));
  if(currentSort==='rating')r.sort((a,b)=>b.rating-a.rating);
  else if(currentSort==='name')r.sort((a,b)=>a.title.localeCompare(b.title));
  else if(currentSort==='price-asc')r.sort((a,b)=>a.price-b.price);
  else if(currentSort==='price-desc')r.sort((a,b)=>b.price-a.price);
  return r;
}
function starsHtml(r){
  const f=Math.round(r);
  return '<span class="stars">'+'★'.repeat(f)+'☆'.repeat(5-f)+'</span>';
}
function renderFilters(){
  const cats=['All',...new Set(recipes.map(r=>r.cat))];
  document.getElementById('filter-pills').innerHTML=cats.map(c=>`<button class="filter-pill${c===currentFilter?' active':''}" onclick="setFilter('${c}')">${c}</button>`).join('');
}
function setFilter(f){currentFilter=f;renderFilters();renderGrid()}
function renderGrid(){
  const r=getFiltered();
  document.getElementById('grid-count').textContent=r.length+' recipe'+(r.length!==1?'s':'');
  if(!r.length){
    document.getElementById('recipe-grid').innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--ink-3)"><div style="font-size:48px;margin-bottom:12px">🍽️</div><div style="font-family:var(--font-display);font-size:20px;color:var(--ink);margin-bottom:6px">No recipes found</div><div style="font-size:14px;font-weight:300">Try a different search or filter</div></div>';
    return;
  }
  document.getElementById('recipe-grid').innerHTML=r.map(rec=>`
    <div class="recipe-card" onclick="openRecipe(${rec.id})">
      <div class="recipe-card-thumb">
        ${rec.emoji||'🍴'}
        <button class="recipe-card-wish${wishlist.includes(rec.id)?' wishlisted':''}" onclick="event.stopPropagation();toggleWishId(${rec.id})" aria-label="Wishlist">
          ${wishlist.includes(rec.id)?'♥':'♡'}
        </button>
      </div>
      <div class="recipe-card-body">
        <div class="recipe-card-cat">${rec.cat}</div>
        <div class="recipe-card-title">${rec.title}</div>
        <div class="recipe-card-desc">${rec.desc}</div>
        <div class="recipe-card-foot">
          <div class="stars-row">${starsHtml(rec.rating)}<span class="stars-count">(${rec.reviews})</span></div>
          <div class="recipe-card-price-wrap">
            <span class="recipe-card-price">₱${rec.price}</span>
            <button class="btn-add-card" onclick="event.stopPropagation();addToCartId(${rec.id})">+ Cart</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── MODAL ──────────────────────────────────────── */
function openRecipe(id){
  const r=recipes.find(x=>x.id===id);
  if(!r)return;
  activeRecipe=r;
  document.getElementById('m-cat').textContent=r.cat;
  document.getElementById('modal-title').textContent=r.title;
  document.getElementById('m-price').textContent='₱'+r.price;
  document.getElementById('m-thumb').innerHTML=`<div class="modal-thumb">${r.emoji||'🍴'}<span class="modal-badge">${starsHtml(r.rating)} ${r.rating}</span></div>`;
  document.getElementById('m-meta-row').innerHTML=`
    <div class="modal-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${r.reviews} reviews</div>
    <div class="modal-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3"/><path d="M7 2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7"/><path d="M11 5h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1"/><path d="M3 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>${r.ing.length} ingredients</div>
    <div class="modal-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${r.steps.length} steps</div>`;
  document.getElementById('m-ing').innerHTML=r.ing.map(i=>`<div class="ing-chip">${i}</div>`).join('');
  document.getElementById('m-steps').innerHTML=r.steps.map((s,i)=>`<div class="step-item"><div class="step-num">${i+1}</div><div class="step-text">${s}</div></div>`).join('');
  const wb=document.getElementById('btn-wish-big');
  const w=wishlist.includes(id);
  wb.textContent=w?'♥':'♡';
  wb.classList.toggle('wishlisted',w);
  renderModalComments(id);
  document.getElementById('recipe-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  fetchAITip(r);
}
function closeRecipeModal(){
  document.getElementById('recipe-overlay').classList.remove('open');
  document.body.style.overflow='';
}
function maybeCloseModal(e){if(e.target===document.getElementById('recipe-overlay'))closeRecipeModal()}

async function fetchAITip(r){
  const el=document.getElementById('ai-tip');
  el.className='ai-box-text loading';
  el.textContent='Generating personalised tips…';
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-6',max_tokens:1000,
        system:'You are a warm, knowledgeable chef. Give 2-3 short practical cooking tips for the recipe. Plain text only, no markdown, no bullet points, no asterisks. Keep it under 80 words. Be specific and useful.',
        messages:[{role:'user',content:`Tips for making ${r.title}. Key ingredients: ${r.ing.slice(0,4).join(', ')}.`}]
      })
    });
    const d=await res.json();
    const txt=d.content?.find(c=>c.type==='text')?.text||'';
    el.className='ai-box-text';
    el.textContent=txt||'Chef tips unavailable right now.';
  }catch{
    el.className='ai-box-text';
    el.textContent='Chef tips unavailable — please check your connection.';
  }
}

/* ── COMMENTS ───────────────────────────────────── */
function renderModalComments(id){
  const list=comments[id]||[];
  const el=document.getElementById('m-comments');
  el.innerHTML=list.length
    ?list.map(c=>`<div class="comment-item"><div class="comment-author">${c.name}</div><div class="comment-text">${c.text}</div></div>`).join('')
    :'<div style="font-size:13px;color:var(--ink-3);font-style:italic;padding:8px 0">No reviews yet — be the first!</div>';
}
function postComment(){
  const name=document.getElementById('c-name').value.trim()||'Anonymous';
  const text=document.getElementById('c-text').value.trim();
  if(!text)return;
  const id=activeRecipe.id;
  if(!comments[id])comments[id]=[];
  comments[id].unshift({name,text});
  save(K.CM,comments);
  document.getElementById('c-text').value='';
  renderModalComments(id);
  showToast('Review posted!','success');
}

/* ── WISHLIST ───────────────────────────────────── */
function toggleWish(){if(activeRecipe)toggleWishId(activeRecipe.id)}
function toggleWishId(id){
  const i=wishlist.indexOf(id);
  i===-1?wishlist.push(id):wishlist.splice(i,1);
  save(K.W,wishlist);
  renderGrid();
  if(activeRecipe&&activeRecipe.id===id){
    const w=wishlist.includes(id);
    const wb=document.getElementById('btn-wish-big');
    wb.textContent=w?'♥':'♡';
    wb.classList.toggle('wishlisted',w);
  }
  showToast(wishlist.includes(id)?'Added to wishlist ♥':'Removed from wishlist');
}

/* ── CART ───────────────────────────────────────── */
function addToCartId(id){
  const r=recipes.find(x=>x.id===id);if(!r)return;
  const ex=cart.find(x=>x.id===id);
  ex?ex.qty++:cart.push({id,title:r.title,cat:r.cat,emoji:r.emoji,price:r.price,qty:1});
  save(K.C,cart);updateCartCount();showToast(r.title+' added to cart','success');
}
function addToCartFromModal(){addToCartId(activeRecipe.id);closeRecipeModal()}
function updateCartCount(){
  document.getElementById('cart-count').textContent=cart.reduce((a,b)=>a+b.qty,0);
}
function changeQty(id,d){
  const i=cart.findIndex(x=>x.id===id);if(i===-1)return;
  cart[i].qty+=d;
  if(cart[i].qty<=0)cart.splice(i,1);
  save(K.C,cart);updateCartCount();renderCart();
}
function renderCart(){
  const el=document.getElementById('cart-items');
  const sb=document.getElementById('cart-sidebar');
  if(!cart.length){
    el.innerHTML=`<div class="empty-cart"><div class="empty-icon">🛒</div><div class="empty-title">Your cart is empty</div><div class="empty-sub">Browse recipes and add your favourites.</div><button class="btn-browse" onclick="showPage('home')">Browse recipes →</button></div>`;
    sb.innerHTML='';return;
  }
  el.innerHTML=cart.map(item=>`
    <div class="cart-item">
      <div class="cart-emoji">${item.emoji||'🍴'}</div>
      <div class="cart-info">
        <div class="cart-item-name">${item.title}</div>
        <div class="cart-item-cat">${item.cat} · ₱${item.price} each</div>
        <div class="qty-wrap">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div class="cart-item-price">₱${item.price*item.qty}</div>
        <button class="btn-rm" onclick="changeQty(${item.id},-999)" aria-label="Remove">×</button>
      </div>
    </div>
  `).join('');
  const sub=cart.reduce((a,b)=>a+b.price*b.qty,0);
  const delivery=49;
  sb.innerHTML=`
    <div class="order-summary-card">
      <div class="summary-title">Order Summary</div>
      ${cart.map(i=>`<div class="summary-row"><span>${i.emoji} ${i.title} ×${i.qty}</span><span>₱${i.price*i.qty}</span></div>`).join('')}
      <div class="summary-divider"></div>
      <div class="summary-row"><span>Subtotal</span><span>₱${sub}</span></div>
      <div class="summary-row"><span>Delivery</span><span>₱${delivery}</span></div>
      <div class="summary-divider"></div>
      <div class="summary-total"><span>Total</span><span>₱${sub+delivery}</span></div>
      <button class="btn-checkout" onclick="openCheckout()">Proceed to checkout →</button>
    </div>`;
}

/* ── CHECKOUT ───────────────────────────────────── */
function openCheckout(){
  const sub=cart.reduce((a,b)=>a+b.price*b.qty,0);
  document.getElementById('co-recap').innerHTML=
    `<div style="font-size:12px;font-weight:500;color:var(--ink-3);margin-bottom:10px;letter-spacing:0.4px;text-transform:uppercase">Order recap</div>`+
    cart.map(i=>`<div class="recap-line"><span>${i.emoji} ${i.title} ×${i.qty}</span><span>₱${i.price*i.qty}</span></div>`).join('')+
    `<div class="recap-total"><span>Total (incl. ₱49 delivery)</span><span>₱${sub+49}</span></div>`;
  // prefill from current user
  if(currentUser){
    const parts=currentUser.name.split(' ');
    document.getElementById('co-fname').value=parts[0]||'';
    document.getElementById('co-lname').value=parts.slice(1).join(' ')||'';
    document.getElementById('co-email').value=currentUser.email||'';
  }
  document.getElementById('checkout-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCheckout(){
  document.getElementById('checkout-overlay').classList.remove('open');
  document.body.style.overflow='';
}
function maybeCloseCheckout(e){if(e.target===document.getElementById('checkout-overlay'))closeCheckout()}
function selectPay(el){
  document.querySelectorAll('.pay-method').forEach(p=>p.classList.remove('selected'));
  el.classList.add('selected');
  selectedPay=el.dataset.pay;
}
function placeOrder(){
  const fname=document.getElementById('co-fname').value.trim();
  const lname=document.getElementById('co-lname').value.trim();
  const email=document.getElementById('co-email').value.trim();
  const addr=document.getElementById('co-addr').value.trim();
  if(!fname||!lname||!email||!addr){showToast('Please fill in all fields','error');return}
  const sub=cart.reduce((a,b)=>a+b.price*b.qty,0);
  orders.unshift({
    id:'CN-'+Date.now(),items:[...cart],total:sub+49,
    name:fname+' '+lname,email,addr,payment:selectedPay,
    status:'Confirmed',date:new Date().toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'})
  });
  save(K.O,orders);
  cart=[];save(K.C,cart);updateCartCount();
  closeCheckout();
  showPage('orders');
  showToast('🎉 Order placed successfully!','success');
}

/* ── ORDERS ─────────────────────────────────────── */
function renderOrders(){
  const el=document.getElementById('orders-list');
  if(!orders.length){
    el.innerHTML='<div class="empty-cart"><div class="empty-icon">📦</div><div class="empty-title">No orders yet</div><div class="empty-sub">Place your first order to see it here.</div><button class="btn-browse" onclick="showPage(\'home\')">Browse recipes →</button></div>';
    return;
  }
  el.innerHTML=orders.map(o=>`
    <div class="order-card">
      <div class="order-head">
        <div><div class="order-id">${o.id}</div><div class="order-date">${o.date}</div></div>
        <span class="order-status">✓ ${o.status}</span>
      </div>
      <div class="order-items-row">${o.items.map(i=>`<span class="order-item-chip">${i.emoji} ${i.title} ×${i.qty}</span>`).join('')}</div>
      <div class="order-foot">
        <span class="order-pay-method">Paid via ${o.payment}</span>
        <span class="order-total">₱${o.total}</span>
      </div>
    </div>
  `).join('');
}

/* ── TOAST ──────────────────────────────────────── */
let _tt;
function showToast(msg,type=''){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className='toast show'+(type?' '+type:'');
  clearTimeout(_tt);_tt=setTimeout(()=>t.className='toast',2800);
}

/* ── INIT ───────────────────────────────────────── */
renderFilters();
renderGrid();
updateCartCount();
renderAuthArea();
renderHeroFanFav();
renderFanFavDropdown();