# ARC USDC Task Escrow + AI Delivery System

## 🧠 Genel Tanım
Bu proje, Arc Testnet üzerinde çalışan bir Task Escrow sistemidir. Kullanıcılar USDC ile görev oluşturur, escrow’a ödeme kilitler ve görev tamamlandığında ödeme otomatik olarak serbest bırakılır.

---

## 👤 Rol Bazlı Sistem

### 1. Task Creator
- Wallet bağlar (Arc Testnet)
- Yeni görev oluşturur
- USDC ödülünü escrow’a yatırır
- Görevi yayınlar

### 2. Executor (İnsan / AI Agent)
- Açık görevleri listeler
- Görevi üstlenir
- Çıktı / proof gönderir

### 3. Reviewer (Creator veya AI)
- Görevi inceler
- Onaylar veya reddeder

---

## 🔄 Sistem Akışı

1. Kullanıcı wallet bağlar
2. Arc Testnet kontrol edilir (chainId: 5042002)
3. Task oluşturulur
4. USDC escrow’a transfer edilir
5. Task “OPEN” durumuna geçer
6. Executor task’ı seçer
7. Çalışma tamamlanır ve submit edilir
8. Creator review yapar
9. Onaylanırsa:
   - USDC escrow’dan executor’a gönderilir
10. Reddedilirse:
   - Dispute / retry flow tetiklenir

---

## 💰 Finansal Akış

- USDC escrow contract içinde tutulur
- Approval sonrası transfer gerçekleşir
- ERC-20 USDC (6 decimals) kullanılır

---

## 📊 Task Status Lifecycle

- OPEN
- ASSIGNED
- SUBMITTED
- APPROVED
- REJECTED
- PAID