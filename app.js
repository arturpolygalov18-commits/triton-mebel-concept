const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav'),furnitureMenu=document.querySelector('.furniture-menu');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');furnitureMenu.open=false}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
const photo=document.querySelector('#detail-image'),caption=document.querySelector('.detail-caption'),stage=document.querySelector('.detail-stage'),incoming=document.querySelector('.detail-incoming'),detailButtons=[...document.querySelectorAll('.detail')],reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let detailRequest=0,detailAnimation=null,displayedButton=detailButtons[0],pendingButton=null;
function stopTransition(){if(detailAnimation){detailAnimation.cancel();detailAnimation=null}incoming.style.opacity='0';incoming.style.transform='none'}
function commitDetail(button){photo.src=button.dataset.src;photo.alt=button.dataset.alt;photo.style.objectPosition=button.dataset.position;caption.textContent=button.dataset.title;displayedButton=button}
function selectDetail(button){detailButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)))}
detailButtons.forEach(button=>button.addEventListener('click',async event=>{
 if(button===pendingButton||button===displayedButton&&!pendingButton)return;
 const request=++detailRequest;pendingButton=button;selectDetail(button);stage.setAttribute('aria-busy','true');
 try{
  const ready=new Image();ready.src=button.dataset.src;await ready.decode();
  if(request!==detailRequest)return;
  stopTransition();
  if(reduceMotion.matches||event.detail===0){commitDetail(button);pendingButton=null;stage.setAttribute('aria-busy','false');return}
  incoming.src=button.dataset.src;incoming.style.objectPosition=button.dataset.position;
  const animation=incoming.animate([{opacity:0,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}],{duration:280,easing:'cubic-bezier(.215,.61,.355,1)',fill:'forwards'});detailAnimation=animation;
  await animation.finished;
  if(request!==detailRequest)return;
  commitDetail(button);stopTransition();pendingButton=null;stage.setAttribute('aria-busy','false');
 }catch(error){if(request!==detailRequest)return;stopTransition();pendingButton=null;selectDetail(displayedButton);stage.setAttribute('aria-busy','false');caption.textContent='Не удалось открыть фото. Попробуйте ещё раз.'}
}));
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches&&pendingButton&&detailAnimation){++detailRequest;const target=pendingButton;stopTransition();commitDetail(target);pendingButton=null;selectDetail(target);stage.setAttribute('aria-busy','false')}});
const track=document.querySelector('.projects'),arrows=document.querySelector('.arrows'),prev=document.querySelector('.prev'),next=document.querySelector('.next');
function controls(){arrows.hidden=track.scrollWidth<=track.clientWidth+2;prev.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2}
document.querySelectorAll('.arrow').forEach(b=>b.addEventListener('click',()=>{const step=track.querySelector('.project').getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap);track.scrollBy({left:(b===prev?-1:1)*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));
track.addEventListener('scroll',controls,{passive:true});window.addEventListener('resize',controls);controls();
