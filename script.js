
const c=document.getElementById('c'),ctx=c.getContext('2d');
const W=c.width,H=c.height,bgm=document.getElementById('bgm');
const start=document.getElementById('start'),pauseBtn=document.getElementById('pause'),muteBtn=document.getElementById('mute');
const h1=document.getElementById('h1'),h2=document.getElementById('h2'),msg=document.getElementById('msg'),last=document.getElementById('last'),sc1=document.getElementById('s1'),sc2=document.getElementById('s2');
let s1=0,s2=0,run=false,paused=false;
async function beginMusic(){try{bgm.volume=.45;await bgm.play()}catch(e){}}
window.addEventListener('pointerdown',beginMusic,{once:true});window.addEventListener('keydown',beginMusic,{once:true});beginMusic();
muteBtn.onclick=()=>{bgm.muted=!bgm.muted;muteBtn.textContent=bgm.muted?'Unmute':'Mute';}
pauseBtn.onclick=()=>{paused=!paused;pauseBtn.textContent=paused?'Resume':'Pause';}
let A=[],B=[],arrows=[];
function make(side){
 let out=[];for(let i=0;i<28;i++)out.push({t:'melee',x:side?W-120+Math.random()*70:50+Math.random()*70,y:40+i*18,h:22,a:.45+Math.random()*.3,s:.8});
 for(let i=0;i<8;i++)out.push({t:'archer',x:side?W-170+Math.random()*40:10+Math.random()*40,y:60+i*40,h:14,a:.22,s:.55});
 return out;
}
function nearest(u,e){let b=null,d=1e9;for(const x of e){let dd=(u.x-x.x)**2+(u.y-x.y)**2;if(dd<d){d=dd;b=x}}return b}
function tick(team,en,left){
 for(const u of team){
  let t=nearest(u,en); if(!t)continue;
  let dx=t.x-u.x,dy=t.y-u.y,dist=Math.hypot(dx,dy);
  if(u.t==='archer'){
    let front=team.filter(v=>v.t==='melee');
    if(front.length){let fx=front.reduce((a,b)=>a+b.x,0)/front.length; if(left){if(u.x>fx-40)u.x-=u.s;} else {if(u.x<fx+40)u.x+=u.s;}}
    if(dist<160&&Math.random()<.06)arrows.push({x:u.x,y:u.y,vx:dx/dist*4,vy:dy/dist*4,d:.25});
    else if(dist>150){u.x+=dx/dist*u.s;u.y+=dy/dist*u.s;}
  } else {
    if(dist>8){u.x+=dx/dist*u.s;u.y+=dy/dist*u.s;}
    else t.h-=u.a*(Math.random()<.08?3:1);
  }
 }
 for(let i=en.length-1;i>=0;i--)if(en[i].h<=0)en.splice(i,1);
}
function updateArrows(){
 for(let i=arrows.length-1;i>=0;i--){
  let a=arrows[i];a.x+=a.vx;a.y+=a.vy;
  for(let e of [...A,...B]){
   if(Math.hypot(a.x-e.x,a.y-e.y)<5){
    if((A.includes(e)&&a.vx>0)||(B.includes(e)&&a.vx<0)){e.h-=a.d;arrows.splice(i,1);break;}
   }
  }
 }
}
function draw(){
 ctx.clearRect(0,0,W,H);
 for(let u of A){ctx.fillStyle=u.t==='archer'?'#88ccff':'#4aa3ff';ctx.fillRect(u.x-3,u.y-3,6,6);}
 for(let u of B){ctx.fillStyle=u.t==='archer'?'#ffaaaa':'#ff4040';ctx.fillRect(u.x-3,u.y-3,6,6);}
 ctx.strokeStyle='white';for(let a of arrows){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x-a.vx*2,a.y-a.vy*2);ctx.stroke();}
}
function loop(){
 if(run&&!paused){
 tick(A,B,true);tick(B,A,false);updateArrows();
 h1.style.width=(A.length/36*100)+'%';h2.style.width=(B.length/36*100)+'%';
 if(!A.length||!B.length){run=false;start.disabled=false;let w=A.length?'AI 1':'AI 2';msg.textContent=w+' wins';last.textContent=w;if(A.length)sc1.textContent=++s1;else sc2.textContent=++s2;}
 }
 draw();requestAnimationFrame(loop);
}
start.onclick=()=>{A=make(false);B=make(true);arrows=[];run=true;paused=false;start.disabled=true;msg.textContent='Battle';}
loop();
