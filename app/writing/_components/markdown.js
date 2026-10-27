import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import { CodeBlock, Diagram } from './reading-controls';

const schema = { ...defaultSchema, attributes: { ...defaultSchema.attributes, code: [['className', /^language-./, 'math-inline', 'math-display']] } };

export default function Markdown({ children }) {
  return <div className="study-prose"><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], [rehypeKatex, { strict: false, trust: false }]]} components={{
    pre({ children }) {
      const child = children;
      const language = child?.props?.className?.replace('language-', '') || '';
      const text = String(child?.props?.children || '').replace(/\n$/, '');
      return language === 'mermaid' ? <Diagram code={text} /> : <CodeBlock code={text} language={language} />;
    },
    table({ children }) { return <div className="study-table" tabIndex="0" role="region" aria-label="Scrollable table"><table>{children}</table></div>; },
    img({ src, alt }) { return <img src={src} alt={alt || ''} loading="lazy" />; },
    a({ href, children }) { return <a href={href} {...(href?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>; },
  }}>{children}</ReactMarkdown></div>;
}
