# ARC Task Escrow - Geliştirme Adımları

## 🧱 Phase 1 — Proje Setup

- Next.js (frontend)
- Wagmi + Viem integration
- Arc Testnet config ekleme (chainId: 5042002)
- Wallet connect sistemi

---

## 🧱 Phase 2 — Blockchain Bağlantısı

- USDC balance okuma (ERC20 6 decimals)
- Native gas USDC kontrolü
- Chain validation (Arc Testnet check)

---

## 🧱 Phase 3 — Smart Contract Geliştirme

### TaskEscrow.sol
Fonksiyonlar:
- createTask()
- fundTask()
- submitWork()
- approveTask()
- releasePayment()

---

## 🧱 Phase 4 — Frontend Task Sistemi

- Task list UI
- Task detail page
- Create task form
- Status badge sistemi

---

## 🧱 Phase 5 — Escrow Logic Entegrasyonu

- approve() → transfer USDC
- reject() → state update
- escrow balance tracking

---

## 🧱 Phase 6 — UI State Yönetimi

UI durumları:
- Wallet not connected
- Wrong network
- Insufficient USDC
- Transaction pending
- Transaction success
- Transaction failed

---

## 🧱 Phase 7 — Test Süreci

- Contract unit tests (Foundry/Hardhat)
- Frontend flow test
- Escrow logic validation

---

## 🧱 Phase 8 — Deployment

- Smart contract deploy (Arc Testnet)
- Frontend deploy (Vercel / Netlify)
- Explorer link doğrulama

---

## 🧱 Phase 9 — Final Validation

- Chain ID doğrulama
- USDC decimal kontrol
- Contract interaction test
- Full user flow simulation