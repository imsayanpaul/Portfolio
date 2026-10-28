'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { projects, projectId, repoUrl } from './projects';

export function Reveal({children}) { return <>{children}</>; }

const pad=n=>String(n).padStart(2,'0');

export function ProblemList(){
  return <ol className="problem-paths">{projects.map((p,index)=><li key={p.repo}><a className="problem-path" href={`#${projectId(p)}`} aria-label={`${p.annoyance} Explore ${p.name}.`}>
    <span className="path-index" aria-hidden="true">{pad(index+1)}</span>
    <span className="path-copy"><span className="path-question">{p.annoyance}</span><span className="path-answer"><span>Built to solve it</span><strong>{p.name}</strong></span></span>
    <span className="path-arrow" aria-hidden="true">↗</span>
  </a></li>)}</ol>;
}

const external={target:'_blank',rel:'noopener noreferrer'};
function previewSources(image){
  const stem=image.replace(/\.[^.]+$/, '');
  const widths=stem==='scrollmark'?[300]:stem==='sequential'?[480,960]:[480,960,1440];
  return widths.map(width=>'/assets/'+stem+'-'+width+'.webp '+width+'w').join(', ');
}
function HoodLines({p}){
  const lines=p.note.split(/(?<=\.)\s+(?=[A-Z])/);
  return <ol className="hood-code">
    {p.stack&&<li className="hood-stack" style={{'--i':0}}><span><span className="k">stack</span><span className="pn">: [</span>{p.stack.map((t,j)=><span key={t}><span className="s">'{t}'</span>{j<p.stack.length-1&&<span className="pn">, </span>}</span>)}<span className="pn">]</span></span></li>}
    {lines.map((line,j)=><li key={j} style={{'--i':j+(p.stack?1:0)}}><span>{line}</span></li>)}
  </ol>;
}

export function ProjectGallery(){
  const [filter,setFilter]=useState('all');
  const visible=projects.filter(p=>filter==='all'||p.category===filter);
  return <><div className="filter-bar"><div role="group" aria-label="Filter projects">{[['all','All work','05'],['web','Web & AI','03'],['tools','Everyday tools','02']].map(([key,label,count])=><button key={key} className={filter===key?'active':''} aria-pressed={filter===key} onClick={()=>setFilter(key)}>{label} <sup>{count}</sup></button>)}</div></div>
  <div className="projects">{visible.map((p,index)=><article className="project" id={projectId(p)} key={p.name}>
    <a className="preview" href={p.live||repoUrl(p)} {...external} aria-label={`Explore ${p.name}`}><span className="project-number">{pad(projects.indexOf(p)+1)} / {p.category==='web'?'WEB APPLICATION':'EVERYDAY TOOL'}</span><img src={`/assets/${p.image}`} srcSet={previewSources(p.image)} sizes={index===0 ? "(max-width: 640px) calc(100vw - 98px), (max-width: 900px) calc(100vw - 138px), (max-width: 1376px) calc(100vw - 296px), 1080px" : "(max-width: 640px) calc(100vw - 98px), (max-width: 900px) calc(50vw - 86px), 558px"} alt={p.alt} loading="lazy" decoding="async"/><span className="visit" aria-hidden="true">↗</span></a>
    <div className="project-meta"><h3>{p.name}</h3><span className="project-tags">{p.tags}</span></div>
    <dl className="project-facts"><div><dt className="mono">Problem</dt><dd>{p.problem}</dd></div><div><dt className="mono">Solution</dt><dd>{p.description}</dd></div></dl>
    <div className="project-links">{p.live&&<a href={p.live} {...external}>Visit project ↗</a>}<a href={repoUrl(p)} {...external}>Source code ↗</a></div>
    <details className="project-hood"><summary><span className="hood-icon" aria-hidden="true">{'</>'}</span>Under the hood<span className="hood-hint">how it’s built</span></summary><div className="hood"><div className="hood-bar mono"><span className="hood-dots"><i/><i/><i/></span><span className="hood-tab">{p.repo.toLowerCase()}/notes.md</span><span className="hood-tags">{p.tags}</span></div><HoodLines p={p}/></div></details>
    {p.repo==='sequential-paste'&&<details className="project-demo"><summary><span className="hood-icon" aria-hidden="true">▶</span>Try the interactive demo<span className="hood-hint">no install needed</span></summary><PasteDemo/></details>}
  </article>)}</div></>;
}

const queue=['Sayan Paul','Full-stack Developer','Something useful ✳'];
const placeholders=['Name','What you do','What’s next'];
export function PasteDemo(){
  const [step,setStep]=useState(0);
  return <div className="demo"><div className="demo-top mono"><span>sequential-paste / interactive demo</span><span>● ● ●</span></div><div className="demo-body"><div><span className="mono">YOUR QUEUE</span><ol>{queue.map((item,i)=><li key={item} className={i<step?'done':''}>{item}</li>)}</ol></div><div className="demo-fields" aria-live="polite" aria-label="Pasted values">{queue.map((item,i)=><div key={item} data-placeholder={placeholders[i]}>{i<step?item:null}</div>)}</div></div><div className="demo-bottom"><button disabled={step===3} onClick={()=>setStep(s=>Math.min(s+1,3))} className="button blue">{step===3?'All done ✓':<>Paste next item <span>↗</span></>}</button><button onClick={()=>setStep(0)} className="reset">Reset ↺</button></div><p className="demo-note mono">BROWSER DEMO · NO CLIPBOARD ACCESS REQUIRED</p></div>;
}

