import{useCallback,useEffect,useRef,useState}from'react'
import{LazyMotion,domAnimation,m,AnimatePresence,MotionConfig,useScroll,useTransform,useMotionValue,useSpring,useMotionValueEvent,useReducedMotion}from'framer-motion'

const E=import.meta.env,SB=E.VITE_SUPABASE_URL,KEY=E.VITE_SUPABASE_ANON_KEY,TABLE='versions',MAIL='vilkji20@gmail.com',TRAILER=''
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches
const AND=/Android/i.test(navigator.userAgent)
const ease=[.22,1,.36,1],SP={stiffness:220,damping:18}

const sky=(W,B,H,s)=>{let d=`M0 ${B}`,x=0,k=s;while(x<W){k=(k*9301+49297)%233280;const w=(W/40+k%(W/18))|0;d+=`V${(B-H*.35-(k%997)/997*H*.65)|0}H${x+w}`;x+=w}return d+`V${B}Z`}
const SKY1=sky(1600,400,340,7),SKY2=sky(1600,400,260,3)
const bld=(W,H,s,mn)=>{const a=[];let x=0,k=s;while(x<W){k=(k*9301+49297)%233280;const w=(W/40+k%(W/18))|0;a.push([x,w,(H*mn+(k%997)/997*H*(1-mn))|0]);x+=w}return a}
const MID=bld(1600,330,11,.4).map(([x,w,h],i)=><g key={i}><rect x={x} y={400-h} width={w} height={h} fill="#120f2a"/>{w>24&&<rect x={x+6} y={412-h} width={w-12} height={h-12} fill={`url(#w${i%2})`}/>}</g>)
const NEAR=bld(1600,210,23,.3).map(([x,w,h],i)=>{const y=400-h,c=x+w/2|0;return<g key={i}><rect x={x} y={y} width={w} height={h} fill="#08090f"/>{i%3===0&&<><path d={`M${c} ${y}v-26`} stroke="#08090f" strokeWidth="3"/><circle cx={c} cy={y-26} r="3" fill="#ff2e4d" className="blink" style={{animationDelay:i*.4+'s'}}/></>}{i%4===1&&<rect x={x+8} y={y-14} width="18" height="14" fill="#08090f"/>}{i%5===2&&<path d={`M${x} ${y+1}h${w}`} stroke="#ff2e4d" strokeWidth="2" opacity=".7"/>}</g>})
const Strip=({d,children})=><div className="strip" style={{animationDuration:d}}>{[0,1,2].map(i=><svg key={i} viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true">{children}</svg>)}</div>
const PT=Array.from({length:24},(_,i)=>({l:(i*37)%100,t:(i*53)%90,d:(i%5)+5,s:i%3+2}))
const JP='M20 200q55-130 110 0q55-130 110 0q55-130 110 0q55-130 110 0'

const T={
tr:{nav:[['ozellikler','Özellikler'],['fragman','Fragman'],['indir','İndir'],['hakkimizda','Hakkımızda']],pre:'VILKJI GAMES SUNAR',sl:'Yerçekimi senin silahın.',hp:'Bunny hop ile hız kazan, havada nişan al, arenaya hükmet. PC ve Android için online rekabetçi FPS.',play:'OYNA / İNDİR',acc:'HESAP OLUŞTUR',scroll:'KAYDIR',st:[['PC','Windows'],['ANDROID','Mobil'],['ONLINE','Rekabetçi']],w:{k:'ÖZELLİKLER · ARSENAL',h:'Silahlar',p:'Her silahın mesafeye göre kafa, gövde ve bacak hasarı. Rakibin kalkanını seç: tek atışta öldüren değerler kırmızı yanar.',ty:{rifle:'Tüfek',sniper:'Keskin nişancı',pistol:'Tabanca',melee:'Yakın dövüş'},names:['M4','AWP','Revolver','Tabanca','Bıçak'],dmg:'Gövde hasarı',rate:'Atış hızı',mag:'Şarjör',ps:'/sn',range:'Mesafe',head:'Kafa',body:'Gövde',leg:'Bacak',rl:{a:'Tüm mesafeler',l:'Hafif vuruş',h:'Ağır vuruş'},sh:'Rakibin kalkanı',shn:['Yok','Yarım','Tam'],hp:'can',one:'Tek atışta öldürür',shk:'SAVUNMA',shh:'Kalkanlar',shp:'Kalkan, 100 canın üstüne eklenen ekstra dayanıklılıktır. Satın alma menüsünden alınır.',shc:['Kalkansız','Yarım kalkan','Tam kalkan'],tot:'Toplam'},vk:'MEDYA',vh:'Fragman',vp:'Oynat',vs:'Fragman yakında',dk:'İNDİR',dh:'Arenaya katıl',pc:'Windows',and:'Android',soon:'Yakında',ver:'Sürüm',auto:'Oyun açılışta kendini günceller.',none:'İndirme çok yakında.',nk:'Yama Notları',noNotes:'Henüz yama notu yok.',ak:'STÜDYO',ap:'Vilkji Games, oynamak istediğimiz oyunları kendimiz yapmak için kuruldu. İlk oyunumuz FAHRNYT, akıcı hareketi ve sert rekabeti tek arenada buluşturuyor. Hedefimiz PC ve mobilde aynı hissi veren oyunlar.',ct:'İletişim',cp:'Soru, öneri ya da hata bildirimi için bize yaz.',rights:'Tüm hakları saklıdır.',m:{h:'Hesap oluştur',note:'Aynı hesapla oyuna giriş yaparsın.',mail:'E-posta',pass:'Şifre (en az 6 karakter)',go:'KAYIT OL',ok:'Doğrulama e-postası gönderildi. Gelen kutunu kontrol et.',off:'Kayıt sistemi yakında açılıyor.',err:'Bir hata oluştu.',close:'Kapat'}},
en:{nav:[['ozellikler','Features'],['fragman','Trailer'],['indir','Download'],['hakkimizda','About']],pre:'VILKJI GAMES PRESENTS',sl:'Gravity is your weapon.',hp:'Build speed with bunny hops, aim mid-air, own the arena. An online competitive FPS for PC and Android.',play:'PLAY / DOWNLOAD',acc:'CREATE ACCOUNT',scroll:'SCROLL',st:[['PC','Windows'],['ANDROID','Mobile'],['ONLINE','Competitive']],w:{k:'FEATURES · ARSENAL',h:'Weapons',p:'Head, body and leg damage for every weapon by range. Pick the enemy shield: one-shot values light up red.',ty:{rifle:'Rifle',sniper:'Sniper',pistol:'Pistol',melee:'Melee'},names:['M4','AWP','Revolver','Pistol','Knife'],dmg:'Body damage',rate:'Fire rate',mag:'Magazine',ps:'/s',range:'Range',head:'Head',body:'Body',leg:'Leg',rl:{a:'All ranges',l:'Light hit',h:'Heavy hit'},sh:'Enemy shield',shn:['None','Half','Full'],hp:'HP',one:'One-shot kill',shk:'DEFENSE',shh:'Shields',shp:'Shields add extra durability on top of 100 HP. Get them from the buy menu.',shc:['No shield','Half shield','Full shield'],tot:'Total'},vk:'MEDIA',vh:'Trailer',vp:'Play',vs:'Trailer coming soon',dk:'DOWNLOAD',dh:'Join the arena',pc:'Windows',and:'Android',soon:'Coming soon',ver:'Version',auto:'The game updates itself on launch.',none:'Download coming very soon.',nk:'Patch Notes',noNotes:'No patch notes yet.',ak:'STUDIO',ap:'Vilkji Games was founded to make the games we want to play. Our first title, FAHRNYT, brings fluid movement and hard competition into one arena. Our goal: games that feel the same on PC and mobile.',ct:'Contact',cp:'Questions, ideas or bug reports — write to us.',rights:'All rights reserved.',m:{h:'Create account',note:'Use the same account to log in to the game.',mail:'Email',pass:'Password (min. 6 characters)',go:'SIGN UP',ok:'Verification email sent. Check your inbox.',off:'Sign-up opens soon.',err:'Something went wrong.',close:'Close'}}}

let vc
const getV=()=>vc||=(SB&&KEY?fetch(`${SB}/rest/v1/${TABLE}?select=*&order=created_at.desc&limit=20`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}}).then(r=>r.ok?r.json():[]).catch(()=>[]):Promise.resolve([]))
const useV=()=>{const[v,s]=useState(null);useEffect(()=>{let a=1;getV().then(d=>a&&s(d));return()=>{a=0}},[]);return v}
const jump=(id,s)=>id?document.getElementById(id)?.scrollIntoView({behavior:s&&!RM?'smooth':'auto'}):scrollTo({top:0,behavior:RM?'auto':'smooth'})
const up=d=>({initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{delay:d,duration:.7,ease}})

