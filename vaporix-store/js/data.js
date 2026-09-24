/* ==========================================
   DATA.JS - Constants and Default Products
   ========================================== */

const WA_NUMBER = "923140329974";
const ADMIN_PASS = "vaporix2026";

const defaultProducts = [
  {id:'p1',name:'Vaporix Steel Bottle',price:1500,img:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',desc:'Insulated steel bottle, custom name/logo engraving available.'},
  {id:'p2',name:'Vaporix Signature Tee',price:2200,img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',desc:'Heavyweight cotton tee with the gold Vaporix mark.'},
  {id:'p3',name:'Vaporix Gold Pen',price:800,img:'https://images.unsplash.com/photo-1583485088034-697b5bc36b90?w=600&q=80',desc:'Matte black pen with gold trim, personalised engraving.'},
  {id:'p4',name:'Vaporix Snapback Cap',price:1800,img:'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80',desc:'Structured cap, embroidered logo, adjustable strap.'},
  {id:'p5',name:'Dior Sauvage Extrait',price:1200,img:'https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Library-Sites-DiorSharedLibrary/default/dwc7572052/images/beauty/0-HOME/BEAUTY/2026/08-AUGUST/Sauvage_Extrait_Mood_Hands_WW_Extrait_1688x3000_V1.jpg?sw=800',desc:'Premium luxury perfume with intense, sophisticated fragrance notes.'}
];

// Helper functions for localStorage
function loadJSON(k,fallback){
  try{
    const v=localStorage.getItem(k);
    return v?JSON.parse(v):fallback;
  }catch(e){
    return fallback;
  }
}

function saveJSON(k,v){
  try{
    localStorage.setItem(k,JSON.stringify(v));
  }catch(e){}
}

// State
let products = loadJSON('vx_products', defaultProducts);
if(!localStorage.getItem('vx_products')) saveJSON('vx_products', products);
let users = loadJSON('vx_users', []);
let currentUser = loadJSON('vx_current', null);
let adminOn = false;

let currentSlide = 0;
let slideInterval = null;

function getRandomPrice(){return Math.floor(Math.random() * 2500) + 500;}

function renderSlider(){
  const track = document.getElementById('sliderTrack');
  if(!track) return;
  track.innerHTML = products.map(p=>{
    const rp = getRandomPrice();
    return `<div class="slide">
      <img src="${escAttr(p.img)}" alt="${escAttr(p.name)}" onerror="this.src='assets/images/logo.jpg'">
      <div class="sbody">
        <h4>${esc(p.name)}</h4>
        <span class="sprice">PKR ${Number(rp).toLocaleString()}</span>
        <button class="sbtn" onclick="handleBuyClick(${JSON.stringify(p).replace(/"/g, '"')})">Buy Now</button>
      </div>
    </div>`;
  }).join('');
  updateSlider();
  renderDots();
  startAutoSlide();
}

function renderDots(){
  const dots = document.getElementById('sliderDots');
  if(!dots) return;
  dots.innerHTML = products.map((_,i)=>`<button class="dot ${i===currentSlide?'active':''}" onclick="goToSlide(${i})"></button>`).join('');
}

function updateSlider(){
  const track = document.getElementById('sliderTrack');
  if(!track) return;
  const slideWidth = products[currentSlide] ? track.querySelector('.slide')?.offsetWidth + 20 : 0;
  track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  document.querySelectorAll('.dot').forEach((d,i)=>{d.classList.toggle('active', i===currentSlide);});
}

function goToSlide(n){
  currentSlide = n;
  updateSlider();
  resetAutoSlide();
}

function slideNext(){
  currentSlide = (currentSlide + 1) % products.length;
  updateSlider();
  resetAutoSlide();
}

function slidePrev(){
  currentSlide = (currentSlide - 1 + products.length) % products.length;
  updateSlider();
  resetAutoSlide();
}

function startAutoSlide(){
  if(slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(slideNext, 3000);
}

function resetAutoSlide(){
  if(slideInterval) clearInterval(slideInterval);
  slideInterval = setTimeout(function(){
    currentSlide = (currentSlide + 1) % products.length;
    updateSlider();
    startAutoSlide();
  }, 3000);
}

let pendingBuyProduct = null;

function buyLink(p){
  const text = `Hi Vaporix! I'd like to order: ${p.name} (PKR ${p.price}). Please help me complete this order.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

function openWhatsApp(p){
  window.open(buyLink(p), '_blank', 'noopener');
}

function handleBuyClick(p){
  if(!currentUser){
    pendingBuyProduct = p;
    openAuth('login');
    return;
  }
  openWhatsApp(p);
}

function initSlider(){
  renderSlider();
}
