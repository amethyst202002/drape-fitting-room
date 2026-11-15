// mockData.js — Global mock state for DRAPE Virtual Fitting Room
// No import/export — loaded as global script via Babel CDN

const MOCK_RACK = [
  { id:'item-1', name:'Relaxed Linen Shirt', brand:'Massimo Dutti', price:'$89', category:'top', styling_type:'tuckable', owned:false, imageUrl:'https://picsum.photos/seed/garment1/400/500', sourceUrl:'https://www.massimodutti.com/product/linen-shirt' },
  { id:'item-2', name:'Silk Draped Blouse', brand:'Reiss', price:'$145', category:'top', styling_type:null, owned:false, imageUrl:'https://picsum.photos/seed/garment2/400/500', sourceUrl:'https://www.reiss.com/product/silk-blouse' },
  { id:'item-3', name:'Cotton Oversized Tee', brand:'COS', price:'$45', category:'top', styling_type:null, owned:false, imageUrl:'https://picsum.photos/seed/garment3/400/500', sourceUrl:'https://www.cos.com/product/tee' },
  { id:'item-4', name:'Wide-Leg Palazzo Trousers', brand:'Zara', price:'$69', category:'bottom', styling_type:null, owned:false, imageUrl:'https://picsum.photos/seed/garment4/400/500', sourceUrl:'https://www.zara.com/product/palazzo' },
  { id:'item-5', name:'Maxi Pleated Skirt', brand:'Mango', price:'$79', category:'bottom', styling_type:null, owned:false, imageUrl:'https://picsum.photos/seed/garment5/400/500', sourceUrl:'https://www.mango.com/product/maxi-skirt' },
  { id:'item-6', name:'Ankle-Length Linen Trousers', brand:'H&M', price:'$39', category:'bottom', styling_type:null, owned:false, imageUrl:'https://picsum.photos/seed/garment6/400/500', sourceUrl:'https://www.hm.com/product/linen-trousers' },
  { id:'item-7', name:'Structured Blazer', brand:'ASOS', price:'$95', category:'outerwear', styling_type:'openable', owned:false, imageUrl:'https://picsum.photos/seed/garment7/400/500', sourceUrl:'https://www.asos.com/product/blazer' },
  { id:'item-8', name:'Wool Longline Coat', brand:'Net-a-Porter', price:'$320', category:'outerwear', styling_type:'openable', owned:false, imageUrl:'https://picsum.photos/seed/garment8/400/500', sourceUrl:'https://www.net-a-porter.com/product/coat' },
  { id:'item-9', name:'Jersey Instant Hijab', brand:'Modanisa', price:'$22', category:'headwear', styling_type:'hijab_style', owned:false, imageUrl:'https://picsum.photos/seed/garment9/400/500', sourceUrl:'https://www.modanisa.com/product/instant-hijab' },
  { id:'item-10', name:'Chiffon Wrap Scarf', brand:'Modanisa', price:'$35', category:'headwear', styling_type:'hijab_style', owned:false, imageUrl:'https://picsum.photos/seed/garment10/400/500', sourceUrl:'https://www.modanisa.com/product/chiffon-scarf' },
  { id:'item-11', name:'Gold Chain Belt', brand:'Zara', price:'$29', category:'accessory', styling_type:null, owned:false, imageUrl:'https://picsum.photos/seed/garment11/400/500', sourceUrl:'https://www.zara.com/product/chain-belt' },
  { id:'item-12', name:'Leather Tote Bag', brand:'Reiss', price:'$220', category:'accessory', styling_type:null, owned:false, imageUrl:'https://picsum.photos/seed/garment12/400/500', sourceUrl:'https://www.reiss.com/product/leather-tote' },
];

const MOCK_CLOSET = [
  { id:'closet-1', name:'My Favourite Denim Jacket', brand:'Levi\'s', price:'$0', category:'outerwear', styling_type:'openable', owned:true, imageUrl:'https://picsum.photos/seed/closet1/400/500', sourceUrl:'' },
  { id:'closet-2', name:'Cream Knit Cardigan', brand:'Own', price:'$0', category:'outerwear', styling_type:'openable', owned:true, imageUrl:'https://picsum.photos/seed/closet2/400/500', sourceUrl:'' },
  { id:'closet-3', name:'Black Midi Dress', brand:'ASOS', price:'$0', category:'top', styling_type:null, owned:true, imageUrl:'https://picsum.photos/seed/closet3/400/500', sourceUrl:'' },
  { id:'closet-4', name:'White Cotton Blouse', brand:'Zara', price:'$0', category:'top', styling_type:'tuckable', owned:true, imageUrl:'https://picsum.photos/seed/closet4/400/500', sourceUrl:'' },
  { id:'closet-5', name:'Navy Wide Pants', brand:'Massimo Dutti', price:'$0', category:'bottom', styling_type:null, owned:true, imageUrl:'https://picsum.photos/seed/closet5/400/500', sourceUrl:'' },
  { id:'closet-6', name:'Printed Prayer Hijab', brand:'Own', price:'$0', category:'headwear', styling_type:'hijab_style', owned:true, imageUrl:'https://picsum.photos/seed/closet6/400/500', sourceUrl:'' },
];

