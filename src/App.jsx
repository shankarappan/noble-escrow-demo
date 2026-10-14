import { useScrollFlow } from './useScrollFlow.js';
import { FAQChat } from './FAQChat.jsx';
import { faqEntries } from './faq-data.mjs';
const faqs = faqEntries.slice(0, 4).map(({question, answer}) => [question, answer]);
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, List, X, Phone, Plus, Minus, CheckCircle } from '@phosphor-icons/react';
const services = [
['Construction & development','Milestone payments, clearly agreed.','An escrow arrangement can link payments to defined construction milestones. Agree who confirms completion, what evidence is needed and when funds may be released.',['Project and party details','Payment milestones and release authority','Completion and dispute conditions']],
['Legal & corporate','Independent holding for commercial transactions.','Structure the holding and release of funds around the terms of a commercial transaction, settlement or agreement. Each party’s responsibilities and the conditions for release should be clear.',['Transaction and party details','Agreed conditions and instructions','Timing and relevant documentation']],
['Capital raising','Conditions established before funds are released.','Escrow can support an agreed fundraising target or staged release of capital. The arrangement should explain the deadline, release conditions and treatment of funds if the target is not met.',['Fundraising target and deadline','Release and refund conditions','Authority to approve instructions']],
['Immigration & investments','A clear approach to conditional payments.','Discuss an escrow arrangement for an immigration or investment-related transaction. Requirements depend on the transaction and the relevant rules; suitability needs to be assessed before proceeding.',['Purpose and parties involved','Relevant transaction requirements','Release conditions and timing']]];
const trust = [
['Funds & release','An agreement defines the conditions.','Escrow holds funds pending the conditions agreed by the parties. The agreement should set out who may instruct release, the evidence required and what happens if instructions are disputed.'],
['Identity checks','Know the parties before proceeding.','Identity and transaction checks form part of onboarding. The documents required depend on the parties and the transaction. Sensitive identity and banking details belong in an approved onboarding process, not an initial enquiry.'],
['Help & disputes','Understand the next step.','If a disagreement arises, refer to the release and dispute provisions of your agreement. An escrow provider’s holding role should be distinguished from deciding the underlying dispute. Contact the team to discuss the process.']];

