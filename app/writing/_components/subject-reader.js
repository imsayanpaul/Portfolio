import Link from 'next/link';
import { subjects } from './data';
import Markdown from './markdown';
import StudySearch from './search';
import LiveReaders from './live-readers';
import { ReadingControls } from './reading-controls';

export default function SubjectReader({ data }) {
  const subject = data.slug;
  const current = subjects.findIndex(s => s.slug === subject);
  const next = subjects[(current + 1) % subjects.length];
  return <main id="writing-main" className="wrap subject-page">
    <div className="study-breadcrumb mono"><Link href="/writing">← WRITING / STUDY NOTES</Link><span>SEM 7 / {data.code}</span></div>
    <nav className="subject-tabs" aria-label="Study subjects">{subjects.map(s => <Link key={s.slug} href={'/writing/notes/' + s.slug} aria-current={s.slug === subject ? 'page' : undefined}>{s.name}</Link>)}</nav>
    <header className="subject-header"><div><span className="mono">MAKAUT BCA / SEMESTER 7 / {data.code}</span><h1>{data.name} notes</h1><p>{data.description} Free student-written study notes for MAKAUT BCA Semester 7 ({data.code}), organised by module.</p></div><div className="subject-meta mono"><span>{data.count} ANSWERS & PRACTICALS</span><span>UPDATED {new Date(data.updated + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase()}</span></div></header>
    <LiveReaders /><StudySearch key={subject} subjects={subjects} currentSubject={subject} />
    <div className="study-reading-layout">
      <aside className="study-toc"><span className="mono">IN THIS NOTEBOOK</span><nav aria-label="Module contents">{data.modules.map((m, i) => <a href={'#' + m.id} key={m.id}><span className="mono">{String(i).padStart(2, '0')}</span><span>{m.title.replace(/ — .*/, '')}</span></a>)}</nav><p>Open one question at a time.<br />Take it at your own pace.</p><a className="study-correction" href={'mailto:sayanpaul717@gmail.com?subject=' + encodeURIComponent('Study correction: ' + data.name)}>Suggest a correction ↗</a></aside>
      <div className="study-reading-content"><ReadingControls key={subject} />
        {data.modules.map(module => <section className={'study-module' + (module.id === 'overview' ? ' study-overview' : '')} id={module.id} key={module.id}><h2>{module.title}</h2>{module.body && <Markdown>{module.body}</Markdown>}
          {module.questions.map(question => <details className="study-question" id={question.id} key={question.id}><summary><span>{question.title}</span><span className="question-toggle" aria-hidden="true">+</span></summary><div className="question-body"><a className="question-permalink mono" href={'#' + question.id} aria-label={'Link to ' + question.title}>LINK TO THIS QUESTION ↗</a><Markdown>{question.body}</Markdown></div></details>)}
        </section>)}
        <div className="study-next"><span className="mono">ANOTHER NOTEBOOK</span><Link href={'/writing/notes/' + next.slug}>{next.name} <span>→</span></Link></div>
      </div>
    </div>
  </main>;
}
