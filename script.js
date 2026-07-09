
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
 ctx.fillStyle="#87b7ff";ctx.fillRect(0,0,W,H);
 ctx.fillStyle="#4c8b3b";ctx.fillRect(0,G,W,H-G);
 ctx.fillStyle="#6a4a22";ctx.fillRect(0,G+18,W,72);
}
function drawUnit(u,col){
 ctx.fillStyle=col;
 ctx.beginPath();ctx.arc(u.x,u.y-18,5,0,7);ctx.fill();
 ctx.fillRect(u.x-2,u.y-13,4,13);
 ctx.beginPath();
 ctx.moveTo(u.x,u.y-10);
 ctx.lineTo(u.x+6*u.d,u.y-4);
 ctx.strokeStyle=col;ctx.stroke();
}
function draw(){
 bg();
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
