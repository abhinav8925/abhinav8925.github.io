(function(){'use strict';
var d=document,dd=d.documentElement;

// Theme
var t=d.getElementById('themeToggle'),s=localStorage.getItem('theme');
function setTheme(e){dd.setAttribute('data-theme',e);localStorage.setItem('theme',e);if(t)t.innerHTML=e==='dark'
?'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';}
setTheme(s||'light');
if(t)t.addEventListener('click',function(){setTheme(dd.getAttribute('data-theme')==='dark'?'light':'dark');});

// Mobile nav
var m=d.getElementById('mobileToggle'),n=d.getElementById('navLinks');
if(m&&n){m.addEventListener('click',function(){n.classList.toggle('active');m.classList.toggle('active');});
n.querySelectorAll('a').forEach(function(l){l.addEventListener('click',function(){n.classList.remove('active');m.classList.remove('active');});});}

// Nav scroll shadow
var nav=d.querySelector('.nav');
window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.pageYOffset>50);},{passive:true});

// Scroll reveal
var obs=new IntersectionObserver(function(e){e.forEach(function(entry){if(entry.isIntersecting)entry.target.classList.add('visible');});},{threshold:.15,rootMargin:'0px 0px -50px 0px'});
d.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});

// Rotating titles
var role=d.getElementById('rotatingRole');
if(role){var roles=['Backend Engineer','DevOps Engineer','Global CS Mentor'],i=0;
setInterval(function(){i=(i+1)%roles.length;role.style.opacity='0';role.style.transform='translateY(8px)';
setTimeout(function(){role.textContent=roles[i];role.style.opacity='1';role.style.transform='translateY(0)';},250);},5000);}

// Live clock (inline backup runs first; this takes over on fresh loads)
var clock=d.getElementById('liveClock');
if(clock){(function tick(){clock.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});setTimeout(tick,1000);})();}

// Visitor notification
var today=new Date().toISOString().split('T')[0],nk='portfolio_notified_'+today;
if(!localStorage.getItem(nk)){try{var tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
fetch('https://formspree.io/f/mqeopgoo',{method:'POST',body:JSON.stringify({name:'Portfolio Visitor',email:'visitor@portfolio',
message:['New visitor on your portfolio!','Time: '+new Date().toLocaleString(),'Timezone: '+tz,'Browser: '+navigator.userAgent.substring(0,120),'Language: '+navigator.language,'Platform: '+navigator.platform].join('\n')}),
headers:{'Accept':'application/json','Content-Type':'application/json'}});localStorage.setItem(nk,'1');}catch(_){}}

// Visitor counter
var te=d.getElementById('visitorCount'),ye=d.getElementById('todayCount');
if(te||ye){(function(){var ck='portfolio_counted_'+today,isNew=!localStorage.getItem(ck);
Promise.all([fetch('https://api.countapi.xyz/'+(isNew?'hit':'get')+'/abhinav-portfolio-v3/total'),fetch('https://api.countapi.xyz/'+(isNew?'hit':'get')+'/abhinav-portfolio-v3/'+today)])
.then(function(r){return Promise.all(r.map(function(x){return x.json();}));})
.then(function(d){if(te&&d[0].value)te.textContent=d[0].value.toLocaleString();if(ye&&d[1].value)ye.textContent=d[1].value.toLocaleString();if(isNew)localStorage.setItem(ck,'1');})
.catch(function(){var c=localStorage.getItem('portfolio_visits');if(!c){c='1';localStorage.setItem('portfolio_visits','1');}if(te)te.textContent=c;});})();}

// Year
d.getElementById('year').textContent=today.substring(0,4);

// Profile photo fallback
(function(){var img=d.getElementById('profilePhoto'),ph=d.getElementById('initialPlaceholder');
if(img&&ph){var tmp=new Image();tmp.onload=function(){img.style.display='block';ph.style.display='none';};tmp.src=img.src;}})();

// Contact form
var cf=d.getElementById('contactForm');
if(cf){cf.addEventListener('submit',function(e){e.preventDefault();
var btn=d.getElementById('formSubmitBtn'),st=d.getElementById('formStatus');
btn.disabled=true;btn.textContent='Sending...';st.textContent='';st.className='form-status';
fetch(cf.action,{method:'POST',body:JSON.stringify({name:cf.name.value,email:cf.email.value,message:cf.message.value}),headers:{'Accept':'application/json','Content-Type':'application/json'}})
.then(function(r){if(r.ok){st.textContent="Message sent! I'll get back to you soon.";st.className='form-status form-status-success';cf.reset();}
else{return r.json().then(function(d){st.textContent=d?.error||'Something went wrong.';st.className='form-status form-status-error';});}})
.catch(function(){st.textContent='Network error. Email me at anandabhinav1903@gmail.com';st.className='form-status form-status-error';})
.finally(function(){btn.disabled=false;btn.textContent='Send message';});});}

// Smooth anchor scroll
d.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=d.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}});});
})();