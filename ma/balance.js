/*
  WALLET BALANCE STORAGE
  =====================
  • Balance is stored ONLY in NGN
  • Key   = Telegram User ID
  • Value = Balance amount in NGN
  • If a user ID is NOT listed → balance = ₦0
*/

const walletBalances = {

  // ===== ADMIN / TEST =====
  "8140042906": 150000,   // ₦150,000
  "8097634090": 75000,    // ₦75,000

  // ===== SELLERS / USERS =====
  "6976365864": 25000,    // ₦25,000
  "7979664801": 52000,     // ₦52,200

  // Add more users below 👇
  // "TELEGRAM_ID": BALANCE_IN_NGN,
};