const Mark=({s=28})=><svg width={s} height={s} viewBox="0 0 64 64" aria-hidden="true"><path d="M17 54V14h22M17 33h15" fill="none" stroke="var(--color-red)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/><path d="M39 14q7-10 14-1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 5"/><circle cx="54" cy="16" r="4" fill="var(--color-cyan)"/></svg>
const Dot=({p,r=9,c='var(--color-cyan)',d='2.6s'})=>RM?null:<circle r={r} fill={c}><animateMotion dur={d} repeatCount="indefinite" path={p}/></circle>

const Btn=({v,children,className='',...p})=><m.button whileHover={{y:-3}} whileTap={{scale:.96}} className={(v?'btn-line ':'btn-glow ')+className}{...p}><span>{children}</span></m.button>

const Tilt=({as,children,...p})=>{const C=as==='a'?m.a:as==='div'?m.div:m.button,rx=useMotionValue(0),ry=useMotionValue(0),sx=useSpring(rx,SP),sy=useSpring(ry,SP)
return<C {...p} style={{rotateX:sx,rotateY:sy,transformPerspective:900}} whileTap={{scale:.97}} onPointerMove={e=>{if(e.pointerType!=='mouse')return;const b=e.currentTarget.getBoundingClientRect();ry.set(((e.clientX-b.left)/b.width-.5)*12);rx.set(((e.clientY-b.top)/b.height-.5)*-12)}} onPointerLeave={()=>{rx.set(0);ry.set(0)}}>{children}</C>}

