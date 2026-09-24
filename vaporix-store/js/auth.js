/* ==========================================
   AUTH.JS - Firebase Auth (Email/Password + Social)
   ========================================== */

let authMode='signup';
let pendingBuyProduct = null;

function openAuth(mode){
  authMode=mode;
  document.getElementById('authModal').style.display='flex';
  document.getElementById('authTitle').textContent = mode==='signup' ? 'Sign up' : 'Log in';
  document.getElementById('authBtn').textContent = mode==='signup' ? 'Create account' : 'Log in';
  document.getElementById('authSwitch').innerHTML = mode==='signup'
    ? 'Already have an account? <a onclick="openAuth(\'login\')">Log in</a>'
    : 'New here? <a onclick="openAuth(\'signup\')">Sign up</a>';
  document.getElementById('authMsg').className='msg';
  document.getElementById('aName').style.display = mode==='signup' ? 'block':'none';
  document.getElementById('aName').previousElementSibling.style.display = mode==='signup' ? 'block':'none';
}

function closeAuth(){
  document.getElementById('authModal').style.display='none';
}

async function signInWithProvider(providerName){
  const msg=document.getElementById('authMsg');
  msg.className='msg';
  msg.textContent='';
  let provider;
  if(providerName==='google') provider=googleProvider;
  else if(providerName==='facebook') provider=facebookProvider;
  else if(providerName==='twitter') provider=twitterProvider;
  else return;
  try{
    const result=await auth.signInWithPopup(provider);
    const user=result.user;
    currentUser={name:user.displayName||user.email.split('@')[0],email:user.email,uid:user.uid,photoURL:user.photoURL};
    saveJSON('vx_current',currentUser);
    renderAuthArea();
    msg.textContent='Logged in with '+providerName+'!';
    msg.className='msg ok';
    setTimeout(()=>{
      closeAuth();
      if(pendingBuyProduct){
        const p = pendingBuyProduct;
        pendingBuyProduct = null;
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Vaporix! I'd like to order: ${p.name} (PKR ${p.price}). Please help me complete this order.`)}`, '_blank', 'noopener');
      } else {
        go('shop');
      }
    },600);
  }catch(err){
    msg.textContent=err.message;
    msg.className='msg err';
  }
}

function submitAuth(){
  const email=document.getElementById('aEmail').value.trim().toLowerCase();
  const pass=document.getElementById('aPass').value;
  const name=document.getElementById('aName').value.trim();
  const msg=document.getElementById('authMsg');

  if(!email||!pass){
    msg.textContent='Fill in all fields.';
    msg.className='msg err';
    return;
  }

  if(authMode==='signup'){
    auth.createUserWithEmailAndPassword(email,pass).then(cred=>{
      return cred.user.updateProfile({displayName:name||email.split('@')[0]});
    }).then(()=>{
      const user=auth.currentUser;
      currentUser={name:user.displayName||user.email.split('@')[0],email:user.email,uid:user.uid};
      saveJSON('vx_current',currentUser);
      msg.textContent='Account created!';msg.className='msg ok';
      renderAuthArea();
      setTimeout(()=>{
        closeAuth();
        if(pendingBuyProduct){
          const p = pendingBuyProduct;
          pendingBuyProduct = null;
          window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Vaporix! I'd like to order: ${p.name} (PKR ${p.price}). Please help me complete this order.`)}`, '_blank', 'noopener');
        } else {
          go('shop');
        }
      },600);
    }).catch(err=>{msg.textContent=err.message;msg.className='msg err';});
  } else {
    auth.signInWithEmailAndPassword(email,pass).then(cred=>{
      const user=cred.user;
      currentUser={name:user.displayName||user.email.split('@')[0],email:user.email,uid:user.uid,photoURL:user.photoURL};
      saveJSON('vx_current',currentUser);
      msg.textContent='Logged in!';msg.className='msg ok';
      renderAuthArea();
      setTimeout(()=>{
        closeAuth();
        if(pendingBuyProduct){
          const p = pendingBuyProduct;
          pendingBuyProduct = null;
          window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Vaporix! I'd like to order: ${p.name} (PKR ${p.price}). Please help me complete this order.`)}`, '_blank', 'noopener');
        } else {
          go('shop');
        }
      },600);
    }).catch(err=>{msg.textContent=err.message;msg.className='msg err';});
  }
}

function logout(){
  auth.signOut();
  currentUser=null;
  localStorage.removeItem('vx_current');
  renderAuthArea();
  go('home');
}

function renderAuthArea(){
  const el=document.getElementById('authArea');
  if(currentUser){
    el.innerHTML = `<span class="userchip">Hi, ${currentUser.name}</span><button class="pill" onclick="logout()">Log out</button>`;
  } else {
    el.innerHTML = `<button class="pill" onclick="openAuth('login')">Log in / Sign up</button>`;
  }
}

function initAuth(){
  renderAuthArea();
  auth.onAuthStateChanged(user=>{
    if(user && !currentUser){
      currentUser={name:user.displayName||user.email.split('@')[0],email:user.email,uid:user.uid,photoURL:user.photoURL};
      saveJSON('vx_current',currentUser);
      renderAuthArea();
    }else if(!user && currentUser){
      currentUser=null;
      localStorage.removeItem('vx_current');
      renderAuthArea();
    }
  });
}