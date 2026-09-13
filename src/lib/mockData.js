// Sample output of trace_fund_flow() (Algorithm 1) for a TRC-20 task-scam case.
export const MOCK_GRAPH = {
  nodes: [
    { id: "TX7sK...victim", type: "SUSPECT", label: "Scammer Wallet #1", balance: 0, firstSeen: "2026-09-02T09:12:00Z" },
    { id: "TBg91...peel1", type: "INTERMEDIARY", balance: 412.5, firstSeen: "2026-09-02T09:40:00Z" },
    { id: "TQ3mk...peel2", type: "INTERMEDIARY", balance: 380.1, firstSeen: "2026-09-02T10:05:00Z" },
    { id: "TM7dw...bridge", type: "CONTRACT", label: "Instant Swapper (ChangeNOW-like)", firstSeen: "2026-09-02T10:31:00Z" },
    { id: "TR4xp...deposit", type: "EXCHANGE_DEPOSIT", label: "Exchange Deposit Wallet", balance: 0.0, firstSeen: "2026-09-02T11:02:00Z" },
    { id: "TBIN...hot", type: "VASP", label: "Binance Hot Wallet 4", balance: 9182231.4, firstSeen: "2026-09-02T11:07:00Z" },
  ],
  edges: [
    { source: "TX7sK...victim", target: "TBg91...peel1", amount: 50000, token: "USDT", tx_hash: "0x8f3a…c21d", timestamp: "2026-09-02T09:41:12Z" },
    { source: "TBg91...peel1", target: "TQ3mk...peel2", amount: 49500, token: "USDT", tx_hash: "0x1b77…9e04", timestamp: "2026-09-02T10:06:44Z" },
    { source: "TQ3mk...peel2", target: "TM7dw...bridge", amount: 49380, token: "USDT", tx_hash: "0x6cd2…41aa", timestamp: "2026-09-02T10:32:03Z" },
    { source: "TM7dw...bridge", target: "TR4xp...deposit", amount: 49210, token: "USDT", tx_hash: "0xe509…b7c8", timestamp: "2026-09-02T11:03:19Z" },
    { source: "TR4xp...deposit", target: "TBIN...hot", amount: 49204, token: "USDT", tx_hash: "0x93f1…2d60", timestamp: "2026-09-02T11:07:55Z" },
  ],
  attribution: {
    exchange_name: "Binance",
    deposit_address: "TR4xp...deposit",
    hot_wallet_address: "TBIN...hot",
    tx_hash: "0x93f1…2d60",
    deposit_timestamp: "2026-09-02T11:07:55Z",
    confidence: 0.95,
    hops: 3,
    time_to_attribution_ms: 1400,
  },
};
