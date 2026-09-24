/* ==========================================
   MAIN.JS - Initialization
   ========================================== */

// Initialize everything when DOM is ready
initAuth();
initChatbot();
initSlider();

try{
  initHero3D();
}catch(e){
  document.getElementById('hero3d').style.display='none';
}
