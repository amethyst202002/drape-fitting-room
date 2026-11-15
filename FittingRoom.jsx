// FittingRoom.jsx — Screen 2: The Core Fitting Engine
// No import/export — global Babel CDN scope

const { useState, useEffect, useRef } = React;

const LOADING_MSGS = [
  'Scanning fabric textures...',
  'Draping garments...',
  'Adjusting fit...',
  'Revealing your look...',
];

function FittingRoom({ activeOutfit, modelConfig, generations, stylingOptions, onChangeModel, onUpdateStylingOption, onVisualize, onRemoveItem, onShopLook, onBack, onOpenStylist }) {
  const [isFlipped, setIsFlipped]           = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [loadingStep, setLoadingStep]       = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showCompare, setShowCompare]       = useState(false);
  const [compareIndices]                    = useState([0, 1]);
  const intervalRef                         = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const handleVisualize = () => {
    if (isLoading || activeOutfit.length === 0) return;
    setIsLoading(true);
    setLoadingStep(0);
    setGeneratedImage(null);
    intervalRef.current = setInterval(() => setLoadingStep(s => s + 1), 1200);
    setTimeout(() => {
      clearInterval(intervalRef.current);
      setGeneratedImage('https://picsum.photos/seed/gen' + Date.now() + '/600/800');
      setIsLoading(false);
      onVisualize();
    }, 4800);
  };

  const formatRelTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(h / 24);
    if (d > 0) return d + 'd ago';
    if (h > 0) return h + 'h ago';
    return 'just now';
  };

  const bgImage = isFlipped
    ? (modelConfig && modelConfig.backImageUrl ? modelConfig.backImageUrl : 'https://picsum.photos/seed/mannequin3back/600/900')
    : (modelConfig && modelConfig.imageUrl ? modelConfig.imageUrl : 'https://picsum.photos/seed/mannequin3/600/900');

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--color-bg)', overflow:'hidden', fontFamily:'var(--font-body)' }}>

      {/* Top Bar */}
      <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'var(--color-surface)', borderBottom:'1px solid var(--color-border)' }}>
        <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.4rem', padding:'4px 8px', color:'var(--color-text)' }}>←</button>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:400 }}>Fitting Room</span>
        <button onClick={onShopLook} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-gold)', fontWeight:600, fontSize:'0.9rem' }}>Shop Look</button>
      </div>

      {/* Main Visual Area */}
      <div style={{ flexShrink:0, height:'340px', margin:'12px 12px 0', position:'relative', borderRadius:'var(--radius-lg)', overflow:'hidden', boxShadow:'var(--shadow-md)', backgroundImage:'url('+bgImage+')', backgroundSize:'cover', backgroundPosition:'center top' }}>

        {/* Generated image overlay */}
        {generatedImage && (
          <img src={generatedImage} alt="Generated outfit" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', animation:'fadeIn 0.8s ease', zIndex:1 }} />
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div style={{ position:'absolute', inset:0, background:'rgba(44,40,37,0.88)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:3 }}>
            <div style={{ color:'white', fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:'20px', animation:'pulse 1.5s ease infinite', textAlign:'center', padding:'0 20px' }}>
              {LOADING_MSGS[Math.min(loadingStep, 3)]}
            </div>
            <div style={{ width:'200px', height:'4px', background:'rgba(255,255,255,0.2)', borderRadius:'2px' }}>
              <div style={{ width: (Math.min(loadingStep+1,4)/4*100)+'%', height:'100%', background:'var(--color-sage)', borderRadius:'2px', transition:'width 1.2s ease' }} />
            </div>
          </div>
        )}

        {/* Overlay controls */}
        <button onClick={() => setShowModelModal(true)} style={{ position:'absolute', top:'12px', left:'12px', background:'rgba(0,0,0,0.65)', color:'white', border:'none', borderRadius:'var(--radius-pill)', padding:'6px 14px', fontSize:'0.75rem', cursor:'pointer', zIndex:2 }}>
          Change Model
        </button>
        <button onClick={() => setIsFlipped(f => !f)} style={{ position:'absolute', top:'12px', right:'12px', width:'36px', height:'36px', borderRadius:'50%', background:'rgba(0,0,0,0.5)', color:'white', border:'none', fontSize:'1rem', cursor:'pointer', zIndex:2, display:'flex', alignItems:'center', justifyContent:'center' }}>
          🔄
        </button>
        {generatedImage && (
          <div style={{ position:'absolute', bottom:'12px', left:'12px', background:'var(--color-gold)', color:'white', padding:'4px 10px', borderRadius:'var(--radius-pill)', fontSize:'0.72rem', fontWeight:700, zIndex:2 }}>
            ✨ New
          </div>
        )}
      </div>

      {/* Outfit Drawer */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px' }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:'8px', color:'var(--color-text)' }}>
          Your Look <span style={{ color:'var(--color-text-muted)', fontSize:'0.9rem' }}>({activeOutfit.length} items)</span>
        </div>

        {activeOutfit.length === 0 && (
          <div style={{ textAlign:'center', padding:'20px', color:'var(--color-text-muted)' }}>
            <div style={{ fontSize:'2rem', marginBottom:'8px' }}>👗</div>
            <div style={{ fontSize:'0.85rem' }}>No items selected yet. Go back to add pieces.</div>
          </div>
        )}

        {activeOutfit.map(item => {
          const opts = stylingOptions[item.id] || {};
          return (
            <div key={item.id}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 0', borderBottom:'1px solid var(--color-border)' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width:'52px', height:'65px', objectFit:'cover', borderRadius:'var(--radius-sm)', flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:'0.85rem' }}>{item.name}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--color-text-muted)', marginTop:'2px' }}>{item.brand}</div>
                </div>
                <button onClick={() => onRemoveItem(item.id)} style={{ background:'none', border:'none', fontSize:'1.3rem', color:'var(--color-text-muted)', cursor:'pointer', padding:'4px' }}>×</button>
              </div>

              {/* Styling Controls */}
              {item.styling_type === 'tuckable' && (
                <div style={{ paddingLeft:'62px', paddingBottom:'10px', paddingTop:'6px' }}>
                  <div style={{ fontSize:'0.72rem', color:'var(--color-text-muted)', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Styling</div>
                  <div style={{ display:'inline-flex', border:'1px solid var(--color-sage)', borderRadius:'var(--radius-pill)', overflow:'hidden' }}>
                    {['Tuck In','Untuck'].map(opt => {
                      const val = opt === 'Tuck In';
                      const active = opts.tucked === val || (opts.tucked === undefined && !val);
                      return (
                        <button key={opt} onClick={() => onUpdateStylingOption(item.id, 'tucked', val)}
                          style={{ padding:'6px 16px', border:'none', cursor:'pointer', fontSize:'0.8rem', fontWeight:500, background: active ? 'var(--color-sage)' : 'white', color: active ? 'white' : 'var(--color-sage)', transition:'var(--transition)' }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {item.styling_type === 'openable' && (
                <div style={{ paddingLeft:'62px', paddingBottom:'10px', paddingTop:'6px', display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ fontSize:'0.72rem', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Style</div>
                  <span style={{ fontSize:'0.8rem', color: (opts.open === false) ? 'var(--color-text-muted)' : 'var(--color-sage-dark)', fontWeight:500 }}>Open</span>
                  <div onClick={() => onUpdateStylingOption(item.id, 'open', !(opts.open !== false))}
                    style={{ width:'44px', height:'24px', borderRadius:'var(--radius-pill)', background:(opts.open !== false) ? 'var(--color-sage)' : '#D0C8C0', position:'relative', cursor:'pointer', transition:'var(--transition)', flexShrink:0 }}>
                    <div style={{ position:'absolute', top:'2px', width:'20px', height:'20px', borderRadius:'50%', background:'white', transition:'left 0.2s ease', left:(opts.open !== false) ? '22px' : '2px', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                  <span style={{ fontSize:'0.8rem', color: (opts.open === false) ? 'var(--color-sage-dark)' : 'var(--color-text-muted)', fontWeight:500 }}>Closed</span>
                </div>
              )}

              {item.styling_type === 'hijab_style' && (
                <div style={{ paddingLeft:'62px', paddingBottom:'10px', paddingTop:'6px' }}>
                  <div style={{ fontSize:'0.72rem', color:'var(--color-text-muted)', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Drape Style</div>
                  <select value={opts.drapeStyle || 'Loose Drape'} onChange={e => onUpdateStylingOption(item.id, 'drapeStyle', e.target.value)}
                    style={{ padding:'7px 12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--color-sage)', fontSize:'0.82rem', background:'white', color:'var(--color-text)', cursor:'pointer', outline:'none' }}>
                    <option>Loose Drape</option>
                    <option>Tight Wrap</option>
                    <option>Turkish Style</option>
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visualize Button */}
      <div style={{ flexShrink:0, padding:'10px 12px 0' }}>
        <button onClick={handleVisualize} disabled={isLoading || activeOutfit.length === 0}
          style={{ width:'100%', height:'54px', background: (isLoading || activeOutfit.length===0) ? 'var(--color-text-muted)' : 'var(--color-cta)', color:'white', border:'none', borderRadius:'var(--radius-md)', fontFamily:'var(--font-display)', fontSize:'1.2rem', cursor: (isLoading || activeOutfit.length===0) ? 'not-allowed' : 'pointer', letterSpacing:'0.05em', transition:'var(--transition)' }}>
          {isLoading ? 'Generating...' : '✨ Visualize Fit'}
        </button>
      </div>

      {/* Session Filmstrip */}
      <div style={{ flexShrink:0, display:'flex', alignItems:'center', overflowX:'auto', padding:'10px 16px 10px', gap:'10px', background:'var(--color-surface)', borderTop:'1px solid var(--color-border)', marginTop:'10px', scrollbarWidth:'none' }}>
        <div style={{ fontSize:'0.72rem', color:'var(--color-text-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', flexShrink:0, marginRight:'4px' }}>History</div>
        {generations.map(gen => (
          <div key={gen.id} style={{ flexShrink:0, textAlign:'center' }}>
            <img src={gen.imageUrl} alt={gen.label} onClick={() => setGeneratedImage(gen.imageUrl)}
              style={{ width:'56px', height:'70px', objectFit:'cover', borderRadius:'var(--radius-sm)', cursor:'pointer', display:'block', boxShadow:'var(--shadow-sm)' }} />
            <div style={{ fontSize:'0.6rem', color:'var(--color-text-muted)', marginTop:'3px' }}>{formatRelTime(gen.timestamp)}</div>
          </div>
        ))}
        <button onClick={() => setShowCompare(true)}
          style={{ marginLeft:'auto', flexShrink:0, padding:'6px 14px', border:'1px solid var(--color-sage)', borderRadius:'var(--radius-pill)', background:'white', color:'var(--color-sage)', fontSize:'0.78rem', cursor:'pointer', whiteSpace:'nowrap' }}>
          ⊞ Compare
        </button>
      </div>

      {/* Model Setup Modal */}
      {showModelModal && (
        <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(0,0,0,0.5)', overflow:'auto' }}>
          <div style={{ background:'var(--color-surface)', minHeight:'100%', padding:'20px', position:'relative' }}>
            <button onClick={() => setShowModelModal(false)} style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', zIndex:1 }}>×</button>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', marginBottom:'24px', paddingRight:'40px' }}>Change Model</div>

            {/* Section A: Upload Photo */}
            <div style={{ marginBottom:'4px', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-muted)', fontWeight:600 }}>📸 Upload Your Photo</div>
            <div style={{ position:'relative', border:'2px dashed var(--color-border)', borderRadius:'var(--radius-md)', height:'160px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--color-surface-2)', marginTop:'8px' }}>
              <div style={{ fontSize:'2rem', marginBottom:'8px' }}>📷</div>
              <div style={{ fontSize:'0.9rem', color:'var(--color-text-muted)' }}>Drop photo here or tap to browse</div>
              {/* Corner handles */}
              {[{top:'14px',left:'14px'},{top:'14px',right:'14px'},{bottom:'14px',left:'14px'},{bottom:'14px',right:'14px'}].map((pos,i) => (
                <div key={i} style={{ position:'absolute', width:'12px', height:'12px', border:'2px solid var(--color-sage)', ...pos }} />
              ))}
            </div>
            <div style={{ fontSize:'0.75rem', color:'var(--color-text-muted)', fontStyle:'italic', marginTop:'8px', marginBottom:'20px' }}>🔒 Head is auto-cropped for privacy</div>

            <div style={{ height:'1px', background:'var(--color-border)', margin:'20px 0' }} />

            {/* Section B: Timed Selfie */}
            <div style={{ marginBottom:'4px', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-muted)', fontWeight:600 }}>⏱ Timed Selfie</div>
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:'3rem' }}>📷</div>
              <div style={{ display:'inline-block', background:'var(--color-gold)', color:'white', borderRadius:'var(--radius-pill)', padding:'4px 14px', fontSize:'0.8rem', fontWeight:600, margin:'10px 0' }}>10s Timer</div>
              <div style={{ fontSize:'0.85rem', color:'var(--color-text-muted)' }}>Strike a pose — we'll handle the rest.</div>
            </div>

            <div style={{ height:'1px', background:'var(--color-border)', margin:'20px 0' }} />

            {/* Section C: Choose Mannequin */}
            <div style={{ marginBottom:'12px', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-muted)', fontWeight:600 }}>Choose Mannequin</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
              {MOCK_MANNEQUINS.map(man => (
                <div key={man.id} onClick={() => { onChangeModel(man); setShowModelModal(false); }}
                  style={{ cursor:'pointer', borderRadius:'var(--radius-md)', overflow:'hidden', border: modelConfig && modelConfig.id===man.id ? '2px solid var(--color-sage)' : '2px solid transparent', position:'relative', boxShadow:'var(--shadow-sm)' }}>
                  <img src={man.imageUrl} alt={man.label} style={{ width:'100%', aspectRatio:'2/3', objectFit:'cover', display:'block' }} />
                  {man.isHijabi && (
                    <div style={{ position:'absolute', top:'6px', left:'50%', transform:'translateX(-50%)', background:'var(--color-sage)', color:'white', fontSize:'0.55rem', padding:'3px 7px', borderRadius:'var(--radius-pill)', whiteSpace:'nowrap', fontWeight:600 }}>🌙 Hijab</div>
                  )}
                  <div style={{ padding:'6px 8px', background:'var(--color-surface)' }}>
                    <div style={{ fontSize:'0.75rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{man.label}</div>
                    <div style={{ display:'inline-block', fontSize:'0.62rem', background:'var(--color-surface-2)', borderRadius:'var(--radius-pill)', padding:'2px 7px', marginTop:'3px' }}>Size {man.size}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height:'40px' }} />
          </div>
        </div>
      )}

      {/* Compare Overlay */}
      {showCompare && generations.length >= 2 && (
        <div style={{ position:'fixed', inset:0, zIndex:110, background:'#111', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'rgba(0,0,0,0.8)' }}>
            <div style={{ color:'white', fontFamily:'var(--font-display)', fontSize:'1.1rem' }}>Compare Fits</div>
            <button onClick={() => setShowCompare(false)} style={{ background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer' }}>×</button>
          </div>
          <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
            {[compareIndices[0], compareIndices[1]].map((idx, i) => {
              const gen = generations[idx] || generations[0];
              return (
                <div key={i} style={{ flex:1, position:'relative' }}>
                  <img src={gen.imageUrl} alt={gen.label} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.6)', color:'white', padding:'10px 12px' }}>
                    <div style={{ fontSize:'0.8rem', fontWeight:600 }}>{gen.label}</div>
                    <div style={{ fontSize:'0.65rem', opacity:0.7, marginTop:'2px' }}>{formatRelTime(gen.timestamp)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
