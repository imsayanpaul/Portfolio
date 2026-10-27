import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const raw = JSON.parse(await fs.readFile(path.join(root, 'content/notion/sem7.json'), 'utf8'));
const definitions = [
  ['Strategic Management', 'strategic-management', 'MIM702A', 'Strategy, decisions, and the bigger picture.'],
  ['Consumer Behaviour', 'consumer-behaviour', 'MIM701A', 'What shapes the choices people make.'],
  ['Cyber Security', 'cyber-security', 'BCAC703', 'Networks, threats, and keeping information safe.'],
  ['Research Methodology', 'research-methodology', 'BCAC702', 'From a good question to a sound conclusion.'],
  ['Introduction to Machine Learning', 'machine-learning', 'BCAC701B', 'Models, algorithms, and learning from data.'],
  ['Research Methodology Lab', 'research-methodology-lab', 'BCAC792', 'Design, analyse, and present a research study.'],
  ['Machine Learning Lab', 'machine-learning-lab', 'BCAC791B', 'Hands-on Python, data, and model building.'],
];
const slugify = text => text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const plain = text => text.replace(/<[^>]+>/g, '').replace(/[*_\x60#]/g, '').replace(/\s+/g, ' ').trim();
const normalize = text => text
  .replace(/<image source="([^"]+)">\s*([\s\S]*?)\s*<\/image>/g, (_, ref, alt) => {
    const filename = new URL(ref).searchParams.get('name');
    if (!filename || !/^[\w.-]+$/.test(filename)) throw new Error('Invalid diagram filename');
    return '\n![' + alt.replace(/[\[\]]/g, '') + '](/study/diagrams/' + filename + ')\n';
  })
  .replace(/<date[^>]*>(.*?)<\/date>/g, '$1')
  .trim();

await fs.mkdir(path.join(root, 'content/study'), { recursive: true });
await fs.mkdir(path.join(root, 'public/study/diagrams'), { recursive: true });
const downloadFile = process.argv[2];
if (downloadFile) {
  const files = JSON.parse(await fs.readFile(downloadFile, 'utf8'));
  for (const item of files) {
    const name = new URL(item.reference).searchParams.get('name');
    if (!name || !/^[\w.-]+$/.test(name)) throw new Error('Invalid asset name');
    const response = await fetch(item.url);
    if (!response.ok) throw new Error('Could not download ' + name + ': ' + response.status);
    await fs.writeFile(path.join(root, 'public/study/diagrams', name), Buffer.from(await response.arrayBuffer()));
  }
}

const summaries = [];
const search = [];
for (const [name, slug, code, description] of definitions) {
  const page = raw.find(p => p.title.endsWith(name));
  if (!page) throw new Error('Missing ' + name);
  const content = page.text.split('<content>\n')[1]?.split('\n</content>')[0];
  if (!content || page.truncated || page.unknown_block_count) throw new Error('Incomplete ' + name);
  const modules = [];
  let current = { id: 'overview', title: 'Before you start', body: '', questions: [] };
  modules.push(current);
  const lines = content.split('\n');
  let fence = false;
  let question = null;
  let inToggle = false;
  const finish = () => {
    if (!question) return;
    question.body = normalize(question.body);
    current.questions.push(question);
    question = null;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('\x60\x60\x60')) fence = !fence;
    if (!fence && /^<toggle\b/.test(line)) {
      finish();
      const title = plain(lines[++i]);
      question = { id: /^Q(\d+)\./.test(title) ? 'q' + title.match(/^Q(\d+)/)[1] : slugify(title), title, body: '' };
      inToggle = true;
      continue;
    }
    if (!fence && line === '</toggle>') { finish(); inToggle = false; continue; }
    if (!fence && !inToggle && /^#{2,3} (Module |Lab Module |Experiments |Additional answers)/.test(line)) {
      finish();
      const title = line.replace(/^#+ /, '');
      current = { id: slugify(title), title, body: '', questions: [] };
      modules.push(current);
      continue;
    }
    if (!fence && !inToggle && /^<b>Q\d+\./.test(line)) {
      finish();
      const title = plain(line).replace(/\\([\[\]])/g, '$1');
      question = { id: 'q' + title.match(/^Q(\d+)/)[1], title, body: '' };
      continue;
    }
    if (question) question.body += line + '\n';
    else current.body += line + '\n';
  }
  finish();
  for (const module of modules) module.body = normalize(module.body);
  const count = modules.reduce((total, m) => total + m.questions.filter(q => /^q\d+$/.test(q.id)).length, 0);
  const subject = { name, slug, code, description, kind: name.includes('Lab') ? 'Lab' : 'Theory', updated: page.page_last_edited_at.slice(0, 10), count, modules };
  await fs.writeFile(path.join(root, 'content/study', slug + '.json'), JSON.stringify(subject, null, 2) + '\n');
  const { modules: _, ...summary } = subject;
  summaries.push({ ...summary, modules: modules.filter(m => m.id !== 'overview' && !m.title.startsWith('Additional')).length });
  for (const module of modules) for (const q of module.questions) {
    search.push({ subject: name, code, slug, id: q.id, title: q.title, module: module.title, text: plain(q.body) });
  }
  console.log(name + ': ' + count + ' questions, ' + (modules.length - 1) + ' sections');
}
await fs.writeFile(path.join(root, 'content/study/index.json'), JSON.stringify(summaries, null, 2) + '\n');
await fs.writeFile(path.join(root, 'public/study/search-index.json'), JSON.stringify(search));
