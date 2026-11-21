// UniversalRack.jsx — Screen 1: Home / Universal Rack
// No import/export — global Babel CDN scope

const { useState, useRef } = React;

function UniversalRack({ rack, activeOutfit, onAddItem, onRemoveItem, onImportUrl, onUploadOwn, onImportScreenshot, onOpenFittingRoom, onOpenStylist }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState(0);
  const [importUrl, setImportUrl] = useState('');
  const [importedItem, setImportedItem] = useState(null);
  const fileInputRef = useRef(null);
  const screenshotInputRef = useRef(null);

  const filters = ['All','Tops','Bottoms','Outerwear','Headwear','My Closet'];

  const filteredRack = rack.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Tops') return item.category === 'top';
    if (activeFilter === 'Bottoms') return item.category === 'bottom';
    if (activeFilter === 'Outerwear') return item.category === 'outerwear';
    if (activeFilter === 'Headwear') return item.category === 'headwear';
    if (activeFilter === 'My Closet') return item.owned === true;
    return true;
  });

  const isInOutfit = (id) => activeOutfit.some(i => i.id === id);
  const ownedCount = rack.filter(i => i.owned).length;

  const handleImport = () => {
    if (!importUrl.trim()) return;
    setImportStep(1);
    // Use microlink.io to fetch real Open Graph metadata from the product URL
    const apiUrl = 'https://api.microlink.io?url=' + encodeURIComponent(importUrl.trim());
    fetch(apiUrl)
      .then(r => r.json())
      .then(data => {
        const d = data.data || {};
        const name  = d.title || d.description || 'Product';
        const img   = (d.image && d.image.url) ? d.image.url : null;
        const brand = d.publisher || d.author || ((() => { try { return new URL(importUrl).hostname.replace('www.',''); } catch(e) { return 'Store'; } })());
        const price = d.price || '';
        setImportedItem({
          name:     name.length > 60 ? name.slice(0, 60) + '...' : name,
          brand:    brand,
          price:    price || 'See site',
          imageUrl: img || 'https://picsum.photos/seed/import' + Date.now() + '/400/500',
          sourceUrl: importUrl.trim(),
        });
        setImportStep(2);
      })
      .catch(() => {
        // Fallback: use URL domain + placeholder
        const domain = (() => { try { return new URL(importUrl).hostname.replace('www.',''); } catch(e) { return 'Store'; } })();
        setImportedItem({
          name: 'Product from ' + domain,
          brand: domain,
          price: 'See site',
          imageUrl: 'https://picsum.photos/seed/import' + Date.now() + '/400/500',
          sourceUrl: importUrl.trim(),
        });
        setImportStep(2);
      });
  };

  const handleAddFromModal = () => {
    if (importedItem) {
      onImportUrl(importUrl, importedItem);
    } else {
      onImportUrl(importUrl);
    }
    setShowImportModal(false);
    setImportStep(0);
    setImportUrl('');
    setImportedItem(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadOwn(e.target.files[0]);
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      onImportScreenshot({ file, dataUrl });
    };
    reader.readAsDataURL(file);
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const s = {
    wrapper: { minHeight:'100vh', background:'var(--color-bg)', paddingBottom:'140px', fontFamily:'var(--font-body)' },
    header: { background:'var(--color-surface)', padding:'20px 20px 14px', borderBottom:'1px solid var(--color-border)' },
    headerRow: { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
    appName: { fontFamily:'var(--font-display)', fontSize:'2.8rem', fontWeight:300, letterSpacing:'0.3em', color:'var(--color-text)', lineHeight:1 },
    subtitle: { fontSize:'0.72rem', color:'var(--color-text-muted)', letterSpacing:'0.15em', textTransform:'uppercase', marginTop:'4px' },
    iconBtn: { background:'none', border:'none', cursor:'pointer', fontSize:'1.3rem', position:'relative', padding:'4px 6px' },
    badge: { position:'absolute', top:'-2px', right:'-2px', background:'var(--color-sage)', color:'white', fontSize:'0.55rem', fontWeight:700, width:'16px', height:'16px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' },
    importBar: { margin:'14px 16px', padding:'16px', background:'var(--color-surface)', borderRadius:'var(--radius-md)', boxShadow:'var(--shadow-sm)' },
    sageBtnFull: { width:'100%', background:'var(--color-sage)', color:'white', border:'none', borderRadius:'var(--radius-md)', padding:'13px', fontSize:'0.95rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' },
    outlineBtn: { width:'100%', background:'transparent', color:'var(--color-sage)', border:'1px solid var(--color-sage)', borderRadius:'var(--radius-md)', padding:'10px', fontSize:'0.88rem', fontWeight:500, cursor:'pointer', marginTop:'10px' },
    storeNote: { fontSize:'0.72rem', color:'var(--color-text-light)', textAlign:'center', marginTop:'10px' },
    tabsRow: { display:'flex', overflowX:'auto', padding:'0 16px 14px', gap:'8px', scrollbarWidth:'none', WebkitOverflowScrolling:'touch' },
    grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', padding:'0 16px' },
    card: { position:'relative', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--color-surface)', boxShadow:'var(--shadow-sm)', cursor:'pointer' },
    imgWrap: (inOutfit) => ({ position:'relative', paddingTop:'133%', overflow:'hidden', outline: inOutfit ? '2.5px solid var(--color-sage)' : 'none', outlineOffset:'-2.5px' }),
    img: { position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover' },
    mineBadge: { position:'absolute', top:'8px', left:'8px', background:'var(--color-gold)', color:'white', fontSize:'0.58rem', fontWeight:700, padding:'3px 8px', borderRadius:'var(--radius-pill)', letterSpacing:'0.08em', zIndex:2 },
    addBtn: (inOutfit) => ({ position:'absolute', bottom:'8px', right:'8px', width:'32px', height:'32px', borderRadius:'50%', background: inOutfit ? 'var(--color-sage)' : 'var(--color-cta)', color:'white', border:'none', fontSize:inOutfit?'1rem':'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-sm)', zIndex:2, transition:'var(--transition)' }),
    cardInfo: { padding:'8px 10px 10px' },
    brand: { fontSize:'0.6rem', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' },
    name: { fontSize:'0.85rem', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginTop:'2px' },
    price: { fontSize:'0.82rem', color:'var(--color-sage-dark)', fontWeight:500, marginTop:'2px' },
    tray: { position:'fixed', bottom:'56px', left:0, right:0, maxWidth:'430px', margin:'0 auto', zIndex:50, background:'var(--color-surface)', padding:'12px 16px 14px', borderTop:'1px solid var(--color-border)', boxShadow:'0 -4px 20px rgba(0,0,0,0.08)', animation:'slideUp 0.3s ease' },
    trayRow: { display:'flex', alignItems:'center', gap:'8px', overflowX:'auto', marginBottom:'10px', scrollbarWidth:'none' },
    trayThumb: { width:'48px', height:'60px', objectFit:'cover', borderRadius:'var(--radius-sm)', flexShrink:0 },
    trayCount: { fontSize:'0.82rem', color:'var(--color-text-muted)', whiteSpace:'nowrap' },
    ctaBtn: { width:'100%', background:'var(--color-cta)', color:'white', border:'none', borderRadius:'var(--radius-md)', padding:'14px', fontFamily:'var(--font-display)', fontSize:'1.1rem', cursor:'pointer', letterSpacing:'0.05em' },
    overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'flex-end' },
    sheet: { background:'white', width:'100%', maxWidth:'430px', margin:'0 auto', borderRadius:'20px 20px 0 0', padding:'24px', maxHeight:'85vh', overflowY:'auto' },
    handle: { width:'40px', height:'4px', background:'var(--color-border)', borderRadius:'2px', margin:'0 auto 20px' },
    sheetTitle: { fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:'16px' },
    urlInput: { width:'100%', padding:'12px 16px', borderRadius:'var(--radius-md)', border:'1px solid var(--color-border)', fontSize:'0.9rem', outline:'none', marginBottom:'12px', fontFamily:'var(--font-body)' },
    spinner: { width:'40px', height:'40px', border:'3px solid var(--color-sage-light)', borderTopColor:'var(--color-sage)', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'20px auto' },
    parsedCard: { display:'flex', gap:'12px', alignItems:'center', background:'var(--color-surface-2)', padding:'12px', borderRadius:'var(--radius-md)', marginBottom:'16px' },
    parsedImg: { width:'64px', height:'80px', objectFit:'cover', borderRadius:'var(--radius-sm)' },
  };

  return (
    <div style={s.wrapper}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerRow}>
          <div>
            <div style={s.appName}>DRAPE</div>
            <div style={s.subtitle}>Your Universal Wardrobe</div>
          </div>
          <div style={{ display:'flex', gap:'4px', paddingTop:'4px' }}>
            <button style={s.iconBtn} title="My Closet">
              👗
              {ownedCount > 0 && <span style={s.badge}>{ownedCount}</span>}
            </button>
            <button style={s.iconBtn} onClick={onOpenStylist} title="AI Stylist">✦</button>
          </div>
        </div>
      </div>

      {/* Import Bar */}
      <div style={s.importBar}>
        <button style={s.sageBtnFull} onClick={() => { setShowImportModal(true); setImportStep(0); }}>
          <span>⬆</span> Import from any store
        </button>
        <input type="file" ref={fileInputRef} style={{ display:'none' }} accept="image/*" onChange={handleFileChange} />
        <button style={s.outlineBtn} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
          + Upload My Own
        </button>

        {/* Screenshot import — camera icon, prominent */}
        <input type="file" ref={screenshotInputRef} style={{ display:'none' }} accept="image/*" capture="environment" onChange={handleScreenshotChange} />
        <button
          style={{ ...s.outlineBtn, marginTop:'8px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', borderColor:'var(--color-beige-dark)', color:'var(--color-beige-dark)', fontWeight:600 }}
          onClick={() => screenshotInputRef.current && screenshotInputRef.current.click()}
        >
          📸 Add Screenshot from Any Site
        </button>
        <div style={{ fontSize:'0.7rem', color:'var(--color-text-light)', textAlign:'center', marginTop:'6px' }}>
          Screenshot a product anywhere → upload here ✦ no sharing required
        </div>
        <div style={s.storeNote}>Works with Zara, ASOS, Modanisa, Net-a-Porter + 500 more</div>
      </div>

      {/* Filter Tabs */}
      <div style={s.tabsRow}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              flexShrink:0, padding:'7px 16px', borderRadius:'var(--radius-pill)',
              fontSize:'0.8rem', fontWeight:500, cursor:'pointer', whiteSpace:'nowrap',
              border: activeFilter === f ? 'none' : '1px solid var(--color-border)',
              background: activeFilter === f ? 'var(--color-sage)' : 'var(--color-surface)',
              color: activeFilter === f ? 'white' : 'var(--color-text-muted)',
              transition:'var(--transition)',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Section Label */}
      <div style={{ padding:'0 16px 10px', fontSize:'0.72rem', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500 }}>
        {filteredRack.length} {activeFilter === 'All' ? 'Pieces' : activeFilter}
      </div>

      {/* Garment Grid */}
      <div style={s.grid}>
        {filteredRack.map(item => {
          const inOutfit = isInOutfit(item.id);
          return (
            <div key={item.id} style={s.card}>
              <div style={s.imgWrap(inOutfit)}>
                <img src={item.imageUrl} alt={item.name} style={s.img} loading="lazy" />
                {item.owned && <span style={s.mineBadge}>MINE</span>}
                {item.isScreenshot && <span style={{ ...s.mineBadge, background:'var(--color-beige-dark)', left:'auto', right:'8px' }}>📸</span>}
                <button
                  style={s.addBtn(inOutfit)}
                  onClick={(e) => { e.stopPropagation(); inOutfit ? onRemoveItem(item.id) : onAddItem(item); }}
                >
                  {inOutfit ? '✓' : '+'}
                </button>
              </div>
              <div style={s.cardInfo}>
                <div style={s.brand}>{item.brand}</div>
                <div style={s.name}>{item.name}</div>
                <div style={s.price}>{item.price}</div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRack.length === 0 && (
        <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--color-text-muted)' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'12px' }}>✦</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem' }}>Nothing here yet</div>
          <div style={{ fontSize:'0.85rem', marginTop:'6px' }}>Import from a store or upload your own items</div>
        </div>
      )}

      {/* Active Outfit Tray */}
      {activeOutfit.length > 0 && (
        <div style={s.tray}>
          <div style={s.trayRow}>
            <div style={{ fontSize:'0.82rem', color:'var(--color-text-muted)', whiteSpace:'nowrap', flexShrink:0 }}>
              {activeOutfit.length} {activeOutfit.length === 1 ? 'item' : 'items'} selected
            </div>
            {activeOutfit.map(item => (
              <img key={item.id} src={item.imageUrl} alt={item.name} style={s.trayThumb} />
            ))}
          </div>
          <button style={s.ctaBtn} onClick={onOpenFittingRoom}>
            Enter Fitting Room →
          </button>
        </div>
      )}

      {/* Import URL Modal */}
      {showImportModal && (
        <div style={s.overlay} onClick={() => { setShowImportModal(false); setImportStep(0); }}>
          <div style={s.sheet} onClick={e => e.stopPropagation()}>
            <div style={s.handle} />
            <div style={s.sheetTitle}>Import from Store</div>

            {importStep === 0 && (
              <>
                <input
                  type="text"
                  style={s.urlInput}
                  placeholder="Paste product URL e.g. zara.com/product/..."
                  value={importUrl}
                  onChange={e => setImportUrl(e.target.value)}
                />
                <button style={{ ...s.sageBtnFull, borderRadius:'var(--radius-md)' }} onClick={handleImport}>
                  Import Product
                </button>
                <button style={{ ...s.outlineBtn, marginTop:'10px' }} onClick={() => { setShowImportModal(false); setImportStep(0); }}>
                  Cancel
                </button>
              </>
            )}

            {importStep === 1 && (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={s.spinner} />
                <div style={{ color:'var(--color-text-muted)', fontSize:'0.9rem' }}>Parsing product details...</div>
              </div>
            )}

            {importStep === 2 && importedItem && (
              <>
                <div style={s.parsedCard}>
                  <img src={importedItem.imageUrl} alt={importedItem.name} style={s.parsedImg} />
                  <div>
                    <div style={{ fontSize:'0.72rem', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{importedItem.brand}</div>
                    <div style={{ fontWeight:600, marginTop:'4px' }}>{importedItem.name}</div>
                    <div style={{ color:'var(--color-sage-dark)', fontWeight:500, marginTop:'4px' }}>{importedItem.price}</div>
                  </div>
                </div>
                <button style={{ ...s.sageBtnFull, borderRadius:'var(--radius-md)' }} onClick={handleAddFromModal}>
                  Add to Rack
                </button>
                <button style={{ ...s.outlineBtn }} onClick={() => { setShowImportModal(false); setImportStep(0); }}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
