# DRAPE — AI-Powered Virtual Fitting Room

> A mobile-first React prototype for a B2C virtual fitting room & contextual AI stylist — built for modest fashion, plus-size inclusive, and universal shoppers.

## 🌿 Live Demo

Deployed via Vercel. See the [live app](https://drape-fitting-room.vercel.app) *(update URL after deploy)*

---

## ✨ Features

- **Universal Rack** — import from any e-commerce URL, upload from your closet, or **take/upload a screenshot** from any website
- **Fitting Room** — dynamic styling toggles (tuck/untuck, open/close, hijab drape style), AI visualization
- **AI Stylist** — contextual chat with Modest Mode filters and Hype Woman / Honest Editor personality modes
- **Inclusive Mannequins** — standard + hijabi models in XS–XL

## 🚀 Run Locally

```bash
npx serve .
# → open http://localhost:3000
```

No build step needed — React + Babel load from CDN.

## 📁 Structure

```
index.html          # Entry point + design tokens
mockData.js         # Mock garments, mannequins, AI responses
UniversalRack.jsx   # Screen 1: Home / Rack
FittingRoom.jsx     # Screen 2: Core fitting engine
AIStylist.jsx       # Screen 3: AI chat drawer
App.jsx             # Global state + navigation
vercel.json         # Static deployment config
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Sage Green | `#8A9E8C` |
| Warm Beige | `#C9B99A` |
| Espresso CTA | `#3D3530` |
| Gold | `#C4A96D` |
| Background | `#FAF9F7` |
| Display Font | Cormorant Garamond |
| Body Font | Inter |
