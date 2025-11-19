// Monetag Direct Link
  const monetagLink = "https://otieu.com/4/9831065";
  const delay = 4000; // 4 seconds before open
  const cooldown = 20 * 1000; // 20 seconds cooldown
  const key = "monetag_last_redirect";
  const now = Date.now();

  // Check last redirect time in localStorage
  const lastRedirect = localStorage.getItem(key);

  // Redirect only if last redirect was more than 20s ago
  if (!lastRedirect || now - lastRedirect > cooldown) {
    setTimeout(() => {
      window.open(monetagLink, "_blank");
      localStorage.setItem(key, now); // Save time of redirect
    }, delay);
  }