const Rv=({d=0,className,children})=><m.div className={className} initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:1,delay:d,ease}}>{children}</m.div>

const Sec=({id,k,h,c='',children})=><section id={id} className={'relative overflow-hidden py-24 md:py-32 '+c}>
<m.div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-[10%] z-20 w-[70%] bg-[linear-gradient(90deg,transparent,#ff2e4d14,#1fe3ff10,transparent)]" style={{skewX:-20}} initial={{x:'-120%'}} whileInView={{x:'220%'}} viewport={{once:true,amount:.4}} transition={{duration:1.6,ease:'linear'}}/>
<div className="wr relative"><Rv><p className="kick">{k}</p></Rv><h2 className="mt-3 overflow-hidden font-head text-[clamp(44px,8vw,96px)] font-extrabold uppercase leading-[.9]"><m.span className="block" initial={{y:'105%'}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:.8,ease}}>{h}</m.span></h2>{children}</div></section>

const Prog=()=>{const{scrollYProgress:p}=useScroll();return<m.div style={{scaleX:p}} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-red"/>}

const Nav=({t,lang,sl,nav,path})=>{const{scrollY}=useScroll(),[s,ss]=useState(false),[o,so]=useState(false)
useMotionValueEvent(scrollY,'change',v=>ss(v>40))
const go=id=>{so(false);nav(id)},lb=<button onClick={()=>sl(lang==='tr'?'en':'tr')} className="cut bg-white/5 px-3 py-1.5 font-head text-sm tracking-widest transition-colors hover:bg-red/30">{lang==='tr'?'EN':'TR'}</button>
return<header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${s||o?'border-b border-white/10 bg-ink/75 backdrop-blur-xl':''}`}>
<div className="wr flex h-16 items-center justify-between"><button onClick={()=>go()} className="flex items-center gap-2 font-head text-2xl font-bold tracking-wide"><Mark/>VILKJI<span className="font-semibold text-mute">GAMES</span></button>
<nav className="hidden items-center gap-8 md:flex">{t.nav.map(([id,n])=><button key={id} onClick={()=>go(id)} className={`relative font-head text-lg uppercase tracking-wider transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:bg-red after:transition-transform hover:text-metal hover:after:scale-x-100 ${path==='/'+id?'text-metal after:scale-x-100':'text-mute after:scale-x-0'}`}>{n}</button>)}{lb}</nav>
<button onClick={()=>so(!o)} aria-label="menu" className="relative size-10 md:hidden">{[1,-1].map(d=><m.span key={d} className="absolute inset-x-2 top-1/2 h-0.5 bg-metal" animate={o?{rotate:45*d,y:0}:{rotate:0,y:-4*d}}/>)}</button></div>
<AnimatePresence>{o&&<m.nav initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} className="wr pb-6 md:hidden">{t.nav.map(([id,n],i)=><m.button key={id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*.05}} onClick={()=>go(id)} className="block w-full border-b border-white/10 py-4 text-left font-head text-2xl uppercase">{n}</m.button>)}<div className="mt-5">{lb}</div></m.nav>}</AnimatePresence></header>}

const Hero=({t,play,acc})=>{const r=useRef(),{scrollYProgress:p}=useScroll({target:r,offset:['start start','end start']})
const yB=useTransform(p,[0,1],['0%','35%']),yF=useTransform(p,[0,1],['0%','24%']),yM=useTransform(p,[0,1],['0%','18%']),yN=useTransform(p,[0,1],['0%','12%']),yT=useTransform(p,[0,1],['0%','45%']),oT=useTransform(p,[0,.75],[1,0])
const mx=useMotionValue(0),sx=useSpring(mx,{stiffness:50,damping:18}),xF=useTransform(sx,v=>v*-24),xM=useTransform(sx,v=>v*-38),xN=useTransform(sx,v=>v*-56),xT=useTransform(sx,v=>v*14)
return<section ref={r} onPointerMove={e=>e.pointerType==='mouse'&&mx.set(e.clientX/innerWidth-.5)} className="relative flex h-[100svh] min-h-[640px] items-center overflow-hidden">
<m.div style={{y:yB}} className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_5%,#1c1550,transparent_70%),radial-gradient(45%_40%_at_85%_40%,#ff2e4d38,transparent_70%),radial-gradient(40%_40%_at_8%_55%,#1fe3ff22,transparent_70%)]"/>{PT.map((q,i)=><span key={i} className={`pt absolute rounded-full ${i%2?'bg-cyan max-md:hidden':'bg-red'}`} style={{left:q.l+'%',top:q.t+'%',width:q.s,height:q.s,animationDuration:q.d+'s',animationDelay:-q.d*q.l/100+'s'}}/>)}</m.div>
<svg width="0" height="0" className="absolute" aria-hidden="true"><defs>{['#1fe3ff','#ffb547'].map((c,i)=><pattern key={i} id={'w'+i} width="14" height="20" patternUnits="userSpaceOnUse"><rect x="3" y="4" width="6" height="8" fill={c} opacity={i?.3:.4}/></pattern>)}</defs></svg>
<m.div style={{y:yF}} className="absolute inset-x-0 bottom-[24%] h-[46%]"><m.div style={{x:xF}} className="absolute inset-0"><Strip d="110s"><path d={SKY1} fill="#1c1550" opacity=".75"/></Strip></m.div></m.div>
<m.div style={{y:yM}} className="absolute inset-x-0 bottom-[24%] h-[36%]"><m.div style={{x:xM}} className="absolute inset-0"><Strip d="60s">{MID}</Strip></m.div></m.div>
<m.div style={{y:yN}} className="absolute inset-x-0 bottom-[24%] h-[24%]"><m.div style={{x:xN}} className="absolute inset-0"><Strip d="30s">{NEAR}</Strip></m.div></m.div>
<div className="floor"><b><i/></b></div>
<svg viewBox="0 0 480 240" className="absolute right-[2%] top-[16%] hidden w-[46%] md:block" aria-hidden="true"><path d={JP} className="dash" fill="none" stroke="var(--color-red)" strokeWidth="2.5" strokeDasharray="6 10" strokeLinecap="round"/><Dot p={JP} r={8}/></svg>
<m.div style={{y:yT,x:xT,opacity:oT}} className="wr relative z-10 pt-16">
<m.p initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{delay:.15,duration:.6,ease}} className="kick">{t.pre}</m.p>
<h1 className="mt-4 overflow-hidden font-head text-[clamp(72px,21vw,260px)] font-extrabold uppercase leading-[.85] tracking-tight"><m.span className="gi relative block" data-t="FAHRNYT" initial={{y:'100%'}} animate={{y:0}} transition={{duration:.9,delay:.3,ease}}><span className="text-red">F</span>AHRNYT</m.span></h1>
<m.p {...up(.7)} className="mt-5 font-head text-2xl uppercase tracking-wide text-cyan md:text-4xl">{t.sl}</m.p>
<m.p {...up(.8)} className="mt-3 max-w-xl text-mute md:text-lg">{t.hp}</m.p>
<m.div {...up(.9)} className="mt-8 flex flex-col gap-3 sm:flex-row"><Btn onClick={play} className="w-full sm:w-auto"><svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 4v12m-5-5 5 5 5-5M5 20h14"/></svg>{t.play}</Btn><Btn v onClick={acc} className="w-full sm:w-auto">{t.acc}</Btn></m.div>
<m.div {...up(1)} className="mt-10 hidden gap-8 sm:flex">{t.st.map(([a,b])=><div key={a} className="border-l-2 border-red pl-3"><b className="block font-head text-2xl">{a}</b><span className="text-xs uppercase tracking-[.2em] text-mute">{b}</span></div>)}</m.div></m.div>
<div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,var(--color-ink),transparent)]"/>
<m.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4}} className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-head text-xs tracking-[.4em] text-mute">{t.scroll}<span className="sl block h-10 w-px overflow-hidden bg-white/20"><i/></span></m.div></section>}

const W=[{ty:'rifle',r:11,m:30,d:[['0–15m',156,39,33],['15–30m',140,35,29],['30–50m',124,31,26]]},{ty:'sniper',r:.6,m:5,d:[['a',255,150,127]]},{ty:'pistol',r:4,m:6,d:[['0–30m',159,55,46],['30–50m',145,50,42]]},{ty:'pistol',r:6.75,m:12,d:[['0–30m',78,26,22],['30–50m',66,22,18]]},{ty:'melee',d:[['l',50,50,50],['h',75,75,75]]}]
const Bar=({l,v,s})=><div><div className="flex justify-between font-head text-sm uppercase tracking-[.2em] text-mute"><span>{l}</span><span className="text-metal">{s}</span></div><div className="mt-2 h-1.5 bg-white/10"><m.div className="h-full origin-left bg-red" initial={{scaleX:0}} animate={{scaleX:Math.min(v,1)}} transition={{duration:.8,ease}}/></div></div>
const Hex=({o})=><svg viewBox="0 0 40 40" className="size-10"><path d="M20 2 36 11v18L20 38 4 29V11Z" fill="var(--color-cyan)" fillOpacity={o} stroke="var(--color-cyan)" strokeWidth="2"/></svg>
const H2=({k,h})=><><Rv><p className="kick">{k}</p></Rv><h2 className="mt-3 overflow-hidden font-head text-[clamp(44px,8vw,96px)] font-extrabold uppercase leading-[.9]"><m.span className="block" initial={{y:'105%'}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:.8,ease}}>{h}</m.span></h2></>

const Arm=({t})=>{const q=t.w,[i,si]=useState(0),[sh,ss]=useState(2),w=W[i],hp=100+sh*25
return<div className="wr pb-24 pt-28 md:pt-36">
<m.p {...up(.1)} className="kick">{q.k}</m.p>
<h1 className="mt-3 overflow-hidden font-head text-[clamp(56px,11vw,130px)] font-extrabold uppercase leading-[.9]"><m.span className="block" initial={{y:'105%'}} animate={{y:0}} transition={{duration:.8,delay:.15,ease}}>{q.h}</m.span></h1>
<m.p {...up(.3)} className="mt-4 max-w-2xl text-mute md:text-lg">{q.p}</m.p>
<m.div {...up(.4)} className="mt-8 flex flex-wrap items-center gap-2"><span className="mr-2 font-head text-sm uppercase tracking-[.2em] text-mute">{q.sh}</span>{q.shn.map((n,j)=><button key={j} onClick={()=>ss(j)} className={`cut px-4 py-2 font-head text-lg uppercase tracking-wider transition-colors ${sh===j?'bg-red text-white':'bg-white/5 hover:bg-white/10'}`}>{n} · {100+j*25}</button>)}</m.div>
<div className="mt-10 grid gap-6 lg:grid-cols-[4fr_8fr]">
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1">{W.map((x,j)=><Rv key={j} d={j*.06}><Tilt onClick={()=>si(j)} className={`cut relative block w-full p-4 text-left transition-colors duration-300 md:p-5 ${i===j?'bg-red/15':'bg-coal2 hover:bg-coal2/60'}`}><span className={`absolute inset-y-0 left-0 w-1 transition-colors ${i===j?'bg-red':'bg-white/10'}`}/><span className="font-head text-sm uppercase tracking-[.2em] text-mute">0{j+1} · {q.ty[x.ty]}</span><span className="mt-1 block font-head text-2xl font-bold uppercase md:text-3xl">{q.names[j]}</span></Tilt></Rv>)}</div>
<Rv d={.15} className="cut relative overflow-hidden bg-coal2/60"><div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,#1c1550aa,transparent_60%)]"/>
<AnimatePresence mode="wait"><m.div key={i} initial={{clipPath:'polygon(0 0,0 0,-30% 100%,-30% 100%)'}} animate={{clipPath:'polygon(0 0,130% 0,100% 100%,-30% 100%)'}} exit={{opacity:0,x:30,transition:{duration:.2}}} transition={{duration:.6,ease}} className="relative p-6 md:p-10">
<p className="font-head text-sm uppercase tracking-[.3em] text-cyan">{q.ty[w.ty]}</p><h2 className="font-head text-6xl font-extrabold uppercase md:text-7xl">{q.names[i]}</h2>
<div className="mt-6 grid gap-5 sm:grid-cols-3"><Bar l={q.dmg} v={w.d[0][2]/150} s={w.d[0][2]}/><Bar l={q.rate} v={w.r?w.r/11:0} s={w.r?w.r+q.ps:'—'}/><Bar l={q.mag} v={w.m?w.m/30:0} s={w.m||'—'}/></div>
<div className="mt-8 overflow-x-auto"><table className="w-full min-w-[400px] text-left"><thead><tr className="font-head text-sm uppercase tracking-[.2em] text-mute">{[q.range,q.head,q.body,q.leg].map(h=><th key={h} className="border-b border-white/10 pb-3 font-semibold">{h}</th>)}</tr></thead>
<tbody>{w.d.map(([r,...v])=><tr key={r}><td className="border-b border-white/5 py-3 text-mute">{q.rl[r]||r}</td>{v.map((n,j)=><td key={j} className="border-b border-white/5 py-3"><span className={`inline-block min-w-14 px-2 py-0.5 text-center font-head text-2xl font-bold transition-colors duration-300 ${n>=hp?'bg-red/20 text-red':''}`}>{n}</span></td>)}</tr>)}</tbody></table></div>
<p className="mt-4 flex items-center gap-2 text-sm text-mute"><span className="inline-block size-3 bg-red/60"/>{q.one} · {hp} {q.hp}</p></m.div></AnimatePresence></Rv></div>
<div className="mt-24"><H2 k={q.shk} h={q.shh}/><Rv><p className="mt-4 max-w-2xl text-mute">{q.shp}</p></Rv>
<div className="mt-8 grid gap-4 sm:grid-cols-3">{q.shc.map((n,j)=><Rv key={j} d={j*.08}><div className={`cut relative p-6 transition-colors ${sh===j?'bg-red/15':'bg-coal2'}`}><Hex o={j*.35}/><p className="mt-4 font-head text-sm uppercase tracking-[.2em] text-mute">{n}</p><p className="font-head text-5xl font-extrabold">{j?'+'+j*25:'0'}</p><p className="text-sm text-mute">{q.tot}: {100+j*25} {q.hp}</p></div></Rv>)}</div></div></div>}


const Media=({t})=>{const[on,so]=useState(false)
return<Sec id="fragman" k={t.vk} h={t.vh} c="bg-coal/40"><Rv className="relative mt-12 p-3 md:p-4">{['left-0 top-0 border-l-2 border-t-2','right-0 top-0 border-r-2 border-t-2','left-0 bottom-0 border-l-2 border-b-2','right-0 bottom-0 border-r-2 border-b-2'].map(c=><span key={c} className={'absolute size-8 border-cyan '+c}/>)}
<div className="cut scan relative aspect-video overflow-hidden bg-coal2">{on?<iframe className="absolute inset-0 size-full" src={`https://www.youtube-nocookie.com/embed/${TRAILER}?autoplay=1&rel=0`} title="FAHRNYT" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>:
<button onClick={()=>TRAILER&&so(true)} className={'group absolute inset-0 grid place-items-center '+(TRAILER?'':'cursor-default')}><span className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_20%,#1c1550,transparent_70%),radial-gradient(40%_40%_at_80%_60%,#ff2e4d2a,transparent_70%)]"/><svg viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-2/3 w-full" aria-hidden="true"><path d={SKY1} fill="#1c1550" opacity=".8"/><path d={SKY2} fill="#0c0e16"/></svg>
<span className="relative grid size-24 place-items-center transition-transform duration-300 group-hover:scale-110 md:size-28"><svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible"><path d="M50 3 91 26.5v47L50 97 9 73.5v-47Z" fill="none" stroke="var(--color-red)" strokeWidth="2" className="pulse"/><path d="M50 3 91 26.5v47L50 97 9 73.5v-47Z" fill="var(--color-red)"/></svg><svg viewBox="0 0 24 24" className="relative size-9 translate-x-0.5" fill="#fff"><path d="M7 4v16l13-8z"/></svg></span>
<span className="absolute bottom-5 left-5 font-head text-lg uppercase tracking-[.2em] md:text-xl">{TRAILER?t.vp:t.vs}</span></button>}</div>
<div className="mt-3 flex justify-between font-head text-sm tracking-[.3em] text-mute"><span><span className="text-red">●</span> FAHRNYT.MP4</span><span>16:9</span></div></Rv></Sec>}

const DlC=({n,url,sub,ic,pr})=><Tilt as={url?'a':'div'} href={url||undefined} className={`cut relative flex items-center gap-5 p-6 transition-colors ${url?(pr?'bg-red/15 hover:bg-red/25':'bg-coal2 hover:bg-coal2/60'):'bg-coal2/50 opacity-60'}`}><span className={`absolute inset-y-0 left-0 w-1 ${pr&&url?'bg-red':'bg-white/10'}`}/><svg viewBox="0 0 24 24" className="size-10 shrink-0 text-cyan" fill="none" stroke="currentColor" strokeWidth="1.6"><path d={ic}/></svg><span className="flex-1"><span className="block font-head text-3xl font-bold uppercase">{n}</span><span className="text-sm text-mute">{sub}</span></span>{url&&<svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12m-5-5 5 5 5-5M5 20h14"/></svg>}</Tilt>

const Dl=({t})=>{const v=useV(),l=v?.[0],[o,so]=useState(0)
return<Sec id="indir" k={t.dk} h={t.dh}><div className="mt-12 grid gap-10 lg:grid-cols-2">
<div className="grid content-start gap-4">{[['pc_url',t.pc,'M3 5h18v11H3zM8 20h8M12 16v4',!AND],['apk_url',t.and,'M7 2h10v20H7zM11 18h2',AND]].map(([k,n,ic,pr],i)=><Rv key={k} d={i*.1}><DlC n={n} url={l?.[k]} sub={l?.[k]?`v${l.version}`:t.soon} ic={ic} pr={pr}/></Rv>)}<p className="text-sm text-mute">{v===null?'…':l?`${t.ver} ${l.version} · ${t.auto}`:t.none}</p></div>
<Rv d={.15}><h3 className="mb-4 font-head text-3xl font-bold uppercase">{t.nk}</h3>{v?.length?v.map((r,i)=><div key={r.version} className="cut mb-3 bg-coal2"><button onClick={()=>so(o===i?-1:i)} className="flex w-full items-center gap-4 p-5 text-left"><span className="font-head text-2xl font-bold">v{r.version}</span><span className="ml-auto text-sm text-mute">{r.created_at?.slice(0,10)}</span><m.span animate={{rotate:o===i?45:0}} className="text-2xl leading-none text-red">+</m.span></button>
<AnimatePresence initial={false}>{o===i&&<m.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><ul className="list-disc space-y-1 px-10 pb-5 text-mute">{String(r.notes||'').split('\n').filter(Boolean).map((x,j)=><li key={j}>{x}</li>)}</ul></m.div>}</AnimatePresence></div>):<p className="text-mute">{v===null?'…':t.noNotes}</p>}</Rv></div></Sec>}

const About=({t})=><Sec id="hakkimizda" k={t.ak} h="Vilkji Games" c="bg-coal/40"><div className="mt-10 grid items-start gap-10 lg:grid-cols-[3fr_2fr]"><Rv><p className="text-lg leading-relaxed text-mute md:text-xl">{t.ap}</p></Rv><Rv d={.1} className="cut bg-coal2/70 p-8"><h3 className="font-head text-3xl font-bold uppercase">{t.ct}</h3><p className="mt-2 text-mute">{t.cp}</p><a href={'mailto:'+MAIL} className="btn-line mt-6 inline-block max-w-full"><span className="truncate">{MAIL}</span></a></Rv></div></Sec>

const Foot=({t})=><footer className="border-t border-white/10"><div className="wr flex flex-col gap-3 py-10 md:flex-row md:items-center"><span className="flex items-center gap-2 font-head text-xl font-bold"><Mark s={24}/>VILKJI GAMES</span><span className="text-sm text-mute md:ml-auto">© {new Date().getFullYear()} Vilkji Games. {t.rights}</span></div></footer>

const Acc=({t,close})=>{const[msg,sm]=useState(''),[busy,sb]=useState(false)
useEffect(()=>{const k=e=>e.key==='Escape'&&close(),b=document.body.style;addEventListener('keydown',k);b.overflow='hidden';return()=>{removeEventListener('keydown',k);b.overflow=''}},[close])
const sub=async e=>{e.preventDefault();if(!SB||!KEY)return sm(t.m.off);sb(true);const f=new FormData(e.currentTarget)
try{const r=await fetch(`${SB}/auth/v1/signup`,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email:f.get('e'),password:f.get('p')})}),j=await r.json().catch(()=>({}));sm(r.ok?t.m.ok:j.msg||j.error_description||j.message||t.m.err)}catch{sm(t.m.err)}sb(false)}
return<m.div className="fixed inset-0 z-[90] grid place-items-center p-4" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><div className="absolute inset-0 bg-ink/75 backdrop-blur-md" onClick={close}/>
<m.form onSubmit={sub} initial={{y:40,opacity:0,clipPath:'inset(0 0 100% 0)'}} animate={{y:0,opacity:1,clipPath:'inset(0 0 0% 0)'}} exit={{y:20,opacity:0}} transition={{duration:.5,ease}} className="cut relative w-full max-w-md bg-coal2/85 p-8 backdrop-blur-xl">
<p className="kick">VILKJI ID</p><h3 className="mt-3 font-head text-5xl font-bold uppercase">{t.m.h}</h3><p className="mt-2 text-sm text-mute">{t.m.note}</p>
<input name="e" type="email" required autoComplete="email" placeholder={t.m.mail} className="inp mt-6"/><input name="p" type="password" required minLength={6} autoComplete="new-password" placeholder={t.m.pass} className="inp mt-3"/>
<Btn disabled={busy} className="mt-6 w-full">{busy?'…':t.m.go}</Btn>{msg&&<p className="mt-4 text-sm text-cyan">{msg}</p>}
<button type="button" onClick={close} aria-label={t.m.close} className="absolute right-4 top-4 grid size-9 place-items-center text-xl text-mute transition-colors hover:text-metal">✕</button></m.form></m.div>}

