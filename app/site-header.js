import Link from "next/link";
const socials=[['LinkedIn','https://www.linkedin.com/in/imsayanpaul','linkedin'],['X','https://x.com/imsayanpaul','x'],['GitHub','https://github.com/imsayanpaul','github'],['Instagram','https://www.instagram.com/imsayanpaul',null]];
const external={target:'_blank',rel:'noopener noreferrer'};


export default function SiteHeader({activePage}){return <header className="nav wrap">
  <a href="/" className="nameplate" aria-label="Sayan Paul home"><span className="nameplate-name">Sayan Paul<span className="nameplate-dot">.</span></span><span className="nameplate-role">Full-stack Developer</span></a>
  <nav aria-label="Main navigation"><a href="/#work">Work <sup>05</sup></a><a href="/#problems">Problems</a><Link href="/about" aria-current={activePage==='about'?'page':undefined}>About</Link><a href="/#tech-stack">Stack</a></nav>
  <div className="nav-actions"><div className="nav-socials" role="group" aria-label="Social profiles">{socials.filter(([,,file])=>file).map(([name,href,file])=><a key={name} href={href} {...external} aria-label={`Sayan Paul on ${name} (opens in a new tab)`} title={name}><span className="social-icon" style={{maskImage:`url(/social/${file}.svg)`,WebkitMaskImage:`url(/social/${file}.svg)`}} aria-hidden="true"/></a>)}</div><a className="nav-contact" href="/#contact">Let’s connect <span>↗</span></a></div>
</header>;}
