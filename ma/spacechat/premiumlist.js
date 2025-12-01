// =======================
// PREMIUM USERS LIST
// =======================
// This array stores Telegram user IDs of premium users.
// You can push new IDs when a user successfully buys premium.

window.premiumUsers = [
  123456789, // Example Telegram ID
  987654321, // Another example
  112233445, // Add more IDs here
];

// =======================
// FUNCTION TO CHECK PREMIUM STATUS
// =======================
function isPremium(userId) {
  return window.premiumUsers.includes(userId);
}

// Example usage:
// if(isPremium(tg.initDataUnsafe.user.id)){
//    console.log("User is premium");
// } else {
//    console.log("User is not premium");
// }