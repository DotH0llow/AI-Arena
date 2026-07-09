
const c=document.getElementById('c'),ctx=c.getContext('2d');
const W=c.width,H=c.height,G=H-90,bgm=document.getElementById('bgm');
const start=document.getElementById('start'),pauseBtn=document.getElementById('pause'),muteBtn=document.getElementById('mute');
const h1=document.getElementById('h1'),h2=document.getElementById('h2'),msg=document.getElementById('msg'),last=document.getElementById('last'),sc1=document.getElementById('s1'),sc2=document.getElementById('s2');
let s1=0,s2=0,run=false,paused=false,A=[],B=[],arrows=[];
async function beginMusic(){try{bgm.src="audio/Rokatanc.mp3";bgm.volume=.45;await bgm.play();}catch(e){}}
["pointerdown","keydown","mousemove","touchstart"].forEach(e=>addEventListener(e,beginMusic,{once:true}));
beginMusic();
muteBtn.onclick=()=>bgm.muted=!bgm.muted;
pauseBtn.onclick=()=>{paused=!paused;pauseBtn.textContent=paused?"Resume":"Pause";}
function make(side){
 let t=[];
 for(let i=0;i<22;i++)t.push({t:"melee",x:side?W-120-i*18:120+i*18,y:G,h:26,a:.45,s:0.65,d:side?-1:1});
 for(let i=0;i<8;i++)t.push({t:"archer",x:side?W-180-i*18:60+i*18,y:G-20,h:16,a:.2,s:.45,d:side?-1:1});
 return t;
}
function nearest(u,e){let n=null,b=1e9;for(const x of e){let d=Math.abs(x.x-u.x);if(d<b){b=d;n=x}}return n;}
function tick(team,en){
 for(const u of team){
  const t=nearest(u,en); if(!t)continue;
  const dist=Math.abs(t.x-u.x);
  if(u.t==="melee"){
    if(dist>18)u.x+=u.s*u.d;
    else t.h-=u.a*(Math.random()<0.08?3:1);
  }else{
    if(dist>220)u.x+=u.s*u.d;
    else if(Math.random()<0.03)arrows.push({x:u.x,y:u.y-8,vx:4*u.d});
  }
 }
 for(let i=en.length-1;i>=0;i--)if(en[i].h<=0)en.splice(i,1);
}
function updateArrows(){
 for(let i=arrows.length-1;i>=0;i--){
  const a=arrows[i];a.x+=a.vx;
  const enemies=a.vx>0?B:A;
  for(const e of enemies){
    if(Math.abs(e.x-a.x)<5){e.h-=3;arrows.splice(i,1);break;}
  }
 }
}
function bg(){
const sky=ctx.createLinearGradient(0,0,0,G);sky.addColorStop(0,"#7eb8ff");sky.addColorStop(1,"#dcefff");ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
ctx.fillStyle="#75889a";for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(i*170,G-120);ctx.lineTo(i*170+90,G-210);ctx.lineTo(i*170+180,G-120);ctx.fill();}
ctx.fillStyle="#415c35";ctx.fillRect(0,G-22,W,22);
for(let i=0;i<W;i+=18){ctx.fillStyle=i%36?"#4e9c42":"#58ab47";ctx.fillRect(i,G-6,18,6);}
ctx.fillStyle="#7b5b35";ctx.fillRect(0,G,W,90);
for(let i=0;i<W;i+=32){ctx.fillStyle="#6a4d2d";ctx.fillRect(i,G+18,20,3);}
}
function banner(x,col){ctx.strokeStyle="#6b4b22";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,G-55);ctx.lineTo(x,G-120);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x,G-118);ctx.quadraticCurveTo(x+22,G-112+Math.sin(Date.now()/250+x)*4,x,G-98);ctx.fill();}
function drawUnit(u,col){
 ctx.fillStyle=col;
 ctx.beginPath();ctx.arc(u.x,u.y-18,5,0,7);ctx.fill();
 ctx.fillRect(u.x-2,u.y-13,4,13);ctx.strokeStyle="#222";ctx.beginPath();ctx.moveTo(u.x-4,u.y);ctx.lineTo(u.x-8*u.d,u.y+8);ctx.moveTo(u.x+4,u.y);ctx.lineTo(u.x+8*u.d,u.y+8);ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(u.x,u.y-10);
 ctx.lineTo(u.x+6*u.d,u.y-4);
 ctx.strokeStyle=col;ctx.stroke();
}
function draw(){
 bg();banner(40,"#2d6cff");banner(W-40,"#c92b2b");
 ctx.strokeStyle="#553";
 for(const a of arrows){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x-a.vx*2,a.y);ctx.stroke();}
 A.forEach(u=>drawUnit(u,"#2d6cff"));
 B.forEach(u=>drawUnit(u,"#c92b2b"));
}
function loop(){
 if(run&&!paused){
  tick(A,B);tick(B,A);updateArrows();
  h1.style.width=(A.length/30*100)+"%";h2.style.width=(B.length/30*100)+"%";
  if(!A.length||!B.length){run=false;start.disabled=false;const w=A.length?"AI 1":"AI 2";msg.textContent=w+" wins";last.textContent=w;A.length?sc1.textContent=++s1:sc2.textContent=++s2;}
 }
 draw();requestAnimationFrame(loop);
}
start.onclick=()=>{A=make(false);B=make(true);arrows=[];run=true;start.disabled=true;msg.textContent="Battle";}
loop();
