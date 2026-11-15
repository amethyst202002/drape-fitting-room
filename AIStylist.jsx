// AIStylist.jsx — Screen 3: AI Stylist Chat Drawer
// No import/export — global Babel CDN scope

const { useState: useStylistState, useEffect: useStylistEffect, useRef: useStylistRef } = React;

function AIStylist({ isOpen, onClose, rack, activeOutfit, aiResponses, onAddToOutfit }) {
  const [messages, setMessages]           = useStylistState([]);
  const [inputText, setInputText]         = useStylistState('');
  const [isModestMode, setIsModestMode]   = useStylistState(true);
  const [personalityMode, setPersonality] = useStylistState('hype');
  const [isTyping, setIsTyping]           = useStylistState(false);
  const messagesEndRef                    = useStylistRef(null);

  // Initial greeting
  useStylistEffect(() => {
    const rackLen = rack ? rack.length : 0;
    setMessages([{
      id: 1,
      role: 'ai',
      text: "Salaam! I'm your AI stylist ✦ I've analyzed your rack of " + rackLen + " pieces. What vibe are we going for today? 🌿",
      recommendations: [],
      modesty_params: null,
      timestamp: new Date(),
    }]);
  }, []);

  // Auto-scroll
  useStylistEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior:'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (textOverride) => {
    const text = typeof textOverride === 'string' ? textOverride : inputText;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role:'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let key = 'default';
      if (lower.includes('blazer') || lower.includes('match')) key = 'blazer';
      else if (lower.includes('eid') || lower.includes('celebrat') || lower.includes('occasion')) key = 'eid';
      else if (lower.includes('neutral') || lower.includes('basic') || lower.includes('neutral')) key = 'neutral';
      else if (lower.includes('modest') || lower.includes('coverage') || lower.includes('hijab')) key = 'modest';

      const resp = (aiResponses && aiResponses[key]) || (aiResponses && aiResponses['default']) || {
        text: 'Let me find something that works for you!',
        recommendations: [],
        modesty_params: 'General modesty filters active',
        hype: 'So many amazing options!',
        honest: 'Here is a balanced suggestion.',
      };

      const msgText = personalityMode === 'hype' ? resp.hype : resp.honest;
      const recItems = (rack || []).filter(i => (resp.recommendations || []).includes(i.id));

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: resp.text + ' ' + msgText,
        recommendations: recItems,
        modesty_params: isModestMode ? resp.modesty_params : null,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 1800);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  };

  const PROMPTS = [
    'What matches this blazer?',
    'Style this for Eid',
    'Modest & trendy?',
    'Build a neutral look',
  ];

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:199, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition:'opacity 0.4s' }} />

      {/* Sliding Panel */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, maxWidth:'430px', margin:'0 auto', height:'85vh', background:'var(--color-surface)', borderRadius:'20px 20px 0 0', boxShadow:'var(--shadow-lg)', zIndex:200, display:'flex', flexDirection:'column', transform: isOpen ? 'translateY(0)' : 'translateY(100%)', transition:'transform 0.4s cubic-bezier(0.4,0,0.2,1)', fontFamily:'var(--font-body)' }}>

        {/* Handle + Header */}
        <div style={{ padding:'12px 16px 0', flexShrink:0 }}>
          <div style={{ width:'40px', height:'4px', background:'var(--color-border)', borderRadius:'2px', margin:'0 auto 14px' }} />
          <div style={{ position:'relative' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontStyle:'italic', color:'var(--color-text)' }}>✦ AI Stylist</div>
            <div style={{ fontSize:'0.75rem', color:'var(--color-text-muted)', marginTop:'2px' }}>Powered by contextual fashion AI</div>
            <button onClick={onClose} style={{ position:'absolute', top:0, right:0, background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', color:'var(--color-text-muted)' }}>×</button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--color-border)', flexShrink:0 }}>
          {/* Row 1: Modest Mode */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
            <span style={{ fontWeight:500, fontSize:'0.85rem' }}>Modest Mode</span>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              {isModestMode && (
                <span style={{ background:'var(--color-sage-light)', color:'var(--color-sage-dark)', borderRadius:'var(--radius-pill)', padding:'3px 10px', fontSize:'0.72rem', fontWeight:500 }}>
                  🌙 Modest filters active
                </span>
              )}
              <div onClick={() => setIsModestMode(m => !m)}
                style={{ width:'48px', height:'26px', borderRadius:'var(--radius-pill)', background: isModestMode ? 'var(--color-sage)' : '#D0C8C0', cursor:'pointer', position:'relative', transition:'var(--transition)', flexShrink:0 }}>
                <div style={{ position:'absolute', top:'3px', width:'20px', height:'20px', borderRadius:'50%', background:'white', boxShadow:'0 1px 3px rgba(0,0,0,0.2)', transition:'left 0.2s ease', left: isModestMode ? '25px' : '3px' }} />
              </div>
            </div>
          </div>
          {/* Row 2: Personality Slider */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'0.82rem', fontWeight:500, flexShrink:0, color:'var(--color-text)' }}>Style Voice:</span>
            <span style={{ fontSize:'0.75rem', color: personalityMode==='hype' ? 'var(--color-sage-dark)' : 'var(--color-text-muted)', fontWeight: personalityMode==='hype'?600:400 }}>🌸 Hype</span>
            <input type="range" min={0} max={1} step={1} value={personalityMode==='hype' ? 0 : 1}
              onChange={e => setPersonality(e.target.value === '0' ? 'hype' : 'honest')}
              style={{ flex:1, accentColor:'var(--color-sage)' }} />
            <span style={{ fontSize:'0.75rem', color: personalityMode==='honest' ? 'var(--color-sage-dark)' : 'var(--color-text-muted)', fontWeight: personalityMode==='honest'?600:400 }}>✂️ Honest</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'12px 16px', display:'flex', flexDirection:'column', gap:'10px' }}>
          {messages.map(msg => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} style={{ alignSelf:'flex-end', maxWidth:'75%' }}>
                  <div style={{ background:'var(--color-sage)', color:'white', borderRadius:'18px 18px 4px 18px', padding:'10px 16px', fontSize:'0.9rem', lineHeight:1.4 }}>{msg.text}</div>
                  <div style={{ fontSize:'0.65rem', color:'var(--color-text-muted)', textAlign:'right', marginTop:'3px' }}>{formatTime(msg.timestamp)}</div>
                </div>
              );
            }
            return (
              <div key={msg.id} style={{ alignSelf:'flex-start', width:'92%' }}>
                <div style={{ background:'var(--color-surface)', borderRadius:'4px 18px 18px 18px', padding:'12px 16px', boxShadow:'var(--shadow-sm)', borderLeft:'3px solid var(--color-sage)' }}>
                  <div style={{ fontSize:'0.88rem', lineHeight:1.6, color:'var(--color-text)' }}>{msg.text}</div>

                  {/* Recommendation Cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div style={{ display:'flex', gap:'10px', overflowX:'auto', marginTop:'12px', paddingBottom:'4px', scrollbarWidth:'none' }}>
                      {msg.recommendations.map(item => (
                        <div key={item.id} style={{ width:'110px', flexShrink:0, background:'var(--color-surface-2)', borderRadius:'var(--radius-md)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                          <img src={item.imageUrl} alt={item.name} style={{ width:'110px', height:'80px', objectFit:'cover', display:'block' }} />
                          <div style={{ padding:'6px 8px' }}>
                            <div style={{ fontSize:'0.72rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                            <div style={{ fontSize:'0.62rem', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'1px' }}>{item.brand}</div>
                            <button onClick={() => onAddToOutfit(item)}
                              style={{ width:'100%', marginTop:'5px', background:'var(--color-sage)', color:'white', border:'none', borderRadius:'var(--radius-sm)', padding:'4px 0', fontSize:'0.7rem', cursor:'pointer', fontWeight:500 }}>
                              + Add to Look
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Modesty params */}
                  {msg.modesty_params && (
                    <div style={{ fontSize:'0.72rem', color:'var(--color-sage-dark)', marginTop:'10px', fontStyle:'italic', lineHeight:1.5 }}>
                      ✦ Filtered by: {msg.modesty_params}
                    </div>
                  )}
                  <div style={{ fontSize:'0.65rem', color:'var(--color-text-muted)', marginTop:'6px' }}>{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ alignSelf:'flex-start', width:'80px' }}>
              <div style={{ background:'var(--color-surface)', borderRadius:'4px 18px 18px 18px', padding:'14px 16px', boxShadow:'var(--shadow-sm)', borderLeft:'3px solid var(--color-sage)', display:'flex', gap:'5px', alignItems:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--color-sage-light)', animation:'dotBounce 0.6s infinite', animationDelay: (i*0.2)+'s' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div style={{ flexShrink:0, overflowX:'auto', padding:'8px 16px', display:'flex', gap:'8px', scrollbarWidth:'none', borderTop:'1px solid var(--color-border)' }}>
          {PROMPTS.map(p => (
            <button key={p} onClick={() => handleSend(p)}
              style={{ flexShrink:0, padding:'7px 14px', border:'1px solid var(--color-border)', borderRadius:'var(--radius-pill)', fontSize:'0.78rem', background:'var(--color-surface)', cursor:'pointer', whiteSpace:'nowrap', color:'var(--color-text)', transition:'var(--transition)' }}>
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ flexShrink:0, padding:'10px 16px 16px', display:'flex', alignItems:'center', gap:'8px', background:'var(--color-surface)' }}>
          <span style={{ fontSize:'1.2rem', color:'var(--color-text-muted)', cursor:'pointer', flexShrink:0 }}>🎙</span>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Ask your stylist..."
            style={{ flex:1, padding:'10px 14px', borderRadius:'var(--radius-pill)', border:'1px solid var(--color-border)', background:'var(--color-surface-2)', fontSize:'0.9rem', outline:'none', fontFamily:'var(--font-body)' }}
          />
          <button onClick={handleSend}
            style={{ width:'40px', height:'40px', borderRadius:'50%', background:'var(--color-sage)', color:'white', border:'none', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            →
          </button>
        </div>
      </div>
    </>
  );
}
