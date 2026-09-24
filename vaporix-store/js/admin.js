/* ==========================================
   ADMIN.JS - Product Management
   ========================================== */

function adminLogin(){
  const val=document.getElementById('adminPass').value;
  if(val===ADMIN_PASS){
    adminOn=true;
    renderAdmin();
  } else {
    alert('Incorrect admin password.');
  }
}

function renderAdmin(){
  document.getElementById('adminLocked').style.display = adminOn ? 'none':'block';
  document.getElementById('adminContent').style.display = adminOn ? 'block':'none';
  if(!adminOn) return;

  const list=document.getElementById('adminList');
  list.innerHTML = products.map(p=>`
    <div class="row">
      <img src="${escAttr(p.img)}" onerror="this.src='assets/images/logo.jpg'">
      <div class="info"><div class="name">${esc(p.name)}</div><div class="p">PKR ${Number(p.price).toLocaleString()}</div></div>
      <button class="mini" onclick="editProduct('${p.id}')">Edit</button>
      <button class="mini danger" onclick="deleteProduct('${p.id}')">Delete</button>
    </div>`).join('') || '<p style="color:var(--ink-dim)">No products yet.</p>';
}

function saveProduct(e){
  e.preventDefault();
  const id=document.getElementById('pId').value;
  const data={
    id: id || 'p'+Date.now(),
    name:document.getElementById('pName').value.trim(),
    price:Number(document.getElementById('pPrice').value),
    img:document.getElementById('pImg').value.trim(),
    desc:document.getElementById('pDesc').value.trim()
  };

  if(id){
    products = products.map(p=>p.id===id?data:p);
  } else {
    products.push(data);
  }

  saveJSON('vx_products',products);
  e.target.reset();
  document.getElementById('pId').value='';
  document.getElementById('pSubmitBtn').textContent='Add product';
  renderAdmin();
  return false;
}

function editProduct(id){
  const p=products.find(p=>p.id===id);
  if(!p)return;
  document.getElementById('pId').value=p.id;
  document.getElementById('pName').value=p.name;
  document.getElementById('pPrice').value=p.price;
  document.getElementById('pImg').value=p.img;
  document.getElementById('pDesc').value=p.desc;
  document.getElementById('pSubmitBtn').textContent='Save changes';
  window.scrollTo({top:0,behavior:'smooth'});
}

function deleteProduct(id){
  if(!confirm('Remove this product?')) return;
  products=products.filter(p=>p.id!==id);
  saveJSON('vx_products',products);
  renderAdmin();
}
