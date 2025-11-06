"use client"
import { AppShell } from '@/components/layout/AppShell'
import React, { useEffect, useMemo, useState } from 'react'
import { api, API_BASE_URL } from '@/lib/api'
import Cookies from 'js-cookie'
import HealthSpinner from '@/components/ui/HealthSpinner'
import { MedicalTexture } from '@/components/ui/MedicalTexture'

export default function AIPage() {
  const [symptoms, setSymptoms] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState('symptom-checker')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: React.ReactNode }[]>([])

  // Basic intent detection to select the right AI tool per input
  const isGreeting = (text: string) => {
    const t = text.trim().toLowerCase();
    const en = /^(hi|hello|hey|good\s*(morning|afternoon|evening)|yo|sup)\b/i;
    const rw = /^(muraho|mwiriwe|amakuru|bite|mwaramutse|muramuke|ndabaramutsa)\b/i;
    return en.test(t) || rw.test(t);
  };
  const looksLikeMedicationQuestion = (text: string) => /(dose|dosage|side\s*effects|contraindication|how\s*to\s*take|warning|interact|with|ingano\s*y'|ingaruka|ku\s*burya|ukuntu\s*gifatwa)/i.test(text);
  const looksLikeHealthTips = (text: string) => /(tip|advice|how\s*to|improve|diet|nutrition|exercise|lifestyle|sleep|stress|inama|uburyo|imibereho|imidugudu|kurya|siporo|gusinzira)/i.test(text);
  const looksLikeSymptoms = (text: string) => /(pain|fever|cough|headache|nausea|vomit|dizzy|symptom|rash|sore|fatigue|shortness\s*of\s*breath|chills|uburibwe|umuriro|inkorora|umutwe|kuruka|isereri|ibimenyetso|kuribwa)/i.test(text);

  const determineServiceFromInput = (text: string): 'symptom-checker' | 'health-tips' | 'prescription-helper' => {
    const t = text.toLowerCase();
    // Explicit hints
    if (/(symptom|checker)\b/.test(t)) return 'symptom-checker';
    if (/(tip|advice|wellness|healthy)\b/.test(t)) return 'health-tips';
    if (/(prescription|medicine|medication|drug|pill)\b/.test(t)) return 'prescription-helper';
    // Heuristics
    if (looksLikeMedicationQuestion(t)) return 'prescription-helper';
    if (looksLikeHealthTips(t)) return 'health-tips';
    if (looksLikeSymptoms(t)) return 'symptom-checker';
    // Default fallback
    return 'symptom-checker';
  };

  // Comprehensive Kinyarwanda detector - if user uses Kinyarwanda, they likely don't know English
  const detectLanguage = (text: string): 'rw' | 'en' => {
    const t = (text || '').toLowerCase();
    // Expanded Kinyarwanda patterns - be more aggressive in detection
    const rwHints = [
      /muraho/, /amakuru/, /mfite/, /ndizwa|ndumva|ndwaye/, /mbabaye/, /icyo|iki/, /uburwayi/, /muganga/, /ku/,
      /murakoze/, /muraho/, /mwiriwe/, /mwaramutse/, /muramuke/, /ndabaramutsa/, /bite/, /ni\s+ikihe/, /cyangwa/, /kandi/,
      /umurwayi/, /ubuzima/, /indwara/, /ikimenyetso/, /umutwe/, /umutima/, /igifu/, /agakuba/, /umuhondo/,
      /soma/, /vuga/, /jya/, /genda/, /komeza/, /tangira/, /gira/, /bona/, /amahoro/, /mwiriweho/,
      /ni\s+/, /na\s+/, /cya\s+/, /cyo\s+/, /mu\s+/, /ku\s+/, /no\s+/, /nk\s+/, /nka\s+/, /muri/, /kuri/,
      /wowe/, /jewe/, /twebwe/, /mwebwe/, /cya/, /cyo/, /cye/, /za/, /zo/, /ze/,
      /ubwoba/, /kwiyubaka/, /gukabya/, /gutera/, /kwihangana/
    ];
    const isRw = rwHints.some((r) => r.test(t));
    // Also check for Kinyarwanda accented characters
    const hasRwAccents = /[áàâäéèêëíìîïóòôöúùûü]/.test(text);
    // If any Kinyarwanda pattern is found, respond in Kinyarwanda
    return (isRw || hasRwAccents) ? 'rw' : 'en';
  };

  const getCachedUserName = (): string | null => {
    if (typeof window === 'undefined') return null;
    const direct = localStorage.getItem('userName');
    if (direct && direct.trim()) return direct.trim();
    try {
      const userJson = localStorage.getItem('user') || localStorage.getItem('currentUser') || localStorage.getItem('profile');
      if (userJson) {
        const parsed = JSON.parse(userJson);
        const name = parsed?.name || parsed?.user?.name;
        if (typeof name === 'string' && name.trim()) return name.trim();
      }
    } catch {}
    return null;
  };

  const fetchUserName = async (): Promise<string> => {
    const cached = getCachedUserName();
    if (cached) return cached;
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com'
      const res = await fetch(`${API_BASE_URL.trim()}/auth/me`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) return 'there';
      const data = await res.json();
      const name = data?.data?.name || data?.user?.name || data?.name || 'there';
      if (typeof window !== 'undefined' && name && name !== 'there') {
        try { localStorage.setItem('userName', name); } catch {}
      }
      return name;
    } catch {
      return 'there';
    }
  };

  // Deeper analysis: extract intent, entities, and a brief rationale to guide answers
  type Analysis = {
    intent: 'greeting' | 'symptoms' | 'tips' | 'medication';
    entities: {
      symptoms?: string[];
      topics?: string[];
      medicationName?: string;
      questions?: string[];
    };
    confidence: number;
    rationale: string;
  }

  const analyzeInput = (text: string): Analysis => {
    const original = text.trim();
    const lower = original.toLowerCase();
    const lang = detectLanguage(original);

    if (isGreeting(original)) {
      return {
        intent: 'greeting',
        entities: {},
        confidence: 0.95,
        rationale: lang === 'rw' ? 'Byabonetse ko ari ikazane/kwaramutsa' : 'Detected common greeting phrase'
      };
    }

    // Extract medication name heuristically (first capitalized token or word before dosage keywords)
    let medicationName: string | undefined;
    const medMatch = original.match(/([A-Z][a-zA-Z\-]{2,})(?:\s*(\d+\s*mg|\d+\s*mcg))?/);
    if (medMatch) medicationName = medMatch[1];
    const questionHints = original.match(/(?:(?:what|how|can|does|is|are|should)\b[^\?\.!]*[\?\.\!]?)/gi) || [];

    // Topics for tips
    const topicCandidates = original.split(/,|;|\band\b/gi).map(s => s.trim()).filter(Boolean);
    const symptomsList = original.split(/,|;|\band\b/gi).map(s => s.trim()).filter(Boolean);

    const medScore = (looksLikeMedicationQuestion(lower) ? 0.6 : 0) + (medicationName ? 0.3 : 0);
    const tipScore = (looksLikeHealthTips(lower) ? 0.7 : 0) + (topicCandidates.length > 0 ? 0.2 : 0);
    const symScore = (looksLikeSymptoms(lower) ? 0.7 : 0) + (symptomsList.length > 0 ? 0.2 : 0);

    if (medScore >= tipScore && medScore >= symScore) {
      return {
        intent: 'medication',
        entities: {
          medicationName: medicationName || original,
          questions: questionHints.length ? questionHints.map(q => q.trim()) : undefined
        },
        confidence: medScore,
        rationale: lang === 'rw' ? 'Amagambo yerekeye imiti yabonetse' : 'Medication-related keywords and potential drug name detected'
      };
    }
    if (tipScore >= medScore && tipScore >= symScore) {
      return {
        intent: 'tips',
        entities: { topics: topicCandidates.slice(0, 5) },
        confidence: tipScore,
        rationale: lang === 'rw' ? 'Amagambo y\'inama z\'ubuzima yabonetse' : 'Health tips/wellness language detected'
      };
    }
    return {
      intent: 'symptoms',
      entities: { symptoms: symptomsList.slice(0, 8) },
      confidence: symScore,
      rationale: lang === 'rw' ? 'Amagambo asa n\'ibimenyetso by\'uburwayi yabonetse' : 'Symptom-like terms detected'
    };
  };

  const run = async (e: React.FormEvent) => {
    e.preventDefault()
    // Ensure conversation id exists before sending
    let currentConvId = conversationId;
    if (!currentConvId) {
      const existing = typeof window !== 'undefined' ? localStorage.getItem('ai_conversation_id') : null;
      if (existing) {
        currentConvId = existing;
        setConversationId(existing);
      } else {
        currentConvId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        setConversationId(currentConvId);
        try { localStorage.setItem('ai_conversation_id', currentConvId) } catch {}
        // Create conversation in database
        try {
          await api.ai.createConversation({ conversationId: currentConvId, title: 'New conversation' });
        } catch (err) {
          console.warn('⚠️  [AI FRONTEND] Could not create conversation:', err);
        }
      }
    }
    setLoading(true)
    try {
      // Optimistically add user message to chat
      setMessages(prev => ([
        ...prev,
        { role: 'user', content: (
          <div className="whitespace-pre-wrap">{symptoms.trim()}</div>
        )}
      ]))
      // Handle greetings immediately without calling backend
      // IMPORTANT: If user uses Kinyarwanda, always respond in Kinyarwanda (they likely don't know English)
      if (isGreeting(symptoms)) {
        const name = await fetchUserName();
        const lang = detectLanguage(symptoms); // Detect language from user's greeting
        // Always respond in the language the user used - if Kinyarwanda detected, respond in Kinyarwanda
        const assistantBlock = (
          <div>
            <div className="mb-1">{lang==='rw' ? `Muraho ${name}! 👋` : `Hello ${name}! 👋`}</div>
            <div className="text-sm text-gray-700">{lang==='rw' ? 'Nigute nagufasha uyu munsi? Sobanura ibimenyetso, usabe inama z\'ubuzima, cyangwa ubufasha ku miti.' : 'How can I help you today? Describe your symptoms, ask for health tips, or medication guidance.'}</div>
          </div>
        )
        setMessages(prev => ([...prev, { role: 'assistant', content: assistantBlock }]))
        // Save greeting exchange
        try {
          const currentConvId = conversationId || localStorage.getItem('ai_conversation_id') || `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          if (!conversationId) {
            setConversationId(currentConvId);
            try { localStorage.setItem('ai_conversation_id', currentConvId) } catch {}
            // Create conversation in database
            try {
              if (api?.ai?.createConversation && typeof api.ai.createConversation === 'function') {
                await api.ai.createConversation({ conversationId: currentConvId, title: 'New conversation' });
              } else {
                console.warn('⚠️  [AI FRONTEND] createConversation not available, using direct fetch');
                const token = Cookies.get('token');
                const API_BASE_URL_VALUE = process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com';
                const res = await fetch(`${API_BASE_URL_VALUE.trim()}/ai/chat/conversations`, {
            method: 'POST',
            credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                  },
                  body: JSON.stringify({ conversationId: currentConvId, title: 'New conversation' })
                });
                if (!res.ok) {
                  throw new Error(`Failed to create: ${res.status}`);
                }
              }
            } catch (err) {
              console.warn('⚠️  [AI FRONTEND] Could not create conversation:', err);
            }
          }
          // Save messages using API client or direct fetch
          if (api?.ai?.saveMessages && typeof api.ai.saveMessages === 'function') {
            await api.ai.saveMessages({
              conversationId: currentConvId,
              messages: [
                { role: 'user', service: 'general-chat', content: symptoms, analysis: 'greeting' },
                { role: 'assistant', service: 'general-chat', content: (lang==='rw' ? ('Muraho ' + name + '! Nigute nagufasha uyu munsi?') : ('Hello ' + name + '! How can I help you today?')), analysis: 'greeting' }
              ]
            });
          } else {
            console.warn('⚠️  [AI FRONTEND] saveMessages not available, using direct fetch');
            const token = Cookies.get('token');
            const API_BASE_URL_VALUE = process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com';
            const resSave = await fetch(`${API_BASE_URL_VALUE.trim()}/ai/chat/save`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
            body: JSON.stringify({
                conversationId: currentConvId,
              messages: [
                  { role: 'user', service: 'general-chat', content: symptoms, analysis: 'greeting' },
                  { role: 'assistant', service: 'general-chat', content: (lang==='rw' ? ('Muraho ' + name + '! Nigute nagufasha uyu munsi?') : ('Hello ' + name + '! How can I help you today?')), analysis: 'greeting' }
              ]
            })
            });
            if (!resSave.ok) {
              throw new Error(`Failed to save: ${resSave.status}`);
            }
          }
          console.log('✅ [AI FRONTEND] Greeting messages saved');
        } catch (saveErr) {
          console.error('❌ [AI FRONTEND] Failed to save greeting messages:', saveErr);
        }
        setLoading(false)
        setSymptoms('')
        return
      }

      // Choose service based on input analysis (with transparency)
      const a = analyzeInput(symptoms)
      const serviceForThisQuery = a.intent === 'medication' ? 'prescription-helper' : a.intent === 'tips' ? 'health-tips' : 'symptom-checker'
      const lang = detectLanguage(symptoms)
      
      console.log('🤖 [AI FRONTEND] Analyzing input...');
      console.log('   Input:', symptoms);
      console.log('   Detected intent:', a.intent);
      console.log('   Confidence:', a.confidence);
      console.log('   Selected service:', serviceForThisQuery);
      console.log('   Language:', lang);
      
      setMessages(prev => ([...prev, { role: 'assistant', content: (
        <div className="text-xs text-gray-500">
          Detected intent: <span className="font-medium">{a.intent}</span> · {a.rationale}
        </div>
      ) }]))
      let res
      
      // Always use general chat for conversational ChatGPT-like experience
      console.log('💬 [AI FRONTEND] Using general chat for conversational response');
      console.log('   api:', api);
      console.log('   api.ai:', api.ai);
      console.log('   api.ai.generalChat:', api.ai?.generalChat);
      console.log('   typeof api.ai.generalChat:', typeof api.ai?.generalChat);
      
      try {
        // Check if generalChat exists, if not use direct fetch
        if (!api.ai || typeof api.ai.generalChat !== 'function') {
          console.warn('⚠️  [AI FRONTEND] generalChat not available, using direct fetch');
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com';
          const token = Cookies.get('token');
          const fetchRes = await fetch(`${API_BASE_URL.trim()}/ai/chat-general`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              message: symptoms,
              context: { detectedIntent: a.intent, entities: a.entities },
              lang
            })
          });
          if (fetchRes.ok) {
            res = await fetchRes.json();
          } else {
            throw new Error(`Failed to fetch: ${fetchRes.status}`);
          }
        } else {
          res = await api.ai.generalChat({
            message: symptoms,
            context: { detectedIntent: a.intent, entities: a.entities },
            lang
          });
        }
        console.log('✅ [AI FRONTEND] General chat response:', res);
        
        if (res?.data?.answer) {
          setResponse({ data: { analysis: res.data.answer, recommendations: [], urgency: 'low' } });
          setMessages(prev => ([...prev, { role: 'assistant', content: (
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{res.data.answer}</div>
          ) }]));
          // Save messages
          try {
            const currentConvId = conversationId || localStorage.getItem('ai_conversation_id') || `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            if (!conversationId) {
              setConversationId(currentConvId);
              try { localStorage.setItem('ai_conversation_id', currentConvId) } catch {}
            }
            // Save messages using API client or direct fetch
            if (api?.ai?.saveMessages && typeof api.ai.saveMessages === 'function') {
              await api.ai.saveMessages({
                conversationId: currentConvId,
                messages: [
                  { role: 'user', service: 'general-chat', content: symptoms, analysis: a.rationale },
                  { role: 'assistant', service: 'general-chat', content: res.data.answer, analysis: 'general' }
                ]
              });
            } else {
              console.warn('⚠️  [AI FRONTEND] saveMessages not available, using direct fetch');
              const token = Cookies.get('token');
              const API_BASE_URL_VALUE = process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com';
              const resSave = await fetch(`${API_BASE_URL_VALUE.trim()}/ai/chat/save`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                  conversationId: currentConvId,
                  messages: [
                    { role: 'user', service: 'general-chat', content: symptoms, analysis: a.rationale },
                    { role: 'assistant', service: 'general-chat', content: res.data.answer, analysis: 'general' }
                  ]
                })
              });
              if (!resSave.ok) {
                throw new Error(`Failed to save: ${resSave.status}`);
              }
            }
            console.log('✅ [AI FRONTEND] Messages saved successfully');
          } catch (saveErr) {
            console.error('❌ [AI FRONTEND] Failed to save messages:', saveErr);
          }
          setLoading(false);
          setSymptoms('');
          return;
        }
      } catch (generalChatError) {
        console.error('❌ [AI FRONTEND] General chat failed:', generalChatError);
        // Fallback to error message
        const errorText = 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.';
        setMessages(prev => ([...prev, { role: 'assistant', content: (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{errorText}</div>
        ) }]));
        setLoading(false);
        setSymptoms('');
        return;
      }
      
      switch (serviceForThisQuery) {
        case 'symptom-checker':
          res = await api.ai.symptomChecker({
            symptoms: (a.entities.symptoms && a.entities.symptoms.length ? a.entities.symptoms : symptoms.split(',')).map((s: string) => s.trim()).filter(Boolean),
            severity: 'mild',
            duration: '2d',
            age: 30,
            lang
          })
          break
        case 'health-tips':
          {
            const items = (a.entities.topics && a.entities.topics.length ? a.entities.topics : symptoms.split(',')).map((s: string) => s.trim()).filter(Boolean)
            const [categoryOrCondition, ...rest] = items
            res = await api.ai.healthTips({
              category: categoryOrCondition || 'general',
              condition: categoryOrCondition,
              age: 30,
              interests: rest,
              lang
            })
          }
          break
        case 'prescription-helper':
          {
            const medicationName = (a.entities.medicationName || '').trim() || symptoms
            const qs = (a.entities.questions && a.entities.questions.length ? a.entities.questions : []) as string[]
            res = await api.ai.prescriptionHelper({
              medicationName: medicationName || symptoms,
              questions: qs.length ? qs : [
                'What are common side effects?',
                'How should I take it?',
                'Any warnings?'
              ],
              lang
            })
          }
          break
        default:
          res = await api.ai.symptomChecker({
            symptoms: symptoms.split(',').map((s: string) => s.trim()),
            severity: 'mild',
            duration: '2d',
            age: 30
          })
      }
      
      // Normalize backend responses to UI-friendly shape
      if (!res || (res as any)?.status === 'error') {
        setResponse({ error: (res as any)?.message || 'AI service error. Please try again.' })
        const errorText = (res as any)?.message || 'AI service error. Please try again.'
        setMessages(prev => ([...prev, { role: 'assistant', content: (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {errorText}
          </div>
        ) }]))
        // Persist failed exchange for history
        try {
          // Save messages using API client
          await api.ai.saveMessages({
              conversationId,
              messages: [
                { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: 'error' },
                { role: 'assistant', service: serviceForThisQuery, content: errorText, analysis: 'error' }
              ]
          })
        } catch {}
      } else if ((res as any)?.data) {
        const d = (res as any).data
        if (serviceForThisQuery === 'symptom-checker') {
          const analysisText = Array.isArray(d.analysis)
            ? d.analysis.map((a: any) => `${a.symptom || a.matched}: ${a.recommendations?.[0] || a.urgency || ''}`).join('\n')
            : (d.analysis || '')
          setResponse({ data: { analysis: analysisText, recommendations: d.recommendations, urgency: d.urgencyLevel || d.urgency } })
          setMessages(prev => ([...prev, { role: 'assistant', content: (
            <AIResponseBlock analysis={analysisText} recommendations={d.recommendations} urgency={d.urgencyLevel || d.urgency} />
          ) }]))
          try {
            // Save messages using API client
            await api.ai.saveMessages({
                conversationId,
                messages: [
                  { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: a.rationale },
                  { role: 'assistant', service: serviceForThisQuery, content: [analysisText, ...(d.recommendations || [])].filter(Boolean).join('\n'), analysis: (d.urgencyLevel || d.urgency || '') }
                ]
            })
          } catch {}
        } else if (serviceForThisQuery === 'health-tips') {
          const tips = d.tips || []
          const aiTips = d.aiGeneratedTips || []
          const recs = [...tips, ...aiTips].map((t: any) => `${t.title}: ${t.content}`)
          setResponse({ data: { analysis: `Personalized tips (${recs.length})`, recommendations: recs, urgency: 'low' } })
          setMessages(prev => ([...prev, { role: 'assistant', content: (
            <AIResponseBlock analysis={`Personalized tips (${recs.length})`} recommendations={recs} urgency={'low'} />
          ) }]))
          try {
            // Save messages using API client
            await api.ai.saveMessages({
                conversationId,
                messages: [
                  { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: a.rationale },
                  { role: 'assistant', service: serviceForThisQuery, content: recs.join('\n'), analysis: 'tips' }
                ]
            })
          } catch {}
        } else if (serviceForThisQuery === 'prescription-helper') {
          const info = d.information
          const recs = [...(d.guidance || []), ...(d.ai?.warnings || [])]
          const analysisText = info ? `${info.genericName || ''} — Uses: ${(info.uses || []).join(', ')}` : 'Medication guidance'
          setResponse({ data: { analysis: analysisText, recommendations: recs, urgency: 'medium' } })
          setMessages(prev => ([...prev, { role: 'assistant', content: (
            <AIResponseBlock analysis={analysisText} recommendations={recs} urgency={'medium'} />
          ) }]))
          try {
            // Save messages using API client
            await api.ai.saveMessages({
                conversationId,
                messages: [
                  { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: a.rationale },
                  { role: 'assistant', service: serviceForThisQuery, content: [analysisText, ...recs].join('\n'), analysis: 'medication' }
                ]
            })
          } catch {}
        } else {
          setResponse({ data: d })
          setMessages(prev => ([...prev, { role: 'assistant', content: (
            <AIResponseBlock analysis={'Analysis'} recommendations={Array.isArray(d) ? d : []} urgency={'low'} />
          ) }]))
        }
      } else {
        const mock = generateMockResponse(selectedService, symptoms)
        setResponse(mock)
        const assistantBlock = (
          <AIResponseBlock analysis={mock.data.analysis} recommendations={mock.data.recommendations} urgency={mock.data.urgency} />
        )
        setMessages(prev => ([...prev, { role: 'assistant', content: assistantBlock }]))
        // Save mock exchange as well
        try {
          // Save messages using API client
          await api.ai.saveMessages({
              conversationId,
              messages: [
                { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: 'mock' },
                { role: 'assistant', service: serviceForThisQuery, content: [mock.data.analysis, ...(mock.data.recommendations || [])].filter(Boolean).join('\n'), analysis: mock.data.urgency }
              ]
          })
        } catch {}
      }
    } catch (error: any) {
      console.error('AI service error:', error?.message || error)
      setResponse({ error: error?.message || 'AI request failed.' })
      const errText = error?.message || 'AI request failed.'
      setMessages(prev => ([...prev, { role: 'assistant', content: (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error?.message || 'AI request failed.'}</div>
      ) }]))
      // Persist exception exchange
      try {
        // Save messages using API client
        await api.ai.saveMessages({
            conversationId,
            messages: [
              { role: 'user', service: selectedService, content: symptoms, analysis: 'exception' },
              { role: 'assistant', service: selectedService, content: errText, analysis: 'exception' }
            ]
        })
      } catch {}
    } finally {
      setLoading(false)
      setSymptoms('')
    }
  }

  const generateMockResponse = (service: string, input: string) => {
    const symptoms = input.split(',').map(s => s.trim())
    
    switch (service) {
      case 'symptom-checker':
        return {
          data: {
            analysis: `Based on your symptoms: ${symptoms.join(', ')}, this appears to be a common condition that may require medical attention. The symptoms you've described could be related to several possible conditions.`,
            recommendations: [
              'Rest and stay hydrated',
              'Monitor your temperature regularly',
              'Consider over-the-counter pain relief if needed',
              'Avoid strenuous activities',
              'Seek medical attention if symptoms worsen'
            ],
            urgency: symptoms.some(s => s.toLowerCase().includes('severe') || s.toLowerCase().includes('chest pain')) ? 'high' : 'medium'
          }
        }
      case 'health-tips':
        return {
          data: {
            analysis: `Here are some health tips related to "${input}":`,
            recommendations: [
              'Maintain a balanced diet with plenty of fruits and vegetables',
              'Exercise regularly for at least 30 minutes daily',
              'Get adequate sleep (7-9 hours per night)',
              'Stay hydrated by drinking plenty of water',
              'Manage stress through relaxation techniques',
              'Regular health check-ups are important'
            ],
            urgency: 'low'
          }
        }
      case 'prescription-helper':
        return {
          data: {
            analysis: `For the symptoms you've described: ${symptoms.join(', ')}, here are some general guidance on medications and treatments.`,
            recommendations: [
              'Consult with a healthcare professional before taking any medication',
              'Consider over-the-counter options like acetaminophen for pain relief',
              'Antihistamines may help with allergy-related symptoms',
              'Stay hydrated and get plenty of rest',
              'Follow dosage instructions carefully'
            ],
            urgency: 'medium'
          }
        }
      default:
        return {
          data: {
            analysis: 'Thank you for using our AI health assistant. Please consult with a healthcare professional for proper medical advice.',
            recommendations: ['Consult a healthcare provider', 'Follow medical advice', 'Maintain regular check-ups'],
            urgency: 'low'
          }
        }
    }
  }

  const aiServices = [
    {
      id: 'symptom-checker',
      name: 'Symptom Checker',
      description: 'Analyze your symptoms and get preliminary health insights',
      icon: '🔍'
    },
    {
      id: 'health-tips',
      name: 'Health Tips',
      description: 'Get personalized health and wellness recommendations',
      icon: '💡'
    },
    {
      id: 'prescription-helper',
      name: 'Prescription Helper',
      description: 'Get guidance on medication and treatment options',
      icon: '💊'
    }
  ]

  const selectedServiceMeta = useMemo(() => aiServices.find(s => s.id === selectedService), [selectedService])

  // Conversation id for grouping history
  const [conversationId, setConversationId] = useState<string>('')
  useEffect(() => {
    const existing = typeof window !== 'undefined' ? localStorage.getItem('ai_conversation_id') : ''
    if (existing) setConversationId(existing)
    else {
      const id = `conv_${Date.now()}`
      setConversationId(id)
      try { localStorage.setItem('ai_conversation_id', id) } catch {}
    }
  }, [])

  // Load recent history when conversation changes
  useEffect(() => {
    const loadHistory = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }
      try {
        console.log('📖 [AI FRONTEND] Loading history for conversation:', conversationId);
        // Load history using API client or direct fetch
        let data;
        if (api?.ai?.getHistory && typeof api.ai.getHistory === 'function') {
          data = await api.ai.getHistory({ limit: 100, conversationId });
        } else {
          console.warn('⚠️  [AI FRONTEND] getHistory not available, using direct fetch');
          const token = Cookies.get('token');
          const API_BASE_URL_VALUE = process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com';
          const res = await fetch(`${API_BASE_URL_VALUE.trim()}/ai/chat/history?conversationId=${encodeURIComponent(conversationId)}&limit=100`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            data = await res.json();
          } else {
            throw new Error(`Failed to fetch: ${res.status}`);
          }
        }
        console.log('📖 [AI FRONTEND] History loaded:', data?.data?.length || 0, 'messages');
        
        const msgs = (data?.data || []).map((m: any) => ({
          role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
          content: (
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {m.content || ''}
            </div>
          )
        }));
        setMessages(msgs);
        console.log('✅ [AI FRONTEND] Messages loaded:', msgs.length);
      } catch (err) {
        console.error('❌ [AI FRONTEND] Error loading history:', err);
        setMessages([]);
      }
    };
    loadHistory();
  }, [conversationId])

  return (
    <AppShell
      menu={[
        { href: '/patient', label: 'Overview' },
        { href: '/patient/appointments', label: 'Appointments' },
        { href: '/patient/teleconsult', label: 'Teleconsultation' },
        { href: '/patient/pharmacy', label: 'Pharmacy' },
        { href: '/patient/ai', label: 'AI Assistant' },
        { href: '/patient/emergency', label: 'Emergency' },
        { href: '/patient/records', label: 'Medical Records' },
        { href: '/patient/orders', label: 'My Orders' },
      ]}
    >
      <div className="h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Conversation Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 card p-4 flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Conversations</h2>
            <button
              onClick={async () => {
                const id = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                console.log('🆕 [AI FRONTEND] Creating new conversation:', id);
                setConversationId(id);
                try { localStorage.setItem('ai_conversation_id', id) } catch {}
                setMessages([]);
                try {
                  // Create conversation using API client or direct fetch
                  if (api?.ai?.createConversation && typeof api.ai.createConversation === 'function') {
                    await api.ai.createConversation({ conversationId: id, title: 'New conversation' });
                    console.log('✅ [AI FRONTEND] New conversation created');
                  } else {
                    console.warn('⚠️  [AI FRONTEND] createConversation not available, using direct fetch');
                    const token = Cookies.get('token');
                    const API_BASE_URL_VALUE = process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com';
                    const res = await fetch(`${API_BASE_URL_VALUE.trim()}/ai/chat/conversations`, {
                    method: 'POST',
                    credentials: 'include',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                      },
                    body: JSON.stringify({ conversationId: id, title: 'New conversation' })
                    });
                    if (res.ok) {
                      console.log('✅ [AI FRONTEND] New conversation created via fallback');
                    } else {
                      throw new Error(`Failed to create: ${res.status}`);
                    }
                  }
                } catch (err) {
                  console.error('❌ [AI FRONTEND] Failed to create conversation:', err);
                }
              }}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          <ConversationList
            activeId={conversationId}
            onSelect={async (id) => {
              console.log('🔄 [AI FRONTEND] Selecting conversation:', id);
              setConversationId(id);
              try { localStorage.setItem('ai_conversation_id', id) } catch {}
              // History will be loaded automatically by useEffect
            }}
          />

          <div className="mt-auto pt-4 text-xs text-gray-500">
            ⚠️ Informational only. Not a medical diagnosis.
          </div>
        </aside>

        {/* Right: Chat area */}
        <section className="lg:col-span-8 xl:col-span-9 card flex flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <h1 className="text-xl font-semibold text-gray-900">AI Health Assistant</h1>
            <p className="text-sm text-gray-500">{selectedServiceMeta?.name} · {selectedServiceMeta?.description}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                Ask a health question to get started.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`${m.role === 'assistant' ? 'bg-gray-100 text-gray-900' : 'bg-blue-600 text-white'} max-w-[85%] rounded-2xl px-4 py-3 shadow-sm`}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-3 shadow-sm">
                  <HealthSpinner />
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={run} className="border-t p-3 flex items-end gap-3">
            <textarea
              className="input flex-1 resize-none"
              rows={2}
              placeholder={
                selectedService === 'symptom-checker' ? 'Describe your symptoms (comma separated)' :
                selectedService === 'health-tips' ? 'What health topic interests you?' :
                'Describe your condition or medication questions'
              }
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading || !symptoms.trim()}
              className="btn-primary whitespace-nowrap"
            >
              {loading ? (
                  <HealthSpinner />
              ) : (
                'Send'
              )}
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  )
}

