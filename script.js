
const c=document.getElementById('c'),x=c.getContext('2d');
const W=c.width,H=c.height;const s=document.getElementById('start'),m=document.getElementById('msg'),h1=document.getElementById('h1'),h2=document.getElementById('h2'),last=document.getElementById('last'),sc1=document.getElementById('s1'),sc2=document.getElementById('s2');let score1=0,score2=0;document.getElementById('bgm').play().catch(()=>document.body.onclick=()=>document.getElementById('bgm').play());
let A=[],B=[],run=false;
function make(side){
 let arr=[];for(let i=0;i<35;i++)arr.push({x:side?W-140+Math.random()*100:20+Math.random()*100,y:30+i*13+Math.random()*8,h:18+Math.random()*10,atk:0.25+Math.random()*0.5,spd:0.6+Math.random()*0.8,r:4});
 return arr;
}
function reset(){A=make(0);B=make(1);run=true;s.disabled=true;m.textContent="Battle";}
function nearest(u,en){let best=null,d=1e9;for(const e of en){let dd=(u.x-e.x)**2+(u.y-e.y)**2;if(dd<d){d=dd;best=e}}return best}
function tick(team,en,dir){
 for(const u of [...team]){
  const t=nearest(u,en);if(!t)continue;
  const dx=t.x-u.x,dy=t.y-u.y,dist=Math.hypot(dx,dy);
  if(dist>8){u.x+=dx/dist*u.spd;u.y+=dy/dist*u.spd;}
  else{t.h-=u.atk*(0.5+Math.random())*((Math.random()<0.08)?3:1);}
 }
 for(let i=en.length-1;i>=0;i--)if(en[i].h<=0)en.splice(i,1);
}
function draw(){
 x.clearRect(0,0,W,H);
 x.strokeStyle="#4aa3ff";for(const u of A)x.strokeRect(u.x-3,u.y-3,6,6);x.fillStyle="#ff4040";for(const u of B)x.fillRect(u.x-3,u.y-3,6,6);
}
function loop(){
 if(run){
  tick(A,B,1);tick(B,A,-1);
  h1.style.width=(A.length/35*100)+"%";h2.style.width=(B.length/35*100)+"%";
  if(!A.length||!B.length){run=false;s.disabled=false;let w=A.length?"AI 1":"AI 2";m.textContent=w+" wins";last.textContent=w;if(A.length){score1++;sc1.textContent=score1}else{score2++;sc2.textContent=score2}}
 }
 draw();requestAnimationFrame(loop);
}
s.onclick=reset;loop();
