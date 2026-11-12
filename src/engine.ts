import {PARTS} from './data'
export const calc=(sel:string[],rk:any,ms:any,bm:number)=>{
const ps=PARTS.filter(p=>sel.includes(p.id));const sum=(k:string)=>ps.reduce((a,p)=>a+(p[k]||0),0)
const dry=sum('m'),fuel=sum('f');const isp=fuel?ps.reduce((a,p)=>a+(p.f||0)*(p.isp||0),0)/fuel:0
const dv=fuel&&dry?isp*9.81*Math.log((dry+fuel)/dry):0
const gen=ps.reduce((a,p)=>a+(p.p<0?-p.p:0),0),use=ps.reduce((a,p)=>a+(p.p>0?p.p:0),0)
const cost=sum('cost'),budget=ms.budget*bm,left=budget-cost-(rk?rk.cost:0),margin=rk?rk.cap-dry-fuel:0
const comm=sum('cm'),sci=sum('s'),rel=ps.length?ps.reduce((a,p)=>a+p.r,0)/ps.length:0
const err:string[]=[]
if(!sel.includes('bus'))err.push('Add a Spacecraft Bus.')
if(!fuel)err.push('Add a propulsion system.')
if(!rk)err.push('Select a launch vehicle.')
else if(margin<0)err.push(`WARNING: Exceeds launch payload capacity by ${Math.round(-margin)} kg.`)
if(use>gen)err.push(`POWER CRITICAL: Systems need ${use} W but only ${gen} W is generated.`)
if(left<0)err.push(`BUDGET: Over by $${Math.round(-left)}M.`)
if(fuel&&dv<ms.dv)err.push(`DELTA-V: ${Math.round(dv)} m/s available, ${ms.dv} m/s required.`)
if(comm<ms.comm)err.push(`COMMS: Capability ${comm}, mission needs ${ms.comm}.`)
return{dry,fuel,dv,gen,use,cost,budget,left,margin,comm,sci,rel,err,ok:!err.length}}
export const advise=(c:any,ms:any)=>{const a:string[]=[]
if(c.margin<0)a.push('ORBIT AI: Too heavy. Swap chemical for ion (less propellant mass), drop a low-priority instrument, or pick a bigger rocket.')
if(c.use>c.gen)a.push('ORBIT AI: Power deficit. Add solar arrays/RTG, or remove power-hungry items (ion thrusters, radar).')
if(c.fuel&&c.dv<ms.dv)a.push('ORBIT AI: Not enough delta-v. Ion thrusters give far more dv per kg of propellant, but need ~250 W.')
if(c.comm<ms.comm)a.push('ORBIT AI: Comms too weak for this distance. Add a High-Gain Antenna or Deep-Space Comms.')
if(c.sci<ms.sci)a.push(`ORBIT AI: Science ${c.sci}/${ms.sci}. Add instruments that suit the target.`)
if(c.left<0)a.push('ORBIT AI: Over budget. Choose a cheaper rocket or fewer instruments.')
return a.length?a:['ORBIT AI: Design looks balanced. Check margins, then launch.']}
export const score=(c:any,ms:any,rk:any,evPts:number,evMax:number,relD:number,launched:boolean)=>{
const obj=launched?300*Math.min(1,c.sci/ms.sci):0
const eng=200*Math.max(0,1-.6*Math.max(0,c.margin)/rk.cap-.4*Math.max(0,c.gen-c.use)/c.gen)
const bud=Math.min(150,150*Math.max(0,c.left)/c.budget*2)
const sci=launched?150*Math.min(1,c.sci/(ms.sci*1.5)):0
const rel=100*Math.max(0,Math.min(1,c.rel+relD)),emg=evMax?100*evPts/evMax:0
const t=Math.round(obj+eng+bud+sci+rel+emg)
return{obj,eng,bud,sci,rel,emg,total:t,pct:Math.round(t/10)}}
export const grade=(t:number)=>t>=900?'Legendary Mission':t>=750?'Successful Mission':t>=500?'Partial Success':'Mission Failure'
