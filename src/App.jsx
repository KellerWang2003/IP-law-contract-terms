import React, { useState, useEffect } from 'react'

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const ACCENT      = '#3B82F6' // Electric Blue
const ACCENT_DARK = '#2563EB'
const TEXT        = '#0F172A' // Slate 900
const MUTED       = '#64748B' // Slate 500
const DIVIDER     = '#E2E8F0'
const CARD_BG     = '#FFFFFF'
const WARM_BG     = '#F8FAFC' // Slate 50
const SUCCESS     = '#10B981' // Emerald 500
const ERROR       = '#EF4444' // Red 500

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; background: #E2E8F0; }

  .page-bg {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: #fff;
  }
  @media (min-width: 640px) {
    .page-bg {
      background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
      padding: 52px 24px 80px;
    }
  }

  .app-shell {
    width: 100%; max-width: 720px; min-height: 100vh;
    background: #fff; display: flex; flex-direction: column;
    position: relative; overflow-x: hidden;
  }
  @media (min-width: 640px) {
    .app-shell {
      min-height: 0; height: 85vh; border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 25px -5px rgba(0,0,0,0.1);
      overflow: hidden;
    }
  }

  .app-shell::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%);
    z-index: 10;
  }

  .fade-in { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .flow-screen {
    flex: 1; display: flex; flex-direction: column; height: 100%;
    animation: fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both;
  }

  .concept-list { flex: 1; overflow-y: auto; padding-bottom: 32px; }
  @media (min-width: 640px) {
    .concept-list {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
      padding: 0 32px 36px; align-content: start;
    }
    .concept-divider { display: none !important; }
  }

  .row-btn {
    width: 100%; background: none; border: none; cursor: pointer;
    padding: 20px 24px; display: flex; align-items: flex-start; justify-content: space-between;
    text-align: left; transition: background 0.2s ease, transform 0.1s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .row-btn:hover  { background: #F8FAFC; border-color: #CBD5E1; }
  .row-btn:active { transform: scale(0.98); }
  @media (min-width: 640px) {
    .row-btn {
      border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; background: #fff;
    }
    .row-btn:hover {
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); background: #fff;
    }
  }

  .flow-pad { padding: 24px 20px 0; overflow-y: auto; flex: 1; display: flex; flex-direction: column; }
  @media (min-width: 640px) { .flow-pad { padding-left: 40px; padding-right: 40px; padding-top: 32px; } }

  .flow-btn-bar { padding: 20px 20px 32px; flex-shrink: 0; background: #fff; }
  @media (min-width: 640px) { .flow-btn-bar { padding: 24px 40px 40px; } }

  .press-btn { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
  .press-btn:active { transform: scale(0.96); }
  .press-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
  button { font-family: inherit; }

  .interactive-zone {
    background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px;
    padding: 24px; display: flex; flex-direction: column; align-items: center;
    position: relative; overflow: hidden; min-height: 240px; justify-content: center;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  }
  
  .card {
    background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
    padding: 20px; width: 100%; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .result-banner {
    padding: 16px; border-radius: 12px; font-weight: 600; font-size: 15px;
    display: flex; align-items: center; gap: 12px; line-height: 1.5;
    animation: fadeUp 0.3s ease; width: 100%;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }

  .toggle-group {
    display: flex; background: #E2E8F0; border-radius: 12px; padding: 4px; width: 100%;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  }
  .toggle-btn {
    flex: 1; border: none; background: transparent; padding: 12px 0;
    font-size: 13px; font-weight: 700; color: #64748B; border-radius: 8px;
    cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .toggle-btn:hover { color: #334155; }
  .toggle-btn.active {
    background: #fff; color: #0F172A; box-shadow: 0 2px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05);
  }
`

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function BackBtn({ onBack }) {
  return (
    <button onClick={onBack} style={{
      background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6,
      color: MUTED, fontSize: 13, fontWeight: 600, padding: '16px 20px', letterSpacing: '0.04em', cursor: 'pointer'
    }}>
      <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
        <path d="M5 1L1 5L5 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      RETURN
    </button>
  )
}

function Header({ onBack, title }) {
  return (
    <div style={{
      borderBottom: `1px solid ${DIVIDER}`, display: 'flex', alignItems: 'center',
      minHeight: 56, flexShrink: 0, position: 'relative', background: '#fff', zIndex: 20
    }}>
      <BackBtn onBack={onBack} />
      {title && (
        <span style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontSize: 14, fontWeight: 700, color: TEXT, letterSpacing: '0.04em',
          pointerEvents: 'none', whiteSpace: 'nowrap', textTransform: 'uppercase'
        }}>{title}</span>
      )}
    </div>
  )
}

function ResultBanner({ type, title, text }) {
  const isErr = type === 'error'
  return (
    <div className="result-banner" style={{
      background: isErr ? '#FEF2F2' : '#EFF6FF',
      border: `1px solid ${isErr ? '#FCA5A5' : '#BFDBFE'}`,
      color: isErr ? '#991B1B' : '#1E3A8A'
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: isErr ? '#FEE2E2' : '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {isErr ? '✕' : '✓'}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
        <div style={{ fontWeight: 500, marginTop: 2 }}>{text}</div>
      </div>
    </div>
  )
}

function ContinueBtn({ onClick }) {
  return (
    <div className="fade-in" style={{ paddingTop: 16, width: '100%' }}>
      <button onClick={onClick} className="press-btn" style={{
        width: '100%', padding: '16px 24px', 
        background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)', 
        color: '#fff', border: '1px solid #000', borderRadius: 14, fontSize: 15, fontWeight: 600,
        letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}>Back to Menu</button>
    </div>
  )
}

// ─── HOME ────────────────────────────────────────────────────────────────────

const FLOWS = [
  { id: 'offer',         title: 'Offer',         desc: 'A clear, definite proposal to enter into an agreement.' },
  { id: 'acceptance',    title: 'Acceptance',    desc: 'Unambiguous agreement to the exact terms of the offer.' },
  { id: 'intention',     title: 'Intention',     desc: 'The "meeting of the minds" to be legally bound.' },
  { id: 'consideration', title: 'Consideration', desc: 'A bargained-for exchange of mutual value.' },
  { id: 'capacity',      title: 'Capacity',      desc: 'The legal ability of parties to enter a contract.' },
  { id: 'legality',      title: 'Legality',      desc: 'The purpose of the agreement must be lawful.' },
]

function Home({ onSelect }) {
  return (
    <div className="flow-screen">
      <div style={{ padding: '64px 32px 40px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: TEXT, margin: '0 0 12px', lineHeight: 1 }}>
          Syntax<span style={{ color: ACCENT }}>Law</span>
        </h1>
        <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.5, margin: 0, maxWidth: 320 }}>
          Clear, direct explanations of the 6 core requirements of common law contract formation.
        </p>
      </div>
      <div className="concept-list">
        {FLOWS.map((f, i) => (
          <React.Fragment key={f.id}>
            <button className="row-btn" onClick={() => onSelect(f.id)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: '#EFF6FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontSize: 13, fontWeight: 800, color: ACCENT_DARK
                }}>
                  0{i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            </button>
            {i < FLOWS.length - 1 && <div className="concept-divider" style={{ height: 1, background: DIVIDER, margin: '0 32px' }} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ─── FLOW 1: OFFER ───────────────────────────────────────────────────────────

function OfferFlow({ onBack }) {
  const [isDefinite, setDefinite] = useState(false)

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="1. Offer" />
      <div className="flow-pad">
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
          An <strong>Offer</strong> must be a clear, definite proposal that creates the power of acceptance. You cannot "agree to agree" later.
        </p>

        <div className="interactive-zone" style={{ gap: 24, padding: '32px 24px' }}>
          <div className="toggle-group">
            <button className={`toggle-btn ${!isDefinite ? 'active' : ''}`} onClick={() => setDefinite(false)}>Vague Proposal</button>
            <button className={`toggle-btn ${isDefinite ? 'active' : ''}`} onClick={() => setDefinite(true)}>Definite Offer</button>
          </div>

          <div className="card" style={{ borderLeft: `4px solid ${isDefinite ? ACCENT : '#94A3B8'}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 8, letterSpacing: '1px' }}>STATEMENT</div>
            <div style={{ fontSize: 18, color: TEXT, lineHeight: 1.4, fontWeight: 500 }}>
              {isDefinite 
                ? `"I will pay you exactly $1,000 to draw a character for me this Friday."`
                : `"Let's figure out a price later to draw a character for me."`
              }
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 24, minHeight: 80 }}>
          {isDefinite ? (
            <ResultBanner type="success" title="Valid Offer" text="The terms are specific. The other party now has the power to accept." />
          ) : (
            <ResultBanner type="error" title="Not an offer" text="Lacks specific terms. This is merely an invitation to negotiate." />
          )}
        </div>
      </div>
      <div className="flow-btn-bar"><ContinueBtn onClick={onBack} /></div>
    </div>
  )
}

// ─── FLOW 2: ACCEPTANCE (Mirror Image Rule) ──────────────────────────────────

function AcceptanceFlow({ onBack }) {
  const [response, setResponse] = useState(null) // 'exact', 'altered'

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="2. Acceptance" />
      <div className="flow-pad">
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
          <strong>Acceptance</strong> must mirror the exact terms of the offer. This is called the <em>Mirror Image Rule</em>. Changing any term rejects the original offer entirely.
        </p>

        <div className="interactive-zone" style={{ gap: 20, padding: '32px 24px' }}>
          
          <div className="card" style={{ position: 'relative' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 8, letterSpacing: '1px' }}>THE OFFER</div>
            <div style={{ fontSize: 16, color: response === 'altered' ? MUTED : TEXT, textDecoration: response === 'altered' ? 'line-through' : 'none' }}>
              "I offer to sell you my car for <strong>$5,000</strong>."
            </div>
            {response === 'altered' && <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 11, fontWeight: 800, color: ERROR, border: `1px solid ${ERROR}`, padding: '2px 6px', borderRadius: 4 }}>DESTROYED</div>}
          </div>

          <div style={{ width: '100%', display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={() => setResponse('exact')} className="press-btn" style={{
              flex: 1, padding: '16px 12px', background: response === 'exact' ? SUCCESS : '#fff', 
              color: response === 'exact' ? '#fff' : TEXT, border: `1px solid ${response === 'exact' ? SUCCESS : DIVIDER}`, borderRadius: 12, fontWeight: 600, fontSize: 14,
              boxShadow: response === 'exact' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              "I accept for $5,000."
            </button>
            <button onClick={() => setResponse('altered')} className="press-btn" style={{
              flex: 1, padding: '16px 12px', background: response === 'altered' ? ERROR : '#fff', 
              color: response === 'altered' ? '#fff' : TEXT, border: `1px solid ${response === 'altered' ? ERROR : DIVIDER}`, borderRadius: 12, fontWeight: 600, fontSize: 14,
              boxShadow: response === 'altered' ? '0 4px 12px rgba(239, 68, 68, 0.25)' : '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              "I accept, but for $4,500."
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 24, minHeight: 80 }}>
          {response === 'exact' && (
            <ResultBanner type="success" title="Contract Formed" text="You accepted in an unambiguous manner mirroring the offer exactly." />
          )}
          {response === 'altered' && (
            <ResultBanner type="error" title="Counteroffer" text="You altered a term. The original offer is destroyed, and you have made a counteroffer." />
          )}
        </div>
      </div>
      <div className="flow-btn-bar"><ContinueBtn onClick={onBack} /></div>
    </div>
  )
}

// ─── FLOW 3: INTENTION (Meeting of the Minds) ────────────────────────────────

function IntentionFlow({ onBack }) {
  const [partyA, setPartyA] = useState('joke') // 'joke', 'serious'
  const partyB = 'serious' // Fixed to serious

  const isMeeting = partyA === 'serious' && partyB === 'serious'

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="3. Intention" />
      <div className="flow-pad">
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
          <strong>Intention</strong> requires a "meeting of the minds". Both parties must objectively intend the agreement to be legally binding.
        </p>

        <div className="interactive-zone" style={{ gap: 20, padding: '24px' }}>
          
          <div style={{ display: 'flex', width: '100%', gap: 16 }}>
            {/* Party A */}
            <div className="card" style={{ flex: 1, background: partyA === 'serious' ? '#EFF6FF' : '#F1F5F9', border: `1px solid ${partyA === 'serious' ? '#BFDBFE' : DIVIDER}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, marginBottom: 12, letterSpacing: '1px' }}>PARTY A (YOU)</div>
              <div className="toggle-group" style={{ flexDirection: 'column', background: 'transparent', gap: 8, padding: 0 }}>
                <button className={`toggle-btn ${partyA === 'joke' ? 'active' : ''}`} style={{ border: '1px solid #CBD5E1' }} onClick={() => setPartyA('joke')}>"I'm just joking around."</button>
                <button className={`toggle-btn ${partyA === 'serious' ? 'active' : ''}`} style={{ border: '1px solid #CBD5E1' }} onClick={() => setPartyA('serious')}>"I am serious."</button>
              </div>
            </div>

            {/* Party B */}
            <div className="card" style={{ flex: 1, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, marginBottom: 12, letterSpacing: '1px' }}>PARTY B</div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 600, color: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '1px solid #BFDBFE' }}>
                "I am serious."
              </div>
            </div>
          </div>

        </div>

        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 24, minHeight: 80 }}>
          {isMeeting ? (
            <ResultBanner type="success" title="Meeting of the Minds" text="Both parties intend to be legally bound. Mutual assent exists." />
          ) : (
            <ResultBanner type="error" title="No Mutual Assent" text="Without objective mutual intention, the contract is not valid." />
          )}
        </div>
      </div>
      <div className="flow-btn-bar"><ContinueBtn onClick={onBack} /></div>
    </div>
  )
}

// ─── FLOW 4: CONSIDERATION (Bargained-for Exchange) ────────────────────────

function ConsiderationFlow({ onBack }) {
  const [partyB, setPartyB] = useState('nothing') // 'nothing', 'nominal'

  const isValid = partyB === 'nominal'

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="4. Consideration" />
      <div className="flow-pad">
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
          <strong>Consideration</strong> means each party must give or promise something of legal value. A one-sided promise is a gift. Even nominal value (e.g. $1) satisfies this.
        </p>

        <div className="interactive-zone" style={{ gap: 20, padding: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 12 }}>
            <div className="card" style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, marginBottom: 8 }}>PARTY A GIVES</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: TEXT }}>"Web Design Services"</div>
            </div>

            <div style={{ fontSize: 24, color: '#CBD5E1' }}>⇄</div>

            <div className="card" style={{ flex: 1, textAlign: 'center', padding: '12px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, marginBottom: 8 }}>PARTY B GIVES</div>
              <div className="toggle-group" style={{ flexDirection: 'column', padding: 0, background: 'transparent', gap: 4 }}>
                <button className={`toggle-btn ${partyB === 'nothing' ? 'active' : ''}`} style={{ border: '1px solid #CBD5E1', padding: '8px' }} onClick={() => setPartyB('nothing')}>Nothing (Gift)</button>
                <button className={`toggle-btn ${partyB === 'nominal' ? 'active' : ''}`} style={{ border: '1px solid #CBD5E1', padding: '8px' }} onClick={() => setPartyB('nominal')}>$1 (Value)</button>
              </div>
            </div>
          </div>

        </div>

        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 24, minHeight: 80 }}>
          {isValid ? (
            <ResultBanner type="success" title="Valid Consideration" text="A bargained-for exchange of value exists. The contract is enforceable." />
          ) : (
            <ResultBanner type="error" title="Unenforceable Gift" text="One-sided promises lack consideration and cannot be enforced in law." />
          )}
        </div>
      </div>
      <div className="flow-btn-bar"><ContinueBtn onClick={onBack} /></div>
    </div>
  )
}

// ─── FLOW 5: CAPACITY ────────────────────────────────────────────────────────

function CapacityFlow({ onBack }) {
  const [state, setState] = useState('minor') // 'minor', 'adult'

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="5. Capacity" />
      <div className="flow-pad">
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
          Parties must have legal <strong>Capacity</strong> to contract. Minors, intoxicated persons, or those of unsound mind lack capacity, making the contract voidable.
        </p>

        <div className="interactive-zone" style={{ gap: 20, padding: '32px 24px' }}>
          
          <div className="toggle-group">
            <button className={`toggle-btn ${state === 'minor' ? 'active' : ''}`} onClick={() => setState('minor')}>Minor (Age 16)</button>
            <button className={`toggle-btn ${state === 'adult' ? 'active' : ''}`} onClick={() => setState('adult')}>Adult (Age 25)</button>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F1F5F9', border: `2px solid ${state === 'adult' ? SUCCESS : ERROR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              👤
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: MUTED, letterSpacing: '1px' }}>CONTRACTING PARTY</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: TEXT, marginTop: 4 }}>
                {state === 'minor' ? 'John Doe, 16 years old' : 'John Doe, 25 years old'}
              </div>
            </div>
          </div>

        </div>

        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 24, minHeight: 80 }}>
          {state === 'adult' ? (
            <ResultBanner type="success" title="Capacity Met" text="The party is of sound mind and legal age. The contract is firmly binding." />
          ) : (
            <ResultBanner type="error" title="Voidable Contract" text="A minor lacks legal capacity. They may void the contract, but the other party may not." />
          )}
        </div>
      </div>
      <div className="flow-btn-bar"><ContinueBtn onClick={onBack} /></div>
    </div>
  )
}

