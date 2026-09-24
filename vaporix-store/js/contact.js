/* ==========================================
   CONTACT.JS - WhatsApp Contact Form
   ========================================== */

function sendContact(e){
  e.preventDefault();
  const name=document.getElementById('cName').value.trim();
  const contact=document.getElementById('cContact').value.trim();
  const msg=document.getElementById('cMsg').value.trim();
  const text = `New Vaporix contact form message:\nName: ${name}\nContact: ${contact}\nMessage: ${msg}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  return false;
}
