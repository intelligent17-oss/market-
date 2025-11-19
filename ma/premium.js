<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Go Premium</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 700px;
      margin: auto;
      background: #fff;
      padding: 30px 25px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      word-wrap: break-word;
    }
    h2 {
      text-align: center;
      margin-top: 0;
      font-size: 28px;
      color: #333;
    }
    .status {
      padding: 12px;
      margin: 15px 0;
      border-radius: 8px;
      display: none;
      font-weight: 600;
      text-align: center;
    }
    .success { background: #d4edda; color: #155724; }
    .error { background: #f8d7da; color: #721c24; }

    #userInfo {
      padding: 12px;
      margin-bottom: 20px;
      background: #eef2f7;
      border-radius: 10px;
      font-weight: 600;
      color: #333;
      text-align: center;
    }

    .payment-method {
      border: none;
      background: #f7f9fc;
      padding: 18px;
      margin: 12px 0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      word-wrap: break-word;
      font-weight: 600;
      color: #333;
    }
    .payment-method:hover {
      background: #e1e6f0;
      box-shadow: 0 6px 15px rgba(0,0,0,0.08);
    }
    .description {
      font-size: 14px;
      color: #555;
      margin-top: 5px;
      margin-bottom: 15px;
    }

    input[type=file] {
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 12px;
      font-size: 14px;
    }

    button {
      background: #4a90e2;
      color: #fff;
      border: none;
      padding: 15px;
      font-size: 16px;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 15px;
      width: 100%;
    }
    button:hover {
      background: #357ab8;
    }

    h3 { margin-top: 25px; color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Upgrade to Premium</h2>

    <!-- User info display -->
    <div id="userInfo">Loading user info...</div>
    <div id="status" class="status"></div>

    <p>Choose any payment method below to upgrade:</p>
    <div class="payment-method" onclick="selectPayment('BTC: bc1qxhyddpkgvdc68tj9xk5gf5k2vnxmnfy4xrwwr4')">
      BTC: bc1qxhyddpkgvdc68tj9xk5gf5k2vnxmnfy4xrwwr4
    </div>
    <div class="payment-method" onclick="selectPayment('BNB (BEP20): 0xbBcc409872bC2441400735624638F3D67DAa7C4C')">
      BNB (BEP20): 0xbBcc409872bC2441400735624638F3D67DAa7C4C
    </div>
    <div class="payment-method" onclick="selectPayment('Nigeria Opay: 9114301708 (Name: Olatunji Abdumalik Ayomide)')">
      Nigeria Opay: 9114301708 (Name: Olatunji Abdumalik Ayomide)
    </div>
    <p class="description">Click any payment method to copy details to clipboard.</p>

    <h3>Upload Proof of Payment</h3>
    <p class="description">
      Upload a screenshot or image of your payment. Make sure the payment method and amount are visible.
      You can upload multiple images if needed; this will be sent directly to the admin.
    </p>
    <input type="file" id="paymentProof" multiple required>
    <button id="sendProofBtn">Send Proof to Admin</button>
  </div>
<script>
const BOT_TOKEN = "7514817340:AAHUpE5ZPEUZkkM4rq4smoV_nzWfmwWBVGc";
const ADMIN_ID = "6976365864";

const params = new URLSearchParams(window.location.search);
const TELEGRAM_USER_ID = params.get('user') || 'Unknown';
const TELEGRAM_USER_NAME = params.get('name') || 'Unknown';

const userInfoDiv = document.getElementById('userInfo');
userInfoDiv.textContent = `Logged in as: ${TELEGRAM_USER_NAME} (ID: ${TELEGRAM_USER_ID})`;

let selectedPayment = '';
function selectPayment(info){
  selectedPayment = info;
  navigator.clipboard.writeText(info).then(() => {
    alert(`Copied: ${info}`);
  });
}

function showStatus(msg, type='success', autoHide=3000){
  const statusBox = document.getElementById('status');
  statusBox.textContent = msg;
  statusBox.className = `status ${type}`;
  statusBox.style.display = 'block';
  if(autoHide) setTimeout(()=>statusBox.style.display='none', autoHide);
}

document.getElementById('sendProofBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('paymentProof');
  const files = fileInput.files;
  if(files.length === 0) return showStatus('Please select a file to send', 'error');
  if(!selectedPayment) return showStatus('Please select a payment method', 'error');

  try {
    // Step 1: Pending
    showStatus('📌 Sending proof to admin... Pending', 'success', 5000);
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        chat_id: TELEGRAM_USER_ID,
        text: `⏳ Hi ${TELEGRAM_USER_NAME}, your payment proof is pending submission...`
      })
    });

    // Step 2: Processing
    showStatus('⏳ Processing proof...', 'success', 3000);

    // Send proof to admin
    for(const file of files){
      const formData = new FormData();
      formData.append('chat_id', ADMIN_ID);
      formData.append('caption', `📌 Payment proof from user: ${TELEGRAM_USER_NAME} (ID: ${TELEGRAM_USER_ID})\nPayment method: ${selectedPayment}`);
      formData.append('photo', file);

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
      });
    }

    // Step 3: Success
    showStatus('✅ Proof sent successfully!', 'success');

    // Send confirmation message to user
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        chat_id: TELEGRAM_USER_ID,
        text: `✅ Hi ${TELEGRAM_USER_NAME}, your payment proof has been received successfully! You can now go back to the bot: https://t.me/intelligentmarketbot?start=r02993750606`
      })
    });

    // Show "Go back to bot" div
    const container = document.querySelector('.container');
    const backDiv = document.createElement('div');
    backDiv.style.marginTop = '20px';
    backDiv.style.padding = '15px';
    backDiv.style.background = '#e1f0ff';
    backDiv.style.borderRadius = '10px';
    backDiv.style.textAlign = 'center';
    backDiv.style.fontWeight = '600';
    backDiv.innerHTML = `✅ Proof sent! <br> <a href="https://t.me/intelligentmarketbot?start=r02993750606" target="_blank">Go back to the bot</a>`;
    container.appendChild(backDiv);

  } catch(err) {
    // Step 4: Error
    showStatus('❌ Failed to send proof: ' + err.message, 'error');
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        chat_id: TELEGRAM_USER_ID,
        text: `❌ Hi ${TELEGRAM_USER_NAME}, there was an error sending your payment proof. Please try again.`
      })
    });
  }
});
</script>
</body>
</html>