function AIResponseBlock({ analysis, recommendations, urgency }: { analysis?: string, recommendations?: string[], urgency?: string }) {
  return (
    <div className="space-y-4">
      {analysis && (
        <div>
          <div className="text-sm font-semibold mb-1">Analysis</div>
                  <div className="bg-emerald-50/95 backdrop-blur-sm text-gray-800 p-3 rounded-lg border border-emerald-200 whitespace-pre-wrap relative overflow-hidden">
                    <MedicalTexture pattern="healthcare" opacity={0.03} className="text-emerald-600" />
                    <span className="relative z-10">{analysis}</span>
                  </div>
        </div>
      )}
      {Array.isArray(recommendations) && recommendations.length > 0 && (
        <div>
          <div className="text-sm font-semibold mb-1">Recommendations</div>
                  <ul className="list-disc list-inside space-y-1 bg-emerald-50/95 backdrop-blur-sm text-gray-800 p-3 rounded-lg border border-emerald-200 relative overflow-hidden">
                    <MedicalTexture pattern="pills" opacity={0.03} className="text-emerald-600" />
            {recommendations.map((rec, idx) => (<li key={idx}>{rec}</li>))}
          </ul>
        </div>
      )}
      {urgency && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Urgency:</span>
          <span className={`badge ${
            urgency === 'high' ? 'badge-danger' : urgency === 'medium' ? 'badge-warning' : 'badge-success'
          }`}>{(urgency || '').toString().toUpperCase()}</span>
        </div>
      )}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
        This AI is for information only and not a medical diagnosis.
      </div>
    </div>
  )
}

