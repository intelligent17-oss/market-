// =======================
// Buy Premium JS
// =======================

const premiumContent = `
  <div class="premium-container">
    <h2>Go Premium 🎉</h2>
    <p>Pay NGN5000 or $6 to enjoy unlimited messages and remove all limits!</p>
    <ul>
      <li>Unlimited messages in all groups</li>
      <li>Access to exclusive premium groups</li>
      <li>Priority support</li>
    </ul>
    <button id="buyPremiumBtn">Buy Premium</button>
  </div>
`;

function loadPremiumTab() {
  contentContainer.innerHTML = premiumContent;

  const buyBtn = document.getElementById("buyPremiumBtn");
  buyBtn.addEventListener("click", () => {
    // Example: Redirect to payment page or open payment modal
    window.open("https://yourpaymentlink.com", "_blank");
    showMessage("Thank you! Premium purchase initiated.", "success");
  });
}

// Attach this to the Premium button in main.js
premiumBtn.addEventListener("click", () => {
  setActiveNav(premiumBtn);
  loadPremiumTab();
});