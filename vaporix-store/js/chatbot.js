/* ==========================================
   CHATBOT.JS - Floating Chat Widget
   ========================================== */

const chatKB = [
  [/shop|product|buy|price/i, "Head to the Shop tab! Sign up or log in first, then tap 'Buy Now' on any product to order it straight through WhatsApp."],
  [/contact|reach|whatsapp|number/i, "You can reach us anytime on WhatsApp at 0314 0329974, or use the Contact form and it'll message us directly."],
  [/admin/i, "The Admin Panel is for the store owner to add, edit or remove products — it's password protected."],
  [/account|sign ?up|log ?in|login/i, "Tap 'Log in / Sign up' in the top right. You'll need an account to browse the Shop."],
  [/custom|logo|engrav|personali[sz]e/i, "Most Vaporix items can be personalised — mention what you want engraved or printed when you message us on WhatsApp."],
  [/hi|hello|hey/i, "Hey! I'm the Vaporix assistant. Ask me about products, ordering, or your account."]
];

function toggleChat(){
  document.getElementById('chat-panel').classList.toggle('open');
}

function addBubble(text,who){
  const log=document.getElementById('chat-log');
  const d=document.createElement('div');
  d.className='bubble '+who;
  d.textContent=text;
  log.appendChild(d);
  log.scrollTop=log.scrollHeight;
}

function sendChat(){
  const inp=document.getElementById('chatIn');
  const val=inp.value.trim();
  if(!val)return;
  addBubble(val,'user');
  inp.value='';
  setTimeout(()=>{
    const hit = chatKB.find(([re])=>re.test(val));
    addBubble(hit ? hit[1] : "I'm not totally sure on that — you can ask on WhatsApp (0314 0329974) and the owner will help directly!", 'bot');
  },350);
}

function initChatbot(){
  addBubble("Hey! I'm the Vaporix assistant — ask me about products, ordering or your account.",'bot');
}
