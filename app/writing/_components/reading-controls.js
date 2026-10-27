'use client';
import { useEffect, useRef, useState } from 'react';

const diagramRenderers = new Set();

export function ReadingControls() {
  const [message, setMessage] = useState('');
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    const reveal = () => {
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target?.tagName === 'DETAILS') {
        target.open = true;
        requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
      }
    };
    reveal();
    const followQuestion = event => {
      const anchor = event.target.closest?.('a[href]');
      if (!anchor) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname) return;
      let id;
      try { id = decodeURIComponent(destination.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target?.classList.contains('study-question')) target.open = true;
    };
    window.addEventListener('hashchange', reveal);
    document.addEventListener('click', followQuestion);
    return () => { window.removeEventListener('hashchange', reveal); document.removeEventListener('click', followQuestion); };
  }, []);
  function expand(open) { document.querySelectorAll('.study-question').forEach(node => { node.open = open; }); }
  async function copy() {
    try { await navigator.clipboard.writeText(window.location.href); setMessage('Link copied'); }
    catch { setMessage('Copy the page address to share these notes.'); }
  }
  async function print() {
    setPrinting(true);
    const details = [...document.querySelectorAll('.study-question')];
    const opened = details.map(node => node.open);
    details.forEach(node => { node.open = true; });
    try {
      const images = [...document.querySelectorAll('.question-body img')];
      images.forEach(image => { image.loading = 'eager'; });
      await Promise.all([...diagramRenderers].map(render => render()));
      await Promise.all(images.map(image => image.decode().catch(() => {})));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const sources = [...document.querySelectorAll('.study-diagram[data-rendered="false"] details')];
      sources.forEach(node => { node.open = true; });
      window.addEventListener('afterprint', () => {
        details.forEach((node, i) => { node.open = opened[i]; });
        sources.forEach(node => { node.open = false; });
      }, { once: true });
      window.print();
    } finally { setPrinting(false); }
  }
  return <div className="reading-tools"><div><button onClick={() => expand(true)}>Expand all +</button><button onClick={() => expand(false)}>Collapse all −</button></div><div><button onClick={copy}>Share ↗</button><button onClick={print} disabled={printing}>{printing ? 'Preparing…' : 'Print / PDF'}</button></div>{message && <span className="reading-status mono" role="status">{message}</span>}</div>;
}

export function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setError(false); setTimeout(() => setCopied(false), 2000); }
    catch { setError(true); }
  }
  return <div className="study-code"><div className="study-code-bar mono"><span>{language || 'CODE'}</span><button onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button></div><pre><code>{code}</code></pre>{error && <p role="status">Select the code to copy it manually.</p>}</div>;
}

let diagramSequence = 0;
let mermaidPromise;
function getMermaid() {
  if (!mermaidPromise) mermaidPromise = import('mermaid').then(module => {
    const mermaid = module.default;
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true, theme: 'base', themeVariables: { primaryColor: '#e8edff', primaryTextColor: '#171815', primaryBorderColor: '#2449f4', lineColor: '#6b705f', fontFamily: 'sans-serif' } });
    return mermaid;
  });
  return mermaidPromise;
}
export function Diagram({ code }) {
  const container = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    let pending;
    const render = () => {
      if (!pending) pending = getMermaid().then(async mermaid => {
        const result = await mermaid.render('study-diagram-' + (++diagramSequence), code);
        if (active) setSvg(result.svg);
      }).catch(() => { if (active) setError(true); });
      return pending;
    };
    diagramRenderers.add(render);
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { render(); observer.disconnect(); } });
    if (container.current) observer.observe(container.current);
    return () => { active = false; observer.disconnect(); diagramRenderers.delete(render); };
  }, [code]);
  return <div className="study-diagram" ref={container} data-rendered={Boolean(svg)}>{svg ? <div role="img" aria-label="Study diagram" dangerouslySetInnerHTML={{ __html: svg }} /> : <p className="mono">{error ? 'Diagram source' : 'Diagram loads when you reach it.'}</p>}<details><summary>{error ? 'View diagram source' : 'Diagram text'}</summary><pre>{code}</pre></details></div>;
}
