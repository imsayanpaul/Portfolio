import Link from 'next/link';
import StudySearch from './search';
import LiveReaders from './live-readers';

export default function WritingCollection({ subjects, articles, activeTab }) {
  const total = subjects.reduce((count, subject) => count + subject.count, 0);
  return <>
    <div className="writing-intro"><div className="writing-hero"><span className="mono study-eyebrow">BUILDING / LEARNING / THINKING OUT LOUD</span><h1>Things worth<br /><em>writing down.</em></h1><p>Notes from what I’m learning, and stories from what I’m building. A little corner of my mind, open to everyone.</p></div><span className="writing-mark" aria-hidden="true">✳</span></div>
    <nav className="writing-tabs" aria-label="Writing categories"><Link href="/writing" aria-current={activeTab === 'notes' ? 'page' : undefined}>Study notes <span>{String(subjects.length).padStart(2, '0')}</span></Link><Link href="/writing/articles" aria-current={activeTab === 'articles' ? 'page' : undefined}>Blog <span>{String(articles.length).padStart(2, '0')}</span></Link></nav>
    {activeTab === 'notes' ? <section aria-label="Study notes" className="writing-notes">
      <div className="study-section-heading"><div><span className="mono">CURRENTLY LEARNING / SEMESTER 7</span><h2>A few notes to study from.</h2></div><p>{total} answers & practicals.<br />Free to read, no sign-in.</p></div>
      <LiveReaders /><StudySearch subjects={subjects} />
      <div className="subject-grid">{subjects.map((subject, index) => <Link href={'/writing/notes/' + subject.slug} key={subject.slug} className={'subject-card subject-tone-' + index}>
        <div className="subject-card-top mono"><span>{String(index + 1).padStart(2, '0')} / {subject.code}</span><span>{subject.kind}</span></div>
        <span className="subject-symbol" aria-hidden="true">{['↗', '◎', '⌘', '⊕', '✳', '⌁', '⌗'][index]}</span>
        <h3>{subject.name}</h3><p>{subject.description}</p>
        <div className="subject-card-bottom"><span className="mono">{subject.count} {subject.kind === 'Lab' ? 'PRACTICALS & VIVA' : 'WORKED ANSWERS'}</span><span aria-hidden="true">↗</span></div>
      </Link>)}</div>
      <div className="writing-notes-foot"><p>These are the notes I study from. If you spot something that needs fixing, I’d love to know.</p><a href="mailto:sayanpaul717@gmail.com?subject=Study%20notes%20correction">Suggest a correction ↗</a></div>
    </section> : <section aria-label="Blog posts" className="writing-articles">
      {articles.length ? <div className="article-list">{articles.map(article => <Link key={article.slug} href={'/writing/' + article.slug}><span className="mono">{article.date}</span><h2>{article.title} ↗</h2><p>{article.description}</p></Link>)}</div> : <div className="writing-empty"><div><span className="mono">A BLANK PAGE, FOR NOW</span><h2>Still gathering my thoughts.</h2><p>Stories from building software and figuring things out.<br />I’ll share the first one here when it’s ready.</p></div><Link href="/writing">Read my study notes ↗</Link></div>}
    </section>}
  </>;
}
