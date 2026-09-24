/* ==========================================
   ROUTER.JS - Page Navigation
   ========================================== */

function go(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.navlinks button[data-page]').forEach(b=>b.classList.toggle('active', b.dataset.page===page));
  document.getElementById('navlinks').classList.remove('open');
  if(page==='shop') renderShop();
  if(page==='admin') renderAdmin();
  window.scrollTo({top:0,behavior:'smooth'});
}
