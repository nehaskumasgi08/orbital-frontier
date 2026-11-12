import {useState,useEffect} from 'react'
import {Scene} from './Scene'
import {PARTS,ROCKETS,MISSIONS,EVENTS,DIFFS} from './data'
import {calc,advise,score,grade} from './engine'
const KEY='orbital-frontier-save'
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
const ACH=['Zero Budget Overrun','Power Master','Scientific Pioneer','Emergency Commander','Legendary Mission Architect']
export default function App(){
const [save,setSave]=useState<any>(load()||{unlocked:1,best:0,hist:[],ach:[]})
const [scr,setScr]=useState('start');const [name,setName]=useState('Nova');const [diff,setDiff]=useState('Explorer')
const [mi,setMi]=useState(0);const [sel,setSel]=useState<string[]>([]);const [rk,setRk]=useState<any>(null)
const [cd,setCd]=useState(5);const [t,setT]=useState(-1);const [evs,setEvs]=useState<any[]>([]);const [ei,setEi]=useState(0)
const [log,setLog]=useState<any[]>([]);const [res,setRes]=useState<any>(null);const [ok,setOk]=useState(true);const [prog,setProg]=useState(0)
const ms=MISSIONS[mi],bm=DIFFS[diff].b,c=calc(sel,rk,ms,bm)
useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(save))},[save])
const tog=(id:string)=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])
const start=()=>{setLog([]);setEi(0);setEvs([...EVENTS].sort(()=>Math.random()-.5).slice(0,DIFFS[diff].e));setCd(5);setT(-1);setScr('launch')}
useEffect(()=>{if(scr!=='launch')return
if(cd>0){const i=setTimeout(()=>setCd(cd-1),900);return()=>clearTimeout(i)}
const success=Math.random()<rk.r*(.9+.1*c.rel);setOk(success)
const i=setInterval(()=>setT(x=>{const n=x<0?0:x+.012;if(n>=(success?1:.45)){clearInterval(i);setTimeout(()=>success?(setProg(0),setScr('ops')):finish([],success),900)}return n}),30)
return()=>clearInterval(i)},[scr,cd])
const decide=(ch:any)=>{const nl=[...log,{ev:evs[ei],ch}];setLog(nl);if(ei+1<evs.length)setEi(ei+1);else finish(nl,true)}
const finish=(nl:any[],launched:boolean)=>{const pts=nl.reduce((a,x)=>a+x.ch.pts,0),rd=nl.reduce((a,x)=>a+x.ch.rel,0)
const s=score(c,ms,rk,pts,nl.length*10,rd,launched);const a:string[]=[]
if(launched&&c.left>=0)a.push(ACH[0]);if(c.gen>=c.use*1.1&&c.gen<=c.use*1.6)a.push(ACH[1]);if(s.sci>=130)a.push(ACH[2]);if(s.emg>=80&&nl.length)a.push(ACH[3]);if(s.total>=900)a.push(ACH[4])
setRes({s,a,nl,launched});setSave((v:any)=>({unlocked:s.total>=500?Math.max(v.unlocked,Math.min(5,mi+2)):v.unlocked,best:Math.max(v.best,s.total),hist:[{n:name,m:ms.n,sc:s.total,d:diff},...v.hist].slice(0,10),ach:[...new Set([...v.ach,...a])]}));setScr('report')}
const reset=()=>{setSel([]);setRk(null);setRes(null);setScr('missions')}
const parts=PARTS.filter(p=>sel.includes(p.id)).map(p=>p.id)
const mode=scr==='start'?'earth':scr==='launch'?'launch':scr==='ops'?'ops':'build'
return <div className="app"><div className="view"><Scene mode={mode} parts={parts} t={t}/>
<div style={{position:'absolute',top:8,left:12}}><b>ORBITAL FRONTIER</b> <small>Simulated educational data - not real NASA telemetry</small></div></div>
<div className="side">
{scr==='start'&&<><h1>MISSION CONTROL ONLINE</h1><p>Humanity is preparing for its next great discovery. You have been selected as Chief Mission Architect.</p>
<input value={name} onChange={e=>setName(e.target.value)} placeholder="Callsign"/><br/>
{Object.keys(DIFFS).map(d=><button key={d} className={d===diff?'on':''} onClick={()=>setDiff(d)}>{d}</button>)}
<div className="card edu"><b>How to play:</b> 1) Pick a mission. 2) Build the spacecraft (drag the 3D view to rotate). 3) Pick a rocket. 4) Fix every warning, then launch. 5) Make decisions during emergencies. Higher difficulty = tighter budgets and more events.</div>
<button onClick={()=>setScr('missions')}>START MISSION</button><p><small>Best: {save.best} | Achievements: {save.ach.length}/5</small></p>
<h3>Achievements</h3>{ACH.map(a=><div key={a} className={save.ach.includes(a)?'ok':''}>{save.ach.includes(a)?'★':'☆'} {a}</div>)}
<h3>History</h3>{save.hist.map((h:any,i:number)=><small key={i} style={{display:'block'}}>{h.n} - {h.m} ({h.d}): {h.sc}</small>)}</>}
{scr==='missions'&&<><h2>Mission Selection</h2>{MISSIONS.map(m=><div className="card" key={m.id}><b>0{m.id+1}: {m.n}</b> {m.id>=save.unlocked&&'🔒'}<br/><small>{m.o}<br/>Budget ${Math.round(m.budget*bm)}M | Needs {m.dv} m/s dv | ~{m.days} days | Science {m.sci} | Comms {m.comm}<br/>Risks: {m.risk}</small><br/>
<button disabled={m.id>=save.unlocked} onClick={()=>{setMi(m.id);setSel([]);setRk(null);setScr('lab')}}>{m.id>=save.unlocked?'Score 500+ on previous mission':'Brief & Build'}</button></div>)}</>}
{scr==='lab'&&<><h2>Spacecraft Lab: {ms.n}</h2>
<div className="card"><b>Mission briefing:</b> {ms.o} Risks: {ms.risk}.</div>
<div className="card"><b>Dashboard</b> (live)<br/>Mass {Math.round(c.dry+c.fuel)} kg (fuel {c.fuel}) | Payload margin {rk?Math.round(c.margin):'-'} kg<br/>Power {c.gen} W gen / {c.use} W used<br/>Budget left ${Math.round(c.left)}M | Delta-v {Math.round(c.dv)}/{ms.dv} m/s<br/>Comms {c.comm}/{ms.comm} | Science {c.sci}/{ms.sci} | Reliability {(c.rel*100).toFixed(1)}%</div>
{c.err.map((e,i)=><div key={i} className="warn">⚠ {e}</div>)}
<div className="card edu">{advise(c,ms).map((a,i)=><div key={i}>{a}</div>)}</div>
<h3>Rocket</h3>{ROCKETS.map(r=><button key={r.id} className={rk?.id===r.id?'on':''} onClick={()=>setRk(r)}>{r.n}<br/><small>{r.cap} kg | ${r.cost}M | {r.r*100}%</small></button>)}
{['Structure','Propulsion','Power','Science','Comms','Navigation'].map(cat=><div key={cat}><h3>{cat}</h3>{PARTS.filter(p=>p.c===cat).map(p=><button key={p.id} className={sel.includes(p.id)?'on':''} title={p.t} onClick={()=>tog(p.id)}>{p.n}<br/><small>{p.m}kg {p.p>0?`-${p.p}`:`+${-p.p}`}W ${p.cost}M</small></button>)}</div>)}
<div className="card edu">Mass: every kg needs fuel to move it, so extra parts cost range. Power: instruments stop working if demand exceeds generation. Delta-v is your "fuel budget" for changing speed.</div>
<button disabled={!c.ok} onClick={start}>🚀 LAUNCH</button><button onClick={()=>setScr('missions')}>Back</button></>}
{scr==='launch'&&<><h2>Launchpad</h2><h1>{cd>0?`T-${cd}`:t<1?(ok?'LIFTOFF!':'ASCENT...'):'STAGE SEPARATION'}</h1>{!ok&&t>.4&&<h2 className="warn">ANOMALY - VEHICLE LOST</h2>}<p className="edu">Launch vehicle reliability {(rk.r*100).toFixed(0)}% x spacecraft reliability decide launch success. Rockets are the heaviest, costliest part of a mission.</p></>}
{scr==='ops'&&evs[ei]&&<><h2>Mission Operations</h2><div className="bar"><i style={{width:`${(ei/evs.length)*100}%`}}/></div><small>Event {ei+1}/{evs.length} | MET day {Math.round(ms.days*ei/evs.length)} | Simulated telemetry</small>
<div className="card"><h3 className="warn">{evs[ei].t}</h3>{evs[ei].d}<p className="edu">{evs[ei].edu}</p>{evs[ei].ch.map((h:any)=><button key={h.l} onClick={()=>decide(h)}>{h.l}</button>)}</div>
<h3>Event log</h3>{log.map((x,i)=><div key={i}><small>{x.ev.t}: <b>{x.ch.l}</b> - {x.ch.res}</small></div>)}</>}
{scr==='report'&&res&&<><h1>{res.launched?'MISSION COMPLETE':'MISSION LOST'}</h1><h2>{grade(res.s.total)}: {res.s.total}/1000</h2><small>Success {res.s.pct}%</small>
<div className="card">{([['Objectives',res.s.obj,300],['Engineering',res.s.eng,200],['Budget',res.s.bud,150],['Science',res.s.sci,150],['Reliability',res.s.rel,100],['Emergencies',res.s.emg,100]] as any[]).map(([n,v,m])=><div key={n}>{n}: {Math.round(v)}/{m}<div className="bar"><i style={{width:`${v/m*100}%`}}/></div></div>)}</div>
<div className="card"><b>Debrief</b><br/>Objective: {ms.o}<br/>Craft: {parts.join(', ')} on {rk.n}<br/>Delta-v {Math.round(c.dv)} m/s, power {c.gen}/{c.use} W, budget left ${Math.round(c.left)}M<br/>{res.nl.map((x:any,i:number)=><div key={i}>• {x.ev.t}: {x.ch.l} ({x.ch.res})</div>)}{!res.launched&&<div className="warn">Launch failure ended the mission.</div>}
<p className="edu">Lessons: {res.nl.length?res.nl.map((x:any)=>x.ev.edu).join(' '):'Reliability margins matter - redundancy and a proven rocket reduce launch risk.'}</p></div>
{res.a.map((a:string)=><div key={a} className="ok">★ Achievement: {a}</div>)}<p><b>YOU DIDN'T JUST PLAY A GAME. YOU DESIGNED A SPACE MISSION.</b></p>
<button onClick={()=>setScr('lab')}>Replay (change design)</button><button onClick={reset}>Missions</button><button onClick={()=>setScr('start')}>Command Center</button></>}
</div></div>}