// ─── FLOW 6: LEGALITY ────────────────────────────────────────────────────────

function LegalityFlow({ onBack }) {
  const [purpose, setPurpose] = useState('illegal') // 'illegal', 'legal'

  return (
    <div className="flow-screen">
      <Header onBack={onBack} title="6. Legality" />
      <div className="flow-pad">
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
          Courts will only enforce agreements that have a <strong>Lawful Purpose</strong>. Contracts to commit a crime or violate public policy are completely void from the start.
        </p>

        <div className="interactive-zone" style={{ gap: 20, padding: '32px 24px' }}>
          
          <div className="toggle-group">
            <button className={`toggle-btn ${purpose === 'illegal' ? 'active' : ''}`} onClick={() => setPurpose('illegal')}>Illicit Bounty</button>
            <button className={`toggle-btn ${purpose === 'legal' ? 'active' : ''}`} onClick={() => setPurpose('legal')}>Service Agreement</button>
          </div>

          <div className="card" style={{ borderLeft: `4px solid ${purpose === 'legal' ? SUCCESS : ERROR}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 8, letterSpacing: '1px' }}>CONTRACT CLAUSE</div>
            <div style={{ fontSize: 18, color: TEXT, lineHeight: 1.4, fontWeight: 500 }}>
              {purpose === 'legal' 
                ? `"Party A agrees to construct a website for Party B."`
                : `"Party A agrees to injure Party B's business rival."`
              }
            </div>
          </div>

        </div>

        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 24, minHeight: 80 }}>
          {purpose === 'legal' ? (
            <ResultBanner type="success" title="Lawful Purpose" text="The agreement is for a legal activity and is enforceable by law." />
          ) : (
            <ResultBanner type="error" title="Void Ab Initio" text="Contracts for illegal acts possess no legal weight. They are void from the start." />
          )}
        </div>
      </div>
      <div className="flow-btn-bar"><ContinueBtn onClick={onBack} /></div>
    </div>
  )
}


// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!document.getElementById('syntaxlaw-css')) {
      const el = document.createElement('style')
      el.id = 'syntaxlaw-css'
      el.textContent = GLOBAL_CSS
      document.head.appendChild(el)
    }
  }, [])

  const screen = () => {
    switch (active) {
      case 'offer':         return <OfferFlow key={active} onBack={() => setActive(null)} />
      case 'acceptance':    return <AcceptanceFlow key={active} onBack={() => setActive(null)} />
      case 'intention':     return <IntentionFlow key={active} onBack={() => setActive(null)} />
      case 'consideration': return <ConsiderationFlow key={active} onBack={() => setActive(null)} />
      case 'capacity':      return <CapacityFlow key={active} onBack={() => setActive(null)} />
      case 'legality':      return <LegalityFlow key={active} onBack={() => setActive(null)} />
      default:              return <Home onSelect={setActive} />
    }
  }

  return (
    <div className="page-bg">
      <div className="app-shell">{screen()}</div>
    </div>
  )
}
