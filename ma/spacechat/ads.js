// =======================
// MONETAG ADS
// =======================

// Function to safely show Monetag ad
function showAd() {
    if (typeof show_9830606 === "function") {
        show_9830606(); // Call the Monetag SDK function
    } else {
        // Retry in 500ms if the SDK is not yet loaded
        setTimeout(showAd, 500);
    }
}

// Initialize ads after page load
window.addEventListener("load", () => {
    // First ad after 3 seconds
    setTimeout(() => {
        showAd();

        // Repeat every 40 seconds
        setInterval(showAd, 40000);
    }, 10000);
});