const MOCK_MANNEQUINS = [
  { id:'man-1', label:'Classic XS', size:'XS', isHijabi:false, imageUrl:'https://picsum.photos/seed/mannequin1/600/900', backImageUrl:'https://picsum.photos/seed/mannequin1back/600/900' },
  { id:'man-2', label:'Standard S', size:'S', isHijabi:false, imageUrl:'https://picsum.photos/seed/mannequin2/600/900', backImageUrl:'https://picsum.photos/seed/mannequin2back/600/900' },
  { id:'man-3', label:'Standard M', size:'M', isHijabi:false, imageUrl:'https://picsum.photos/seed/mannequin3/600/900', backImageUrl:'https://picsum.photos/seed/mannequin3back/600/900' },
  { id:'man-4', label:'Standard XL', size:'XL', isHijabi:false, imageUrl:'https://picsum.photos/seed/mannequin4/600/900', backImageUrl:'https://picsum.photos/seed/mannequin4back/600/900' },
  { id:'man-5', label:'Hijabi M', size:'M', isHijabi:true, imageUrl:'https://picsum.photos/seed/mannequin5/600/900', backImageUrl:'https://picsum.photos/seed/mannequin5back/600/900' },
  { id:'man-6', label:'Hijabi L', size:'L', isHijabi:true, imageUrl:'https://picsum.photos/seed/mannequin6/600/900', backImageUrl:'https://picsum.photos/seed/mannequin6back/600/900' },
];

const INITIAL_STATE = {
  universalRack: MOCK_RACK,
  virtualCloset: MOCK_CLOSET,
  activeOutfit: [],
  modelConfig: MOCK_MANNEQUINS[2],
};

const MOCK_AI_RESPONSES = {
  blazer: {
    text: "This blazer is a powerhouse piece! Here are pieces that complement its structure perfectly.",
    recommendations: ['item-4', 'item-6'],
    modesty_params: "Ankle-length hemlines, High necklines \u2265 collarbone, Opaque fabric weight >180gsm",
    hype: "OBSESSED with this blazer combo \u2014 structured elegance is EVERYTHING right now! \uD83D\uDD25",
    honest: "The structured blazer works best with high-waisted wide-leg trousers to balance the volume proportions."
  },
  eid: {
    text: "For Eid, let\u2019s go festive yet refined. These pieces will make you radiant.",
    recommendations: ['item-9', 'item-2', 'item-5'],
    modesty_params: "Full coverage required, Celebratory palette, No sheer or clingy fabrics, Loose silhouette",
    hype: "Eid look INCOMING! You are going to be absolutely radiant! \u2728\uD83C\uDF19",
    honest: "These selections balance occasion-appropriate modesty with a refined festive aesthetic."
  },
  neutral: {
    text: "A tonal neutral palette is the foundation of a timeless, versatile wardrobe.",
    recommendations: ['item-6', 'item-1', 'item-11'],
    modesty_params: "Muted tones only, Layerable pieces, Versatile loose silhouettes",
    hype: "Neutral queen energy is UNMATCHED! This tonal combo is absolutely chef\u2019s kiss! \uD83E\uDD0C",
    honest: "Neutral tones build a versatile capsule that pairs with almost everything. Classic and always appropriate."
  },
  modest: {
    text: "Here are my top modest fashion picks from your rack \u2014 coverage and style in perfect harmony.",
    recommendations: ['item-6', 'item-8', 'item-9'],
    modesty_params: "Head-to-toe coverage, Loose silhouette, Opaque fabrics only, Minimum ankle-length hemlines",
    hype: "Modesty is a WHOLE vibe and these pieces serve it FULLY! \uD83C\uDF3F",
    honest: "These pieces meet comprehensive modest fashion criteria across fit, coverage, length, and fabric opacity."
  },
  default: {
    text: "Here\u2019s a great starting point based on your current rack.",
    recommendations: ['item-1', 'item-4'],
    modesty_params: "General modesty filters active",
    hype: "So many amazing options here \u2014 let\u2019s build something truly special! \uD83D\uDCAB",
    honest: "Here is a balanced suggestion that works across most occasions and body types."
  }
};

const MOCK_GENERATIONS = [
  { id:'gen-1', timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(), imageUrl:'https://picsum.photos/seed/gen1/600/800', items:['item-1','item-4','item-7'], label:'Casual Monday Look' },
  { id:'gen-2', timestamp: new Date(Date.now() - 86400000).toISOString(), imageUrl:'https://picsum.photos/seed/gen2/600/800', items:['item-2','item-5','item-9'], label:'Eid Celebration Outfit' },
  { id:'gen-3', timestamp: new Date(Date.now() - 3*60*60*1000).toISOString(), imageUrl:'https://picsum.photos/seed/gen3/600/800', items:['item-3','item-6','item-8'], label:'Editorial Street Style' },
];
