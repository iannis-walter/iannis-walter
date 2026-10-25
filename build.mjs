// build.mjs — génère les SVG du README : node build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const C={quai:'#0D0D0B',flap:'#1A1A17',top:'#22221E',rule:'#2A2A25',ink:'#EFECE3',dim:'#8A877E',sig:'#FFC21A',ok:'#43D17F',warn:'#FF8A1F'};
const MONO="ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,'DejaVu Sans Mono',monospace";
const W=800,RM='@media (prefers-reduced-motion:reduce){';
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const svg=(h,body,css='')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="${MONO}"><style>${css}</style>${body}</svg>`;
let seed=7;const rnd=()=>(seed=seed*16807%2147483647)/2147483647; // aléatoire reproductible

// ─── Tableau principal : nom en palettes split-flap + bandeau info ───
function board(){
  const name='IANNIS VASSELET',cw=44,gap=5,ch=68,N=7,AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',L=1500;
  const info='Open to senior AI / LLM roles ✱ Freelance via Isoft ✱ Clean code that holds up in production ✱ Python · TypeScript · Java ✱ Marseille · remote FR / EU ✱ ';
  const x0=(W-name.length*(cw+gap)+gap)/2;
  const flaps=[...name].map((c,i)=>{
    const strip=[...Array(N)].map(()=>AZ[Math.floor(rnd()*36)]).concat(c.trim());
    return `<svg x="${x0+i*(cw+gap)}" y="84" width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" rx="5" fill="${C.flap}"/><rect width="${cw}" height="${ch/2}" rx="5" fill="${C.top}"/><g class="s" style="animation-delay:${(.3+i*.07).toFixed(2)}s" font-size="46" font-weight="700" fill="${C.ink}" text-anchor="middle">${strip.map((g,k)=>`<text x="${cw/2}" y="${k*ch+50}">${g}</text>`).join('')}</g><rect y="${ch/2-.75}" width="${cw}" height="1.5" fill="#000"/></svg>`;
  }).join('');
  const band=`<text y="23" font-size="14" font-weight="700" fill="#000" textLength="${L}" lengthAdjust="spacingAndGlyphs">${esc(info)}</text>`;
  return svg(286,`<rect width="${W}" height="286" rx="14" fill="${C.quai}"/><text x="28" y="44" font-size="26" font-weight="700" fill="${C.sig}" letter-spacing="5">DÉPARTS</text><text x="186" y="44" font-size="15" font-style="italic" fill="${C.dim}">Departures</text><text x="772" y="38" text-anchor="end" font-size="13" font-weight="700" fill="${C.ink}" letter-spacing="2">MARSEILLE ST-CHARLES</text><text x="772" y="56" text-anchor="end" font-size="11" fill="${C.dim}" letter-spacing="2">REMOTE FR / EU · 2026</text><rect x="28" y="69" width="744" height="1" fill="${C.rule}"/>${flaps}<text x="400" y="186" text-anchor="middle" font-size="15" font-weight="700" fill="${C.ink}" letter-spacing="1.5">SENIOR FULL-STACK ENGINEER — BACKEND &amp; APPLIED AI</text><text x="400" y="210" text-anchor="middle" font-size="13" fill="${C.dim}">Python · TypeScript · Java — from the data model to production</text><rect x="16" y="236" width="768" height="34" rx="5" fill="${C.sig}"/><svg x="96" y="236" width="688" height="34"><g class="m">${band}<g transform="translate(${L})">${band}</g></g></svg><rect x="16" y="236" width="80" height="34" rx="5" fill="#000"/><text x="56" y="258" text-anchor="middle" font-size="13" font-weight="700" fill="${C.sig}" letter-spacing="2">INFO</text>`,
  `.s{animation:f .5s steps(${N}) forwards}@keyframes f{to{transform:translateY(-${N*ch}px)}}.m{animation:m 40s linear infinite}@keyframes m{to{transform:translateX(-${L}px)}}${RM}.s{animation:none;transform:translateY(-${N*ch}px)}.m{animation:none}}`);
}