const FC=['#07080d','#ff2e4d','#1c1550','#07080d','#ff2e4d','#07080d','#1c1550','#07080d']
const ES=[.7,0,.3,1]
const SL={i:{scaleX:0,originX:0},a:i=>({scaleX:1,originX:0,transition:{duration:.3,delay:i*.035,ease:ES}}),e:i=>({scaleX:0,originX:1,transition:{duration:.3,delay:i*.035,ease:ES,originX:{duration:0,delay:0}}})}
const FD={i:{opacity:0},a:{opacity:1,transition:{delay:.2,duration:.15}},e:{opacity:0,transition:{duration:.12}}}
const Fx=()=><m.div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" variants={{i:{},a:{},e:{}}} initial="i" animate="a" exit="e">{FC.map((c,i)=><m.div key={i} custom={i} variants={SL} className="absolute -left-[20%] w-[140%]" style={{top:i*18-30+'%',height:'24%',background:c,skewY:-8}}/>)}<m.div variants={FD} className="speed absolute inset-0"/><m.div variants={FD} className="absolute inset-0 grid place-items-center"><span className="gx font-head text-7xl font-extrabold md:text-9xl" data-t="VILKJI">VILKJI</span></m.div></m.div>

export default function App(){
const[lang,sl]=useState(()=>{try{return localStorage.lang||(navigator.language.startsWith('tr')?'tr':'en')}catch{return'tr'}})
const[fx,sf]=useState(false),[acc,sa]=useState(false),rm=useReducedMotion(),t=T[lang],busy=useRef(false)
useEffect(()=>{document.documentElement.lang=lang;try{localStorage.lang=lang}catch{}},[lang])
const run=cb=>{if(rm)return cb();if(busy.current)return;busy.current=true;sf(true);setTimeout(()=>{cb();sf(false);busy.current=false},620)}
const close=useCallback(()=>sa(false),[])
const cur=()=>location.pathname.replace(/\/+$/,'')||'/',[path,sp]=useState(cur),want=useRef()
useEffect(()=>{const f=()=>sp(cur());addEventListener('popstate',f);return()=>removeEventListener('popstate',f)},[])
useEffect(()=>{if(want.current){jump(want.current);want.current=null}else scrollTo(0,0);document.title=(path==='/ozellikler'?t.w.h+' · ':'')+'FAHRNYT · Vilkji Games'},[path])
const to=p=>{if(p!==location.pathname)history.pushState(0,'',p);sp(p)}
const nav=id=>{if(id==='ozellikler')return path==='/ozellikler'?jump():run(()=>to('/ozellikler'));if(path!=='/'){want.current=id;return run(()=>to('/'))}jump(id,1)}
return<LazyMotion features={domAnimation} strict><MotionConfig reducedMotion="user"><Prog/><Nav t={t} lang={lang} sl={sl} nav={nav} path={path}/>
<main key={path}>{path==='/ozellikler'?<Arm t={t}/>:<><Hero t={t} play={()=>run(()=>jump('indir'))} acc={()=>run(()=>sa(true))}/><Media t={t}/><Dl t={t}/><About t={t}/></>}</main><Foot t={t}/>
<AnimatePresence>{acc&&<Acc t={t} close={close}/>}</AnimatePresence><AnimatePresence>{fx&&<Fx/>}</AnimatePresence></MotionConfig></LazyMotion>}
