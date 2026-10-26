const icons = {
  'HTML5': ['html5', '#e85b22', '#ffffff'],
  'CSS3': ['css', '#087fbd', '#ffffff'],
  'Tailwind CSS': ['tailwindcss', '#1e293b', '#38bdf8'],
  'JavaScript': ['javascript', '#f3df4f', '#202020'],
  'React': ['react', '#202b3a', '#61dafb'],
  'Redux': ['redux', '#764abc', '#ffffff'],
  'Next.js': ['nextdotjs', '#20242d', '#ffffff'],
  'Node.js': ['nodedotjs', '#243129', '#83cd29'],
  'Express': ['express', '#262b35', '#ffffff'],
  'MongoDB': ['mongodb', '#033b2c', '#00ed64'],
  'PostgreSQL': ['postgresql', '#25344a', '#a2c6df'],
  'Python': ['python', '#27374a', '#ffd343'],
};

export default function TechStack() {
  return <section id="tech-stack" className="row" aria-labelledby="tech-stack-heading"><div className="wrap stack-dock">
    <div className="dock-heading"><span className="mono">04 / the toolbox</span><h2 id="tech-stack-heading">My tech stack<span>.</span></h2></div>
    <ul className="dock-logos" aria-label="Technologies I use">
      {Object.entries(icons).map(([name,[icon,background,color]],index)=><li className="dock-item" key={name} style={{'--delay':`${index*40}ms`}}>
        <span className="dock-tile" style={{background}} aria-hidden="true"><span className="dock-icon" style={{backgroundColor:color,maskImage:`url(/tech/${icon}.svg)`,WebkitMaskImage:`url(/tech/${icon}.svg)`}}/></span>
        <span className="dock-name">{name}</span>
      </li>)}
    </ul>
  </div></section>;
}