// ─── En-tête de colonnes + une ligne par train ───
const cols=()=>svg(36,`<rect width="${W}" height="36" rx="8" fill="${C.quai}"/><g font-size="11" fill="${C.dim}" letter-spacing="1.6"><text x="18" y="23">LIGNE</text><text x="80" y="23">TRAIN</text><text x="262" y="23">DESTINATION · VIA</text><text x="704" y="23" text-anchor="middle">ÉTAT · STATUS</text></g>`);
const ST={ontime:["À L'HEURE",'ON TIME',C.ok],service:['EN SERVICE','LIVE',C.ok],request:['SUR DEMANDE','PRIVATE · ON REQUEST',C.warn],boarding:['EMBARQUEMENT','PRIVATE BETA',C.sig,1]};
function row(p){const[fr,en,c,blink]=ST[p.st];
  return svg(80,`<rect width="${W}" height="80" rx="8" fill="${C.quai}"/><rect x="18" y="18" width="44" height="44" rx="8" fill="${p.c}"/><text x="40" y="45" text-anchor="middle" font-size="15" font-weight="700" fill="${p.lc||'#fff'}">${p.l}</text><text x="80" y="42" font-size="24" font-weight="700" fill="${C.sig}" letter-spacing="1">${esc(p.t)}</text><text x="80" y="61" font-size="10.5" fill="${C.dim}" letter-spacing="1.4">${p.k}</text><text x="262" y="38" font-size="17" font-weight="700" fill="${C.ink}">${esc(p.d)}</text><text x="262" y="59" font-size="12.5" fill="${C.dim}">via ${esc(p.v)}</text><g${blink?' class="b"':''}><rect x="626.5" y="18.5" width="155" height="43" rx="5" fill="none" stroke="${c}" stroke-opacity=".5"/><text x="704" y="37" text-anchor="middle" font-size="13" font-weight="700" fill="${c}" letter-spacing="1">${fr}</text><text x="704" y="53" text-anchor="middle" font-size="10" fill="${c}" fill-opacity=".75" letter-spacing="1.2">${en}</text></g>`,
  `.b{animation:b 1.4s linear infinite}@keyframes b{0%,49%{opacity:1}50%,100%{opacity:.3}}${RM}.b{animation:none}}`);}

// Destination ≤ 32 caractères, via ≤ 42, sinon ça déborde sur l'état.
const P=[
 {f:'stratos',t:'STRATOS',l:'TS',c:'#2F74C0',k:'OPEN SOURCE',d:'MISSION CONTROL · 39 KM JUMP',v:'133 tests · 5 ADRs · deterministic physics',st:'ontime'},
 {f:'askme',t:'ASK ME',l:'PY',c:'#1F9D5B',k:'OPEN SOURCE · LIVE',d:'AGENTIC RAG · ZERO FRAMEWORK',v:'tool-use loop · eval suite · tracing',st:'service'},
 {f:'quote-part',t:'QUOTE-PART',l:'JV',c:'#D6452E',k:'OPEN SOURCE',d:'DRUG COST ENGINE · BDPM',v:'hexagonal · TDD · Testcontainers',st:'ontime'},
 {f:'hyperion',t:'HYPERION',l:'TS',c:'#2F74C0',k:'OPEN SOURCE · LIVE',d:'OPS MONITORING · AGENTLESS',v:'SSH collection · rules engine · TOTP 2FA',st:'service'},
 {f:'aria',t:'ARIA',l:'RN',c:'#7B4FD6',k:'NON-PROFIT · SOLO DEV',d:'ANTI-HARASSMENT APP',v:'real-time SOS · 29 data models · OAuth ×3',st:'request'},
 {f:'fit-ai',t:'FIT-AI',l:'TS',c:'#2F74C0',k:'PRIVATE REPO',d:'AI WARDROBE · DAILY OUTFIT',v:'105 tests · CIEDE2000 · 0 runtime deps',st:'request'},
 {f:'sillage',t:'SILLAGE',l:'TS',c:'#2F74C0',k:'OPEN SOURCE',d:'PREMIUM BOOKING · STRIPE',v:'server-side pricing · idempotent payments',st:'ontime'},
 {f:'cachotte',t:'CACHOTTE',l:'iOS',c:'#F28C28',lc:'#2A1500',k:'PRIVATE BETA',d:'SECRET WISHLIST FOR TWO',v:'hidden by the database, not the UI',st:'boarding'}];

