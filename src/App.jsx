import React, { useState, useEffect, useRef } from 'react'

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const ACCENT      = '#4A6FA5'
const ACCENT_DARK = '#3A5A8A'
const TEXT        = '#111111'
const MUTED       = '#6B7280'
const DIVIDER     = '#E5E7EB'
const CARD_BG     = '#F8F9FA'
const WARM_BG     = '#FAF8F4'

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 640 : false
  )
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isDesktop
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  .page-bg {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: #fff;
  }
  @media (min-width: 640px) {
    .page-bg {
      background: linear-gradient(160deg, #ECF0F6 0%, #E6EBF4 100%);
      padding: 52px 24px 80px;
      align-items: flex-start;
    }
  }

  .app-shell {
    width: 100%;
    max-width: 720px;
    min-height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }
  @media (min-width: 640px) {
    .app-shell {
      min-height: 0;
      border-radius: 18px;
      box-shadow:
        0 0 0 1px rgba(0,0,0,0.06),
        0 4px 8px rgba(0,0,0,0.04),
        0 16px 48px rgba(0,0,0,0.10),
        0 40px 80px rgba(0,0,0,0.06);
      overflow: hidden;
    }
  }

  .app-shell::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${ACCENT};
    z-index: 10;
  }

  .fade-in { animation: fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .flow-screen {
    flex: 1; display: flex; flex-direction: column;
    animation: fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* ── Home concept grid ── */
  .concept-list {
    flex: 1;
  }
  @media (min-width: 640px) {
    .concept-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 0 32px 36px;
      align-content: start;
    }
    .concept-item-last {
      grid-column: 1 / -1;
      max-width: calc(50% - 5px);
    }
    .concept-divider { display: none !important; }
  }

  /* ── Row / card button ── */
  .row-btn {
    width: 100%; background: none; border: none; cursor: pointer;
    padding: 16px 20px; display: flex; align-items: center;
    justify-content: space-between; text-align: left;
    transition: background 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .row-btn:hover  { background: #F7F8FA; }
  .row-btn:active { background: #EFF1F5; }
  @media (min-width: 640px) {
    .row-btn {
      border: 1.5px solid #E8EAF0;
      border-radius: 14px;
      padding: 18px 20px;
      background: #fff;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.15s;
    }
    .row-btn:hover {
      border-color: rgba(74,111,165,0.3);
      box-shadow: 0 4px 16px rgba(74,111,165,0.09);
      background: #fff;
    }
  }

  /* ── Acceptance desktop: side-by-side ── */
  .acceptance-body {
    flex: 1; display: flex; flex-direction: column;
    padding: 28px 20px 0; overflow-y: auto;
  }
  .acceptance-action-bar {
    padding: 20px 20px 48px;
    display: flex; flex-direction: column;
    align-items: center; gap: 12;
  }
  @media (min-width: 640px) {
    .acceptance-body {
      flex-direction: row;
      align-items: flex-start;
      padding: 36px 36px 36px;
      gap: 40px;
      overflow-y: visible;
    }
    .acceptance-terms-col { flex: 1; }
    .acceptance-action-col {
      flex: 0 0 160px;
      display: flex; flex-direction: column;
      align-items: center; padding-top: 32px;
      position: sticky; top: 24px;
    }
    .acceptance-action-bar { display: none !important; }
    .acceptance-action-col-btn {
      display: flex !important;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      width: 100%;
    }
  }

  /* ── Completion desktop ── */
  @media (min-width: 640px) {
    .completion-inner {
      padding: 56px 48px 48px !important;
    }
    .completion-title {
      font-size: 36px !important;
    }
    .completion-body {
      font-size: 16px !important;
    }
  }

  /* ── Flow content padding (desktop) ── */
  @media (min-width: 640px) {
    .flow-pad { padding-left: 36px !important; padding-right: 36px !important; }
    .flow-pad-top { padding-top: 32px !important; }
    .flow-btn-bar { padding: 20px 36px 52px !important; }
  }

  .press-btn { transition: transform 0.1s ease, opacity 0.1s ease; }
  .press-btn:active { transform: scale(0.985); }

  button { font-family: inherit; cursor: pointer; }
  input  { font-family: inherit; }

  .chip {
    border-radius: 20px; padding: 6px 13px;
    font-size: 13px; font-weight: 500;
    user-select: none; -webkit-user-select: none;
  }

  /* ── Range slider ── */
  input[type=range] { accent-color: ${ACCENT}; cursor: pointer; }
`

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function BackBtn({ onBack }) {
  return (
    <button onClick={onBack} style={{
      background: 'none', border: 'none',
      display: 'flex', alignItems: 'center', gap: 5,
      color: ACCENT, fontSize: 14, fontWeight: 500,
      padding: '14px 16px', minWidth: 70,
    }}>
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M7 1L1 7L7 13" stroke={ACCENT} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Back
    </button>
  )
}

function Header({ onBack, title }) {
  return (
    <div style={{
      borderBottom: `1px solid ${DIVIDER}`,
      display: 'flex', alignItems: 'center',
      minHeight: 52, flexShrink: 0,
      position: 'relative',
    }}>
      <BackBtn onBack={onBack} />
      {title && (
        <>
          <span style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            fontSize: 14, fontWeight: 600, color: TEXT, letterSpacing: '0.01em',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>{title}</span>
          <div style={{ flex: 1 }} />
          <div style={{ minWidth: 70 }} />
        </>
      )}
    </div>
  )
}

function Annotation({ text }) {
  return (
    <div className="fade-in" style={{
      margin: '20px 0 0',
      padding: '16px 18px 18px',
      background: 'linear-gradient(135deg, #EEF3FB 0%, #F0F4FA 100%)',
      borderRadius: 14,
      border: `1px solid rgba(74,111,165,0.18)`,
      boxShadow: '0 1px 4px rgba(74,111,165,0.08)',
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: ACCENT,
        letterSpacing: '1px', marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
          <path d="M5.5 1L6.8 4.2H10.2L7.5 6.2L8.5 9.5L5.5 7.5L2.5 9.5L3.5 6.2L0.8 4.2H4.2L5.5 1Z"
            fill={ACCENT} opacity="0.7"/>
        </svg>
        LEGAL CONCEPT
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.68, color: '#2a3a50', fontStyle: 'italic', margin: 0 }}>{text}</p>
    </div>
  )
}

function DoneBtn({ onClick, label = 'See the Concept' }) {
  return (
    <div className="fade-in" style={{ paddingTop: 16, width: '100%' }}>
      <button onClick={onClick} className="press-btn" style={primaryBtn}>{label}</button>
    </div>
  )
}

function CompletionScreen({ title, body, onBack }) {
  return (
    <div className="flow-screen" style={{ background: WARM_BG }}>
      <Header onBack={onBack} />
      <div className="completion-inner" style={{
        flex: 1, padding: '44px 28px 32px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(74,111,165,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: '0.8px' }}>CONCEPT COMPLETE</span>
        </div>

        <h2 className="completion-title" style={{
          fontSize: 28, fontWeight: 300, color: TEXT,
          letterSpacing: '-0.5px', lineHeight: 1.2,
          marginBottom: 20, marginTop: 8,
        }}>
          {title}
        </h2>

        <div style={{ height: 1, background: 'rgba(74,111,165,0.15)', marginBottom: 20 }} />

        <p className="completion-body" style={{ fontSize: 15, lineHeight: 1.78, color: '#444' }}>{body}</p>

        <div style={{ flex: 1, minHeight: 32 }} />

        <button onClick={onBack} className="press-btn" style={{
          ...primaryBtn, marginTop: 32,
          background: 'transparent', color: ACCENT,
          border: `1.5px solid ${ACCENT}`,
        }}>
          ← Back to SignUp™
        </button>
      </div>
    </div>
  )
}

const primaryBtn = {
  width: '100%', padding: '15px 16px',
  background: ACCENT, color: '#fff',
  border: 'none', borderRadius: 13,
  fontSize: 15, fontWeight: 500,
  letterSpacing: '0.01em',
}
const disabledBtn = {
  ...primaryBtn,
  background: '#D1D5DB', color: '#9CA3AF', cursor: 'not-allowed',
}

// ─── HOME ────────────────────────────────────────────────────────────────────

const FLOWS = [
  { id: 'offer',         title: 'Offer',         desc: 'One party puts specific terms on the table for the other to consider.' },
  { id: 'counteroffer',  title: 'Counteroffer',  desc: 'Responding with different terms rejects the original and starts fresh.' },
  { id: 'acceptance',    title: 'Acceptance',    desc: 'Agreeing to the exact terms on the table — the moment a contract forms.' },
  { id: 'consideration', title: 'Consideration', desc: 'Both sides must give something up for the deal to be enforceable.' },
  { id: 'mutualassent',  title: 'Mutual Assent', desc: 'Both parties must be agreeing to the same thing at the same time.' },
]

function Home({ onSelect }) {
  return (
    <div className="flow-screen">
      {/* Header */}
      <div style={{ padding: '60px 24px 36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 1, marginBottom: 10 }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.8px', color: TEXT, margin: 0, lineHeight: 1 }}>SignUp</h1>
          <span style={{ fontSize: 16, fontWeight: 400, color: ACCENT, marginLeft: 1 }}>™</span>
        </div>
        <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.5, margin: 0 }}>
          An interactive guide to common law contract formation
        </p>
        <div style={{ height: 2, width: 32, background: ACCENT, borderRadius: 2, marginTop: 16, opacity: 0.7 }} />
      </div>

      {/* Concept list / grid */}
      <div className="concept-list">
        {FLOWS.map((f, i) => (
          <React.Fragment key={f.id}>
            <div className={i === FLOWS.length - 1 ? 'concept-item-last' : undefined}>
              <button className="row-btn" onClick={() => onSelect(f.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: 'rgba(74,111,165,0.09)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT }}>{i + 1}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 600, color: TEXT, letterSpacing: '-0.1px' }}>{f.title}</div>
                    <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2, lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </div>
                <svg width="6" height="11" viewBox="0 0 6 11" fill="none" style={{ flexShrink: 0, marginLeft: 8 }}>
                  <path d="M1 1L5 5.5L1 10" stroke="#C0C7D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {i < FLOWS.length - 1 && (
              <div className="concept-divider" style={{ height: 1, background: DIVIDER, marginLeft: 64 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 24px 44px', borderTop: `1px solid ${DIVIDER}`, marginTop: 'auto' }}>
        <p style={{ fontSize: 11.5, color: '#B0B8C4', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
          Each concept is its own experience. Complete them in any order.
        </p>
      </div>
    </div>
  )
}

// ─── FLOW 1: OFFER ───────────────────────────────────────────────────────────

const OFFER_TEXT = `The App to You:\n\nWe'd like to propose the following terms:\n\n1. Access to this platform for 12 months\n2. A monthly fee of $9.99, billed on the 1st of each month\n3. You agree not to share your login credentials with anyone\n\nPlease consider these terms.`

function OfferFlow({ onBack }) {
  const [phase, setPhase] = useState('typing')
  const [displayed, setDisplayed] = useState('')
  const timerRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (phase !== 'typing') return
    startRef.current = Date.now()
    const CHAR_MS = 25
    const type = () => {
      const elapsed = Date.now() - startRef.current
      const target = Math.min(Math.floor(elapsed / CHAR_MS), OFFER_TEXT.length)
      setDisplayed(OFFER_TEXT.slice(0, target))
      if (target >= OFFER_TEXT.length) { setTimeout(() => setPhase('ready'), 400); return }
      timerRef.current = setTimeout(type, CHAR_MS)
    }
    timerRef.current = setTimeout(type, CHAR_MS)
    return () => clearTimeout(timerRef.current)
  }, [phase])

  if (phase === 'done') return (
    <CompletionScreen
      title="That was an Offer."
      body="An offer is a specific, definite proposal from one party to another with clear enough terms that a simple 'yes' would create a binding agreement. Until someone responds, the offer stays open — the offeror is committed to those terms if accepted, but the offeree is free to accept, reject, or respond differently. Nothing is agreed to yet."
      onBack={onBack}
    />
  )

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="Offer" />
      <div className="flow-pad" style={{ flex: 1, padding: '28px 20px 0', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: ACCENT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>A</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>The App</span>
          {phase === 'typing' && (
            <div style={{ display: 'flex', gap: 3, marginLeft: 2, alignItems: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 4, height: 4, borderRadius: '50%', background: '#C0C7D0',
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          )}
        </div>
        <div style={{
          background: CARD_BG,
          borderRadius: '4px 16px 16px 16px',
          padding: '20px 22px',
          fontSize: 14, lineHeight: 1.9, color: '#222',
          whiteSpace: 'pre-wrap', minHeight: 180,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
          border: `1px solid rgba(0,0,0,0.05)`,
        }}>
          {displayed}
          {phase === 'typing' && (
            <span style={{
              display: 'inline-block', width: 2, height: '1em',
              background: '#666', verticalAlign: 'text-bottom',
              animation: 'blink 0.9s step-end infinite', marginLeft: 1,
            }}/>
          )}
        </div>
        {phase === 'annotate' && <Annotation text="A specific set of terms has been proposed. Nothing has been agreed to. One side is bound if accepted — the other is free to respond or walk away." />}
      </div>

      <div className="flow-btn-bar" style={{ padding: '16px 20px 40px' }}>
        {phase === 'ready' && (
          <button className="fade-in press-btn" onClick={() => setPhase('annotate')} style={primaryBtn}>Continue</button>
        )}
        {phase === 'annotate' && <DoneBtn onClick={() => setPhase('done')} />}
      </div>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }
      `}</style>
    </div>
  )
}

// ─── FLOW 2: COUNTEROFFER ─────────────────────────────────────────────────────

const ORIG_TERMS = [
  { id: 1, label: 'Term 1', text: 'Access to this platform for 12 months' },
  { id: 2, label: 'Term 2', text: 'A monthly fee of $9.99, billed on the 1st' },
  { id: 3, label: 'Term 3', text: 'You agree not to share your login credentials' },
]

function CounterFlow({ onBack }) {
  const [terms, setTerms] = useState(ORIG_TERMS.map(t => ({ ...t, val: t.text, changed: false, editing: false })))
  const [phase, setPhase] = useState('edit')

  const hasChanged = terms.some(t => t.changed)

  const startEdit = id => setTerms(p => p.map(t => ({ ...t, editing: t.id === id })))
  const onChange  = (id, v) => setTerms(p => p.map(t => t.id === id ? { ...t, val: v } : t))
  const saveEdit  = id => setTerms(p => p.map(t =>
    t.id === id ? { ...t, editing: false, changed: t.val.trim() !== t.text } : t
  ))

  const submit = () => {
    if (!hasChanged) return
    setPhase('strike')
    setTimeout(() => {
      setPhase('flip')
      setTimeout(() => setPhase('annotate'), 1200)
    }, 1200)
  }

  if (phase === 'done') return (
    <CompletionScreen
      title="That was a Counteroffer."
      body="A counteroffer rejects the original offer outright and proposes new terms. Under the mirror image rule, any change — however small — kills the original offer permanently. It cannot be revived. The roles flip: the original offeror becomes the offeree, and the original offeree is now the offeror waiting for a response."
      onBack={onBack}
    />
  )

  const showNew  = phase === 'flip' || phase === 'annotate'
  const striking = phase === 'strike'

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="Counteroffer" />
      <div className="flow-pad" style={{ flex: 1, padding: '24px 20px 0', overflowY: 'auto' }}>

        {phase === 'edit' && (
          <>
            <p style={{ fontSize: 12.5, color: MUTED, marginBottom: 4, fontWeight: 500 }}>The App's proposal</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>Tap the pencil icon to modify at least one term</p>
            {terms.map(t => (
              <div key={t.id} style={{
                background: '#fff', borderRadius: 14, padding: '13px 14px', marginBottom: 10,
                border: `1.5px solid ${t.changed ? ACCENT : DIVIDER}`,
                boxShadow: t.changed ? `0 0 0 3px rgba(74,111,165,0.1)` : '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 10, color: t.changed ? ACCENT : '#9CA3AF',
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 5,
                    transition: 'color 0.2s',
                  }}>{t.label}</div>
                  {t.editing ? (
                    <input autoFocus value={t.val}
                      onChange={e => onChange(t.id, e.target.value)}
                      onBlur={() => saveEdit(t.id)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(t.id)}
                      style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 14, color: TEXT, outline: 'none', padding: 0 }}
                    />
                  ) : (
                    <div style={{ fontSize: 14, color: t.changed ? ACCENT : TEXT }}>{t.val || t.text}</div>
                  )}
                </div>
                <button onClick={() => startEdit(t.id)} style={{
                  background: t.changed ? 'rgba(74,111,165,0.1)' : '#F3F4F6',
                  border: 'none', padding: '6px', borderRadius: 8, flexShrink: 0, marginTop: 1,
                  transition: 'background 0.2s',
                }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke={t.changed ? ACCENT : MUTED}
                      strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </>
        )}

        {(striking || showNew) && (
          <div>
            <p style={{ fontSize: 12.5, color: MUTED, marginBottom: 16, fontWeight: 500 }}>
              {striking ? 'Original offer dissolving…' : 'New terms on the table'}
            </p>
            {ORIG_TERMS.map((orig, i) => {
              const edited = terms.find(t => t.id === orig.id)
              return (
                <div key={orig.id} style={{ marginBottom: 10, minHeight: 64, position: 'relative' }}>
                  <div style={{
                    background: CARD_BG, borderRadius: 14, padding: '13px 14px',
                    fontSize: 14, color: '#bbb', textDecoration: 'line-through',
                    position: showNew ? 'absolute' : 'static', width: '100%',
                    opacity: showNew ? 0 : 1,
                    transition: `opacity 0.35s ease ${i * 0.12}s`,
                    animation: striking ? `strike 0.35s ease ${i * 0.18}s both` : 'none',
                  }}>{orig.text}</div>
                  {showNew && (
                    <div className="fade-in" style={{
                      background: 'rgba(74,111,165,0.06)', borderRadius: 14, padding: '13px 14px',
                      border: `1.5px solid rgba(74,111,165,0.25)`,
                      animationDelay: `${i * 0.1}s`,
                    }}>
                      <div style={{ fontSize: 10, color: ACCENT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 5 }}>{orig.label}</div>
                      <div style={{ fontSize: 14, color: ACCENT_DARK }}>{edited?.val || orig.text}</div>
                    </div>
                  )}
                </div>
              )
            })}

            {showNew && (
              <div className="fade-in" style={{
                marginTop: 28, padding: '20px 16px',
                background: '#F8F9FA', borderRadius: 16, border: `1px solid ${DIVIDER}`,
                animationDelay: '0.28s',
              }}>
                <p style={{ fontSize: 11, color: MUTED, textAlign: 'center', marginBottom: 16, fontWeight: 600, letterSpacing: '0.5px' }}>ROLES REVERSED</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.8px', marginBottom: 10 }}>THE APP</div>
                    <div style={{ fontSize: 12, color: '#C0C7D0', textDecoration: 'line-through', marginBottom: 6 }}>offeror</div>
                    <div style={{ display: 'inline-block', fontSize: 13, color: ACCENT, fontWeight: 700, background: 'rgba(74,111,165,0.1)', borderRadius: 6, padding: '3px 10px' }}>offeree</div>
                  </div>
                  <div style={{ padding: '0 8px', color: '#C0C7D0', fontSize: 20, fontWeight: 300 }}>⇄</div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.8px', marginBottom: 10 }}>YOU</div>
                    <div style={{ fontSize: 12, color: '#C0C7D0', textDecoration: 'line-through', marginBottom: 6 }}>offeree</div>
                    <div style={{ display: 'inline-block', fontSize: 13, color: ACCENT, fontWeight: 700, background: 'rgba(74,111,165,0.1)', borderRadius: 6, padding: '3px 10px' }}>offeror</div>
                  </div>
                </div>
              </div>
            )}

            {phase === 'annotate' && (
              <Annotation text="By changing the terms, you rejected the original offer. It no longer exists. You created a new offer, and the roles reversed." />
            )}
          </div>
        )}
      </div>

      <div className="flow-btn-bar" style={{ padding: '16px 20px 40px' }}>
        {phase === 'edit' && (
          <button onClick={submit} className="press-btn" style={hasChanged ? primaryBtn : disabledBtn} disabled={!hasChanged}>
            Submit Counter
          </button>
        )}
        {phase === 'annotate' && <DoneBtn onClick={() => setPhase('done')} />}
      </div>
      <style>{`@keyframes strike { from { color: #555 } to { color: #bbb; text-decoration: line-through } }`}</style>
    </div>
  )
}

// ─── FLOW 3: ACCEPTANCE ──────────────────────────────────────────────────────

const ACC_TERMS = [
  'Access to this platform for 12 months',
  'A monthly fee of $9.99, billed on the 1st of each month',
  'You agree not to share your login credentials with anyone',
]
const HOLD_MS = 3000

function AcceptanceFlow({ onBack }) {
  const isDesktop = useIsDesktop()
  const [phase, setPhase]       = useState('interact')
  const [progress, setProgress] = useState(0)
  const [holding, setHolding]   = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [stamp, setStamp]       = useState(null)
  const [flash, setFlash]       = useState(false)
  const frameRef = useRef(null)
  const startRef = useRef(null)

  const startHold = e => {
    e.preventDefault()
    if (accepted) return
    setHolding(true)
    startRef.current = performance.now()
    const tick = now => {
      const pct = Math.min((now - startRef.current) / HOLD_MS, 1)
      setProgress(pct)
      if (pct >= 1) {
        setAccepted(true); setHolding(false); setFlash(true)
        setStamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        setTimeout(() => setFlash(false), 250)
        setTimeout(() => setPhase('annotate'), 700)
        return
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
  }

  const endHold = () => {
    if (accepted) return
    setHolding(false)
    cancelAnimationFrame(frameRef.current)
    setProgress(0)
  }

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  if (phase === 'done') return (
    <CompletionScreen
      title="That was Acceptance."
      body="Acceptance must be unconditional and mirror the offer exactly — any change makes it a counteroffer, not acceptance. The moment acceptance is communicated, the contract is formed. Before that moment, nothing is binding. After it, both parties are bound."
      onBack={onBack}
    />
  )

  const R = 30, CIRC = 2 * Math.PI * R
  const bg = flash ? '#DDE8FF' : accepted ? '#F0F4FF' : '#fff'

  // Hold button — shared between mobile (bottom bar) and desktop (right column)
  const HoldButton = () => (
    <>
      {!accepted && phase === 'interact' && (
        <p style={{ fontSize: 12, color: MUTED, textAlign: 'center', margin: '0 0 10px' }}>
          Hold for 3 seconds to accept
        </p>
      )}
      <div
        onPointerDown={startHold} onPointerUp={endHold}
        onPointerLeave={endHold} onPointerCancel={endHold}
        style={{ position: 'relative', width: 92, height: 92, flexShrink: 0 }}
      >
        <svg width="92" height="92" viewBox="0 0 92 92"
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="46" cy="46" r={R} fill="none" stroke="#E5E7EB" strokeWidth="3.5"/>
          <circle cx="46" cy="46" r={R} fill="none"
            stroke={accepted ? '#34C759' : ACCENT} strokeWidth="3.5"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: holding ? 'none' : 'stroke-dashoffset 0.15s ease, stroke 0.4s ease' }}
          />
        </svg>
        <button disabled={accepted} style={{
          position: 'absolute', inset: 0, borderRadius: '50%', border: 'none',
          background: accepted ? 'rgba(52,199,89,0.12)' : holding ? ACCENT : '#F3F4F6',
          color: accepted ? '#34C759' : holding ? '#fff' : '#6B7280',
          fontSize: accepted ? 22 : 12, fontWeight: accepted ? 400 : 600, lineHeight: 1.2,
          cursor: accepted ? 'default' : 'pointer',
          transition: 'background 0.25s, color 0.25s',
          userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        }}>
          {accepted ? '✓' : holding ? '…' : <span style={{ lineHeight: 1.3 }}>Accept<br/>Terms</span>}
        </button>
      </div>
    </>
  )

  if (isDesktop) {
    // Desktop: side-by-side layout
    return (
      <div className="flow-screen" style={{ background: bg, transition: 'background 0.6s ease' }}>
        <Header onBack={onBack} title="Acceptance" />
        {stamp && (
          <div className="fade-in" style={{
            position: 'absolute', top: 60, right: 20,
            background: 'rgba(74,111,165,0.1)', borderRadius: 8, padding: '5px 10px',
            fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: '0.2px',
            border: `1px solid rgba(74,111,165,0.2)`,
          }}>✓ Formed {stamp}</div>
        )}
        <div style={{ flex: 1, display: 'flex', gap: 48, padding: '40px 48px 48px', alignItems: 'flex-start' }}>
          {/* Terms column */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="3.5" width="10" height="7.5" rx="1.5" stroke={accepted ? ACCENT : '#9CA3AF'} strokeWidth="1.2"/>
                <path d="M4 3.5V2.5C4 1.4 4.9 0.5 6 0.5C7.1 0.5 8 1.4 8 2.5V3.5" stroke={accepted ? ACCENT : '#9CA3AF'} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize: 11, fontWeight: 700, color: accepted ? ACCENT : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.7px', margin: 0, transition: 'color 0.5s' }}>
                Terms on the Table — Not Editable
              </p>
            </div>
            {ACC_TERMS.map((t, i) => (
              <div key={i} style={{
                background: accepted ? 'rgba(74,111,165,0.07)' : '#fff',
                borderRadius: 13, padding: '14px 16px', marginBottom: 9,
                fontSize: 14, color: TEXT, lineHeight: 1.5,
                border: `1px solid ${accepted ? 'rgba(74,111,165,0.2)' : DIVIDER}`,
                transition: 'all 0.5s ease', display: 'flex', gap: 11,
              }}>
                <span style={{ color: accepted ? ACCENT : '#C0C7D0', fontWeight: 600, flexShrink: 0, transition: 'color 0.5s' }}>{i + 1}.</span>
                <span>{t}</span>
              </div>
            ))}
            {phase === 'annotate' && (
              <>
                <Annotation text="Acceptance must match the terms exactly. The moment you completed that action, a contract was formed." />
                <div style={{ marginTop: 16 }}>
                  <button onClick={() => setPhase('done')} className="press-btn" style={primaryBtn}>
                    See the Concept
                  </button>
                </div>
              </>
            )}
          </div>
          {/* Action column */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
            <HoldButton />
          </div>
        </div>
      </div>
    )
  }

  // Mobile layout
  return (
    <div className="flow-screen" style={{ background: bg, transition: 'background 0.6s ease' }}>
      <Header onBack={onBack} title="Acceptance" />
      {stamp && (
        <div className="fade-in" style={{
          position: 'absolute', top: 60, right: 16,
          background: 'rgba(74,111,165,0.1)', borderRadius: 8, padding: '5px 10px',
          fontSize: 11, fontWeight: 700, color: ACCENT, border: `1px solid rgba(74,111,165,0.2)`,
        }}>✓ Formed {stamp}</div>
      )}
      <div style={{ flex: 1, padding: '28px 20px 0', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="3.5" width="10" height="7.5" rx="1.5" stroke={accepted ? ACCENT : '#9CA3AF'} strokeWidth="1.2"/>
            <path d="M4 3.5V2.5C4 1.4 4.9 0.5 6 0.5C7.1 0.5 8 1.4 8 2.5V3.5" stroke={accepted ? ACCENT : '#9CA3AF'} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: 11, fontWeight: 700, color: accepted ? ACCENT : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.7px', margin: 0, transition: 'color 0.5s' }}>
            Terms on the Table — Not Editable
          </p>
        </div>
        {ACC_TERMS.map((t, i) => (
          <div key={i} style={{
            background: accepted ? 'rgba(74,111,165,0.07)' : '#fff',
            borderRadius: 13, padding: '14px 16px', marginBottom: 9,
            fontSize: 14, color: TEXT, lineHeight: 1.5,
            border: `1px solid ${accepted ? 'rgba(74,111,165,0.2)' : DIVIDER}`,
            transition: 'all 0.5s ease', display: 'flex', gap: 11,
          }}>
            <span style={{ color: accepted ? ACCENT : '#C0C7D0', fontWeight: 600, flexShrink: 0, transition: 'color 0.5s' }}>{i + 1}.</span>
            <span>{t}</span>
          </div>
        ))}
        {phase === 'annotate' && (
          <Annotation text="Acceptance must match the terms exactly. The moment you completed that action, a contract was formed." />
        )}
      </div>
      <div style={{ padding: '20px 20px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <HoldButton />
        {phase === 'annotate' && (
          <div className="fade-in" style={{ width: '100%' }}>
            <button onClick={() => setPhase('done')} className="press-btn" style={primaryBtn}>See the Concept</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── FLOW 4: CONSIDERATION ────────────────────────────────────────────────────

const POOL_CARDS = ['attention', 'access', 'history', 'convenience', 'presence', 'a name']
const APP_CARDS  = ['service',   'data',  'support', 'reliability',  'features', 'uptime']

function ConsiderationFlow({ onBack }) {
  const [phase, setPhase]    = useState('interact')
  const [pool, setPool]      = useState([...POOL_CARDS])
  const [userSide, setUser]  = useState([])
  const [appSide, setApp]    = useState([])
  const [dragging, setDrag]  = useState(null)
  const [ghostPos, setGhost] = useState({ x: 0, y: 0 })
  const [ghostOff, setOff]   = useState({ x: 0, y: 0 })
  const dropRef = useRef(null)

  const canContinue = userSide.length >= 1 && userSide.length === appSide.length

  const onPointerDown = (e, card) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setDrag(card)
    setOff({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setGhost({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    if (!dragging) return
    const move = e => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      setGhost({ x: cx, y: cy })
    }
    const up = e => {
      const cx = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
      const cy = e.changedTouches ? e.changedTouches[0].clientY : e.clientY
      if (dropRef.current) {
        const r = dropRef.current.getBoundingClientRect()
        if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
          setPool(p => p.filter(c => c !== dragging))
          setUser(p => [...p, dragging])
          setApp(p => p.length < APP_CARDS.length ? [...p, APP_CARDS[p.length]] : p)
        }
      }
      setDrag(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [dragging])

  const removeUserCard = card => {
    setUser(p => p.filter(c => c !== card))
    setPool(p => [...p, card])
    setApp(p => p.slice(0, -1))
  }

  if (phase === 'done') return (
    <CompletionScreen
      title="That was Consideration."
      body="Consideration is the mutual exchange that makes a contract enforceable rather than just a promise. Both sides must give something up — not as a gift, but because the other party is giving something up too. Past actions don't count, and neither does a one-sided benefit. It's the bargain that binds."
      onBack={onBack}
    />
  )

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="Consideration" />
      <div className="flow-pad" style={{ flex: 1, padding: '16px 16px 0', overflowY: 'auto' }}>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div ref={dropRef} style={{
            flex: 1, minHeight: 148,
            background: 'rgba(74,111,165,0.05)', borderRadius: 14,
            border: `1.5px dashed rgba(74,111,165,0.35)`,
            padding: 12, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.8px', marginBottom: 8 }}>YOU GIVE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {userSide.map(c => (
                <div key={c} onClick={() => removeUserCard(c)} className="chip fade-in"
                  style={{ background: ACCENT, color: '#fff', cursor: 'pointer' }}>{c}</div>
              ))}
            </div>
            {userSide.length === 0 && (
              <div style={{ fontSize: 12, color: 'rgba(74,111,165,0.4)', marginTop: 'auto', textAlign: 'center', paddingBottom: 6 }}>drag here ↓</div>
            )}
          </div>

          <div style={{
            flex: 1, minHeight: 148, background: '#F8F9FA', borderRadius: 14,
            border: `1.5px solid ${DIVIDER}`, padding: 12, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.8px', marginBottom: 8 }}>THE APP GIVES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {appSide.map(c => (
                <div key={c} className="chip fade-in" style={{ background: '#4B5563', color: '#fff', cursor: 'default' }}>{c}</div>
              ))}
            </div>
            {appSide.length === 0 && (
              <div style={{ fontSize: 12, color: '#C0C7D0', marginTop: 'auto', textAlign: 'center', paddingBottom: 6 }}>waiting…</div>
            )}
          </div>
        </div>

        <div style={{
          textAlign: 'center', fontSize: 12.5, marginBottom: 12,
          color: canContinue ? '#34C759' : MUTED, fontWeight: canContinue ? 600 : 400,
          transition: 'color 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          {canContinue ? (
            <><svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>Exchange balanced</>
          ) : `You: ${userSide.length} · The App: ${appSide.length}`}
        </div>

        <div style={{ background: '#F8F9FA', borderRadius: 14, padding: '14px 14px', marginBottom: 4, border: `1px solid ${DIVIDER}` }}>
          <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.7px', textAlign: 'center', marginBottom: 12 }}>
            DRAG A CARD TO YOUR SIDE
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {pool.map(card => (
              <div key={card} onPointerDown={e => onPointerDown(e, card)} className="chip"
                style={{
                  background: '#fff', border: `1.5px solid ${DIVIDER}`,
                  color: TEXT, cursor: 'grab', touchAction: 'none',
                  opacity: dragging === card ? 0.3 : 1, transition: 'opacity 0.12s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                }}>{card}</div>
            ))}
            {pool.length === 0 && <div style={{ fontSize: 12, color: '#9CA3AF' }}>All cards placed</div>}
          </div>
        </div>

        {phase === 'annotate' && (
          <Annotation text="Each side gave something up because the other did. This mutual exchange is what makes the agreement enforceable." />
        )}
      </div>

      {dragging && (
        <div style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 999,
          left: ghostPos.x - ghostOff.x, top: ghostPos.y - ghostOff.y,
          background: ACCENT, color: '#fff',
          borderRadius: 20, padding: '7px 14px', fontSize: 13, fontWeight: 500,
          boxShadow: '0 8px 24px rgba(74,111,165,0.4)',
          transform: 'scale(1.08) rotate(-2deg)', userSelect: 'none',
        }}>{dragging}</div>
      )}

      <div className="flow-btn-bar" style={{ padding: '14px 20px 40px' }}>
        {phase === 'interact' && (
          <button onClick={() => setPhase('annotate')} disabled={!canContinue} className="press-btn"
            style={canContinue ? primaryBtn : disabledBtn}>Continue</button>
        )}
        {phase === 'annotate' && <DoneBtn onClick={() => setPhase('done')} />}
      </div>
    </div>
  )
}

// ─── FLOW 5: MUTUAL ASSENT ────────────────────────────────────────────────────

const CLAUSES = [
  { id: 'c1', app: 'This agreement grants access to the platform for one calendar year.',    you: 'This agreement grants access to the platform for one calendar year.',    diff: false },
  { id: 'c2', app: 'Payment of $9.99 is due on the first day of each month.',               you: 'Payment of $9.99 is due at the end of each month.',                      diff: true  },
  { id: 'c3', app: 'Accounts may not be transferred to another individual.',                you: 'Accounts may not be transferred to another individual.',                diff: false },
  { id: 'c4', app: 'The App may update these terms with 30 days\u2019 written notice.',    you: 'The App may update these terms at any time without notice.',              diff: true  },
]

function MutualAssentFlow({ onBack }) {
  const [phase, setPhase]       = useState('interact')
  const [slider, setSlider]     = useState(0)
  const [resolved, setResolved] = useState(new Set())
  const [merged, setMerged]     = useState(false)

  const diffIds      = CLAUSES.filter(c => c.diff).map(c => c.id)
  const allResolved  = diffIds.every(id => resolved.has(id))
  const showHighlight = slider > 0.15

  useEffect(() => {
    if (allResolved && !merged) {
      const t = setTimeout(() => { setMerged(true); setPhase('annotate') }, 300)
      return () => clearTimeout(t)
    }
  }, [allResolved, merged])

  const tapDiff = id => { if (showHighlight) setResolved(p => new Set([...p, id])) }

  if (phase === 'done') return (
    <CompletionScreen
      title="That was Mutual Assent."
      body="Mutual assent — the 'meeting of minds' — means both parties must be agreeing to the same terms at the same time. Courts look at outward conduct and words, not internal intentions, to determine whether true agreement exists. Without it, there is no contract regardless of what either party believed they were agreeing to."
      onBack={onBack}
    />
  )

  if (merged) return (
    <div className="flow-screen" style={{ background: '#FAFBFF' }}>
      <Header onBack={onBack} title="Mutual Assent" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 28px' }}>
        <div className="fade-in" style={{
          background: 'rgba(74,111,165,0.07)', borderRadius: 18, padding: '28px 28px',
          border: `1.5px solid rgba(74,111,165,0.25)`,
          boxShadow: '0 4px 24px rgba(74,111,165,0.1)', width: '100%', maxWidth: 520,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '1px', marginBottom: 18, textAlign: 'center' }}>
            AGREED TERMS — ONE VERSION
          </div>
          {CLAUSES.map(c => (
            <div key={c.id} style={{ fontSize: 14, color: TEXT, lineHeight: 1.75, marginBottom: 14 }}>{c.app}</div>
          ))}
        </div>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <Annotation text="Both sides must agree to the same thing. Misalignment means no contract. Alignment creates agreement." />
          <DoneBtn onClick={() => setPhase('done')} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="Mutual Assent" />
      <div className="flow-pad" style={{ flex: 1, padding: '14px 14px 0', overflowY: 'auto' }}>
        <p style={{ fontSize: 12, color: MUTED, textAlign: 'center', marginBottom: 10, lineHeight: 1.5 }}>
          {!showHighlight
            ? 'Drag the slider to compare both versions'
            : `Tap highlighted clauses to resolve them (${resolved.size}/${diffIds.length} resolved)`}
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          {/* App column */}
          <div style={{
            flex: 1, background: CARD_BG, borderRadius: 14, padding: '14px 13px',
            border: `1px solid ${DIVIDER}`,
            opacity: 0.4 + 0.6 * (1 - slider), transition: 'opacity 0.05s',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.8px', marginBottom: 12 }}>THE APP</div>
            {CLAUSES.map(c => {
              const isActive = c.diff && !resolved.has(c.id) && showHighlight
              return (
                <div key={c.id} onClick={() => isActive && tapDiff(c.id)} style={{
                  fontSize: 12, lineHeight: 1.7, color: TEXT, marginBottom: 10,
                  padding: '7px 8px', borderRadius: 8,
                  background: isActive ? 'rgba(239,68,68,0.08)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(239,68,68,0.25)' : 'transparent'}`,
                  cursor: isActive ? 'pointer' : 'default',
                  transition: 'background 0.2s, border 0.2s',
                }}>{c.app}</div>
              )
            })}
          </div>

          {/* You column */}
          <div style={{
            flex: 1, background: 'rgba(74,111,165,0.05)', borderRadius: 14, padding: '14px 13px',
            border: `1px solid rgba(74,111,165,0.15)`,
            opacity: 0.3 + 0.7 * slider, transition: 'opacity 0.05s',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.8px', marginBottom: 12 }}>YOU</div>
            {CLAUSES.map(c => {
              const isActive = c.diff && !resolved.has(c.id) && showHighlight
              const text = resolved.has(c.id) ? c.app : c.you
              return (
                <div key={c.id} onClick={() => isActive && tapDiff(c.id)} style={{
                  fontSize: 12, lineHeight: 1.7, color: TEXT, marginBottom: 10,
                  padding: '7px 8px', borderRadius: 8,
                  background: isActive ? 'rgba(239,68,68,0.08)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(239,68,68,0.25)' : 'transparent'}`,
                  cursor: isActive ? 'pointer' : 'default',
                  transition: 'background 0.2s, border 0.2s',
                }}>{text}</div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flow-btn-bar" style={{ padding: '14px 20px 40px', flexShrink: 0 }}>
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>Separate</span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>Overlaid</span>
        </div>
        <input type="range" min="0" max="1" step="0.005" value={slider}
          onChange={e => setSlider(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
        {phase === 'annotate' && <DoneBtn onClick={() => setPhase('done')} />}
      </div>
    </div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = GLOBAL_CSS
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])

  const home = () => setActive(null)

  const screen = () => {
    switch (active) {
      case 'offer':         return <OfferFlow          key={active} onBack={home} />
      case 'counteroffer':  return <CounterFlow         key={active} onBack={home} />
      case 'acceptance':    return <AcceptanceFlow      key={active} onBack={home} />
      case 'consideration': return <ConsiderationFlow   key={active} onBack={home} />
      case 'mutualassent':  return <MutualAssentFlow    key={active} onBack={home} />
      default:              return <Home onSelect={setActive} />
    }
  }

  return (
    <div className="page-bg">
      <div className="app-shell">{screen()}</div>
    </div>
  )
}
