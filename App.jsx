// App.jsx — Global App Shell & State Manager
// No import/export — global Babel CDN scope

const { useState: useState, useCallback: useCallback } = React;

function App() {
  const [universalRack, setUniversalRack]   = useState(INITIAL_STATE.universalRack);
  const [virtualCloset, setVirtualCloset]   = useState(INITIAL_STATE.virtualCloset);
  const [activeOutfit, setActiveOutfit]     = useState([]);
  const [modelConfig, setModelConfig]       = useState(INITIAL_STATE.modelConfig);
  const [generations, setGenerations]       = useState(MOCK_GENERATIONS);
  const [currentScreen, setCurrentScreen]  = useState('rack');
  const [isStylistOpen, setIsStylistOpen]  = useState(false);
  const [stylingOptions, setStylingOptions] = useState({});
  const [toasts, setToasts]                = useState([]);

  const showToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const handleAddItem = useCallback((item) => {
    setActiveOutfit(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      showToast(item.name + ' added to your look!');
      return [...prev, item];
    });
  }, [showToast]);

  const handleRemoveItem = useCallback((id) => {
    setActiveOutfit(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleImportScreenshot = useCallback(({ file, dataUrl }) => {
    // The dataUrl IS the image — use it directly so the item shows the real screenshot
    const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Screenshot Item';
    const newItem = {
      id: 'screenshot-' + Date.now(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      brand: 'From Screenshot',
      price: 'See original',
      category: 'top',
      styling_type: null,
      owned: false,
      imageUrl: dataUrl,
      sourceUrl: '',
      isScreenshot: true,
    };
    setUniversalRack(prev => [newItem, ...prev]);
    showToast('Screenshot added to your rack! 📸');
  }, [showToast]);

  const handleImportUrl = useCallback((url, fetchedItem) => {
    const domain = (() => { try { return new URL(url).hostname.replace('www.',''); } catch(e) { return 'store'; } })();
    const newItem = fetchedItem ? {
      // Use real fetched data
      id: 'imported-' + Date.now(),
      name: fetchedItem.name,
      brand: fetchedItem.brand,
      price: fetchedItem.price || 'See site',
      category: 'top',
      styling_type: null,
      owned: false,
      imageUrl: fetchedItem.imageUrl,
      sourceUrl: url,
    } : {
      // Fallback mock
      id: 'imported-' + Date.now(),
      name: 'Item from ' + domain,
      brand: domain,
      price: 'See site',
      category: 'top',
      styling_type: null,
      owned: false,
      imageUrl: 'https://picsum.photos/seed/import' + Date.now() + '/400/500',
      sourceUrl: url,
    };
    setUniversalRack(prev => [newItem, ...prev]);
    showToast((fetchedItem ? fetchedItem.name : 'Item') + ' added from ' + domain + '! 🎉');
  }, [showToast]);

  const handleUploadOwn = useCallback((file) => {
    const newItem = {
      id: 'closet-uploaded-' + Date.now(),
      name: file ? file.name.replace(/\.[^.]+$/, '') : 'My Item',
      brand: 'My Closet',
      price: '$0',
      category: 'top',
      styling_type: null,
      owned: true,
      imageUrl: 'https://picsum.photos/seed/upload' + Date.now() + '/400/500',
      sourceUrl: '',
    };
    setVirtualCloset(prev => [newItem, ...prev]);
    showToast('Added to your closet! 👗');
  }, [showToast]);

  const handleChangeModel = useCallback((config) => {
    setModelConfig(config);
    showToast('Model updated!');
  }, [showToast]);

  const handleUpdateStylingOption = useCallback((itemId, option, value) => {
    setStylingOptions(prev => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || {}), [option]: value },
    }));
  }, []);

  const handleVisualize = useCallback(() => {
    const newGen = {
      id: 'gen-' + Date.now(),
      timestamp: new Date().toISOString(),
      imageUrl: 'https://picsum.photos/seed/gen' + Date.now() + '/600/800',
      items: activeOutfit.map(i => i.id),
      label: 'My Look',
    };
    setGenerations(prev => [newGen, ...prev]);
  }, [activeOutfit]);

  const handleShopLook = useCallback(() => {
    showToast('Opening checkout for ' + activeOutfit.length + ' items... 🛍️');
  }, [activeOutfit, showToast]);

  const combinedRack = [...universalRack, ...virtualCloset];

  return (
    <div style={{ position:'relative', minHeight:'100vh', background:'var(--color-bg)', paddingBottom: currentScreen === 'rack' ? '56px' : '0' }}>

      {/* Screen Content */}
      {currentScreen === 'rack' && (
        <UniversalRack
          rack={combinedRack}
          activeOutfit={activeOutfit}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onImportUrl={handleImportUrl}
          onImportScreenshot={handleImportScreenshot}
          onUploadOwn={handleUploadOwn}
          onOpenFittingRoom={() => setCurrentScreen('fitting-room')}
          onOpenStylist={() => setIsStylistOpen(true)}
        />
      )}

      {currentScreen === 'fitting-room' && (
        <FittingRoom
          activeOutfit={activeOutfit}
          modelConfig={modelConfig}
          generations={generations}
          stylingOptions={stylingOptions}
          onChangeModel={handleChangeModel}
          onUpdateStylingOption={handleUpdateStylingOption}
          onVisualize={handleVisualize}
          onRemoveItem={handleRemoveItem}
          onShopLook={handleShopLook}
          onBack={() => setCurrentScreen('rack')}
          onOpenStylist={() => setIsStylistOpen(true)}
        />
      )}

      {/* AI Stylist — always rendered, slides in/out */}
      <AIStylist
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        rack={combinedRack}
        activeOutfit={activeOutfit}
        aiResponses={MOCK_AI_RESPONSES}
        onAddToOutfit={handleAddItem}
      />

      {/* Bottom Nav */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, maxWidth:'430px', margin:'0 auto', height:'56px', background:'var(--color-surface)', borderTop:'1px solid var(--color-border)', display:'flex', zIndex:50, fontFamily:'var(--font-body)' }}>
        {[
          { icon:'🏠', label:'Rack', screen:'rack', disabled:false, action: () => setCurrentScreen('rack') },
          { icon:'👗', label:'Try On', screen:'fitting-room', disabled: activeOutfit.length === 0, action: () => { if (activeOutfit.length > 0) setCurrentScreen('fitting-room'); } },
          { icon:'✦', label:'Stylist', screen:null, disabled:false, action: () => setIsStylistOpen(true), isDisplay:true },
        ].map(tab => {
          const isActive = tab.screen ? currentScreen === tab.screen : isStylistOpen;
          return (
            <button key={tab.label} onClick={tab.action}
              style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px', border:'none', background:'none', cursor: tab.disabled ? 'not-allowed' : 'pointer', opacity: tab.disabled ? 0.4 : 1, color: isActive ? 'var(--color-sage)' : 'var(--color-text-muted)', transition:'var(--transition)' }}>
              <span style={{ fontSize: tab.isDisplay ? '1.1rem' : '1.3rem', fontFamily: tab.isDisplay ? 'var(--font-display)' : 'inherit', lineHeight:1 }}>{tab.icon}</span>
              <span style={{ fontSize:'0.62rem', fontWeight: isActive ? 600 : 400, letterSpacing:'0.03em' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Notifications */}
      <div style={{ position:'fixed', top:'16px', left:'50%', transform:'translateX(-50%)', zIndex:300, display:'flex', flexDirection:'column', gap:'8px', alignItems:'center', pointerEvents:'none', width:'max-content', maxWidth:'360px' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ background:'var(--color-cta)', color:'white', padding:'10px 20px', borderRadius:'var(--radius-pill)', fontSize:'0.85rem', boxShadow:'var(--shadow-md)', whiteSpace:'nowrap', animation:'slideDown 0.3s ease', fontFamily:'var(--font-body)' }}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