function Brand(){return <a className="brand" href="#top" aria-label="Noble Escrow home"><span className="brand-mark"><img src={`${import.meta.env.BASE_URL}assets/source-logo.avif`} alt="" /></span><span>NOBLE ESCROW</span></a>}
function Dialog({children,onClose,title}){const ref=useRef(null);useEffect(()=>{const el=ref.current;el.showModal();return()=>el.close()},[]);return <dialog ref={ref} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose()}} aria-labelledby="dialog-title"><button className="close" onClick={onClose} aria-label="Close dialog"><X size={24}/></button><div className="dialog-content"><h2 id="dialog-title">{title}</h2>{children}</div></dialog>}
const stages = [
 ['Agree','Set out the transaction terms, release conditions and authority to give instructions.'],
 ['Deposit','Complete the agreed onboarding checks and confirm the funds are deposited.'],
 ['Confirm','Check the agreed evidence or milestone under the escrow agreement.'],
 ['Release','Release funds according to the conditions and instructions in the agreement.']
];
const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const summaries = ['Milestone-based payment arrangements.','Holding funds under agreed conditions.','Defined release and refund terms.','A considered approach to conditional payments.'];
export function App() {
 const motionRoot=useRef(null);
 const [menu,setMenu]=useState(false), [detail,setDetail]=useState(null), [enquiry,setEnquiry]=useState(false), [selected,setSelected]=useState('Not sure yet'), [sent,setSent]=useState(false);
 const {stage,enabled,goToStage}=useScrollFlow(motionRoot,!!detail||enquiry);
 const openEnquiry=(service='Not sure yet')=>{setSelected(service);setSent(false);setDetail(null);setMenu(false);setEnquiry(true)};
 const openDetail=kind=>{setMenu(false);setDetail({kind})};
 useEffect(()=>{if(!menu)return;const key=e=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[menu]);
 const nav=[['How it works','#process'],['Solutions','#solutions'],['Trust & security','#trust']];
 return <>
  <a className="skip" href="#main">Skip to content</a><div id="top" aria-hidden="true"/>
  <header><div className="header-inner"><Brand/>
   <nav id="mobile-links" aria-label="Main navigation" className={menu?'open':''}>
    {nav.map(([name,href])=><a key={href} href={href} onClick={()=>setMenu(false)}>{name}</a>)}
    <button className="nav-link" onClick={()=>openDetail('about')}>About</button>
    <button className="button" onClick={()=>openEnquiry()}>Discuss your transaction</button>
   </nav>
   <button className="menu-toggle" aria-expanded={menu} aria-controls="mobile-links" aria-label={menu?'Close menu':'Open menu'} onClick={()=>setMenu(!menu)}>{menu?<X size={28}/>:<List size={28}/>}</button>
  </div></header>
  <main id="main" ref={motionRoot} className={enabled?"scroll-flow-enabled":"scroll-flow-static"}>
   <div className="hero-flow"><section className="hero" aria-labelledby="hero-title">
    <img className="hero-photo" src={asset('coastal-hero.webp')} alt="" fetchPriority="high"/>
    <div className="hero-copy"><p className="eyebrow">Independent escrow · New Zealand</p>
     <h1 id="hero-title">Move forward.<br/>With confidence.</h1>
     <p className="hero-description">Independent holding and release of funds,<br className="desktop-break"/> guided by the conditions you agree.</p>
     <div className="hero-actions"><button className="button" onClick={()=>openEnquiry()}>Discuss your transaction</button><a className="text-link" href="#process">How escrow works <ArrowRight size={22}/></a></div>
    </div><span className="image-caption">Illustrative imagery</span>
   </section></div>
   <div className="assurance wrap"><span>Independent by design.</span><span className="assurance-line" aria-hidden="true"/><span>Clear agreements. Defined conditions. A considered approach.</span></div>
   <section className="process-flow" id="process" aria-labelledby="process-title"><div className="process wrap">
    <div className="process-copy"><p className="eyebrow">How escrow works</p><h2 id="process-title">A clear path from<br/>agreement to payment.</h2><p>Agree the conditions. Hold funds independently. Release according to the agreement.</p><button className="text-link" onClick={()=>openDetail('process')}>Explore the process <ArrowRight size={22}/></button>
    </div>
    <div className="journey-visual"><figure className="process-art"><img src={asset('escrow-process.webp')} alt="Illustrative escrow process: agree, deposit, confirm and release, guided by an escrow agreement." loading="lazy"/><figcaption>Illustrative process</figcaption></figure>
     <div className="journey-story"><p className="journey-hint">{enabled?'Scroll to follow the journey':'The escrow journey'}<span>0{stage+1} / 04</span></p>
      <div className="journey-track" role="group" aria-label="Escrow journey stages">{stages.map(([title],i)=><button key={title} className={stage===i?'active':''} aria-pressed={stage===i} onClick={()=>goToStage(i)}><span>0{i+1}</span>{title}</button>)}</div>
      {enabled?<div key={stage} className="journey-caption"><h3>{stages[stage][0]}</h3><p>{stages[stage][1]}</p></div>:<ol className="journey-static-stages">{stages.map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol>}
     </div>
    </div>
   </div></section>
   <section className="solutions" id="solutions"><img className="section-photo" src={asset('solutions-landscape.webp')} alt="" loading="lazy"/><div className="wrap solutions-inner"><p className="eyebrow">Our solutions</p><h2>Built for the moments<br/>that matter.</h2><p className="solutions-description">Escrow arrangements tailored to your transaction.</p><div className="service-grid">{services.map((s,i)=><button key={s[0]} className="service" onClick={()=>setDetail({kind:'service',index:i})}><span><strong>{s[0]}</strong><span>{summaries[i]}</span></span><ArrowRight size={25}/></button>)}</div></div></section>
   <section className="clarity" id="trust"><img className="section-photo" src={asset('clarity-landscape.webp')} alt="" loading="lazy"/><div id="contact" className="wrap clarity-inner"><span className="gold-rule"/><h2>Confidence starts with clarity.</h2><p>Understand how funds are handled, who can authorise release<br className="desktop-break"/> and what happens next.</p><div className="clarity-actions"><button className="button" onClick={()=>openEnquiry()}>Talk to the team</button><button className="text-link" onClick={()=>openDetail('trust-overview')}>Trust & security <ArrowRight size={22}/></button></div></div></section>
  </main>
  <footer className="wrap"><Brand/><div className="footer-links"><button onClick={()=>openDetail('privacy')}>Privacy</button><button onClick={()=>openDetail('terms')}>Terms</button><button onClick={()=>openDetail('faq')}>FAQs</button><a href="#contact">Contact</a></div><a className="footer-phone" href="tel:0800372769"><Phone size={22}/>0800 ESCROW</a><span className="demo-note">Presentation demo · Draft copy</span></footer>
  <FAQChat onEnquiry={()=>openEnquiry()}/>
  {detail&&<Dialog title={detail.kind==='service'?services[detail.index][0]:detail.kind==='trust'?trust[detail.index][0]:({process:'How escrow works',about:'About Noble Escrow',faq:'Frequently asked questions','trust-overview':'Trust & security',privacy:'Privacy in this demo',terms:'About this demonstration'})[detail.kind]} onClose={()=>setDetail(null)}>
   {detail.kind==='service'?<><p className="eyebrow">{services[detail.index][1]}</p><p>{services[detail.index][2]}</p><h3>Useful details for your discussion</h3><ul>{services[detail.index][3].map(x=><li key={x}>{x}</li>)}</ul><button className="button" onClick={()=>openEnquiry(services[detail.index][0])}>Discuss this solution <ArrowRight size={20}/></button></>
   :detail.kind==='process'?<><p>Your agreement defines the details. This overview illustrates the usual sequence.</p><ol className="stage-list">{stages.map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol><button className="button" onClick={()=>openEnquiry()}>Discuss your transaction</button></>
   :detail.kind==='about'?<><p>Noble Escrow is a New Zealand business providing independent escrow services for a range of commercial transactions.</p><p>The escrow arrangement sets out the holding of funds and the agreed conditions for release. Talk to the team about suitability for your transaction.</p><button className="button" onClick={()=>openEnquiry()}>Talk to the team</button></>
   :detail.kind==='faq'?<div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<Plus className="plus" size={20}/><Minus className="minus" size={20}/></summary><p>{a}</p></details>)}</div>
   :detail.kind==='trust'?<><p className="eyebrow">{trust[detail.index][1]}</p><p>{trust[detail.index][2]}</p><button className="button" onClick={()=>openEnquiry()}>Ask the team</button></>
   :detail.kind==='trust-overview'?<><p>Clear agreements help everyone understand the holding and release process. Explore the topics below before starting a discussion.</p><div className="link-list">{trust.map((s,i)=><button key={s[0]} onClick={()=>setDetail({kind:'trust',index:i})}>{s[0]}<ArrowRight size={22}/></button>)}</div><p className="small">Company-specific regulatory and security statements will be verified before publication.</p></>
   :detail.kind==='privacy'?<><p>This presentation demo does not transmit or store enquiries or chat messages. Entries remain only in the current browser session and disappear when you reload.</p><p>No analytics or tracking services are included. Use sample information when demonstrating the form.</p></>
   :<><p>This website is a design demonstration, not a live escrow service. Copy and imagery are illustrative and subject to review.</p><p>Sending a demo enquiry does not create an escrow agreement or initiate a transaction. Production terms, fees and regulatory information must be confirmed before launch.</p></>}
  </Dialog>}
  {enquiry&&<Dialog title={sent?'Demo enquiry complete':'Discuss your transaction'} onClose={()=>setEnquiry(false)}>{sent?<div className="success" role="status"><CheckCircle size={44} color="#9d783f"/><p>Your enquiry preview is complete.</p><p>No information has been sent or stored. On the live website, the team would review the enquiry and discuss the next steps with you.</p><button className="button" onClick={()=>setEnquiry(false)}>Return to the website</button><button className="text-link" onClick={()=>setSent(false)}>Try another enquiry</button></div>:<><p>Tell us a little about your transaction.</p><p className="form-note">Demo form — use sample details. Nothing is sent or stored.</p><form onSubmit={e=>{e.preventDefault();setSent(true)}}><label>Your name<input name="name" autoComplete="name" required maxLength={100}/></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={150}/></label><label>Solution<select value={selected} onChange={e=>setSelected(e.target.value)}>{['Not sure yet',...services.map(s=>s[0])].map(s=><option key={s}>{s}</option>)}</select></label><label>A little about your transaction<textarea name="message" rows={4} required maxLength={2000}/></label><p className="small">Please do not include bank account numbers or identity documents.</p><button className="button" type="submit">Preview enquiry <ArrowRight size={20}/></button></form></>}</Dialog>}
 </>;
}
