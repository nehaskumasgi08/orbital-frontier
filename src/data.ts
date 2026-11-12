export const PARTS:any[]=[
{id:'bus',n:'Spacecraft Bus',c:'Structure',m:150,p:20,cost:30,s:0,r:.97,t:'Main structure housing avionics.'},
{id:'tps',n:'Thermal Protection',c:'Structure',m:40,p:0,cost:10,s:0,r:.98,t:'Shields against heat extremes.'},
{id:'chem',n:'Chemical Propulsion',c:'Propulsion',m:120,p:5,cost:40,s:0,r:.95,f:900,isp:320,t:'High thrust, low efficiency (Isp 320 s).'},
{id:'ion',n:'Ion Thrusters',c:'Propulsion',m:80,p:250,cost:60,s:0,r:.93,f:150,isp:3000,t:'Very efficient (Isp 3000 s) but power hungry.'},
{id:'solar',n:'Solar Arrays',c:'Power',m:60,p:-400,cost:20,s:0,r:.97,t:'Generates 400 W near Earth.'},
{id:'batt',n:'Battery Pack',c:'Power',m:40,p:-60,cost:12,s:0,r:.98,t:'Buffers power during eclipse.'},
{id:'rtg',n:'Radioisotope Power',c:'Power',m:45,p:-150,cost:80,s:0,r:.99,t:'Steady power far from the Sun.'},
{id:'cam',n:'HiRes Camera',c:'Science',m:20,p:40,cost:25,s:20,r:.96,t:'Imaging of surface and targets.'},
{id:'spec',n:'Spectrometer',c:'Science',m:35,p:60,cost:35,s:30,r:.95,t:'Identifies chemical composition.'},
{id:'radar',n:'Radar',c:'Science',m:50,p:120,cost:45,s:30,r:.94,t:'Maps subsurface structure.'},
{id:'mag',n:'Magnetometer',c:'Science',m:10,p:10,cost:15,s:15,r:.97,t:'Measures magnetic fields.'},
{id:'atm',n:'Atmospheric Analyzer',c:'Science',m:30,p:50,cost:30,s:25,r:.95,t:'Samples gases.'},
{id:'rad',n:'Radiation Detector',c:'Science',m:12,p:15,cost:12,s:10,r:.98,t:'Measures radiation hazards.'},
{id:'lga',n:'Low-Gain Antenna',c:'Comms',m:5,p:10,cost:5,s:0,r:.99,cm:1,t:'Wide beam, low data rate.'},
{id:'hga',n:'High-Gain Antenna',c:'Comms',m:30,p:60,cost:25,s:0,r:.96,cm:3,t:'Focused beam, high data rate.'},
{id:'dsn',n:'Deep-Space Comms',c:'Comms',m:60,p:110,cost:50,s:0,r:.95,cm:5,t:'Long-range transmitter.'},
{id:'star',n:'Star Tracker',c:'Navigation',m:8,p:10,cost:15,s:0,r:.97,nv:1,t:'Finds orientation from stars.'},
{id:'comp',n:'Navigation Computer',c:'Navigation',m:10,p:30,cost:20,s:0,r:.96,nv:1,t:'Computes trajectory fixes.'},
{id:'auto',n:'Autonomous Guidance',c:'Navigation',m:15,p:45,cost:35,s:0,r:.94,nv:2,t:'Self-corrects when comms lag.'}]
export const ROCKETS=[{id:0,n:'Lightweight Launcher',cap:1200,cost:40,r:.9},{id:1,n:'Medium-Lift Launcher',cap:2500,cost:90,r:.94},{id:2,n:'Heavy-Lift Launcher',cap:5000,cost:180,r:.96},{id:3,n:'Super-Heavy Launcher',cap:9000,cost:320,r:.98}]
export const MISSIONS=[
{id:0,n:'Lunar Discovery',o:'Explore the Moon and find valuable regions.',budget:350,dv:2500,days:4,sci:60,comm:1,risk:'Lunar dust, radiation',col:'#aaa'},
{id:1,n:'Mars Frontier',o:'Study Mars geology; seek evidence of past habitability.',budget:600,dv:4500,days:210,sci:90,comm:3,risk:'Dust storms, long delay',col:'#c5502a'},
{id:2,n:'Asteroid Defender',o:'Investigate an asteroid for planetary defense.',budget:500,dv:4000,days:300,sci:80,comm:3,risk:'Weak gravity, navigation',col:'#876'},
{id:3,n:'Jupiter Expedition',o:'Study Jupiter and its moons.',budget:800,dv:6500,days:1800,sci:110,comm:5,risk:'Extreme radiation, low sunlight',col:'#d9a066'},
{id:4,n:'Deep Space Odyssey',o:'Long-duration mission: power, comms, reliability.',budget:900,dv:8000,days:3000,sci:100,comm:5,risk:'Reliability over years',col:'#59f'}]
export const DIFFS:any={Cadet:{b:1.3,e:2},Explorer:{b:1,e:3},Commander:{b:.85,e:4}}
export const EVENTS:any[]=[
{t:'Solar Panel Damage',d:'A micrometeorite hit a solar panel.',edu:'Power budgets must have margin; damage cuts generation.',ch:[{l:'Shed non-essential loads',res:'Power stabilised, some science paused.',pts:9,rel:0},{l:'Attempt repair',res:'Partial repair; risk accepted.',pts:6,rel:-.02},{l:'Ignore it',res:'Brownouts hit instruments.',pts:0,rel:-.08}]},
{t:'Communication Failure',d:'Signal to Earth is lost.',edu:'Deep-space links depend on antenna gain and redundancy.',ch:[{l:'Switch to backup antenna',res:'Link restored.',pts:10,rel:0},{l:'Reboot transmitter',res:'Link flaky but returns.',pts:5,rel:-.02},{l:'Wait',res:'Hours of data lost.',pts:1,rel:-.05}]},
{t:'Fuel Leak',d:'Propellant is dropping unexpectedly.',edu:'Delta-v comes from propellant; Tsiolkovsky: dv = Isp*g*ln(m0/m1).',ch:[{l:'Isolate the line and recompute burns',res:'Leak sealed; plan adjusted.',pts:10,rel:0},{l:'Reduce burn size',res:'Longer trip but safe.',pts:6,rel:0},{l:'Continue as planned',res:'Fuel runs thin.',pts:0,rel:-.08}]},
{t:'Temperature Crisis',d:'Temperatures are fluctuating abnormally.',edu:'Thermal control keeps electronics in range.',ch:[{l:'Activate heaters/radiators',res:'Temps nominal.',pts:10,rel:0},{l:'Re-orient spacecraft',res:'Helps partially.',pts:6,rel:-.01},{l:'Do nothing',res:'Electronics stressed.',pts:0,rel:-.07}]},
{t:'Navigation Deviation',d:'Spacecraft is off planned trajectory.',edu:'Small errors grow over distance; correction burns cost delta-v.',ch:[{l:'Correction maneuver',res:'Back on course.',pts:10,rel:0},{l:'Accept longer route',res:'Arrive late.',pts:5,rel:0},{l:'Ignore',res:'Large miss distance.',pts:0,rel:-.08}]},
{t:'Scientific Discovery',d:'An unexpected signal is detected.',edu:'Instruments plus flexible operations enable discovery.',ch:[{l:'Redirect resources to investigate',res:'Major discovery logged!',pts:10,rel:-.01},{l:'Log and continue',res:'Data saved for later.',pts:6,rel:0},{l:'Ignore',res:'Opportunity missed.',pts:1,rel:0}]}]