function ConversationList({ activeId, onSelect }: { activeId: string, onSelect: (id: string) => void }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const refresh = async () => {
    try {
      setLoading(true)
      // Load conversations using API client
      try {
        if (api?.ai?.listConversations && typeof api.ai.listConversations === 'function') {
          console.log('📋 [AI FRONTEND] Loading conversations via API client...');
          const data = await api.ai.listConversations();
          console.log('✅ [AI FRONTEND] Conversations loaded:', data?.data?.length || 0);
          setItems(data?.data || []);
        } else {
          // Fallback: direct fetch if API client doesn't have the method
          console.warn('⚠️ [AI] listConversations not available, using direct fetch');
          const token = Cookies.get('token');
          const API_BASE_URL_VALUE = process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com';
          const res = await fetch(`${API_BASE_URL_VALUE.trim()}/ai/chat/conversations`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            const data = await res.json();
            console.log('✅ [AI FRONTEND] Conversations loaded via fallback:', data?.data?.length || 0);
            setItems(data?.data || []);
          } else {
            console.error('❌ [AI] Failed to fetch conversations:', res.status, res.statusText);
            setItems([]);
          }
        }
      } catch (fetchError) {
        console.error('❌ [AI] Error loading conversations:', fetchError);
        setItems([]);
      }
    } catch (error) {
      console.error('❌ [AI] Error in refresh:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const rename = async (id: string) => {
    const title = prompt('Rename conversation to:');
    if (!title || !title.trim()) return;
    try {
      console.log('✏️  [AI FRONTEND] Renaming conversation:', id, 'to:', title);
      // Rename conversation using API client
      await api.ai.renameConversation(id, { title: title.trim() });
      console.log('✅ [AI FRONTEND] Conversation renamed successfully');
      refresh();
    } catch (err) {
      console.error('❌ [AI FRONTEND] Failed to rename conversation:', err);
      alert('Failed to rename conversation. Please try again.');
    }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this conversation? This cannot be undone.')) return;
    try {
      console.log('🗑️  [AI FRONTEND] Deleting conversation:', id);
      // Delete conversation using API client or direct fetch
      if (api?.ai?.deleteConversation && typeof api.ai.deleteConversation === 'function') {
        await api.ai.deleteConversation(id);
        console.log('✅ [AI FRONTEND] Conversation deleted successfully');
      } else {
        console.warn('⚠️  [AI FRONTEND] deleteConversation not available, using direct fetch');
        const token = Cookies.get('token');
        const API_BASE_URL_VALUE = process.env.NEXT_PUBLIC_API_URL || 'https://api.onehealthline.com';
        const res = await fetch(`${API_BASE_URL_VALUE.trim()}/ai/chat/conversations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) {
          throw new Error(`Failed to delete: ${res.status}`);
        }
        console.log('✅ [AI FRONTEND] Conversation deleted via fallback');
      }
      refresh();
      if (id === activeId) onSelect('');
    } catch (err) {
      console.error('❌ [AI FRONTEND] Failed to delete conversation:', err);
      alert('Failed to delete conversation. Please try again.');
    }
  }

  return (
    <div className="space-y-2 overflow-auto pr-1">
      {loading && <div className="text-sm text-gray-500">Loading…</div>}
      {items.map((c) => (
        <div key={c.conversationId} className={`group border rounded-lg p-3 ${activeId === c.conversationId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <button onClick={() => onSelect(c.conversationId)} className="text-left flex-1">
              <div className="font-medium text-sm truncate">{c.title || 'Conversation'}</div>
              <div className="text-xs text-gray-500">
                {new Date(c.updatedAt || c.createdAt).toLocaleString()}
                {c.messageCount !== undefined ? ` · ${c.messageCount} messages` : ''}
              </div>
            </button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <button onClick={() => rename(c.conversationId)} className="text-xs text-blue-600 hover:underline">Rename</button>
              <button onClick={() => del(c.conversationId)} className="text-xs text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        </div>
      ))}
      {!loading && items.length === 0 && (
        <div className="text-sm text-gray-500">No conversations yet.</div>
      )}
    </div>
  )
}

