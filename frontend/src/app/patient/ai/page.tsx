"use client"
import { AppShell } from '@/components/layout/AppShell'
import React, { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import HealthSpinner from '@/components/ui/HealthSpinner'

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

  // Very lightweight Kinyarwanda detector
  const detectLanguage = (text: string): 'rw' | 'en' => {
    const t = (text || '').toLowerCase();
    const rwHints = [/muraho/, /amakuru/, /mfite/, /ndizwa|ndumva|ndwaye/, /mbabaye/, /icyo|iki/, /uburwayi/, /muganga/, /ku/];
    const isRw = rwHints.some((r) => r.test(t));
    return isRw ? 'rw' : 'en';
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'}/auth/me`, {
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
    if (!conversationId) {
      const id = `conv_${Date.now()}`
      setConversationId(id)
      try { localStorage.setItem('ai_conversation_id', id) } catch {}
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
      if (isGreeting(symptoms)) {
        const name = await fetchUserName();
        const lang = detectLanguage(symptoms)
        const assistantBlock = (
          <div>
            <div className="mb-1">{lang==='rw' ? `Muraho ${name}! 👋` : `Hello ${name}! 👋`}</div>
            <div className="text-sm text-gray-700">{lang==='rw' ? 'Nigute nagufasha uyu munsi? Sobanura ibimenyetso, usabe inama z\'ubuzima, cyangwa ubufasha ku miti.' : 'How can I help you today? Describe your symptoms, ask for health tips, or medication guidance.'}</div>
          </div>
        )
        setMessages(prev => ([...prev, { role: 'assistant', content: assistantBlock }]))
        // Save greeting exchange
        try {
          const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
          await fetch(`${base}/ai/chat/save`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId: conversationId || localStorage.getItem('ai_conversation_id'),
              messages: [
                { role: 'user', service: selectedService, content: symptoms, analysis: 'greeting' },
                { role: 'assistant', service: selectedService, content: (lang==='rw' ? ('Muraho ' + name + '! Nigute nagufasha uyu munsi?') : ('Hello ' + name + '! How can I help you today?')), analysis: 'greeting' }
              ]
            })
          })
        } catch {}
        setLoading(false)
        setSymptoms('')
        return
      }

      // Choose service based on input analysis (with transparency)
      const a = analyzeInput(symptoms)
      const serviceForThisQuery = a.intent === 'medication' ? 'prescription-helper' : a.intent === 'tips' ? 'health-tips' : 'symptom-checker'
      setMessages(prev => ([...prev, { role: 'assistant', content: (
        <div className="text-xs text-gray-500">
          Detected intent: <span className="font-medium">{a.intent}</span> · {a.rationale}
        </div>
      ) }]))
      let res
      const lang = detectLanguage(symptoms)
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
          const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
          await fetch(`${base}/ai/chat/save`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId,
              messages: [
                { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: 'error' },
                { role: 'assistant', service: serviceForThisQuery, content: errorText, analysis: 'error' }
              ]
            })
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
            const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
            await fetch(`${base}/ai/chat/save`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId,
                messages: [
                  { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: a.rationale },
                  { role: 'assistant', service: serviceForThisQuery, content: [analysisText, ...(d.recommendations || [])].filter(Boolean).join('\n'), analysis: (d.urgencyLevel || d.urgency || '') }
                ]
              })
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
            const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
            await fetch(`${base}/ai/chat/save`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId,
                messages: [
                  { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: a.rationale },
                  { role: 'assistant', service: serviceForThisQuery, content: recs.join('\n'), analysis: 'tips' }
                ]
              })
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
            const base =  ' http://localhost:5000'
            await fetch(`${base}/ai/chat/save`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId,
                messages: [
                  { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: a.rationale },
                  { role: 'assistant', service: serviceForThisQuery, content: [analysisText, ...recs].join('\n'), analysis: 'medication' }
                ]
              })
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
          const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
          await fetch(`${base}/ai/chat/save`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId,
              messages: [
                { role: 'user', service: serviceForThisQuery, content: symptoms, analysis: 'mock' },
                { role: 'assistant', service: serviceForThisQuery, content: [mock.data.analysis, ...(mock.data.recommendations || [])].filter(Boolean).join('\n'), analysis: mock.data.urgency }
              ]
            })
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
        const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
        await fetch(`${base}/ai/chat/save`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            messages: [
              { role: 'user', service: selectedService, content: symptoms, analysis: 'exception' },
              { role: 'assistant', service: selectedService, content: errText, analysis: 'exception' }
            ]
          })
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

  // Load recent history
  useEffect(() => {
    const loadHistory = async () => {
      if (!conversationId) return
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
        const res = await fetch(`${base}/ai/chat/history?limit=30&conversationId=${encodeURIComponent(conversationId)}`, { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        const msgs = (data?.data || []).reverse().map((m: any) => ({
          role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
          content: <div className="whitespace-pre-wrap">{m.content}</div>
        }))
        setMessages(msgs)
      } catch {}
    }
    loadHistory()
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
                const id = `conv_${Date.now()}`
                setConversationId(id)
                try { localStorage.setItem('ai_conversation_id', id) } catch {}
                setMessages([])
                try {
                  const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
                  await fetch(`${base}/ai/chat/conversations`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ conversationId: id, title: 'New conversation' })
                  })
                } catch {}
              }}
              className="btn-primary text-sm"
            >
              New Chat
            </button>
          </div>

          <ConversationList
            activeId={conversationId}
            onSelect={async (id) => {
              setConversationId(id)
              try { localStorage.setItem('ai_conversation_id', id) } catch {}
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
          <div className="bg-white text-gray-800 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap">{analysis}</div>
        </div>
      )}
      {Array.isArray(recommendations) && recommendations.length > 0 && (
        <div>
          <div className="text-sm font-semibold mb-1">Recommendations</div>
          <ul className="list-disc list-inside space-y-1 bg-white text-gray-800 p-3 rounded-lg border border-gray-200">
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
      const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
      const res = await fetch(`${base}/ai/chat/conversations`, { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setItems(data?.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const rename = async (id: string) => {
    const title = prompt('Rename conversation to:')
    if (!title) return
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
      await fetch(`${base}/ai/chat/conversations/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
      refresh()
    } catch {}
  }

  const del = async (id: string) => {
    if (!confirm('Delete this conversation? This cannot be undone.')) return
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'https://onehealthconnekt.onrender.com'
      await fetch(`${base}/ai/chat/conversations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      refresh()
      if (id === activeId) onSelect('')
    } catch {}
  }

  return (
    <div className="space-y-2 overflow-auto pr-1">
      {loading && <div className="text-sm text-gray-500">Loading…</div>}
      {items.map((c) => (
        <div key={c.conversationId} className={`group border rounded-lg p-3 ${activeId === c.conversationId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <button onClick={() => onSelect(c.conversationId)} className="text-left flex-1">
              <div className="font-medium text-sm truncate">{c.title || 'Conversation'}</div>
              <div className="text-xs text-gray-500">{new Date(c.updatedAt || c.createdAt).toLocaleString()}</div>
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

