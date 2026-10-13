import test from 'node:test';
import assert from 'node:assert/strict';
import {faqEntries,findFAQ} from '../src/faq-data.mjs';
test('every suggested FAQ returns its own answer',()=>{for(const faq of faqEntries)assert.equal(findFAQ(faq.question)?.id,faq.id)});
test('common visitor phrasing maps to grounded answers',()=>{for(const [q,id] of [['How much do you charge?','fees'],['When do I get my money?','release'],['Do you help builders?','construction'],['What happens if there is a dispute?','dispute'],['Can I have my money back?','refund']])assert.equal(findFAQ(q)?.id,id,q)});
test('unsupported questions and blanks do not invent answers',()=>{for(const q of ['', 'What is the weather tomorrow?', 'Tell me a joke', 'Which stocks should I buy?'])assert.equal(findFAQ(q),null)});

test('company overview accepts conversational wording from the reported failure',()=>{for(const q of ['What you guys do', 'What do you guys do?', 'What do you do?', 'What services do you offer?', 'Who are you?', 'Tell me about Noble Escrow', 'What does your company do?'])assert.equal(findFAQ(q)?.id,'overview',q)});
test('specific questions beat generic service wording',()=>{for(const [q,id] of [['What do you guys charge?','fees'],['What services do you offer for construction?','construction'],['Tell me about your services for capital raising','capital'],['What do you do about refunds?','refund']])assert.equal(findFAQ(q)?.id,id,q)});
test('common contractions and plural questions are recognised',()=>{for(const [q,id] of [["What's escrow?",'escrow'],['What are the costs?','fees'],['Do you offer refunds?','refund']])assert.equal(findFAQ(q)?.id,id,q)});
