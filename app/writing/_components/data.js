import fs from 'node:fs';
import path from 'node:path';
import subjects from '../../../content/study/index.json';

export { subjects };
export function getSubject(slug) {
  if (!subjects.some(subject => subject.slug === slug)) return null;
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/study', slug + '.json'), 'utf8'));
}
