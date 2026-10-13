import { useEffect, useRef, useState } from 'react';
import { ChatCircleDots, X, ArrowRight, ArrowCounterClockwise } from '@phosphor-icons/react';
import { faqEntries, findFAQ } from './faq-data.mjs';
const greeting={role:'assistant',text:'Hello. I can help with escrow FAQs, fees, release conditions and getting started. Choose a question or type your own.'};
export function FAQChat({onEnquiry}) {
 const [open,setOpen]=useState(false),[input,setInput]=useState(''),[messages,setMessages]=useState([greeting]);
 const inputRef=useRef(null),listRef=useRef(null),launcherRef=useRef(null);
 const close=()=>{setOpen(false);launcherRef.current?.focus()};
 useEffect(()=>{if(open)inputRef.current?.focus()},[open]);
 useEffect(()=>{if(listRef.current)listRef.current.scrollTop=listRef.current.scrollHeight},[messages,open]);
 function ask(question){const match=findFAQ(question);setMessages(m=>[...m,{role:'user',text:question},{role:'assistant',text:match?.answer||'I couldn’t match that question yet. I can help with our services, escrow costs, payment release and identity checks. Try one of the suggested questions, or choose “Talk to the team” for help with your transaction.',source:match?.question}]);setInput('');inputRef.current?.focus()}
 return <div className="faq-chat">{open&&<section className="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title" id="faq-chat-panel" onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();close()}}}>
 <div className="chat-header"><div><span className="eyebrow">Noble Escrow</span><h2 id="chat-title">FAQ assistant</h2></div><button onClick={close} aria-label="Close FAQ chat"><X size={22}/></button></div>
 <div className="chat-disclosure">Answers from website FAQs · No live adviser</div>
 <div ref={listRef} className="chat-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="FAQ conversation">{messages.map((m,i)=><div className={`chat-message ${m.role}`} key={i}><span className="chat-speaker">{m.role==='user'?'You':'FAQ assistant'}</span><p>{m.text}</p>{m.source&&<span className="chat-source">FAQ: {m.source}</span>}</div>)}</div>
 <div className="chat-topics" aria-label="Suggested FAQ topics">{['overview','fees','release','identity'].map(id=>{const f=faqEntries.find(f=>f.id===id);return <button key={id} onClick={()=>ask(f.question)}>{f.question}</button>})}</div>
 <form className="chat-form" onSubmit={e=>{e.preventDefault();if(input.trim())ask(input.trim())}}><label htmlFor="faq-question" className="sr-only">Ask an FAQ question</label><input id="faq-question" ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about escrow…" maxLength={400} autoComplete="off"/><button type="submit" disabled={!input.trim()} aria-label="Send FAQ question"><ArrowRight size={22}/></button></form>
 <div className="chat-footer"><button onClick={()=>{close();onEnquiry()}}>Talk to the team</button><button onClick={()=>{setMessages([greeting]);setInput('');inputRef.current?.focus()}}><ArrowCounterClockwise size={14}/>Clear chat</button></div><p className="chat-privacy">Demo guidance. Please don’t enter sensitive information.</p>
 </section>}
 <button ref={launcherRef} className="chat-launcher" aria-expanded={open} aria-controls="faq-chat-panel" onClick={()=>open?close():setOpen(true)}><ChatCircleDots size={24}/>{open?'Close chat':'Ask a question'}</button></div>
}
