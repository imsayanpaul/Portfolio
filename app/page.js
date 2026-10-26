import Link from "next/link";
import SiteHeader from "./site-header";
import TechStack from "./tech-stack";
import { ContactForm, ProblemList, LocalTime, ProjectGallery, Reveal } from "./components";

const socials=[['LinkedIn','https://www.linkedin.com/in/imsayanpaul','linkedin'],['X','https://x.com/imsayanpaul','x'],['GitHub','https://github.com/imsayanpaul','github'],['Instagram','https://www.instagram.com/imsayanpaul',null]];
const external={target:'_blank',rel:'noopener noreferrer'};

export default function Home(){return <Reveal><a className="skip" href="#work">Skip to projects</a>
<div className="topline"><span>PERSONAL INTERNET CORNER / VOL. 01</span><span>IDEAS → CODE → REAL THINGS <i></i></span></div>
<SiteHeader/>
<main>
<section className="hero wrap"><div className="eyebrow"><span>FULL-STACK DEVELOPER</span><span className="mono">portfolio / 2026</span></div><h1>SAYAN<span className="surname"> PAUL<span className="asterisk">✳</span></span></h1>
  <div className="hero-bottom"><div className="coordinates mono">&lt; turning “what if”<br/>&nbsp; into “it works” /&gt;</div><div className="intro"><h2>I build things that<br/>make life a little <em>easier.</em></h2><p>From an idea that won’t leave my head to a tool you can actually use. Full-stack products, useful AI, and small fixes for everyday friction.</p><div className="hero-actions"><a className="button dark" href="#work">Explore my work <span>↘</span></a><a className="resume-link" href="/documents/Sayan-Paul-Resume.pdf" download="Sayan-Paul-Resume.pdf">Download résumé <span aria-hidden="true">↓</span><span className="resume-format">PDF</span></a></div></div><figure className="hero-portrait"><div className="portrait-image"><img src="/assets/sayan-portrait.webp" alt="Sayan Paul taking a black-and-white mirror portrait with a camera" width="440" height="517" fetchPriority="high"/></div><figcaption><span>Sayan, behind the code.</span><span aria-hidden="true">✳</span></figcaption></figure></div>
  <div className="hero-foot mono"><span>INDEPENDENT PROJECTS. REAL PROBLEMS.</span><span>SCROLL TO EXPLORE ↓</span></div></section>
<div className="ticker" aria-hidden="true"><div>{[0,1].map(k=><span key={k}>LESS FRICTION. MORE POSSIBILITY. <b>✳</b> BUILT TO BE USEFUL. <b>✳</b> LESS FRICTION. MORE POSSIBILITY. <b>✳</b> BUILT TO BE USEFUL. <b>✳</b> </span>)}</div></div>
<section id="problems" className="problems"><div className="wrap">
  <div className="problem-layout"><div className="problem-head"><div className="section-label mono"><span>01 / where it starts</span></div><h2>Every project starts with a small <em>annoyance.</em></h2><p>Everyday friction, turned into something useful. Pick a problem to see what I built.</p></div><div><ProblemList/></div></div>
</div></section>
<section id="work" className="work"><div className="wrap">
  <div className="section-label mono"><span>02 / selected work</span></div>
  <div className="work-head"><h2>Small sparks.<br/>Working software.</h2><p>Five projects. One common thread: there has to be a better way.</p></div>
  <ProjectGallery/>
</div></section>
<section id="about" className="about"><div className="wrap about-grid"><div><div className="section-label mono">03 / THE PERSON BEHIND THE COMMITS</div><h2>A little obsessed<br/>with <em>making<br/>things work.</em></h2><div className="signature">Sayan Paul <span>↗</span></div></div><div className="about-copy"><p className="large">The best project ideas often start with a small annoyance.</p><p>A saved reel I can’t find. A job application scattered across tabs. A paragraph I keep losing. I turn those moments into software that gets out of the way.</p><p>I like working across the whole product—from the first interface to the API behind it—and finding where AI can do something genuinely useful.</p><a className="text-link" href="https://github.com/imsayanpaul" {...external}>Meet me on GitHub <span>↗</span></a></div></div></section>
<TechStack/>
<section id="contact" className="contact"><div className="wrap">
  <div className="section-label mono"><span>05 / the next good idea</span></div>
  <h2 className="contact-title">LET’S BUILD<br/>SOMETHING.</h2>
  <div className="contact-grid">
    <div><p className="contact-intro">Have a full-stack development opportunity or a project in mind? Send me the details and let’s talk.</p><ContactForm/></div>
    <LocalTime socials={socials}/>
  </div>
</div></section>
</main>
<footer className="wrap mono"><span>© 2026 sayan paul</span><span>crafted with intent. always iterating.</span><a href="#">back to top ↑</a></footer></Reveal>;}
