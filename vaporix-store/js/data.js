/* ==========================================
   DATA.JS - Constants and Slider
   ========================================== */

const WA_NUMBER = "923140329974";
const ADMIN_PASS = "vaporix2026";

// Products are loaded from the Neon API by the main app script.
// This shared global is populated by loadProducts() after the API call.
// Using `var` so it is shared across script tags (becomes window.products).
var products = [];

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