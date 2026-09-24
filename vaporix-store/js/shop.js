/* ==========================================
   SHOP.JS - Product Rendering & Buy Links
   ========================================== */

function esc(s){
  return String(s).replace(/[&<>"']/g,c=>({'&':'&','<':'<','>':'>','"':'"',"'":'''}[c]));
}

function escAttr(s){
  return esc(s);
}

function renderShop(){
  const locked=document.getElementById('shopLocked'), content=document.getElementById('shopContent');

  if(!currentUser){
    locked.style.display='block';
    content.style.display='none';
    return;
  }

  locked.style.display='none';
  content.style.display='block';

  const grid=document.getElementById('productGrid');
  grid.innerHTML = products.map(p=>`
    <div class="card" onclick="openProduct('${p.id}')">
      <img src="${escAttr(p.img)}" alt="${escAttr(p.name)}" onerror="this.src='assets/images/logo.jpg'">
      <div class="cbody">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <span class="price">PKR ${Number(p.price).toLocaleString()}</span>
        <button class="btn btn-wa" onclick="event.stopPropagation(); handleBuyClick(${JSON.stringify(p).replace(/"/g, '"')})">Buy Now</button>
      </div    </div>`).join('');
}

function openProduct(id){
  const p = products.find(p=>p.id===id);
  if(!p) return;
  document.getElementById('pmImg').src = p.img;
  document.getElementById('pmName').textContent = p.name;
  document.getElementById('pmPrice').textContent = 'PKR ' + Number(p.price).toLocaleString();
  document.getElementById('pmDesc').textContent = p.desc;
  document.getElementById('pmBtn').onclick = (e)=>{ e.preventDefault(); handleBuyClick(p); };
  document.getElementById('productModal').classList.add('open');
}
function closeProduct(){
  document.getElementById('productModal').classList.remove('open');
}