// ─── Plan des lignes (stack) ───
function network(){
  const L=[['BACK','#2F74C0','#fff',['Python','FastAPI','Django','NestJS','Fastify','Spring Boot']],['AI',C.sig,'#000',['RAG','Embeddings','pgvector','Function calling','Evals','Tracing']],['FRONT','#7B4FD6','#fff',['React','Next.js','Angular','React Native']],['INFRA','#1F9D5B','#fff',['PostgreSQL','Redis','Docker','Nginx','Fly.io','Hetzner']]];
  const body=L.map(([n,c,tc,s],i)=>{const y=96+i*64,dx=600/(s.length-1);
    return `<rect x="24" y="${y-14}" width="72" height="28" rx="6" fill="${c}"/><text x="60" y="${y+5}" text-anchor="middle" font-size="12" font-weight="700" fill="${tc}" letter-spacing="1.5">${n}</text><rect x="120" y="${y-3}" width="640" height="6" rx="3" fill="${c}"/>`+s.map((t,j)=>{const x=140+j*dx;return `<circle cx="${x}" cy="${y}" r="7" fill="${C.ink}" stroke="${C.quai}" stroke-width="3"/><text x="${x}" y="${j%2?y+26:y-15}" text-anchor="middle" font-size="12" fill="${C.ink}">${esc(t)}</text>`}).join('')}).join('');
  return svg(330,`<rect width="${W}" height="330" rx="14" fill="${C.quai}"/><text x="28" y="40" font-size="15" font-weight="700" fill="${C.sig}" letter-spacing="4">LIGNES DESSERVIES</text><text x="262" y="40" font-size="12" font-style="italic" fill="${C.dim}">Lines served</text>${body}`);
}

// ─── Billet à composter (contact) ───
function ticket(){let x=600,bars='';while(x<760){const w=1+Math.floor(rnd()*3);bars+=`<rect x="${x}" y="98" width="${w}" height="28"/>`;x+=w+1+Math.floor(rnd()*3);}
  return svg(150,`<mask id="n"><rect width="${W}" height="150" rx="10" fill="#fff"/><circle cy="75" r="14"/><circle cx="${W}" cy="75" r="14"/><circle cx="560" r="10"/><circle cx="560" cy="150" r="10"/></mask><g mask="url(#n)"><rect width="${W}" height="150" fill="${C.ink}"/><rect width="10" height="150" fill="${C.sig}"/></g><line x1="560" y1="16" x2="560" y2="134" stroke="#111" stroke-opacity=".35" stroke-dasharray="4 5"/><g fill="#111"><text x="40" y="36" font-size="11" fill-opacity=".55" letter-spacing="2">BILLET · TICKET — ALLER SIMPLE / ONE WAY</text><text x="40" y="64" font-size="10.5" fill-opacity=".55" letter-spacing="1.5">DE / FROM</text><text x="40" y="88" font-size="20" font-weight="700">VOTRE ÉQUIPE</text><text x="222" y="88" font-size="20" font-weight="700">→</text><text x="270" y="64" font-size="10.5" fill-opacity=".55" letter-spacing="1.5">À / TO</text><text x="270" y="88" font-size="20" font-weight="700">IANNIS VASSELET</text><text x="40" y="122" font-size="11" fill-opacity=".7" letter-spacing="1.2">CLASSE : CDI SENIOR · FREELANCE — VALABLE : REMOTE FR / EU</text><text x="680" y="52" text-anchor="middle" font-size="18" font-weight="700" letter-spacing="3">COMPOSTER</text><text x="680" y="74" text-anchor="middle" font-size="11" fill-opacity=".6" letter-spacing="2">CONTACT ↗</text>${bars}</g>`);}

// ─── Écriture (ordre fixe = rendu identique à chaque build) ───
const out={board:board(),columns:cols()};
P.forEach(p=>out['row-'+p.f]=row(p));
out.network=network();out.ticket=ticket();
mkdirSync('assets',{recursive:true});
for(const[k,v]of Object.entries(out))writeFileSync(`assets/${k}.svg`,v);
console.log(`${Object.keys(out).length} SVG écrits dans assets/`);
