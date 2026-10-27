'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function StudySearch({ subjects, currentSubject }) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState(currentSubject || 'all');
  const [index, setIndex] = useState(null);
  const [error, setError] = useState(false);
  const pending = useRef(false);
  async function load() {
    if (index || pending.current) return;
    pending.current = true;
    setError(false);
    try {
      const response = await fetch('/study/search-index.json');
      if (!response.ok) throw new Error('Search unavailable');
      setIndex(await response.json());
    } catch { setError(true); }
    finally { pending.current = false; }
  }
  useEffect(() => { if (query.trim()) load(); }, [query]); // The index loads only when needed.
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = terms.length && index ? index.filter(item => (scope === 'all' || item.slug === scope) && terms.every(term => (item.title + ' ' + item.text + ' ' + item.subject + ' ' + item.code).toLowerCase().includes(term))).sort((a,b) => Number(terms.every(t => b.title.toLowerCase().includes(t))) - Number(terms.every(t => a.title.toLowerCase().includes(t)))) : [];
  return <div className="study-search">
    <div className="study-search-bar"><span aria-hidden="true">⌕</span><label className="sr-only" htmlFor="study-search-input">Search study notes</label><input id="study-search-input" type="search" placeholder="Find a topic, question, or concept…" value={query} onFocus={load} onChange={event => setQuery(event.target.value)} /><label className="sr-only" htmlFor="study-search-scope">Search subject</label><select id="study-search-scope" value={scope} onChange={event => setScope(event.target.value)}><option value="all">All subjects</option>{subjects.map(s => <option value={s.slug} key={s.slug}>{s.name}</option>)}</select></div>
    {query.trim() && <div className="study-search-results"><p role="status" className="mono">{error ? 'Search could not load.' : !index ? 'Loading notes…' : results.length + ' MATCHING QUESTIONS'}{error && <button onClick={load}>Try again</button>}</p>
      {index && !results.length && <p>Try a shorter phrase, such as “sampling”, “regression”, or “strategy”.</p>}
      {results.slice(0, 30).map(item => <Link href={'/writing/notes/' + item.slug + '#' + item.id} key={item.slug + item.id}><span className="mono">{item.subject} · {item.code}</span><strong>{item.title}</strong><span>{item.text.slice(0, 150)}…</span></Link>)}
      {results.length > 30 && <p>Showing the first 30 matches. Add another word to narrow your search.</p>}
    </div>}
  </div>;
}
