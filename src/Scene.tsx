import {Canvas,useFrame} from '@react-three/fiber'
import {OrbitControls,Stars} from '@react-three/drei'
import {useRef} from 'react'
function Earth(){const r=useRef<any>();useFrame((_,d)=>{r.current.rotation.y+=d*.1})
return <group ref={r}><mesh><sphereGeometry args={[3,48,48]}/><meshStandardMaterial color="#1c5fb5" roughness={.8}/></mesh>
<mesh scale={1.02}><sphereGeometry args={[3,32,32]}/><meshStandardMaterial color="#fff" transparent opacity={.12}/></mesh>
<mesh scale={1.08}><sphereGeometry args={[3,32,32]}/><meshBasicMaterial color="#4af" transparent opacity={.12}/></mesh></group>}
export function Craft({parts,spin=true}:any){const r=useRef<any>();useFrame((_,d)=>{if(spin)r.current.rotation.y+=d*.4})
const h=(i:string)=>parts.includes(i);const sci=['cam','spec','radar','mag','atm','rad'].filter(h)
return <group ref={r}>{h('bus')&&<mesh><boxGeometry args={[1,1,1]}/><meshStandardMaterial color="#ccd" metalness={.7} roughness={.3}/></mesh>}
{h('tps')&&<mesh position={[0,.55,0]}><cylinderGeometry args={[.6,.7,.1,24]}/><meshStandardMaterial color="#b85"/></mesh>}
{(h('solar')||h('rtg')||h('batt'))&&[-1,1].map(s=><mesh key={s} position={[s*1.6,0,0]}><boxGeometry args={[1.8,.05,1]}/><meshStandardMaterial color={h('solar')?'#13a':'#555'} emissive={h('solar')?'#024':'#000'}/></mesh>)}
{(h('hga')||h('dsn'))&&<mesh position={[0,.9,0]} rotation={[Math.PI,0,0]}><coneGeometry args={[.5,.3,24]}/><meshStandardMaterial color="#fff"/></mesh>}
{h('lga')&&<mesh position={[.4,.7,.4]}><cylinderGeometry args={[.02,.02,.5]}/><meshStandardMaterial color="#fff"/></mesh>}
{(h('chem')||h('ion'))&&<mesh position={[0,-.8,0]}><coneGeometry args={[.3,.6,16]}/><meshStandardMaterial color={h('ion')?'#4df':'#f93'} emissive={h('ion')?'#08a':'#420'}/></mesh>}
{sci.map((s,i)=><mesh key={s} position={[-.55,.35-i*.2,.3]}><boxGeometry args={[.15,.15,.15]}/><meshStandardMaterial color="#5ef" emissive="#046"/></mesh>)}
{(h('star')||h('comp')||h('auto'))&&<mesh position={[.55,-.3,.3]}><boxGeometry args={[.15,.15,.15]}/><meshStandardMaterial color="#fa4"/></mesh>}</group>}
function Rocket({t}:any){const y=Math.max(0,t)*60
useFrame(({camera})=>{camera.position.set(8,3+y*.6,12);camera.lookAt(0,y,0)})
return <group position={[0,y,0]}><mesh><cylinderGeometry args={[.5,.5,4,20]}/><meshStandardMaterial color="#eee"/></mesh>
<mesh position={[0,2.5,0]}><coneGeometry args={[.5,1,20]}/><meshStandardMaterial color="#f55"/></mesh>
{t>0&&<mesh position={[0,-3,0]} rotation={[Math.PI,0,0]} scale={[1,1+Math.random()*.4,1]}><coneGeometry args={[.45,2,12]}/><meshBasicMaterial color="#fa3"/></mesh>}</group>}
export function Scene({mode,parts,t=0}:any){return <Canvas dpr={[1,1.5]} camera={{position:[0,2,8],fov:50}}>
<color attach="background" args={['#02040a']}/><ambientLight intensity={.4}/><directionalLight position={[5,5,5]} intensity={2}/>
<Stars radius={100} depth={50} count={2500} factor={4} fade/>
{mode==='earth'&&<><Earth/><group position={[0,3.8,0]}><Craft parts={['bus','solar','hga','chem']}/></group></>}
{mode==='build'&&<><Craft parts={parts}/><OrbitControls enablePan={false}/></>}
{mode==='launch'&&<><mesh position={[0,-2.5,0]}><boxGeometry args={[40,1,40]}/><meshStandardMaterial color="#343"/></mesh><Rocket t={t}/></>}
{mode==='ops'&&<><Craft parts={parts}/><OrbitControls enablePan={false}/></>}</Canvas>}
