# 🛡️ CHAKRAVYUH (SETU) — Real-Time Crypto Fraud Attribution & National Surveillance Platform

> **Indian Cybercrime Coordination Centre (I4C) / MHA**  
> Real-Time Multi-Hop Blockchain Attribution, 24/7 Mempool Surveillance & Section 91 CrPC / Section 94 BNSS Legal Directives System.

---

## ⚡ Quickstart

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

- **Demo mode works immediately out of the box** (with high-fidelity pre-indexed on-chain graphs and Supabase persistence).
- To connect the FastAPI backend, set `VITE_API_URL` in `.env`.

---

## 🚀 Complete Feature & UI Architecture Matrix

### 1. 🌐 Landing Page (`/` — `SetuDashboard.jsx`)
- **Apple macOS Dock Floating Navbar**: Mathematically centered 3-column sticky layout with 0ms spring active pill indicator (`About`, `How it works`, `Capabilities`, `Platform`).
- **Interactive Multi-Chain Radar HUD**: Real-time radar sweep animation with live interactive network switcher (`All Chains`, `Polygon PoS`, `Tron TRC-20`, `Bitcoin BTC`, `Ethereum ERC-20`).
- **Fraud Typologies Matrix**: Highlighting *Telegram Task Fraud*, *Fake Mining Liquidity Pools*, *P2P Layering Networks*, *Pig Butchering*, and *Crypto Mixer Hops*.
- **Autonomous Attribution Pipeline**: Visual 4-stage interactive walkthrough from *Victim Ingestion* to *Court-Certified Section 65B Dossier Generation*.

---

### 2. ⚡ Live Attribution Workbench (`/dashboard` — `DashboardPage.jsx`)
- **Multi-Hop Traversal Graph Canvas (`GraphVisualizer.jsx`)**: Cytoscape.js directed acyclic graph (DAG) rendering suspect wallets, layering mules, smart contract mixers, and VASP deposit endpoints.
- **Real-Time Attribution Latency HUD**: Sub-second RPC attribution speed indicator with 5 real-time metrics (*Traced Volume*, *Velocity*, *Identified VASP*, *FIU-IND Status*, *Preservation SLA*).
- **Interactive Node Dossier Intelligence Modal (`NodeDetailDrawer.jsx`)**: Rendered via React Portal (`createPortal`) into `document.body` for perfect viewport centering with zero clipping. Includes:
  - Address identifier with 1-click clipboard copy + block explorer launcher.
  - Traced volume in **USDT & INR**.
  - Risk assessment meter (e.g. `96/100 CRITICAL`).
  - Typology badges (*Peel Chain Pattern*, *Instant Sweep Bot*, *Pre-VASP Aggregator*).
  - 1-click **Section 91 / Section 94 BNSS Legal Notice Generator** with file download & Supabase sync.

---

### 3. 🛡️ 24/7 Watchlist & Surveillance Loop (`WorkspaceCollectionPage.jsx`)
- **Real-Time Surveillance Command Center**:
  - **4-Card Telemetry HUD**: Monitored Targets, Total Traced Value (in Lakhs INR & USDT), Risk Classification, and Preservation SLA countdown (< 4 Hours).
  - **Search & Multi-Chain Filter Pills**: Filter across `Polygon`, `Tron`, `Ethereum`, `Bitcoin`, and Risk levels (`CRITICAL`, `HIGH`).
  - **View Switcher**: Toggle between **Interactive Glass Cards Grid** and **Dense Surveillance Table**.
  - **Autonomous Heuristics**: 800ms mempool polling indicator.
- **Upgraded Add Suspect Wallet Modal**:
  - Centered Apple Glass modal with quick case templates (*Telegram Task Scam Layering*, *Pre-VASP Batch Consolidation*, *P2P Merchant Cashout Disperser*, *Section 91 Urgent Freeze Flag*).

---

### 4. 📜 Cryptographic Evidence Ledger (`EvidenceLedgerPage.jsx`)
- **Section 65B Indian Evidence Act Certified Audit Trail**:
  - Complete 49+ on-chain transaction ledger with microsecond timestamps (IST/UTC), hop depths, token values, INR conversions, and cryptographic transaction hashes.
  - **One-Click Export**: Export directly to **CSV** and **Excel (.xls)** formats for judicial submission.
  - Filter by *Outward Sweep*, *Inbound Deposit*, and *VASP Attribution*.

---

### 5. ⚖️ Legal Dossier System (`WorkspaceCollectionPage.jsx` - Dossier View)
- Standardized Section 94 BNSS / Section 91 CrPC case production packets with VASP targets (*WazirX, CoinDCX, Binance, OKX*), FIR case reference numbers, and digital officer attestations.

---

### 6. 🔍 Quick Command Palette (`⌘K` — `CommandPaletteModal.jsx`)
- Universal shortcut launcher (`Ctrl+K` or `⌘K`) to jump directly to any suspect wallet trace, open the Evidence Ledger, launch the Watchlist, or issue emergency Section 91 freeze notices.

---

### 7. 👤 Officer Profile & Admin Node Management (`ProfilePage.jsx`)
- **Officer Identification Card**: Designation, badge ID, clearance tier (`Tier 2 - National Attribution`), official agency channel, and hardware key attestation.
- **Admin & Node Telemetry Panel**:
  - Live configuration for **Machine Learning Risk Detection API Endpoint** (`PyTorch Geometric GNN / FastAPI`).
  - Archive RPC endpoints for Polygon PoS and TRON TRC-20 nodes.
  - Auto-Freeze Directive Threshold configuration (`95% VASP Confidence`).
  - Role-Based Access Control (RBAC) officer registry.

---

## 📁 Component Directory Structure

| File Path | Description |
|---|---|
| `src/App.jsx` | Top-level routing between Landing (`/`) and Dashboard (`/dashboard`) with global audio and notifications. |
| `src/components/SetuDashboard.jsx` | Landing page with radar animations, centered sticky navbar, and interactive chain selector. |
| `src/components/DashboardPage.jsx` | Main workspace dashboard managing multi-hop visual graph, metrics, and search ingestion. |
| `src/components/WorkspaceNav.jsx` | Dynamic 3-column dock navbar with live IST clock, notification center, and profile dropdown. |
| `src/components/NodeDetailDrawer.jsx` | Centered Apple Glassmorphic entity intelligence dossier modal (React Portal). |
| `src/components/WorkspaceCollectionPage.jsx` | Full-width 24/7 Watchlist command center & statutory legal dossiers. |
| `src/components/EvidenceLedgerPage.jsx` | Section 65B evidence ledger table with CSV & Excel export. |
| `src/components/CommandPaletteModal.jsx` | Universal quick command palette modal (`⌘K` / `Ctrl+K`). |
| `src/components/ProfilePage.jsx` | Officer clearance credentials & Admin ML/RPC telemetry panel. |
| `src/components/GraphVisualizer.jsx` | Cytoscape.js directed graph visualization engine. |
| `src/lib/supabase.js` | Supabase cloud database integration for Watchlist & Dossier persistence. |
| `src/lib/api.js` | API client with seamless switch between real RPC endpoints and forensic mock traces. |
| `src/lib/evidenceData.js` | 49 verified on-chain multi-hop audit records for court production. |
| `src/index.css` | Tailored forest-green (`#061711`) + antique-gold (`#d8b84d`) design system with iOS glassmorphism. |

