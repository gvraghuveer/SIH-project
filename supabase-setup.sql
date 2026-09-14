-- ══════════════════════════════════════════════════════════════════════
-- CHAKRAVYUH SETU — SUPABASE DATABASE SCHEMA & POLICIES
-- Execute this script in Supabase SQL Editor to set up all tables,
-- RLS policies, indexes, and initial demo officer accounts.
-- ══════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Officer Accounts & Clearances)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    badge_id TEXT NOT NULL,
    station_code TEXT NOT NULL,
    clearance TEXT DEFAULT 'Tier 1 - Unit Attribution',
    role TEXT DEFAULT 'investigator' CHECK (role IN ('admin', 'investigator', 'viewer')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of active profiles"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Allow officers to update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Allow profile insertion"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- 2. AUDIT LOGS (Immutable Chain of Custody)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    detail JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read of audit logs"
    ON public.audit_logs FOR SELECT
    USING (true);

CREATE POLICY "Allow audit log insertion"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);

-- 3. CASES & ATTRIBUTION DOSSIERS
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_number TEXT NOT NULL,
    victim_address TEXT NOT NULL,
    chain TEXT DEFAULT 'ethereum',
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'notice_issued', 'frozen', 'closed')),
    risk_score INTEGER DEFAULT 0,
    matched_vasp TEXT,
    assigned_io_badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow access to cases"
    ON public.cases FOR ALL
    USING (true);

-- 4. EVIDENCE LEDGER (Section 65B Certified Hop Ledger)
CREATE TABLE IF NOT EXISTS public.evidence_ledger (
    id BIGSERIAL PRIMARY KEY,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    hop_index INTEGER NOT NULL,
    tx_hash TEXT NOT NULL,
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    amount NUMERIC,
    token TEXT DEFAULT 'USDT',
    section_65b_hash TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.evidence_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow access to evidence ledger"
    ON public.evidence_ledger FOR ALL
    USING (true);

-- 5. STATUTORY NOTICES (Sec 91 CrPC / Sec 94 BNSS Directives)
CREATE TABLE IF NOT EXISTS public.vasp_notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
    fir_number TEXT NOT NULL,
    notice_type TEXT NOT NULL CHECK (notice_type IN ('BNSS_94_FREEZE', 'CRPC_91_PRESERVE')),
    recipient_vasp TEXT NOT NULL,
    target_wallet TEXT NOT NULL,
    notice_text TEXT NOT NULL,
    status TEXT DEFAULT 'issued' CHECK (status IN ('issued', 'acknowledged', 'complied')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vasp_notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow access to statutory notices"
    ON public.vasp_notices FOR ALL
    USING (true);

-- ══════════════════════════════════════════════════════════════════════
-- SEED INITIAL DEMO OFFICERS & AUDIT ENTRIES
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO public.profiles (email, full_name, badge_id, station_code, clearance, role, status)
VALUES
    ('admin@chakravyuh.in', 'Inspector A. Sharma', 'I4C-IND-88219', 'CYBER-PS-I4C-DELHI', 'Tier 3 - Cross-Border / FIU', 'admin', 'active'),
    ('r.iyer@police.gov.in', 'SI R. Iyer', 'MH-CYB-4417', 'CID-CYBER-MUMBAI', 'Tier 2 - National Attribution', 'investigator', 'active'),
    ('k.menon@police.gov.in', 'ASI K. Menon', 'KA-STF-2290', 'STF-CYBER-BENGALURU', 'Tier 1 - Unit Attribution', 'investigator', 'active'),
    ('audit.cell@fiuind.gov.in', 'FIU Audit Cell', 'FIU-OBS-0031', 'FIU-IND-NODAL-CELL', 'Tier 1 - Unit Attribution', 'viewer', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.audit_logs (actor_email, action, target, created_at)
VALUES
    ('admin@chakravyuh.in', 'system.init', 'CHAKRAVYUH_CORE', NOW() - INTERVAL '2 days'),
    ('admin@chakravyuh.in', 'dossier.approved', 'SIH/2026/00412', NOW() - INTERVAL '1 day'),
    ('r.iyer@police.gov.in', 'account.signin', 'r.iyer@police.gov.in', NOW())
ON CONFLICT DO NOTHING;