const EMAIL='sayanpaul717@gmail.com';
export function ContactForm(){
  const [sent,setSent]=useState(false);
  const submit=e=>{
    e.preventDefault();
    const f=new FormData(e.currentTarget),name=f.get('name').trim(),email=f.get('email').trim(),message=f.get('message').trim();
    const body=`${message}\n\n— ${name}${email?` (${email})`:''}`;
    window.location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(`Hello from ${name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return <form className="contact-form" onSubmit={submit}>
    <div className="field-row"><label><span className="sr-only">Name</span><input name="name" placeholder="Your name" autoComplete="name" required/></label><label><span className="sr-only">Email</span><input name="email" type="email" placeholder="Your email" autoComplete="email" required/></label></div>
    <label><span className="sr-only">Message</span><textarea name="message" rows={5} placeholder="What are you building?" required/></label>
    <button type="submit" className="send">Send message <span aria-hidden="true">↗</span></button>
    <p className="mono form-note" aria-live="polite">{sent?'Your email app should be opening. Nothing there? ':'Opens your email app. Or write to '}<a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
  </form>;
}

const kolkata=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Kolkata',hour:'numeric',minute:'2-digit',second:'2-digit'});
const kolkataHour=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Kolkata',hour:'numeric',hourCycle:'h23'});
const partOfDay=h=>h<5?'night':h<12?'morning':h<17?'afternoon':h<21?'evening':'night';
export function LocalTime({socials}){
  const [now,setNow]=useState(null);
  useEffect(()=>{setNow(new Date());const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);
  return <aside className="local-card" aria-label="Local time and links">
    <span className="mono local-label">local time · kolkata</span>
    <time className="local-time" suppressHydrationWarning>{now?kolkata.format(now):'--:--:--'}</time>
    <p className="local-line">{now?`It’s ${partOfDay(+kolkataHour.format(now))} in Kolkata, India.`:'Kolkata, India.'}</p>
    <ul className="local-links">{socials.map(([name,href])=><li key={name}><a href={href} {...external}>{name} <span aria-hidden="true">↗</span></a></li>)}</ul>
  </aside>;
}

// Scroll reveals: tags elements by selector so markup stays untouched. Nothing is hidden unless JS runs and motion is allowed.
const revealGroups=[
  ['up','.section-label,.problem-head h2,.problem-head p,.work-head h2,.work-head p,.filter-bar,.project-meta,.project-facts,.project-links,.project details,.about h2,.signature,.about-copy>*,.dock-heading,.contact-intro,.contact-form,.local-card,.profile-intro>div>*,.career-label,.career-entry,.about-next,.about-breadcrumb'],
  ['mask','.contact-title,.profile-intro h1'],
  ['image','.preview,.profile-photo'],
];
const staggerGroups='.problem-paths>li,.local-links>li';
export function ScrollFX(){
  const bar=useRef(null);
  const pathname=usePathname();
  useEffect(()=>{
    // Touch devices keep content static and avoid per-scroll JavaScript work.
    if(matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 850px)').matches)return;
    const root=document.documentElement;
    let raf=0;
    const onScroll=()=>{if(raf)return;raf=requestAnimationFrame(()=>{
      raf=0;const max=root.scrollHeight-innerHeight;
      if(bar.current)bar.current.style.transform='scaleX('+(max>0?scrollY/max:0)+')';
    });};
    onScroll();addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
    const cleanupScroll=()=>{cancelAnimationFrame(raf);removeEventListener('scroll',onScroll);removeEventListener('resize',onScroll);};
    if(!('IntersectionObserver' in window))return cleanupScroll;
    root.classList.add('fx');
    const timers=new Set();
    const io=new IntersectionObserver(entries=>entries.forEach(({isIntersecting,target})=>{
      if(!isIntersecting)return;
      io.unobserve(target);target.classList.add('is-in');
      const timer=setTimeout(()=>{target.removeAttribute('data-reveal');target.classList.remove('is-in');timers.delete(timer);},1300);
      timers.add(timer);
    }),{rootMargin:'0px 0px -8% 0px',threshold:.01});
    // Read geometry together before writing styles; observe once per route.
    const elements=[...new Set(revealGroups.flatMap(([,selector])=>[...document.querySelectorAll(selector)]).concat([...document.querySelectorAll(staggerGroups)]))];
    const below=elements.filter(el=>el.getBoundingClientRect().top>=innerHeight);
    below.forEach(el=>{el.dataset.reveal='up';io.observe(el);});
    return()=>{cleanupScroll();io.disconnect();timers.forEach(clearTimeout);root.classList.remove('fx');elements.forEach(el=>{el.removeAttribute('data-reveal');el.classList.remove('is-in');});};
  },[pathname]);
  return <div ref={bar} className="scroll-progress" aria-hidden="true"/>;
}
